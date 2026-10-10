<script lang="ts">
  import * as spe from 'simplyengineered';
  import { page } from '$app/state';
  import { baseTags, docs, isActive, tabs, type ComponentDoc } from '$lib/docs';

  let search = $state('');

  // /docs?c=Button deep-links straight to a component
  let unknown = $state<string | null>(
    page.url.searchParams.get('c') &&
      !docs.some((d) => d.component === page.url.searchParams.get('c'))
      ? page.url.searchParams.get('c')
      : null
  );
  let selected = $state<ComponentDoc>(
    docs.find((d) => d.component === page.url.searchParams.get('c')) ?? docs[0]
  );

  // In-app navigation to /docs?c=X must switch components too, not just the
  // initial load. Clicks update `selected` directly (without touching the URL),
  // so this only fires when the query string actually changes. An unknown value
  // keeps the current component but surfaces a notice.
  $effect(() => {
    const requested = page.url.searchParams.get('c');
    if (!requested) {
      unknown = null;
      return;
    }
    const match = docs.find((d) => d.component === requested);
    unknown = match ? null : requested;
    if (match && match.component !== selected.component) selected = match;
  });

  let filtered = $derived(
    docs.filter(
      (d) =>
        d.name.toLowerCase().includes(search.toLowerCase()) ||
        d.component.toLowerCase().includes(search.toLowerCase()) ||
        d.blurb.toLowerCase().includes(search.toLowerCase())
    )
  );

  let bases = $derived(baseTags(selected.base));
  let entries = $derived(Object.entries(selected.attributes));
</script>

<spe.Navbar blur>
  <h2>SimplyEngineered</h2>

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

<div class="docs-layout">
  <aside class="sidebar">
    <spe.StackMenu side="left" threshold="tablet" label="Components">
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
    </spe.StackMenu>
  </aside>

  <main class="doc-panel">
    {#if unknown}
      <p class="notice" role="status">
        No component named <code>{unknown}</code> — showing <strong>{selected.name}</strong>.
      </p>
    {/if}
    <h1>{selected.name}</h1>
    <p class="tag">
      <spe.Tooltip content={`Import as spe.${selected.component}`}>
        <code>{selected.tag}</code>
      </spe.Tooltip>
    </p>
    <p class="blurb">{selected.blurb}</p>

    {#if bases.length}
      <p class="base">
        Renders as
        {#each bases as base (base)}
          <spe.Tooltip content="Underlying HTML element">
            <code>{`<${base}>`}</code>
          </spe.Tooltip>
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
            <th><spe.Tooltip content="Component-specific prop">Attribute</spe.Tooltip></th>
            <th><spe.Tooltip content="Values or types it accepts">Accepts</spe.Tooltip></th>
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
    margin: 8px 0 0;
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
    margin: 0 0 4px;
    color: color-mix(in srgb, var(--spe-font-color) 60%, transparent);
    font-size: 14px;
  }

  .blurb {
    margin: 3px 0 0;
    max-width: 60ch;
    color: color-mix(in srgb, var(--spe-font-color) 65%, transparent);
    font-size: 15px;
    line-height: 1.6;
  }

  .empty {
    margin: 6px 0 0;
    color: color-mix(in srgb, var(--spe-font-color) 55%, transparent);
    font-size: 14px;
    font-style: italic;
  }

  .notice {
    margin: 0 0 12px;
    padding: 8px 12px;
    color: var(--spe-color-red);
    background: color-mix(in srgb, var(--spe-color-red) 10%, transparent);
    border: 1px solid color-mix(in srgb, var(--spe-color-red) 35%, transparent);
    border-radius: var(--spe-radius-low);
    font-size: 13px;
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
    margin-top: 8px;
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
    border-radius: 0;
    margin: 1px 2px 1px 0;
    font-size: 13px;
  }

  td code.dynamic {
    color: color-mix(in srgb, var(--spe-font-color) 60%, transparent);
    font-style: italic;
  }

  @media (max-width: 900px) {
    .docs-layout {
      flex-direction: column;
    }

    .sidebar {
      width: 100%;
      padding: 12px 16px;
      border-right: none;
      border-bottom: 1px solid color-mix(in srgb, var(--spe-font-color) 10%, transparent);
    }

    .doc-panel {
      max-width: 100%;
      padding: 24px 16px;
    }
  }
</style>
