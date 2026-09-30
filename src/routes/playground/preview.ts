import { compile } from 'svelte/compiler';
import { mount, unmount } from 'svelte';
import * as svelteRuntime from 'svelte';
// eslint-disable-next-line svelte/no-svelte-internal
import * as clientRuntime from 'svelte/internal/client';
// the compiler's own output targets these, so the playground has to link against them
// eslint-disable-next-line svelte/no-svelte-internal
import 'svelte/internal/disclose-version';
import * as lib from '$lib';

/**
 * The playground compiles user code in the browser. The compiler emits real ESM
 * that imports from `svelte/internal/client`, `svelte` and whatever the user
 * imported, so instead of resolving those specifiers through a bundler we link
 * them to the modules this page already has loaded and evaluate the result.
 *
 * The result is mounted inside an iframe: the component's own styles (and any
 * stray global rules a component brings with it) then stay out of the editor UI,
 * and `position: fixed` inside a component is scoped to the preview pane.
 */
const SPECIFIERS: Record<string, string> = {
  $lib: '__lib',
  svelte: '__svelte',
  'svelte/internal/client': '__client'
};

const ROOT_ID = 'spe-playground-root';
const ROOT_PADDING = 20;

// a clause can hold newlines and braces but never a semicolon, so a match can
// never run past the end of its own statement
const IMPORT_FROM = /\bimport\s+([^;]*?)\s+from\s*(['"])([^'"]+)\2;?/g;
const IMPORT_BARE = /\bimport\s*(['"])[^'"]+\1;?/g;

export type PreviewResult = { ok: true } | { ok: false; error: string };

let current: Record<string, unknown> | null = null;

function link(js: string): string {
  const unresolved = new Set<string>();

  let out = js.replace(IMPORT_FROM, (_all, clause: string, _q: string, specifier: string) => {
    const ref = SPECIFIERS[specifier];
    if (!ref) {
      unresolved.add(specifier);
      return '';
    }

    const part = clause.trim();
    if (part.startsWith('*')) return `const ${part.replace(/^\*\s*as\s*/, '')} = ${ref};`;
    if (part.startsWith('{')) return `const ${part} = ${ref};`;
    return `const ${part} = ${ref}.default;`;
  });

  // side-effect only imports (the compiler adds these itself, already loaded here)
  out = out.replace(IMPORT_BARE, '');

  if (unresolved.size) {
    const list = [...unresolved].map((s) => `'${s}'`).join(', ');
    throw new Error(
      `The playground can only import $lib, svelte and svelte/internal/client — not ${list}.`
    );
  }

  // the component is the module's default export; the factory returns it instead
  out = out.replace(/\bexport\s+default\s+/, 'return ');
  out = out.replace(/^export\s+(?=(const|let|var|function|class|async)\b)/gm, '');

  if (/^\s*(import|export)\s/m.test(out)) {
    throw new Error('Unsupported module syntax in the compiled output.');
  }

  return `"use strict";\n${out}`;
}

/**
 * Give the frame a clean document: the app's own stylesheets are copied over so
 * the design tokens and font stack match the rest of the site, CodeMirror's
 * injected styles are not.
 */
function prepareDocument(frame: HTMLIFrameElement): { doc: Document; target: HTMLElement } | null {
  const doc = frame.contentDocument;
  if (!doc) return null;

  const scrollTop = doc.documentElement?.scrollTop ?? 0;

  doc.open();
  doc.write('<!doctype html><html><head></head><body></body></html>');
  doc.close();

  const styles = document.head.querySelectorAll<HTMLLinkElement | HTMLStyleElement>(
    'link[rel="stylesheet"], style'
  );
  for (const style of styles) {
    // the editor's own styles are of no use to a preview
    if (style instanceof HTMLStyleElement && style.textContent?.includes('.cm-')) continue;
    doc.head.append(style.cloneNode(true));
  }

  const target = doc.createElement('div');
  target.id = ROOT_ID;
  target.style.padding = `${ROOT_PADDING}px`;
  doc.body.append(target);
  doc.documentElement.scrollTop = scrollTop;

  return { doc, target };
}

function describe(err: unknown): string {
  if (err && typeof err === 'object' && 'message' in err) {
    const e = err as { message: string; start?: { line: number; column: number }; code?: string };
    const at = e.start ? ` (${e.code ?? 'error'} at ${e.start.line}:${e.start.column})` : '';
    return `${e.message}${at}`;
  }
  return String(err);
}

export function destroyPreview(frame?: HTMLIFrameElement): void {
  if (current) {
    try {
      unmount(current);
    } catch {
      // a component that throws mid-teardown should not break the next run
    }
    current = null;
  }

  const doc = frame?.contentDocument;
  if (doc) {
    doc.getElementById(ROOT_ID)?.remove();
    doc.querySelectorAll('style[data-playground]').forEach((el) => el.remove());
  }
}

export function renderPreview(code: string, frame: HTMLIFrameElement): PreviewResult {
  destroyPreview(frame);

  let js: string;
  let css: string;
  try {
    const compiled = compile(code, {
      filename: 'Playground.svelte',
      generate: 'client',
      css: 'external',
      dev: false
    });
    js = compiled.js.code;
    css = compiled.css?.code ?? '';
  } catch (err) {
    return { ok: false, error: describe(err) };
  }

  const prepared = prepareDocument(frame);
  if (!prepared) return { ok: false, error: 'The preview frame is not ready.' };

  const { doc, target } = prepared;

  try {
    const factory = new Function('__client', '__lib', '__svelte', link(js)) as (
      client: unknown,
      lib: unknown,
      svelte: unknown
    ) => unknown;

    const Component = factory(clientRuntime, lib, svelteRuntime);

    if (css) {
      const style = doc.createElement('style');
      style.dataset.playground = '';
      style.textContent = css;
      doc.head.append(style);
    }

    current = mount(Component as Parameters<typeof mount>[0], { target });
    return { ok: true };
  } catch (err) {
    target.replaceChildren();
    return { ok: false, error: describe(err) };
  }
}
