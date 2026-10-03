import { basicSetup } from 'codemirror';
import { EditorView } from '@codemirror/view';
import {
  autocompletion,
  type Completion,
  type CompletionContext,
  type CompletionResult
} from '@codemirror/autocomplete';
import { oneDark } from '@codemirror/theme-one-dark';
import { svelte } from '@replit/codemirror-lang-svelte';

import * as spe from 'simplyengineered';
import docsRaw from '$lib/docs-data.jsonc?raw';

interface ComponentDoc {
  component: string;
  name: string;
  tag: string;
  blurb: string;
  attributes?: Record<string, string[]>;
  base?: string | string[];
}

const docs: ComponentDoc[] = JSON.parse(docsRaw.replace(/\/\/.*$/gm, ''));

const LIB_IMPORT = `import * as spe from 'simplyengineered';`;

/** what gets inserted when a component is picked from the completion list */
const SNIPPETS: Record<string, string> = {
  A: '<spe.A href="/" variant="link">Link text</spe.A>',
  Button: '<spe.Button variant="solid">Click me</spe.Button>',
  Card: '<spe.Card>\n  <p>Card content</p>\n</spe.Card>',
  Dropdown:
    '<spe.Dropdown>\n  <option value="a">Option A</option>\n  <option value="b">Option B</option>\n</spe.Dropdown>',
  Input: '<spe.Input placeholder="Type something" />',
  Modal: '<spe.Modal bind:open={open}>\n  <p>Body</p>\n</spe.Modal>',
  Pilltab:
    '<spe.Pilltab>\n  <spe.PilltabItem href="/">Home</spe.PilltabItem>\n  <spe.PilltabItem href="/docs" variant="active">Docs</spe.PilltabItem>\n</spe.Pilltab>',
  PilltabItem: '<spe.PilltabItem href="/docs" variant="active">Docs</spe.PilltabItem>',
  Textarea: '<spe.Textarea placeholder="Longer text" />',
  Toggle: '<spe.Toggle bind:checked={isOn} />',
  Tooltip:
    '<spe.Tooltip content="Hello!" position="top">\n  <spe.Button>Hover me</spe.Button>\n</spe.Tooltip>'
};

function toTagNames(base?: string | string[]): string[] {
  if (!base) return [];
  const list = Array.isArray(base) ? base : [base];
  return list
    .filter((entry): entry is string => typeof entry === 'string')
    .map((entry) => entry.trim().replace(/^<|>$/g, ''))
    .filter(Boolean);
}

function summarise(doc: ComponentDoc): string {
  const parts: string[] = [];
  const base = toTagNames(doc.base);
  if (base.length) parts.push(`<${base.join('>, <')}>`);
  const values = Object.values(doc.attributes ?? {}).flat();
  if (values.length) parts.push(values.slice(0, 5).join(', '));
  return parts.join('  ·  ');
}

/** add `import * as spe from 'simplyengineered'` if the code doesn't already have it */
function ensureLibImport(view: EditorView): void {
  const source = view.state.doc.toString();
  if (source.includes(LIB_IMPORT)) return;

  const scriptTag = /<script[^>]*>/.exec(source);
  if (scriptTag) {
    const at = scriptTag.index + scriptTag[0].length;
    view.dispatch({ changes: { from: at, insert: `\n  ${LIB_IMPORT}` } });
  } else {
    view.dispatch({ changes: { from: 0, insert: `<script>\n  ${LIB_IMPORT}\n</script>\n\n` } });
  }
}

/**
 * Insert a snippet and put the cursor somewhere useful: on the text between the
 * first and last tag when there is some, otherwise at the end.
 *
 * The completion only matches `spe.` onwards, so a `<` the user already typed is
 * left in the document — swallow it, otherwise the insert doubles it up.
 */
function insertSnippet(view: EditorView, from: number, to: number, snippet: string): void {
  const start = from > 0 && view.state.sliceDoc(from - 1, from) === '<' ? from - 1 : from;

  view.dispatch({
    changes: { from: start, to, insert: snippet },
    selection: { anchor: start + snippet.length },
    scrollIntoView: true
  });

  const text = />([^<>]+)</.exec(snippet);
  if (text) {
    const at = start + text.index + 1;
    view.dispatch({ selection: { anchor: at, head: at + text[1].length } });
  }

  ensureLibImport(view);
}

function buildOptions(): Completion[] {
  // only offer what the library actually exports
  const exported = new Set(Object.keys(spe));

  return docs
    .filter((doc) => exported.has(doc.component))
    .map((doc) => ({
      label: `spe.${doc.component}`,
      type: 'class',
      detail: summarise(doc),
      info: doc.blurb,
      apply: (view: EditorView, _completion: Completion, from: number, to: number) =>
        insertSnippet(view, from, to, SNIPPETS[doc.component] ?? `<spe.${doc.component} />`)
    }));
}

const options = buildOptions();

/** completion source for `spe.<cursor>` */
function speCompletions(context: CompletionContext): CompletionResult | null {
  const typed = context.matchBefore(/spe\.[A-Za-z]*/);
  if (!typed) return null;
  if (typed.from === typed.to && !context.explicit) return null;

  return { from: typed.from, options, validFor: /^spe\.[A-Za-z]*$/ };
}

export interface EditorOptions {
  doc: string;
  onChange: (code: string) => void;
}

export function createEditor(parent: HTMLElement, { doc, onChange }: EditorOptions): EditorView {
  const lang = svelte();

  return new EditorView({
    parent,
    doc,
    extensions: [
      basicSetup,
      oneDark,
      lang,
      // registered through language data so the language's own completions still work
      lang.language.data.of({ autocomplete: speCompletions }),
      autocompletion({ activateOnTyping: true, closeOnBlur: true }),
      EditorView.lineWrapping,
      EditorView.theme({
        '&': { height: '100%', fontSize: '13px' },
        '.cm-scroller': {
          fontFamily:
            'ui-monospace, SFMono-Regular, "SF Mono", Menlo, Consolas, "Liberation Mono", monospace',
          lineHeight: '1.6'
        },
        '.cm-content': { padding: '12px 0' },
        '.cm-gutters': {
          backgroundColor: 'transparent',
          border: 'none',
          color: 'color-mix(in srgb, var(--spe-font-color) 25%, transparent)'
        },
        '.cm-activeLineGutter': { backgroundColor: 'transparent' },
        '.cm-activeLine': {
          backgroundColor: 'color-mix(in srgb, var(--spe-font-color) 4%, transparent)'
        }
      }),
      EditorView.updateListener.of((update) => {
        if (update.docChanged) onChange(update.state.doc.toString());
      })
    ]
  });
}
