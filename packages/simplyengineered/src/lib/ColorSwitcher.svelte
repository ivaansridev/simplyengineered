<!-- SimplyEngineered — ColorSwitcher.svelte -->
<script lang="ts">
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';
  import { untrack } from 'svelte';
  import Dropdown from './Dropdown.svelte';

  interface Props extends HTMLSelectAttributes {
    /** Default color name (e.g. "yellow"), read once on mount. A saved choice takes precedence. */
    active?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    active = '',
    class: className = '',
    children,
    onchange: userOnchange,
    ...rest
  }: Props = $props();

  const STORAGE_KEY = 'spe-colorswitcher';

  let hostEl: HTMLSpanElement | undefined = $state();

  function isLiteral(name: string): boolean {
    return /^(#|rgb|hsl|oklch|lab|color)/i.test(name);
  }

  /**
   * Resolve an option value to a --spe-accent value.
   * A literal color ("#ec4899", "rgb(...)") passes through; a name ("pink")
   * becomes a reference to the matching --spe-color-pink token. If that token
   * isn't defined yet we still emit the reference, so it resolves as soon as
   * the stylesheet lands.
   */
  function resolve(doc: Document, name: string): string | null {
    if (!name) return null;
    if (isLiteral(name)) return name;
    const style = doc.defaultView?.getComputedStyle(doc.documentElement);
    const named = style?.getPropertyValue(`--spe-color-${name}`).trim();
    return named || `var(--spe-color-${name})`;
  }

  /**
   * Paint --spe-accent on the given document and remember the choice. The
   * document comes from the rendered element, so the component works correctly
   * when mounted into another document (preview iframe). --spe-accent-font-color
   * is intentionally not derived here: it keeps the static token from vars.css
   * (white), which consumers can override.
   */
  function apply(doc: Document, name: string) {
    const color = resolve(doc, name);
    if (!color) return;
    const root = doc.documentElement;
    root.style.setProperty('--spe-accent', color);
    try {
      doc.defaultView?.localStorage.setItem(STORAGE_KEY, name);
    } catch {
      /* storage unavailable (private mode) — the color still applies for this visit */
    }
  }

  function readSaved(doc: Document): string | null {
    try {
      return doc.defaultView?.localStorage.getItem(STORAGE_KEY) ?? null;
    } catch {
      return null;
    }
  }

  // `active` is the value rendered on the server and on the first client render,
  // so hydration matches. A saved choice is restored once after mount, in the
  // effect below; the host app's inline script (see the website's app.html)
  // restores the accent before first paint, so there is no flash.
  // untrack: `active` is deliberately read only once.
  let value = $state(untrack(() => active));
  let restored = false;

  $effect(() => {
    const doc = hostEl?.ownerDocument ?? (typeof document !== 'undefined' ? document : undefined);
    if (!doc) return;
    if (!restored) {
      restored = true;
      const saved = readSaved(doc);
      if (saved) value = saved;
    }
    apply(doc, value);
  });
</script>

<span class="spe-colorswitcher-host" bind:this={hostEl}>
  <Dropdown
    class="spe-colorswitcher {className}"
    bind:value
    {...rest}
    onchange={(e) => userOnchange?.(e)}
  >
    {@render children?.()}
  </Dropdown>
</span>

<style>
  /* no box of its own — the select lays out exactly where it would have */
  .spe-colorswitcher-host {
    display: contents;
  }

  /* the shared dropdown is width:100% / 40px tall — compact it for bars and toolbars */
  :global(select.spe-dropdown.spe-colorswitcher) {
    width: auto;
    min-width: 110px;
    height: 36px;
    padding: 0 10px;
    font-weight: 600;
  }
</style>
