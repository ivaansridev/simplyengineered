# SimplyEngineered

A Svelte 5 component library and the site that showcases it.

## Packages

| Package                                         | Description                                                       |
| ----------------------------------------------- | ----------------------------------------------------------------- |
| [`simplyengineered`](packages/simplyengineered) | The published component library (`npm i simplyengineered`).       |
| [`@simplyengineered/website`](packages/website) | The docs, examples and playground site. Private, never published. |

## Setup

```bash
pnpm install
```

## Commands

| Command       | Description                                                                             |
| ------------- | --------------------------------------------------------------------------------------- |
| `pnpm dev`    | Builds the library once, then runs the site with `svelte-package --watch` alongside it. |
| `pnpm build`  | Builds the library (`svelte-package` + `publint`), then the site.                       |
| `pnpm check`  | `svelte-check` across both packages.                                                    |
| `pnpm lint`   | Prettier and ESLint over the whole workspace.                                           |
| `pnpm format` | Formats the workspace in place.                                                         |

The site depends on the library through `workspace:*`, so it always renders the
same `dist` output consumers get from npm. Bumping `simplyengineered`'s version
in `packages/simplyengineered/package.json` and running `pnpm publish` from
there is all a release needs.
