<script lang="ts">
  import * as spe from 'simplyengineered';
  import { baseTags, docs, isActive, tabs } from '$lib/docs';

  let tagName = $derived(baseTags(docs[0].base)[0] ?? '');

  let selected = $state('Option A');
  let query = $state('');
  let notes = $state('');
  let enabled = $state(true);
  let open = $state(false);
</script>

<spe.Navbar blur>
  <h1>SimplyEngineered</h1>

  {#snippet right()}
    <spe.StackMenu threshold="tablet" label="Menu">
      <spe.Pilltab>
        {#each tabs as tab (tab.href)}
          <spe.PilltabItem href={tab.href} variant={isActive(tab.href) ? 'active' : undefined}>
            {tab.label}
          </spe.PilltabItem>
        {/each}
      </spe.Pilltab>
      <spe.Tooltip content="Pick a theme color — saved for next time">
        <spe.ColorSwitcher active="yellow" aria-label="Theme color">
          <option value="yellow">Yellow</option>
          <option value="magenta">Magenta</option>
          <option value="blue">Blue</option>
          <option value="pink">Pink</option>
          <option value="green">Green</option>
          <option value="beige">Beige</option>
        </spe.ColorSwitcher>
      </spe.Tooltip>
    </spe.StackMenu>
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

    <spe.Tooltip content="Install it from npm">
      <div class="install">
        <code>npm i simplyengineered</code>
      </div>
    </spe.Tooltip>

    <div class="cta">
      <spe.Tooltip content="Browse every component">
        <spe.A href="/docs" variant="btn-solid">Read the docs</spe.A>
      </spe.Tooltip>
    </div>
  </section>

  <section class="showcase">
    <h3>Everything is live on this page</h3>
    <p class="hint">No screenshots — these are the real components.</p>

    <div class="row">
      <span class="label"><spe.Tooltip content="Four visual weights">Button</spe.Tooltip></span>
      <spe.Tooltip content="Filled with the current accent color">
        <spe.Button variant="solid">Solid</spe.Button>
      </spe.Tooltip>
      <spe.Tooltip content="Tinted accent background">
        <spe.Button variant="tonal">Tonal</spe.Button>
      </spe.Tooltip>
      <spe.Tooltip content="Accent border, transparent fill">
        <spe.Button variant="outlined">Outlined</spe.Button>
      </spe.Tooltip>
      <spe.Tooltip content="No chrome until you hover it">
        <spe.Button variant="simple">Simple</spe.Button>
      </spe.Tooltip>
      <spe.Tooltip content="Disabled buttons are inert and unfocusable">
        <spe.Button disabled>Disabled</spe.Button>
      </spe.Tooltip>
    </div>

    <div class="row">
      <span class="label"
        ><spe.Tooltip content="Anchors that can also look like buttons">Link</spe.Tooltip></span
      >
      <spe.Tooltip content="Inherits the text color with a dotted underline">
        <spe.A href="/docs" variant="link">Plain link</spe.A>
      </spe.Tooltip>
      <spe.Tooltip content="Uses the accent color">
        <spe.A href="/docs" variant="accent-link">Accent link</spe.A>
      </spe.Tooltip>
      <spe.Tooltip content="An anchor styled like a tonal button">
        <spe.A href="/docs" variant="btn-tonal">Tonal button link</spe.A>
      </spe.Tooltip>
    </div>

    <div class="row">
      <span class="label"><spe.Tooltip content="A pill-shaped tab group">Pilltab</spe.Tooltip></span
      >
      <spe.Pilltab>
        <spe.PilltabItem href="/">Home</spe.PilltabItem>
        <spe.PilltabItem href="/docs" variant="active">Docs</spe.PilltabItem>
      </spe.Pilltab>
    </div>

    <div class="row">
      <span class="label"
        ><spe.Tooltip content="Surfaces for grouping content">Card</spe.Tooltip></span
      >
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
      <span class="label"><spe.Tooltip content="Single-line text field">Input</spe.Tooltip></span>
      <spe.Input placeholder="Type something" bind:value={query} />
    </div>

    <div class="row">
      <span class="label"><spe.Tooltip content="Multi-line text field">Textarea</spe.Tooltip></span>
      <spe.Textarea placeholder="Longer text" bind:value={notes} />
    </div>

    <div class="row">
      <span class="label"
        ><spe.Tooltip content="Native select styled to match">Dropdown</spe.Tooltip></span
      >
      <spe.Dropdown bind:value={selected}>
        <option value="Option A">Option A</option>
        <option value="Option B">Option B</option>
        <option value="Option C">Option C</option>
      </spe.Dropdown>
      <span class="value">selected: {selected}</span>
    </div>

    <div class="row">
      <span class="label"><spe.Tooltip content="An on/off switch">Toggle</spe.Tooltip></span>
      <spe.Tooltip content="Click to toggle">
        <spe.Toggle bind:checked={enabled} />
      </spe.Tooltip>
      <span class="value">enabled: {enabled}</span>
    </div>

    <div class="row">
      <span class="label"
        ><spe.Tooltip content="These follow your cursor">Tooltip</spe.Tooltip></span
      >
      <spe.Tooltip content="Tooltips wrap any content" position="top">
        <spe.Button variant="outlined">Hover me</spe.Button>
      </spe.Tooltip>
    </div>

    <div class="row">
      <span class="label"
        ><spe.Tooltip content="A real dialog with snippets">Modal</spe.Tooltip></span
      >
      <spe.Tooltip content="Opens a real <spe.Modal>">
        <spe.Button variant="tonal" onclick={() => (open = true)}>Open modal</spe.Button>
      </spe.Tooltip>
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
    margin: 0 0 2px;
  }

  .lede {
    max-width: 60ch;
    margin: 8px 0 0;
    color: color-mix(in srgb, var(--spe-font-color) 65%, transparent);
    font-size: 16px;
    line-height: 1.6;
  }

  .lede code {
    font-size: 14px;
  }

  .install {
    margin: 12px 0 0;
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
    margin-top: 12px;
  }

  .showcase {
    margin-top: 36px;
    padding: 24px;
    background: var(--spe-bg-tint);
    border: 1px solid color-mix(in srgb, var(--spe-font-color) 10%, transparent);
    border-radius: var(--spe-radius-med);
  }

  .hint {
    margin: 0 0 4px;
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
    margin-bottom: 1px;
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
    margin-top: 36px;
    padding-top: 20px;
    border-top: 1px solid color-mix(in srgb, var(--spe-font-color) 10%, transparent);
    color: color-mix(in srgb, var(--spe-font-color) 50%, transparent);
    font-size: 14px;
  }
</style>
