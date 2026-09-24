<!-- SimplyEngineered — A.svelte -->
<script lang="ts">
  let { variant = 'link', class: className = '', children, ...rest }: Props = $props();

  let btnClass = $derived(
    variant.startsWith('button-') ? `spe-btn spe-btn-${variant.replace('button-', '')}` : 'spe-hl'
  );
</script>

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
      color 150ms ease,
      background-image 150ms ease,
      border-bottom-color 150ms ease;
  }

  .spe-hl:hover {
    color: var(--spe-accent);
    background-image: none;
    border-bottom-color: var(--spe-accent);
  }

  :global(.spe-btn) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    font: inherit;
    font-size: 16px;
    font-weight: 600;
    text-decoration: none;
    cursor: pointer;
    border: none;
    border-radius: var(--spe-radius-low);
    padding: 6px 16px;
    transition:
      background-color 120ms ease,
      filter 120ms ease,
      color 120ms ease,
      border-color 120ms ease;
  }

  :global(.spe-btn-solid) {
    background: var(--spe-accent);
    color: var(--spe-accent-font-color);
  }
  :global(.spe-btn-solid:hover) {
    filter: brightness(1.1);
  }

  :global(.spe-btn-tonal) {
    background: color-mix(in srgb, var(--spe-accent) 15%, transparent);
    color: var(--spe-accent);
  }
  :global(.spe-btn-tonal:hover) {
    background: color-mix(in srgb, var(--spe-accent) 25%, transparent);
  }

  :global(.spe-btn-outlined) {
    background: transparent;
    color: var(--spe-accent);
    border: 1.5px solid var(--spe-accent);
  }
  :global(.spe-btn-outlined:hover) {
    background: color-mix(in srgb, var(--spe-accent) 10%, transparent);
  }

  :global(.spe-btn-simple) {
    background: transparent;
    color: var(--spe-accent);
  }
  :global(.spe-btn-simple:hover) {
    background: color-mix(in srgb, var(--spe-accent) 10%, transparent);
  }
</style>
