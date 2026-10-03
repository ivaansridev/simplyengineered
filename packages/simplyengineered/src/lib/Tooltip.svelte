<!-- SimplyEngineered — Tooltip.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    content: string;
    position?: 'top' | 'bottom' | 'left' | 'right';
    children?: Snippet;
  }

  let { content, position = 'top', children }: Props = $props();

  function tooltip(
    node: HTMLElement,
    { content, position = 'top' }: { content: string; position?: string }
  ) {
    if (!content) return;
    node.setAttribute('data-tooltip', content);
    node.classList.add('spe-tooltip');
    if (position !== 'top') node.classList.add(`spe-tooltip-${position}`);
  }
</script>

<span use:tooltip={{ content, position }}>
  {@render children?.()}
</span>

<style>
  :global(.spe-tooltip) {
    position: relative;
    display: inline-block;
  }

  :global(.spe-tooltip)::before,
  :global(.spe-tooltip)::after {
    --spe-tt-gap: 8px;
    position: absolute;
    opacity: 0;
    pointer-events: none;
    transition:
      opacity 120ms ease,
      transform 120ms ease;
    z-index: 50;
  }

  :global(.spe-tooltip)::before {
    content: attr(data-tooltip);
    white-space: nowrap;
    padding: 6px 10px;
    font-size: 13px;
    font-weight: 500;
    color: var(--spe-font-color);
    background: var(--spe-bg-tint);
    border-radius: var(--spe-radius-low);
    box-shadow: 0 6px 16px rgb(0 0 0 / 35%);
  }

  :global(.spe-tooltip)::after {
    content: '';
    width: 8px;
    height: 8px;
    background: var(--spe-bg-tint);
    transform: rotate(45deg);
  }

  :global(.spe-tooltip):hover::before,
  :global(.spe-tooltip):hover::after,
  :global(.spe-tooltip):focus-visible::before,
  :global(.spe-tooltip):focus-visible::after {
    opacity: 1;
  }

  :global(.spe-tooltip)::before,
  :global(.spe-tooltip-top)::before {
    bottom: calc(100% + var(--spe-tt-gap));
    left: 50%;
    transform: translateX(-50%) translateY(4px);
  }
  :global(.spe-tooltip)::after,
  :global(.spe-tooltip-top)::after {
    bottom: calc(100% + var(--spe-tt-gap) - 4px);
    left: 50%;
    transform: translateX(-50%) translateY(4px) rotate(45deg);
  }
  :global(.spe-tooltip):hover::before,
  :global(.spe-tooltip):focus-visible::before {
    transform: translateX(-50%) translateY(0);
  }
  :global(.spe-tooltip):hover::after,
  :global(.spe-tooltip):focus-visible::after {
    transform: translateX(-50%) translateY(0) rotate(45deg);
  }

  :global(.spe-tooltip-bottom)::before {
    top: calc(100% + var(--spe-tt-gap));
    bottom: auto;
    left: 50%;
    transform: translateX(-50%) translateY(-4px);
  }
  :global(.spe-tooltip-bottom)::after {
    top: calc(100% + var(--spe-tt-gap) - 4px);
    bottom: auto;
    left: 50%;
    transform: translateX(-50%) translateY(-4px) rotate(45deg);
  }
  :global(.spe-tooltip-bottom):hover::before,
  :global(.spe-tooltip-bottom):focus-visible::before {
    transform: translateX(-50%) translateY(0);
  }
  :global(.spe-tooltip-bottom):hover::after,
  :global(.spe-tooltip-bottom):focus-visible::after {
    transform: translateX(-50%) translateY(0) rotate(45deg);
  }

  :global(.spe-tooltip-left)::before {
    right: calc(100% + var(--spe-tt-gap));
    bottom: auto;
    left: auto;
    top: 50%;
    transform: translateY(-50%) translateX(4px);
  }
  :global(.spe-tooltip-left)::after {
    right: calc(100% + var(--spe-tt-gap) - 4px);
    bottom: auto;
    left: auto;
    top: 50%;
    transform: translateY(-50%) translateX(4px) rotate(45deg);
  }
  :global(.spe-tooltip-left):hover::before,
  :global(.spe-tooltip-left):focus-visible::before {
    transform: translateY(-50%) translateX(0);
  }
  :global(.spe-tooltip-left):hover::after,
  :global(.spe-tooltip-left):focus-visible::after {
    transform: translateY(-50%) translateX(0) rotate(45deg);
  }

  :global(.spe-tooltip-right)::before {
    left: calc(100% + var(--spe-tt-gap));
    right: auto;
    bottom: auto;
    top: 50%;
    transform: translateY(-50%) translateX(-4px);
  }
  :global(.spe-tooltip-right)::after {
    left: calc(100% + var(--spe-tt-gap) - 4px);
    right: auto;
    bottom: auto;
    top: 50%;
    transform: translateY(-50%) translateX(-4px) rotate(45deg);
  }
  :global(.spe-tooltip-right):hover::before,
  :global(.spe-tooltip-right):focus-visible::before {
    transform: translateY(-50%) translateX(0);
  }
  :global(.spe-tooltip-right):hover::after,
  :global(.spe-tooltip-right):focus-visible::after {
    transform: translateY(-50%) translateX(0) rotate(45deg);
  }
</style>
