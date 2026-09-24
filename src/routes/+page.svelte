<script lang="ts">
  import * as spe from '$lib';

  let modalOpen = $state(false);
</script>

<spe.Navbar blur>
  <spe.A href="/" variant="link">SimplyEngineered</spe.A>

  {#snippet right()}
    <spe.Pilltab>
      <spe.PilltabItem variant="active">Home</spe.PilltabItem>
      <spe.PilltabItem>Docs</spe.PilltabItem>
      <spe.PilltabItem>About</spe.PilltabItem>
    </spe.Pilltab>
    <spe.A href="/signup" variant="button-solid">Sign up</spe.A>
  {/snippet}
</spe.Navbar>

<spe.Content>
  <h1>Component Showcase</h1>
  <p>A quick look at every <spe.A href="#" variant="link">spe</spe.A> component so far.</p>

  <h2>Buttons</h2>
  <div class="row">
    <spe.Button variant="solid">Solid</spe.Button>
    <spe.Button variant="tonal">Tonal</spe.Button>
    <spe.Button variant="outlined">Outlined</spe.Button>
    <spe.Button variant="simple">Simple</spe.Button>
    <spe.Button variant="solid" disabled>Disabled</spe.Button>
  </div>

  <h2>Links</h2>
  <div class="row">
    <spe.A href="#" variant="link">Default link</spe.A>
    <spe.A href="#" variant="button-solid">Solid link</spe.A>
    <spe.A href="#" variant="button-outlined">Outlined link</spe.A>
  </div>

  <h2>Tooltip</h2>
  <div class="row">
    <spe.Tooltip content="Top tooltip">
      <spe.Button variant="solid">Hover me (top)</spe.Button>
    </spe.Tooltip>
    <spe.Tooltip content="Bottom tooltip" position="bottom">
      <spe.Button variant="tonal">Hover me (bottom)</spe.Button>
    </spe.Tooltip>
    <spe.Tooltip content="Left tooltip" position="left">
      <spe.Button variant="outlined">Hover me (left)</spe.Button>
    </spe.Tooltip>
    <spe.Tooltip content="Right tooltip" position="right">
      <spe.Button variant="simple">Hover me (right)</spe.Button>
    </spe.Tooltip>
  </div>

  <h2>Modal</h2>
  <div class="row">
    <spe.Button variant="solid" onclick={() => (modalOpen = true)}>Open Modal</spe.Button>
  </div>

  <spe.Modal bind:open={modalOpen}>
    {#snippet heading()}
      <h3>Confirm action</h3>
    {/snippet}

    <p>This is a modal body. It can hold any content you like.</p>

    {#snippet footer()}
      <spe.Button variant="simple" onclick={() => (modalOpen = false)}>Cancel</spe.Button>
      <spe.Button variant="solid" onclick={() => (modalOpen = false)}>Confirm</spe.Button>
    {/snippet}
  </spe.Modal>
</spe.Content>

<style>
  .row {
    display: flex;
    align-items: center;
    gap: 12px;
    flex-wrap: wrap;
    margin-bottom: 24px;
  }

  h1 {
    margin-top: 80px;
  }

  h2 {
    margin-top: 40px;
  }
</style>
