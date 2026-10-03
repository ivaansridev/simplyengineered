<!-- SimplyEngineered — Navbar.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';

  interface Props {
    blur?: boolean;
    children?: Snippet;
    right?: Snippet;
  }

  let { blur = false, children, right }: Props = $props();
</script>

<nav class="spe-nav" class:spe-nav-blur={blur}>
  <div class="spe-nav-left">
    {@render children?.()}
  </div>
  {#if right}
    <div class="spe-nav-right">
      {@render right()}
    </div>
  {/if}
</nav>

<style>
  .spe-nav {
    --spe-nav-height: 60px;
    --spe-nav-title-size: clamp(15px, 1.1rem + 0.35vw, 19px);

    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    height: var(--spe-nav-height);
    padding: 0 20px;
    background: var(--spe-bg-tint);
    border-bottom: 1px solid color-mix(in srgb, var(--spe-font-color) 10%, transparent);
    color: var(--spe-font-color);
  }

  .spe-nav-blur {
    background: color-mix(in srgb, var(--spe-bg-tint) 70%, transparent);
    backdrop-filter: blur(14px) saturate(140%);
    -webkit-backdrop-filter: blur(14px) saturate(140%);
    border-bottom: 1px solid color-mix(in srgb, var(--spe-font-color) 8%, transparent);
  }

  .spe-nav-left,
  .spe-nav-right {
    display: flex;
    align-items: center;
    gap: 16px;
  }

  /* let the brand area shrink so the right side is never pushed out */
  .spe-nav-left {
    flex: 1 1 auto;
    min-width: 0;
  }

  .spe-nav-right {
    flex: 0 0 auto;
  }

  /* headings keep the bar's height: sized down, single line, ellipsis on overflow */
  .spe-nav :global(h1),
  .spe-nav :global(h2),
  .spe-nav :global(h3),
  .spe-nav :global(h4),
  .spe-nav :global(h5),
  .spe-nav :global(h6) {
    margin: 0;
    min-width: 0;
    max-width: 100%;
    font-size: var(--spe-nav-title-size);
    font-weight: 700;
    line-height: 1.2;
    letter-spacing: -0.01em;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }
</style>
