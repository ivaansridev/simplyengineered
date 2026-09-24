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
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 50;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 60px;
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
</style>
