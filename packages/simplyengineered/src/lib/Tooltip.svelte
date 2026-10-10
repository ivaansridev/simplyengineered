<!-- SimplyEngineered — Tooltip.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  type Side = 'top' | 'bottom' | 'left' | 'right';

  interface Props {
    content: string;
    position?: 'auto' | Side;
    children?: Snippet;
  }

  let { content, position = 'auto', children }: Props = $props();

  const GAP = 14;
  const MARGIN = 8;
  const bubbleId = $props.id();

  let anchor: HTMLSpanElement | undefined = $state();
  let bubble: HTMLSpanElement | undefined = $state();
  let arrowEl: HTMLSpanElement | undefined = $state();
  let open = $state(false);

  let pointer: { x: number; y: number } | null = null;
  let frame = 0;
  /** true while the tooltip is being driven by the cursor */
  let pointerActive = false;

  // `window` is the module's realm, which may differ from the document the
  // tooltip lives in (e.g. a preview iframe). Always measure against the
  // element's own view.
  function view(): Window {
    return anchor?.ownerDocument?.defaultView ?? window;
  }

  // Pick a side that keeps the tooltip on screen. Prefer above the cursor;
  // fall back to below, then right/left when there isn't vertical room.
  function chooseSide(px: number, py: number, w: number, h: number): Side {
    if (position !== 'auto') return position;

    const v = view();
    const above = py - GAP - MARGIN;
    const below = v.innerHeight - py - GAP - MARGIN;
    const left = px - GAP - MARGIN;
    const right = v.innerWidth - px - GAP - MARGIN;

    if (above >= h) return 'top';
    if (below >= h) return 'bottom';
    if (right >= w && right >= left) return 'right';
    if (left >= w) return 'left';
    return above >= below ? 'top' : 'bottom';
  }

  function place() {
    if (!bubble || !anchor) return;

    const w = bubble.offsetWidth;
    const h = bubble.offsetHeight;
    const rect = anchor.getBoundingClientRect();

    // Anchor to the cursor while hovering, otherwise to the element (focus).
    const px = pointer ? pointer.x : rect.left + rect.width / 2;
    const py = pointer ? pointer.y : rect.top + rect.height / 2;
    const side = chooseSide(px, py, w, h);

    let left: number;
    let top: number;
    if (side === 'top') {
      left = px - w / 2;
      top = py - GAP - h;
    } else if (side === 'bottom') {
      left = px - w / 2;
      top = py + GAP;
    } else if (side === 'left') {
      left = px - GAP - w;
      top = py - h / 2;
    } else {
      left = px + GAP;
      top = py - h / 2;
    }

    // Keep the whole bubble inside the viewport.
    const v = view();
    left = Math.max(MARGIN, Math.min(left, v.innerWidth - w - MARGIN));
    top = Math.max(MARGIN, Math.min(top, v.innerHeight - h - MARGIN));

    bubble.style.left = `${Math.round(left)}px`;
    bubble.style.top = `${Math.round(top)}px`;
    bubble.dataset.side = side;

    // Point the arrow back at the cursor along the tooltip's edge.
    if (arrowEl) {
      const s = arrowEl.style;
      s.left = '';
      s.right = '';
      s.top = '';
      s.bottom = '';
      s.marginLeft = '-4px';
      s.marginTop = '-4px';
      if (side === 'top' || side === 'bottom') {
        s.left = `${Math.max(MARGIN, Math.min(px - left, w - MARGIN))}px`;
        if (side === 'top') s.bottom = '-4px';
        else s.top = '-4px';
      } else {
        s.top = `${Math.max(MARGIN, Math.min(py - top, h - MARGIN))}px`;
        if (side === 'left') s.right = '-4px';
        else s.left = '-4px';
      }
    }
  }

  function schedule() {
    if (frame) return;
    frame = view().requestAnimationFrame(() => {
      frame = 0;
      place();
    });
  }

  function show() {
    if (!content) return;
    open = true;
    schedule();
  }

  function hide() {
    open = false;
    pointer = null;
    if (frame) {
      view().cancelAnimationFrame(frame);
      frame = 0;
    }
  }

  function onPointerEnter(e: PointerEvent) {
    pointerActive = true;
    pointer = { x: e.clientX, y: e.clientY };
    show();
  }

  function onPointerMove(e: PointerEvent) {
    if (!pointerActive) return;
    pointer = { x: e.clientX, y: e.clientY };
    schedule();
  }

  // Leaving always hides — even mid-click or while a child is focused — so a
  // tooltip can never stay stuck after the cursor has moved away.
  function onPointerLeave() {
    pointerActive = false;
    hide();
  }

  function onPointerCancel() {
    pointerActive = false;
    hide();
  }

  // Associate the tooltip with whatever descendant takes focus, so screen
  // readers announce it — the trigger element is user-provided, so this is
  // done here rather than by asking the caller to wire aria-describedby.
  let describedTarget: Element | null = null;
  let previousDescribedBy: string | null = null;

  function clearDescription() {
    if (!describedTarget) return;
    if (previousDescribedBy === null) describedTarget.removeAttribute('aria-describedby');
    else describedTarget.setAttribute('aria-describedby', previousDescribedBy);
    describedTarget = null;
    previousDescribedBy = null;
  }

  function describe(target: Element) {
    if (describedTarget === target) return;
    clearDescription();
    previousDescribedBy = target.getAttribute('aria-describedby');
    target.setAttribute(
      'aria-describedby',
      previousDescribedBy ? `${previousDescribedBy} ${bubbleId}` : bubbleId
    );
    describedTarget = target;
  }

  // Keyboard focus still shows the hint, anchored to the element.
  function onFocusIn(e: FocusEvent) {
    const target = e.target as Element | null;
    if (!target?.matches?.(':focus-visible')) return;
    describe(target);
    pointerActive = false;
    pointer = null;
    show();
  }

  function onFocusOut(e: FocusEvent) {
    clearDescription();
    const next = e.relatedTarget as Node | null;
    if (next && anchor?.contains(next)) return;
    if (pointerActive) return; // still hovered — keep following the cursor
    hide();
  }

  // Re-measure when the content changes while the tooltip is visible.
  $effect(() => {
    void content;
    if (open) schedule();
  });

  // While visible: hide on scroll, and guard against missed pointerleave
  // events (fast moves, or the pointer leaving the window).
  $effect(() => {
    if (!open) return;

    const onScroll = () => {
      pointerActive = false;
      hide();
    };

    const onWindowMove = (e: PointerEvent) => {
      if (!pointerActive || !anchor) return;
      const r = anchor.getBoundingClientRect();
      if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) {
        pointerActive = false;
        hide();
      }
    };

    const v = view();
    v.addEventListener('scroll', onScroll, true);
    v.addEventListener('pointermove', onWindowMove, true);
    return () => {
      v.removeEventListener('scroll', onScroll, true);
      v.removeEventListener('pointermove', onWindowMove, true);
    };
  });
