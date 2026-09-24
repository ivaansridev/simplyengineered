<!-- SimplyEngineered — Content.svelte -->
<script lang="ts">
  import type { Snippet } from 'svelte';
  let { children }: { children?: Snippet } = $props();
</script>

<div class="spe-content">
  {@render children?.()}
</div>

<style>
  .spe-content {
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
  }
</style>
