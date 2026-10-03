<!-- SimplyEngineered — Input.svelte -->
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends HTMLInputAttributes {
    value?: string;
    simple?: boolean;
  }

  let { value = $bindable(''), simple = false, class: className = '', ...rest }: Props = $props();
</script>

<input class="spe-input {simple ? 'spe-input-simple' : ''} {className}" bind:value {...rest} />

<style>
  .spe-input {
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
    transition:
      border-color 120ms ease,
      background-color 120ms ease,
      box-shadow 120ms ease;
  }

  .spe-input:hover {
    background: var(--spe-bg-tint);
    border-color: color-mix(in srgb, var(--spe-font-color) 40%, transparent);
  }

  .spe-input:focus {
    background: var(--spe-bg-tint);
    border-color: var(--spe-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--spe-accent) 20%, transparent);
  }

  .spe-input::placeholder {
    color: color-mix(in srgb, var(--spe-font-color) 35%, transparent);
  }

  .spe-input:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .spe-input-simple {
    border: none;
  }

  .spe-input-simple:hover {
    border: none;
  }

  .spe-input-simple:focus {
    border: none;
    box-shadow: none;
  }
</style>
