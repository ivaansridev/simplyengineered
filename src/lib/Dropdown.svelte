<!-- SimplyEngineered — Dropdown.svelte -->
<script lang="ts">
  import type { HTMLSelectAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLSelectAttributes {
    value?: string;
    simple?: boolean;
    children?: Snippet;
  }

  let {
    value = $bindable(''),
    simple = false,
    class: className = '',
    children,
    ...rest
  }: Props = $props();
</script>

<select class="spe-dropdown {simple ? 'spe-dropdown-simple' : ''} {className}" bind:value {...rest}>
  {@render children?.()}
</select>

<style>
  .spe-dropdown {
    display: block;
    width: 100%;
    height: var(--spe-input-height, 40px);
    padding: 0 12px;
    font: inherit;
    font-size: 14px;
    color: var(--spe-font-color);
    background: transparent;
    border: 1.5px solid color-mix(in srgb, var(--spe-font-color) 20%, transparent);
    border-radius: var(--spe-radius-low);
    outline: none;
    cursor: pointer;
    appearance: auto;
    transition:
      border-color 120ms ease,
      background-color 120ms ease,
      box-shadow 120ms ease;
  }

  .spe-dropdown:hover {
    background: var(--spe-bg-tint);
    border-color: color-mix(in srgb, var(--spe-font-color) 40%, transparent);
  }

  .spe-dropdown:focus {
    background: var(--spe-bg-tint);
    border-color: var(--spe-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--spe-accent) 20%, transparent);
  }

  .spe-dropdown:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .spe-dropdown-simple {
    border: none;
  }

  .spe-dropdown-simple:hover {
    border: none;
  }

  .spe-dropdown-simple:focus {
    border: none;
    box-shadow: none;
  }
</style>
