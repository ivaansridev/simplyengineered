<!-- SimplyEngineered — Modal.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { onDestroy, untrack } from 'svelte';
  import { fade, fly, scale } from 'svelte/transition';

  type Side = 'center' | 'left' | 'right' | 'top' | 'bottom';

  interface Props {
    open?: boolean;
    variant?: 'default' | 'fullscreen';
    /** `center` (default) dialog, or a sheet that slides in from an edge. */
    side?: Side;
    /** Stable id for the dialog panel, so a trigger can point `aria-controls` at it. */
    id?: string;
    heading?: Snippet;
    children?: Snippet;
    footer?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
    variant = 'default',
    side = 'center',
    id,
    heading,
    children,
    footer,
    onclose
  }: Props = $props();

  const uid = $props.id();
  const panelId = $derived(id ?? `${uid}-panel`);
  const headingId = `${uid}-heading`;

  let overlayEl: HTMLDivElement | undefined = $state();
  let panelEl: HTMLDivElement | undefined = $state();

  const FOCUSABLE =
    'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])';

  function close() {
    if (!open) return;
    open = false;
    onclose?.();
  }

  /** Focusable descendants that are actually visible. */
  function focusable(): HTMLElement[] {
    if (!panelEl) return [];
    const active = panelEl.ownerDocument.activeElement;
    return Array.from(panelEl.querySelectorAll<HTMLElement>(FOCUSABLE)).filter(
      (el) => el.offsetWidth > 0 || el.offsetHeight > 0 || el === active
    );
  }

  /**
   * Motion length from --spe-dur, so the JS transitions honour the same token.
   * Returns 0 when the user prefers reduced motion.
   */
  function motionDuration(node: Element, fallback: number): number {
    const view = node.ownerDocument?.defaultView;
    if (!view) return fallback;
    if (view.matchMedia?.('(prefers-reduced-motion: reduce)').matches) return 0;
    const value = Number.parseFloat(view.getComputedStyle(node).getPropertyValue('--spe-dur'));
    return Number.isFinite(value) && value > 0 ? value : fallback;
  }

  function overlayTransition(node: Element) {
    return fade(node, { duration: motionDuration(node, 200) });
  }

  // Edge sheets slide in from their edge; the centered dialog keeps the subtle scale.
  function panelTransition(node: Element, params: { side: Side }) {
    const duration = motionDuration(node, 220);
    switch (params.side) {
      case 'left':
        return fly(node, { x: '-100%', duration });
      case 'right':
        return fly(node, { x: '100%', duration });
      case 'top':
        return fly(node, { y: '-100%', duration });
      case 'bottom':
        return fly(node, { y: '100%', duration });
      default:
        return scale(node, { duration, start: 0.97 });
    }
  }

  // Only close when the press itself started on the backdrop: a drag that begins
  // in the panel and releases over the backdrop must not dismiss the dialog.
  let pressedOnBackdrop = false;

  // Background content is made inert while the dialog is open so the focus trap
  // matches what assistive tech can reach.
  let inerted: HTMLElement[] = [];
  function inertBackground(overlay: HTMLElement, active: boolean) {
    if (!active) {
      for (const el of inerted) el.removeAttribute('inert');
      inerted = [];
      return;
    }
    const body = overlay.ownerDocument.body;
    const marked: HTMLElement[] = [];
    let node: HTMLElement | null = overlay;
    while (node && node !== body) {
      const parent: HTMLElement | null = node.parentElement;
      if (!parent) break;
      for (const child of Array.from(parent.children)) {
        const el = child as HTMLElement;
        if (el === node || el.hasAttribute('inert')) continue;
        el.setAttribute('inert', '');
        marked.push(el);
      }
      node = parent;
    }
    inerted = marked;
  }

  // The open "session": focus trap, Escape handling, scroll lock, background
  // inert, and focus restore. Set up once when `open` turns true (retrying until
  // the overlay element is bound) and torn down exactly once on close/unmount.
  let sessionCleanup: (() => void) | null = null;

  function startSession(overlay: HTMLElement): () => void {
    return untrack(() => {
      const doc = overlay.ownerDocument;
      const win = doc.defaultView;
      if (!win) return () => {};

      const previouslyFocused = doc.activeElement instanceof HTMLElement ? doc.activeElement : null;
      const body = doc.body;
      const previousOverflow = body.style.overflow;
      body.style.overflow = 'hidden';

      const items = focusable();
      const target = items.find((el) => !el.matches('input, select, textarea')) ?? panelEl;
      target?.focus();

      inertBackground(overlay, true);

      const onKeydown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          close();
          return;
        }
        if (event.key !== 'Tab' || !panelEl) return;

        const focusableEls = focusable();
        if (!focusableEls.length) {
          event.preventDefault();
          return;
        }
        const first = focusableEls[0];
        const last = focusableEls[focusableEls.length - 1];
        const active = doc.activeElement;
        if (event.shiftKey && (active === first || active === panelEl)) {
          event.preventDefault();
          last.focus();
        } else if (!event.shiftKey && active === last) {
          event.preventDefault();
          first.focus();
        }
      };

      win.addEventListener('keydown', onKeydown);
      return () => {
        win.removeEventListener('keydown', onKeydown);
        body.style.overflow = previousOverflow;
        inertBackground(overlay, false);
        previouslyFocused?.focus?.();
      };
    });
  }

  $effect(() => {
    const overlay = overlayEl;
    if (open && overlay) {
      if (!sessionCleanup) sessionCleanup = startSession(overlay);
    } else if (sessionCleanup) {
      sessionCleanup();
      sessionCleanup = null;
    }
  });

  onDestroy(() => {
    sessionCleanup?.();
    sessionCleanup = null;
  });
