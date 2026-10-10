<!-- SimplyEngineered — A.svelte -->
<script lang="ts">
  import type { HTMLAnchorAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  interface Props extends HTMLAnchorAttributes {
    variant?: 'link' | 'accent-link' | 'btn-solid' | 'btn-tonal' | 'btn-outlined' | 'btn-simple';
    children?: Snippet;
  }

  let { variant = 'link', class: className = '', children, ...rest }: Props = $props();

  let btnClass = $derived(
    variant.startsWith('btn-')
      ? `spe-btn spe-btn-${variant.replace('btn-', '')}`
      : variant === 'accent-link'
        ? 'spe-hl spe-hl-accent'
        : 'spe-hl'
  );
</script>

<!-- .spe-btn* styling is shared with <spe.Button> and lives in main.css. -->
<a class="{btnClass} {className}" {...rest}>
  {@render children?.()}
</a>

<style>
  .spe-hl {
    color: inherit;
    border-bottom: 1.5px solid transparent;
    background-image: repeating-linear-gradient(
      to right,
      color-mix(in srgb, var(--spe-font-color) 40%, transparent) 0px,
      color-mix(in srgb, var(--spe-font-color) 40%, transparent) 4px,
      transparent 4px,
      transparent 8px
    );
    background-size: 100% 1.5px;
    background-position: 0 100%;
    background-repeat: repeat-x;
    text-decoration: none;
    transition:
      color var(--spe-dur, 120ms) ease,
      background-image var(--spe-dur, 120ms) ease,
      border-bottom-color var(--spe-dur, 120ms) ease;
  }

  .spe-hl:hover {
    color: var(--spe-accent);
    background-image: none;
    border-bottom-color: var(--spe-accent);
  }

  .spe-hl-accent {
    color: var(--spe-accent);
  }

  .spe-hl-accent:hover {
    color: var(--spe-accent);
    filter: brightness(1.15);
  }
</style>
