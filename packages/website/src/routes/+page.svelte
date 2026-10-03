<script lang="ts">
  import * as spe from 'simplyengineered';
  import docsRaw from '$lib/docs-data.jsonc?raw';
  import { page } from '$app/state';

  interface ComponentDoc {
    component: string;
    name: string;
    tag: string;
    blurb: string;
    base?: string | string[];
  }

  // strip // comments before parsing since JSON.parse doesn't support JSONC natively
  const docs: ComponentDoc[] = JSON.parse(docsRaw.replace(/\/\/.*$/gm, ''));

  const tabs = [
    { label: 'Home', href: '/' },
    { label: 'Docs', href: '/docs' },
    { label: 'Playground', href: '/playground' }
  ];

  function isActive(href: string): boolean {
    return href === '/' ? page.url.pathname === '/' : page.url.pathname.startsWith(href);
  }

  let tagName = $derived(
    (Array.isArray(docs[0].base) ? docs[0].base : [docs[0].base])[0]?.replace(/^<|>$/g, '') ?? ''
  );

  let selected = $state('Option A');
  let query = $state('');
  let notes = $state('');
  let enabled = $state(true);
  let open = $state(false);
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

<div class="page">
  <section class="hero">
    <h2>A small, opinionated Svelte component library.</h2>
    <p class="lede">
      {docs.length} components, zero runtime dependencies. Every component renders a plain
      <code>{`<${tagName}>`}</code>-style element underneath, so your markup stays yours and native
      attributes like <code>id</code>, <code>class</code> and <code>aria-*</code> pass straight through.
    </p>

    <div class="install">
      <code>npm i simplyengineered</code>
    </div>

    <div class="cta">
      <spe.A href="/docs" variant="btn-solid">Read the docs</spe.A>
    </div>
  </section>

  <section class="showcase">
    <h3>Everything is live on this page</h3>
    <p class="hint">No screenshots — these are the real components.</p>

    <div class="row">
      <span class="label">Button</span>
      <spe.Button variant="solid">Solid</spe.Button>
      <spe.Button variant="tonal">Tonal</spe.Button>
      <spe.Button variant="outlined">Outlined</spe.Button>
      <spe.Button variant="simple">Simple</spe.Button>
      <spe.Button disabled>Disabled</spe.Button>
    </div>

    <div class="row">
      <span class="label">Link</span>
      <spe.A href="/docs" variant="link">Plain link</spe.A>
      <spe.A href="/docs" variant="accent-link">Accent link</spe.A>
      <spe.A href="/docs" variant="btn-tonal">Tonal button link</spe.A>
    </div>

    <div class="row">
      <span class="label">Pilltab</span>
      <spe.Pilltab>
        <spe.PilltabItem href="/">Home</spe.PilltabItem>
        <spe.PilltabItem href="/docs" variant="active">Docs</spe.PilltabItem>
      </spe.Pilltab>
    </div>

    <div class="row">
      <span class="label">Card</span>
      <spe.Card class="demo-card">
        <strong>Default</strong>
        <span>tinted surface with a solid border</span>
      </spe.Card>
      <spe.Card variant="simple" class="demo-card">
        <strong>Simple</strong>
        <span>borderless, tints on hover</span>
      </spe.Card>
      <spe.Card variant="accent dashed-border" class="demo-card">
        <strong>Accent + dashed</strong>
        <span>variants combine with spaces</span>
      </spe.Card>
    </div>

    <div class="row">
      <span class="label">Input</span>
      <spe.Input placeholder="Type something" bind:value={query} />
    </div>

    <div class="row">
      <span class="label">Textarea</span>
      <spe.Textarea placeholder="Longer text" bind:value={notes} />
    </div>

    <div class="row">
      <span class="label">Dropdown</span>
      <spe.Dropdown bind:value={selected}>
        <option value="Option A">Option A</option>
        <option value="Option B">Option B</option>
        <option value="Option C">Option C</option>
      </spe.Dropdown>
      <span class="value">selected: {selected}</span>
    </div>

    <div class="row">
      <span class="label">Toggle</span>
      <spe.Toggle bind:checked={enabled} />
      <span class="value">enabled: {enabled}</span>
    </div>

    <div class="row">
      <span class="label">Tooltip</span>
      <spe.Tooltip content="Tooltips wrap any content" position="top">
        <spe.Button variant="outlined">Hover me</spe.Button>
      </spe.Tooltip>
    </div>

    <div class="row">
      <span class="label">Modal</span>
      <spe.Button variant="tonal" onclick={() => (open = true)}>Open modal</spe.Button>
    </div>
  </section>

  <footer>
    <p>SimplyEngineered — built with Svelte 5 runes. No runtime, no bloat.</p>
  </footer>
