<!-- SimplyEngineered — Textarea.svelte -->
<script lang="ts">
  import type { HTMLTextareaAttributes } from 'svelte/elements';

  interface Props extends HTMLTextareaAttributes {
    value?: string;
    simple?: boolean;
  }

  let { value = $bindable(''), simple = false, class: className = '', ...rest }: Props = $props();
</script>

<textarea
  class="spe-textarea {simple ? 'spe-textarea-simple' : ''} {className}"
  bind:value
  {...rest}></textarea>

<style>
  .spe-textarea {
    display: block;
    width: 100%;
    min-height: 100px;
    padding: 10px 12px;
    font: inherit;
    font-size: 14px;
    color: var(--spe-font-color);
    background: transparent;
    border: 1.5px solid color-mix(in srgb, var(--spe-font-color) 20%, transparent);
    border-radius: var(--spe-radius-low);
    outline: none;
    resize: vertical;
    line-height: 1.5;
    transition:
      border-color 120ms ease,
      background-color 120ms ease,
      box-shadow 120ms ease;
  }

  .spe-textarea:hover {
    background: var(--spe-bg-tint);
    border-color: color-mix(in srgb, var(--spe-font-color) 40%, transparent);
  }

  .spe-textarea:focus {
    background: var(--spe-bg-tint);
    border-color: var(--spe-accent);
    box-shadow: 0 0 0 3px color-mix(in srgb, var(--spe-accent) 20%, transparent);
  }

  .spe-textarea::placeholder {
    color: color-mix(in srgb, var(--spe-font-color) 35%, transparent);
  }

  .spe-textarea:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .spe-textarea-simple {
    border: none;
  }

  .spe-textarea-simple:hover {
    border: none;
  }

  .spe-textarea-simple:focus {
    border: none;
    box-shadow: none;
  }
</style>
