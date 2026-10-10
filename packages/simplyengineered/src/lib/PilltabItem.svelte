<!-- SimplyEngineered — PilltabItem.svelte -->
<script lang="ts">
  import type { HTMLAnchorAttributes, HTMLButtonAttributes } from 'svelte/elements';
  import type { Snippet } from 'svelte';

  type Shared = {
    variant?: 'active' | undefined;
    children?: Snippet;
  };

  /*
   * Discriminated on `href`: an anchor only accepts anchor attributes, a button
   * only button attributes — so `type`/`target`/`disabled` can't land on the
   * wrong element.
   */
  type Props = Shared &
    (({ href: string } & HTMLAnchorAttributes) | ({ href?: undefined } & HTMLButtonAttributes));

  let { variant, href, class: className = '', children, ...rest }: Props = $props();

  let classes = $derived(
    `spe-pilltab-item${variant === 'active' ? ' active' : ''}${className ? ` ${className}` : ''}`
  );
</script>

{#if href}
  <!-- the discriminated union makes each spread sound; cast only to pick the element's own attribute set -->
  <a {href} class={classes} {...rest as HTMLAnchorAttributes}>
    {@render children?.()}
  </a>
{:else}
  <button class={classes} {...rest as HTMLButtonAttributes}>
    {@render children?.()}
  </button>
{/if}

<style>
  .spe-pilltab-item {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    margin: 0;
    padding: 8px 20px;
    font: inherit;
    font-size: 14px;
    font-weight: 600;
    color: color-mix(in srgb, var(--spe-font-color) 55%, var(--spe-mode) 45%);
    background: transparent;
    border: none;
    border-radius: var(--spe-radius-med);
    cursor: pointer;
    text-decoration: none;
    transition:
      background-color var(--spe-dur, 120ms) ease,
      color var(--spe-dur, 120ms) ease;
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
