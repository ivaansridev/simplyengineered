<!-- SimplyEngineered — Modal.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  import { fade, scale } from 'svelte/transition';

  interface Props {
    open?: boolean;
    variant?: 'default' | 'fullscreen';
    heading?: Snippet;
    children?: Snippet;
    footer?: Snippet;
    onclose?: () => void;
  }

  let {
    open = $bindable(false),
    variant = 'default',
    heading,
    children,
    footer,
    onclose
  }: Props = $props();

  function close() {
    open = false;
    onclose?.();
  }
</script>

{#if open}
  <div
    class="spe-modal-overlay"
    transition:fade={{ duration: 200 }}
    onclick={close}
    onkeydown={(e) => e.key === 'Escape' && close()}
    role="button"
    tabindex="0"
  >
    <div
      class="spe-modal {variant === 'fullscreen' ? 'spe-modal-full' : ''}"
      transition:scale={{ duration: 200, start: 0.97 }}
      onclick={(e) => e.stopPropagation()}
    >
      {#if heading}
        <div class="spe-modal-heading">{@render heading()}</div>
      {/if}
      <div class="spe-modal-body">{@render children?.()}</div>
      {#if footer}
        <div class="spe-modal-bottom">{@render footer()}</div>
      {/if}
    </div>
  </div>
{/if}

<style>
  .spe-modal-overlay {
    position: fixed;
    inset: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--spe-modal-overlay, rgb(0 0 0 / 55%));
  }

  .spe-modal {
    position: relative;
    width: min(480px, calc(100% - 32px));
    max-height: 80vh;
    display: flex;
    flex-direction: column;
    overflow: hidden;
    background: var(--spe-bg-tint);
    color: var(--spe-font-color);
    border-radius: var(--spe-radius-med);
    box-shadow: 0 16px 40px rgb(0 0 0 / 45%);
  }

  .spe-modal-heading {
    padding: 20px 24px 12px;
    font-size: 18px;
    font-weight: 700;
    border-bottom: 1px solid color-mix(in srgb, var(--spe-font-color) 12%, transparent);
  }

  .spe-modal-body {
    padding: 20px 24px 12px;
    overflow-y: auto;
    overscroll-behavior: contain;
    font-size: 14px;
    line-height: 1.5;
  }

  .spe-modal-bottom {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 8px;
    padding: 12px 24px;
    border-top: 1px solid color-mix(in srgb, var(--spe-font-color) 12%, transparent);
    flex-shrink: 0;
  }

  .spe-modal-full {
    width: 100%;
    height: 100%;
    max-height: 100vh;
    border-radius: 0;
    background: var(--spe-bg-tint);
  }
</style>