</script>

<span
  class="spe-tooltip"
  role="presentation"
  bind:this={anchor}
  onpointerenter={onPointerEnter}
  onpointermove={onPointerMove}
  onpointerleave={onPointerLeave}
  onpointercancel={onPointerCancel}
  onfocusin={onFocusIn}
  onfocusout={onFocusOut}
>
  {@render children?.()}
  {#if content}
    <span class="spe-tooltip-bubble" class:open bind:this={bubble} id={bubbleId} role="tooltip">
      {content}
      <span class="spe-tooltip-arrow" bind:this={arrowEl}></span>
    </span>
  {/if}
</span>

<style>
  .spe-tooltip {
    position: relative;
    display: inline-block;
  }

  .spe-tooltip-bubble {
    position: fixed;
    z-index: 1000;
    padding: 6px 10px;
    font-size: 13px;
    font-weight: 500;
    line-height: 1.4;
    white-space: normal;
    max-width: min(280px, calc(100vw - 16px));
    text-align: left;
    color: var(--spe-font-color);
    background: var(--spe-bg-tint);
    border-radius: var(--spe-radius-low);
    box-shadow: 0 6px 16px rgb(0 0 0 / 35%);
    pointer-events: none;
    visibility: hidden;
    opacity: 0;
  }

  /* No appear animation — it shows instantly. */
  .spe-tooltip-bubble.open {
    visibility: visible;
    opacity: 1;
  }

  .spe-tooltip-arrow {
    position: absolute;
    width: 8px;
    height: 8px;
    background: var(--spe-bg-tint);
    transform: rotate(45deg);
  }
</style>
