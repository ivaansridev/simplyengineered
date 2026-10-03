<!-- SimplyEngineered — Button.svelte -->
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLButtonAttributes {
    variant?: 'solid' | 'tonal' | 'outlined' | 'simple';
    children?: Snippet;
  }

  let { variant = 'solid', class: className = '', children, ...rest }: Props = $props();
</script>

<button class="spe-btn spe-btn-{variant} {className}" {...rest}>
  {@render children?.()}
</button>

<style>
  .spe-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font: inherit;
    font-size: 16px;
    font-weight: 600;
    cursor: pointer;
    border: none;
    border-radius: var(--spe-radius-low);
    padding: 6px 16px;
    transition:
      background-color var(--spe-dur, 120ms) ease,
      filter var(--spe-dur, 120ms) ease,
      color var(--spe-dur, 120ms) ease,
      border-color var(--spe-dur, 120ms) ease;
  }

  .spe-btn:disabled {
    opacity: 0.35;
    cursor: not-allowed;
    pointer-events: none;
  }

  .spe-btn:focus-visible {
    outline: 2px solid var(--spe-accent);
    outline-offset: 2px;
  }

  .spe-btn-solid {
    background: var(--spe-accent);
    color: var(--spe-accent-font-color);
    border: none;
  }
  .spe-btn-solid:hover {
    filter: brightness(1.1);
  }
  .spe-btn-solid:active {
    filter: brightness(0.95);
  }

  .spe-btn-tonal {
    background: color-mix(in srgb, var(--spe-accent) 15%, transparent);
    color: var(--spe-accent);
    border: none;
  }
  .spe-btn-tonal:hover {
    background: color-mix(in srgb, var(--spe-accent) 25%, transparent);
  }
  .spe-btn-tonal:active {
    filter: brightness(0.95);
  }

  .spe-btn-outlined {
    background: transparent;
    color: var(--spe-accent);
    border: 1.5px solid var(--spe-accent);
  }
  .spe-btn-outlined:hover {
    background: var(--spe-hover-bg, transparent);
  }
  .spe-btn-outlined:active {
    filter: brightness(0.95);
  }

  .spe-btn-simple {
    background: transparent;
    color: var(--spe-accent);
    border: none;
  }
  .spe-btn-simple:hover {
    background: var(--spe-hover-bg, transparent);
  }
  .spe-btn-simple:active {
    filter: brightness(0.95);
  }
</style>