</div>

<spe.Modal bind:open>
  {#snippet heading()}<h3>It is a real modal</h3>{/snippet}
  <p>
    Rendered by <code>&lt;spe.Modal&gt;</code> with a heading snippet, a body and a footer. Press escape
    or click outside to close.
  </p>
  {#snippet footer()}
    <spe.Button variant="tonal" onclick={() => (open = false)}>Close</spe.Button>
  {/snippet}
</spe.Modal>

<style>
  .page {
    max-width: 900px;
    margin: 0 auto;
    padding: 120px 24px 64px;
  }

  h2 {
    font-size: 40px;
    line-height: 1.15;
    letter-spacing: -0.02em;
    max-width: 18ch;
  }

  h3 {
    font-size: 20px;
    margin: 0 0 4px;
  }

  .lede {
    max-width: 60ch;
    margin: 16px 0 0;
    color: color-mix(in srgb, var(--spe-font-color) 65%, transparent);
    font-size: 16px;
    line-height: 1.6;
  }

  .lede code {
    font-size: 14px;
  }

  .install {
    margin: 24px 0 0;
    padding: 12px 16px;
    display: inline-block;
    background: var(--spe-bg-tint);
    border: 1px solid color-mix(in srgb, var(--spe-font-color) 12%, transparent);
    border-radius: var(--spe-radius-low);
  }

  .cta {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    margin-top: 24px;
  }

  .showcase {
    margin-top: 72px;
    padding: 24px;
    background: var(--spe-bg-tint);
    border: 1px solid color-mix(in srgb, var(--spe-font-color) 10%, transparent);
    border-radius: var(--spe-radius-med);
  }

  .hint {
    margin: 0 0 8px;
    color: color-mix(in srgb, var(--spe-font-color) 55%, transparent);
    font-size: 14px;
  }

  .row {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
    padding: 14px 0;
    border-top: 1px solid color-mix(in srgb, var(--spe-font-color) 8%, transparent);
  }

  .row :global(.spe-input),
  .row :global(.spe-textarea),
  .row :global(.spe-dropdown) {
    width: 220px;
  }

  .row :global(.demo-card) {
    flex: 1 1 150px;
    min-width: 150px;
    font-size: 13px;
  }

  .row :global(.demo-card strong) {
    display: block;
    margin-bottom: 2px;
    font-size: 14px;
  }

  .row :global(.demo-card span) {
    color: color-mix(in srgb, var(--spe-font-color) 60%, transparent);
  }

  .label {
    width: 84px;
    flex-shrink: 0;
    color: color-mix(in srgb, var(--spe-font-color) 50%, transparent);
    font-size: 13px;
    font-weight: 600;
    text-transform: uppercase;
    letter-spacing: 0.06em;
  }

  .value {
    color: color-mix(in srgb, var(--spe-font-color) 60%, transparent);
    font-size: 14px;
  }

  footer {
    margin-top: 72px;
    padding-top: 20px;
    border-top: 1px solid color-mix(in srgb, var(--spe-font-color) 10%, transparent);
    color: color-mix(in srgb, var(--spe-font-color) 50%, transparent);
    font-size: 14px;
  }
</style>
