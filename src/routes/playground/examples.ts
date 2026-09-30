export interface PlaygroundExample {
  id: string;
  name: string;
  code: string;
}

export const EXAMPLES: PlaygroundExample[] = [
  {
    id: 'card',
    name: 'Card + button',
    code: `<script>
  import * as spe from '$lib';

  let clicks = $state(0);
</script>

<spe.Card variant="accent">
  <h3>Hello from the playground</h3>
  <p>These are the real components. Edit the code and the preview updates.</p>

  <div class="actions">
    <spe.Button onclick={() => clicks++}>Clicked {clicks} times</spe.Button>
    <spe.A href="/docs" variant="link">Read the docs</spe.A>
  </div>
</spe.Card>

<style>
  h3 {
    margin: 0 0 8px;
  }
  p {
    margin: 0;
    color: color-mix(in srgb, var(--spe-font-color) 65%, transparent);
  }
  .actions {
    display: flex;
    align-items: center;
    gap: 12px;
    margin-top: 16px;
  }
</style>
`
  },
  {
    id: 'form',
    name: 'Form controls',
    code: `<script>
  import * as spe from '$lib';

  let name = $state('');
  let bio = $state('');
  let plan = $state('free');
  let updates = $state(true);
</script>

<spe.Card>
  <h3>Account</h3>

  <label for="pg-name">Name</label>
  <spe.Input id="pg-name" placeholder="Your name" bind:value={name} />

  <label for="pg-plan">Plan</label>
  <spe.Dropdown id="pg-plan" bind:value={plan}>
    <option value="free">Free</option>
    <option value="pro">Pro</option>
  </spe.Dropdown>

  <label for="pg-bio">Bio</label>
  <spe.Textarea id="pg-bio" placeholder="A sentence about you" bind:value={bio} />

  <div class="toggle">
    <spe.Toggle bind:checked={updates} />
    <span>Email me about updates</span>
  </div>

  <p class="preview">{name || 'Anonymous'} — {plan}{bio ? ' — ' + bio : ''}</p>
</spe.Card>

<style>
  h3 {
    margin: 0 0 16px;
  }
  label {
    display: block;
    margin: 12px 0 6px;
    font-size: 13px;
    font-weight: 600;
    color: color-mix(in srgb, var(--spe-font-color) 65%, transparent);
  }
  .toggle {
    display: flex;
    align-items: center;
    gap: 10px;
    margin-top: 16px;
    font-size: 14px;
  }
  .preview {
    margin: 16px 0 0;
    padding-top: 12px;
    border-top: 1px solid color-mix(in srgb, var(--spe-font-color) 10%, transparent);
    font-size: 14px;
  }
</style>
`
  },
  {
    id: 'overlay',
    name: 'Modal + tooltip',
    code: `<script>
  import * as spe from '$lib';

  let open = $state(false);
</script>

<div class="actions">
  <spe.Button variant="solid" onclick={() => (open = true)}>Open the modal</spe.Button>

  <spe.Tooltip content="Tooltips work in here too" position="right">
    <spe.Button variant="outlined">Hover me</spe.Button>
  </spe.Tooltip>

  <spe.Button variant="simple" disabled>Disabled</spe.Button>
</div>

<spe.Modal bind:open>
  {#snippet heading()}<h3>It really is a modal</h3>{/snippet}

  <p>Rendered by the real spe.Modal component, with a heading snippet and a footer.</p>

  {#snippet footer()}
    <spe.Button variant="tonal" onclick={() => (open = false)}>Close</spe.Button>
  {/snippet}
</spe.Modal>

<style>
  .actions {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 12px;
  }
</style>
`
  },
  {
    id: 'elevation',
    name: 'Card elevation',
    code: `<script>
  import * as spe from '$lib';
</script>

<!-- spe.Card ships no transform, no shadow and no hover rule, in any variant.
     Everything that moves the second card below is declared here, by you. -->

<spe.Card>Plain. This one never moves.</spe.Card>

<spe.Card class="lift">Hover or tab to me — the rules below are the whole trick.</spe.Card>

<style>
  /* :global() is required: Svelte drops a scoped rule that only matches a class
     passed to a component, and the card would never move. */
  :global(.lift) {
    transition: transform 150ms ease;
  }

  :global(.lift:hover),
  :global(.lift:focus-visible) {
    transform: translateY(-2px);
  }

  :global(.lift:focus-visible) {
    outline: 2px solid var(--spe-accent);
    outline-offset: 2px;
  }
</style>
`
  }
];
