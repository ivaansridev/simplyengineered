<script lang="ts">
  import * as spe from '$lib';
  import docsRaw from '$lib/docs-data.jsonc?raw';
  import { page } from '$app/state';

  interface ComponentDoc {
    component: string;
    name: string;
    tag: string;
    blurb: string;
    code: string;
    attributes: Record<string, string[]>;
    /** underlying element(s) — a single name or a list, with or without <angle> brackets */
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

  let search = $state('');
  // /docs?c=Button deep-links straight to a component
  let selected = $state<ComponentDoc>(
    docs.find((d) => d.component === page.url.searchParams.get('c')) ?? docs[0]
  );

  let filtered = $derived(
    docs.filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.component.toLowerCase().includes(search.toLowerCase()) ||
        d.blurb.toLowerCase().includes(search.toLowerCase())
    )
  );

  // base can be "button" or ["<button>"] — normalise to a list of bare tag names
  function toTagNames(base?: string | string[]): string[] {
    if (!base) return [];
    const list = Array.isArray(base) ? base : [base];
    return list
      .filter((entry): entry is string => typeof entry === 'string')
      .map((entry) => entry.trim().replace(/^<|>$/g, ''))
      .filter(Boolean);
  }

  let bases = $derived(toTagNames(selected.base));
  let entries = $derived(Object.entries(selected.attributes ?? {}));
</script>

<spe.Navbar blur>
  <h2>SimplyEngineered</h2>

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

<div class="docs-layout">
  <aside class="sidebar">
    <spe.Input placeholder="Search components..." bind:value={search} />
    <ul class="component-list">
      {#each filtered as doc (doc.component)}
        <li>
          <button
            class="component-link"
            class:active={selected.component === doc.component}
            onclick={() => (selected = doc)}
          >
            {doc.name}
          </button>
        </li>
      {/each}
    </ul>
  </aside>

  <main class="doc-panel">
    <h1>{selected.name}</h1>
    <p class="tag"><code>{selected.tag}</code></p>
    <p class="blurb">{selected.blurb}</p>

    {#if bases.length}
      <p class="base">
        Renders as
        {#each bases as base (base)}
          <code>{`<${base}>`}</code>
        {/each}
      </p>
    {/if}

    <h2>Example</h2>
    <pre><code>{selected.code}</code></pre>

    <h2>Attributes</h2>

    {#if entries.length}
      <table>
        <thead>
          <tr>
            <th>Attribute</th>
            <th>Accepts</th>
          </tr>
        </thead>
        <tbody>
          {#each entries as [attr, values] (attr)}
            <tr>
              <td><code>{attr}</code></td>
              <td>
                {#each values as value (value)}
                  {#if ['string', 'boolean', 'function', 'integer'].includes(value)}
                    <code class="dynamic">Any {value}</code>
                  {:else}
                    <code>{value}</code>
                  {/if}
                {/each}
              </td>
            </tr>
          {/each}
        </tbody>
      </table>
    {:else}
      <p class="empty">No component-specific attributes.</p>
    {/if}
  </main>
</div>

<style>
  .docs-layout {
    display: flex;
    padding-top: 60px;
    min-height: 100vh;
  }

  .sidebar {
    width: 240px;
    flex-shrink: 0;
    padding: 24px 16px;
    border-right: 1px solid color-mix(in srgb, var(--spe-font-color) 10%, transparent);
  }

  .component-list {
    list-style: none;
    padding: 0;
    margin: 16px 0 0;
  }

  .component-link {
    display: block;
    width: 100%;
    text-align: left;
    padding: 8px 12px;
    background: transparent;
    border: none;
    border-radius: var(--spe-radius-low);
    color: color-mix(in srgb, var(--spe-font-color) 70%, transparent);
    cursor: pointer;
    font: inherit;
    font-size: 14px;
  }

  .component-link:hover {
    background: var(--spe-bg-tint);
    color: var(--spe-font-color);
  }

  .component-link.active {
    background: var(--spe-accent);
    color: var(--spe-accent-font-color);
  }

  .doc-panel {
    flex: 1;
    max-width: 800px;
    padding: 40px;
  }

  .tag code {
    color: var(--spe-accent);
  }

  .base {
    display: flex;
    align-items: center;
    flex-wrap: wrap;
    gap: 6px;
    margin: 0 0 8px;
    color: color-mix(in srgb, var(--spe-font-color) 60%, transparent);
    font-size: 14px;
  }

  .blurb {
    margin: 6px 0 0;
    max-width: 60ch;
    color: color-mix(in srgb, var(--spe-font-color) 65%, transparent);
    font-size: 15px;
    line-height: 1.6;
  }

  .empty {
    margin: 12px 0 0;
    color: color-mix(in srgb, var(--spe-font-color) 55%, transparent);
    font-size: 14px;
    font-style: italic;
  }

  pre {
    background: var(--spe-bg-tint);
    padding: 16px;
    border-radius: var(--spe-radius-low);
    overflow-x: auto;
    font-size: 13px;
    white-space: pre;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 16px;
  }

  th,
  td {
    text-align: left;
    padding: 10px 12px;
    border-bottom: 1px solid color-mix(in srgb, var(--spe-font-color) 10%, transparent);
    font-size: 14px;
    vertical-align: top;
  }

  td code {
    display: inline-block;
    background: var(--spe-bg-tint);
    padding: 2px 8px;
    border-radius: 4px;
    margin: 2px 4px 2px 0;
    font-size: 13px;
  }

  td code.dynamic {
    color: color-mix(in srgb, var(--spe-font-color) 60%, transparent);
    font-style: italic;
  }
</style>
