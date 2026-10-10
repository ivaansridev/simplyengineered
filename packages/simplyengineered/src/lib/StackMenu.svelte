<!-- SimplyEngineered — StackMenu.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import Modal from './Modal.svelte';

  type Threshold = 'phone' | 'tablet';
  type Side = 'left' | 'center' | 'right' | 'bottom' | 'top';

  interface Props {
    /** Collapse the children below this device size. */
    threshold?: Threshold;
    /** Edge the collapsed menu slides in from. */
    side?: Side;
    /** Accessible label for the hamburger button (also the sheet heading). */
    label?: string;
    class?: string;
    children?: Snippet;
  }

  let {
    threshold = 'phone',
    side = 'bottom',
    label = 'Menu',
    class: className = '',
    children
  }: Props = $props();

  const BREAKPOINTS: Record<Threshold, number> = {
    phone: 600,
    tablet: 900
  };

  // The collapse is CSS (so it is correct on the first paint), but the breakpoint
  // numbers live only in BREAKPOINTS — this block generates the media query from
  // them so the JS and CSS can never drift out of sync. The `.spe-stackmenu`
  // prefix raises specificity above the component's scoped base rules, which
  // would otherwise win a tie and keep the toggle hidden.
  const collapseCss = $derived(
    `<style>@media (max-width: ${BREAKPOINTS[threshold]}px){` +
      `.spe-stackmenu.spe-stackmenu-${threshold} .spe-stackmenu-inline{display:none}` +
      `.spe-stackmenu.spe-stackmenu-${threshold} .spe-stackmenu-toggle{display:inline-flex}` +
      `}</style>`
  );

  const dialogId = $props.id();

  let open = $state(false);
  let inlineEl: HTMLDivElement | undefined = $state();
  let menuEl: HTMLDivElement | undefined = $state();
  let slotEl: HTMLDivElement | undefined = $state();

  // The collapse itself is handled by CSS (see the bottom of this file), so it
  // is already correct on the first paint — no measuring, no flash. The media
  // query is only here to close an open sheet if the viewport grows past the
  // threshold. It re-subscribes when `threshold` changes.
  $effect(() => {
    const win = (inlineEl?.ownerDocument ?? (typeof document !== 'undefined' ? document : null))
      ?.defaultView;
    if (!win) return;
    const mq = win.matchMedia(`(min-width: ${BREAKPOINTS[threshold] + 1}px)`);
    const update = () => {
      if (mq.matches) open = false;
    };
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  });

  // Children are rendered once and *moved* between the inline slot and the
  // sheet, instead of being rendered twice — duplicating them would collide
  // child ids / names / <label for> while the sheet is open.
  $effect(() => {
    const menu = menuEl;
    const inline = inlineEl;
    const slot = slotEl;
    if (!menu || !inline) return;
    const target = slot ?? inline;
    if (menu.parentElement !== target) target.appendChild(menu);
  });
</script>

<!-- eslint-disable-next-line svelte/no-at-html-tags -- static CSS generated from BREAKPOINTS, no user input -->
<svelte:head>{@html collapseCss}</svelte:head>

<div class="spe-stackmenu spe-stackmenu-{threshold} {className}">
  <div class="spe-stackmenu-inline" bind:this={inlineEl}>
    <div class="spe-stackmenu-content" bind:this={menuEl}>
      {@render children?.()}
    </div>
  </div>

  <button
    type="button"
    class="spe-stackmenu-toggle"
    aria-label={label}
    aria-haspopup="dialog"
    aria-controls={dialogId}
    aria-expanded={open}
    onclick={() => (open = true)}
  >
    <span></span>
    <span></span>
    <span></span>
  </button>
</div>

<Modal bind:open {side} id={dialogId}>
  {#snippet heading()}{label}{/snippet}
  <div class="spe-stackmenu-list" bind:this={slotEl}>
    <!-- the rendered menu is moved in here while the sheet is open -->
  </div>
</Modal>

<style>
  /*
   * `display: contents` lets the children lay themselves out in whatever
   * container the menu is dropped into — a flex row in a navbar, a column in a
   * sidebar — instead of forcing a horizontal bar.
   *
   * Caveat: because the element generates no box, the `class` prop lands on a
   * box-less node — consumer margin/border/background on `.spe-stackmenu` do
   * nothing. Style the inline content or a wrapper instead. Older engines also
   * drop `display: contents` elements from the accessibility tree.
   */
  .spe-stackmenu {
    display: contents;
  }

  .spe-stackmenu-inline,
  .spe-stackmenu-content {
    display: contents;
  }

  /* Hidden until the viewport drops below the matching threshold. */
  .spe-stackmenu-toggle {
    display: none;
    flex-direction: column;
    justify-content: center;
    gap: 4px;
    width: 40px;
    height: 40px;
    margin: 0;
    padding: 10px;
    background: transparent;
    border: 1px solid color-mix(in srgb, var(--spe-font-color) 25%, transparent);
    border-radius: var(--spe-radius-low);
    cursor: pointer;
  }

  .spe-stackmenu-toggle:hover {
    background: var(--spe-bg-tint);
    border-color: color-mix(in srgb, var(--spe-font-color) 45%, transparent);
  }

  .spe-stackmenu-toggle:focus-visible {
    outline: 2px solid var(--spe-accent);
    outline-offset: 2px;
  }

  .spe-stackmenu-toggle span {
    display: block;
    width: 100%;
    height: 2px;
    background: var(--spe-font-color);
  }

  .spe-stackmenu-list {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    gap: 8px;
  }

  /* stacked children read as menu rows rather than a horizontal bar */
  .spe-stackmenu-list :global(.spe-pilltab) {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .spe-stackmenu-list :global(.spe-pilltab-item) {
    width: 100%;
  }
</style>
