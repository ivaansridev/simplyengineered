<script lang="ts">
  import * as spe from '$lib';
  import { onMount } from 'svelte';
  import { page } from '$app/state';
  import { createEditor } from './editor';
  import { destroyPreview, renderPreview } from './preview';
  import { EXAMPLES } from './examples';
  import type { EditorView } from '@codemirror/view';

  const tabs = [
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Playground', href: '/playground' }
  ];

  function isActive(href: string): boolean {
    return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
  }

  let editorHost: HTMLDivElement;
  let previewFrame: HTMLIFrameElement;

  let editor = $state<EditorView | undefined>(undefined);
  let exampleId = $state(EXAMPLES[0].id);
  let error = $state<string | null>(null);
  let copied = $state(false);

  let example = $derived(EXAMPLES.find((e) => e.id === exampleId) ?? EXAMPLES[0]);
  function run(code: string): void {
    if (!previewFrame) return;
    const result = renderPreview(code, previewFrame);
    error = result.ok ? null : result.error;
  }

  let timer: ReturnType<typeof setTimeout>;
  let silent = false;

  function scheduleRun(code: string): void {
    clearTimeout(timer);
    timer = setTimeout(() => run(code), 300);
  }

  /** swap the whole document without letting the change listener re-render twice */
  function replaceDoc(code: string): void {
    if (!editor) return;
    silent = true;
    editor.dispatch({ changes: { from: 0, to: editor.state.doc.length, insert: code } });
    silent = false;
    run(code);
  }

  /**
   * `change` is delegated by Svelte, so a handler's `currentTarget` is the app
   * root rather than the `<select>` — driving the swap off the bound value
   * instead of reading the event target.
   */
  let appliedId = $state(EXAMPLES[0].id);

  $effect(() => {
    const id = exampleId;
    if (id === appliedId) return;
    appliedId = id;
    replaceDoc(example.code);
  });

  function reset(): void {
    replaceDoc(example.code);
  }

  async function copy(): Promise<void> {
    const code = editor?.state.doc.toString() ?? '';
    try {
      await navigator.clipboard.writeText(code);
      copied = true;
      setTimeout(() => (copied = false), 1500);
    } catch {
      copied = false;
    }
  }

  onMount(() => {
    editor = createEditor(editorHost, {
      doc: example.code,
      onChange: (code) => {
        if (!silent) scheduleRun(code);
      }
    });

    run(example.code);

    return () => {
      clearTimeout(timer);
      destroyPreview(previewFrame);
      editor?.destroy();
    };
  });
</script>

<spe.Navbar blur>
  <h1>SimplyEngineered</h1>

  {#snippet right()}
    <spe.Pilltab>
      {#each tabs as tab (tab.href)}
        <spe.PilltabItem href={tab.href} variant={isActive(tab.href) ? 'active' : undefined}>
          {tab.label}
        </spe.PilltabItem>
      {/each}
    </spe.Pilltab>
  {/snippet}
</spe.Navbar>

<div class="playground">
  <header class="bar">
    <div class="bar-left">
      <h2>Playground</h2>
      <spe.Dropdown bind:value={exampleId} simple>
        {#each EXAMPLES as item (item.id)}
          <option value={item.id}>{item.name}</option>
        {/each}
      </spe.Dropdown>
    </div>

    <div class="bar-right">
      <spe.Button variant="simple" onclick={reset}>Reset</spe.Button>
      <spe.Button variant="tonal" onclick={copy}>{copied ? 'Copied' : 'Copy code'}</spe.Button>
    </div>
  </header>

  {#if error}
    <p class="error">{error}</p>
  {/if}

  <div class="panes">
    <section class="pane">
      <h3>Code</h3>
      <div class="editor" bind:this={editorHost}></div>
      <p class="pane-note">
        <code>spe.*</code> is auto imported — type <code>spe.</code> for completions.
      </p>
    </section>

    <section class="pane">
      <h3>Preview</h3>
      <!-- no src: contentDocument is available as soon as it is in the DOM -->
      <iframe class="preview" title="Component preview" bind:this={previewFrame}></iframe>
    </section>
  </div>
</div>

<style>
  .playground {
    display: flex;
    flex-direction: column;
    gap: 12px;
    height: 100vh;
    padding: 76px 20px 20px;
  }

  .bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    flex-wrap: wrap;
  }

  .bar-left {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .bar-left h2 {
    margin: 0;
    font-size: 18px;
  }

  .bar-left :global(.spe-dropdown) {
    width: auto;
    min-width: 160px;
    height: 34px;
    border-color: color-mix(in srgb, var(--spe-font-color) 15%, transparent);
  }

  .bar-right {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .error {
    margin: 0;
    padding: 10px 14px;
    color: var(--spe-color-red);
    background: color-mix(in srgb, var(--spe-color-red) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--spe-color-red) 35%, transparent);
    border-radius: var(--spe-radius-low);
    font-family: ui-monospace, SFMono-Regular, Menlo, Consolas, monospace;
    font-size: 13px;
    white-space: pre-wrap;
  }

  .panes {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 12px;
    flex: 1;
    min-height: 0;
  }

  .pane {
    display: flex;
    flex-direction: column;
    min-height: 0;
    min-width: 0;
    border: 1px solid color-mix(in srgb, var(--spe-font-color) 10%, transparent);
    border-radius: var(--spe-radius-med);
    overflow: hidden;
  }

  .pane h3 {
    margin: 0;
    padding: 8px 14px;
    color: color-mix(in srgb, var(--spe-font-color) 55%, transparent);
    background: var(--spe-bg-tint);
    border-bottom: 1px solid color-mix(in srgb, var(--spe-font-color) 10%, transparent);
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.08em;
  }

  .editor {
    flex: 1;
    min-height: 0;
    overflow: hidden;
    background: var(--spe-bg-tint);
  }

  .editor :global(.cm-editor) {
    height: 100%;
  }

  .pane-note {
    margin: 0;
    padding: 6px 14px;
    color: color-mix(in srgb, var(--spe-font-color) 45%, transparent);
    background: var(--spe-bg-tint);
    border-top: 1px solid color-mix(in srgb, var(--spe-font-color) 8%, transparent);
    font-size: 12px;
  }

  .pane-note code {
    font-size: 11px;
  }

  .preview {
    flex: 1;
    min-height: 0;
    width: 100%;
    border: 0;
    display: block;
    background: var(--spe-bg);
    color-scheme: dark;
  }

  @media (max-width: 860px) {
    .panes {
      grid-template-columns: 1fr;
      grid-template-rows: 1fr 1fr;
    }
  }
</style>