</script>

{#if open}
  <div
    class="spe-modal-overlay spe-modal-overlay-{side}"
    bind:this={overlayEl}
    transition:overlayTransition
  >
    <!-- A real button, behind the panel, rather than a click handler on the
         overlay wrapper: clicking outside closes, without nesting the dialog in
         an interactive element. -->
    <button
      type="button"
      class="spe-modal-backdrop"
      aria-label="Close"
      tabindex="-1"
      onpointerdown={(e) => {
        if (e.target === e.currentTarget) pressedOnBackdrop = true;
      }}
      onclick={(e) => {
        if (pressedOnBackdrop && e.target === e.currentTarget) close();
        pressedOnBackdrop = false;
      }}
    ></button>

    <div
      class="spe-modal spe-modal-{side} {variant === 'fullscreen' ? 'spe-modal-full' : ''}"
      bind:this={panelEl}
      transition:panelTransition={{ side }}
      id={panelId}
      role="dialog"
      aria-modal="true"
      aria-labelledby={heading ? headingId : undefined}
      tabindex="-1"
    >
      {#if heading}
        <div class="spe-modal-heading" id={headingId}>{@render heading()}</div>
      {/if}
      <div class="spe-modal-body">{@render children?.()}</div>
      {#if footer}
        <div class="spe-modal-footer">{@render footer()}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .spe-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--spe-modal-overlay, rgb(0 0 0 / 55%));
  }

  .spe-modal-overlay-left {
    align-items: stretch;
    justify-content: flex-start;
  }

  .spe-modal-overlay-right {
    align-items: stretch;
    justify-content: flex-end;
  }

  .spe-modal-overlay-top {
    align-items: flex-start;
    justify-content: center;
  }

  .spe-modal-overlay-bottom {
    align-items: flex-end;
    justify-content: center;
  }

  .spe-modal-backdrop {
    position: absolute;
    inset: 0;
    z-index: 0;
    margin: 0;
    padding: 0;
    border: none;
    background: transparent;
    cursor: default;
  }

  .spe-modal {
    position: relative;
    z-index: 1;
    width: min(480px, calc(100% - 32px));
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--spe-bg-tint);
    color: var(--spe-font-color);
    border-radius: var(--spe-radius-med);
    box-shadow: 0 16px 40px rgb(0 0 0 / 45%);
  }

  /* Side sheets: full height, anchored to their edge. */
  .spe-modal-left,
  .spe-modal-right {
    width: min(360px, 85vw);
    height: 100%;
    max-height: 100vh;
  }

  .spe-modal-left {
    border-radius: 0 var(--spe-radius-med) var(--spe-radius-med) 0;
  }

  .spe-modal-right {
    border-radius: var(--spe-radius-med) 0 0 var(--spe-radius-med);
  }

  /* Edge sheets: full width, anchored to the top/bottom edge, tall enough to
     scroll long menus before they grow off screen. */
  .spe-modal-bottom {
    width: 100%;
    max-width: 560px;
    max-height: 85vh;
    border-radius: var(--spe-radius-high) var(--spe-radius-high) 0 0;
  }

  .spe-modal-top {
    width: 100%;
    max-width: 560px;
    max-height: 85vh;
    border-radius: 0 0 var(--spe-radius-high) var(--spe-radius-high);
  }

  .spe-modal-heading {
    padding: 20px 24px 12px;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid color-mix(in srgb, var(--spe-font-color) 12%, transparent);
  }

  .spe-modal-body {
    padding: 20px 24px 12px;
    overflow-y: auto;
    overscroll-behavior: contain;
    font-size: 14px;
    line-height: 1.5;
  }

  .spe-modal-footer {
    display: flex;
    align-items: stretch;
    /* a hairline seam between adjacent buttons */
    gap: 1px;
    padding: 0;
    border-top: 1px solid color-mix(in srgb, var(--spe-font-color) 12%, transparent);
    flex-shrink: 0;
  }

  /*
   * Footer buttons fill the modal edge-to-edge, sharing the width equally.
   * Scoped to direct children and wrapped in :where() so it stays low-
   * specificity: non-`.spe-btn` controls are untouched, and a consumer class can
   * opt an individual control out of the stretch (e.g. a round icon button).
   */
  .spe-modal-footer > :global(:where(.spe-btn)) {
    flex: 1 1 0;
    margin: 0;
    border-radius: 0;
  }

  /* Fullscreen wins over any edge sizing (declared last so it overrides). */
  .spe-modal-full {
    width: 100%;
    height: 100%;
    max-width: none;
    max-height: none;
    border-radius: 0;
    background: var(--spe-bg-tint);
  }
</style>
