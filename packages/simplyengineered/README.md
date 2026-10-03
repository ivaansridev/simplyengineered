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
import 'simplyengineered/colors.css'; // tokens
import 'simplyengineered/main.css'; // base rules
```

Full documentation, examples and a live playground live at
[simplyengineered.dev](https://simplyengineered.dev).
