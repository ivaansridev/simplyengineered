# simplyengineered

A Svelte 5 component library.

## Installation

```bash
npm i simplyengineered
```

## Usage

```typescript
import * as spe from 'simplyengineered';
```

At the top of the file, then use the components as `<spe.Component>`.

The design tokens ship as CSS custom properties. They load automatically with
the library entry point; to pull them in on their own:

```typescript
import 'simplyengineered/vars.css'; // design tokens
import 'simplyengineered/main.css'; // base rules
```

## Theming

Every token is a plain CSS custom property on `:root`, so you can retheme the
library without touching its source or rebuilding. Create your own stylesheet
and import it **after** the library's:

```css
/* my-theme.css */
:root {
  --spe-accent: #ec4899;
  --spe-bg: #0b0b0d;
  --spe-color-yellow: #f5c542;
}
```

```typescript
import 'simplyengineered/vars.css';
import 'simplyengineered/main.css';
import './my-theme.css'; // wins: same selector, later source order
```

Because the selectors are identical (`:root`) and the specificity is equal, the
later file wins — no `!important` needed. See `vars.css` for the full list of
tokens. Note that `<spe.ColorSwitcher>` writes `--spe-accent` inline on `<html>`
while in use, which outranks any stylesheet value; leave it out if you want
purely CSS-driven theming.

Full documentation, examples and a live playground live at
[simplyengineered.dev](https://simplyengineered.dev).
