<!-- SimplyEngineered — Toggle.svelte -->
<script lang="ts">
  import type { HTMLInputAttributes } from 'svelte/elements';

  interface Props extends Omit<HTMLInputAttributes, 'type'> {
    checked?: boolean;
  }

  let { checked = $bindable(false), ...rest }: Props = $props();
</script>

<input type="checkbox" class="spe-toggle" bind:checked {...rest} />

<style>
  .spe-toggle {
    appearance: none;
    -webkit-appearance: none;
    position: relative;
    display: inline-block;
    width: 52px;
    height: 32px;
    border-radius: var(--spe-radius-low);
    background: color-mix(in srgb, var(--spe-font-color) 30%, transparent);
    border: 2px solid color-mix(in srgb, var(--spe-font-color) 40%, transparent);
    cursor: pointer;
    vertical-align: middle;
    transition:
      background-color var(--spe-dur, 120ms) ease,
      border-color var(--spe-dur, 120ms) ease;
  }

  .spe-toggle::before {
    content: '';
    position: absolute;
    top: 50%;
    left: 5px;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    border-radius: var(--spe-radius-low);
    background: var(--spe-font-color);
    transition:
      left var(--spe-dur, 120ms) cubic-bezier(0.35, 0, 0.25, 1),
      width var(--spe-dur, 120ms) ease,
      height var(--spe-dur, 120ms) ease;
  }

  .spe-toggle:checked {
    background: var(--spe-accent);
    border-color: var(--spe-accent);
  }

  .spe-toggle:checked::before {
    left: 25px;
    width: 20px;
    height: 20px;
    /* colour of the knob when it sits on the accent fill */
    background: var(--spe-accent-font-color, white);
  }

  /* both states squash to the same 25px so the effect is consistent */
  .spe-toggle:active::before {
    width: 25px;
  }

  .spe-toggle:checked:active::before {
    left: 20px;
    width: 25px;
  }

  .spe-toggle:disabled {
    opacity: 0.35;
    cursor: not-allowed;
  }

  .spe-toggle:focus-visible {
    outline: 3px solid color-mix(in srgb, var(--spe-accent) 40%, transparent);
    outline-offset: 2px;
  }
</style>
