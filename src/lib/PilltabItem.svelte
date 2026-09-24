<!-- SimplyEngineered — PilltabItem.svelte -->
<script lang="ts">
  import type { HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLButtonAttributes {
    variant?: 'active' | undefined;
    children?: Snippet;
  }

  let { variant, class: className = '', children, ...rest }: Props = $props();
</script>

<button class="spe-pilltab-item {variant === 'active' ? 'active' : ''} {className}" {...rest}>
  {@render children?.()}
</button>

<style>
  .spe-pilltab-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    padding: 8px 20px;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    color: color-mix(in srgb, var(--spe-font-color) 55%, var(--spe-mode) 45%);
    background: transparent;
    border: none;
    border-radius: var(--spe-radius-med);
    cursor: pointer;
    transition:
      background-color 150ms ease,
      color 150ms ease;
  }

  .spe-pilltab-item:hover {
    color: var(--spe-font-color);
  }

  .spe-pilltab-item.active {
    background: var(--spe-accent);
    color: var(--spe-accent-font-color);
  }

  .spe-pilltab-item.active:hover {
    filter: brightness(1.1);
  }

  .spe-pilltab-item:focus-visible {
    outline: 2px solid var(--spe-accent);
    outline-offset: 2px;
  }
</style>
