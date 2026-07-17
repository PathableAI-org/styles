# Quickstart: React Table Wrapper Validation

## Prerequisites

- Install workspace dependencies.
- Stay on branch `031-react-table-wrapper`.
- Confirm `.specify/feature.json` points to
  `specs/031-react-table-wrapper`.

## Source Contract Check

```bash
sed -n '1,320p' packages/styles/src/pathable-component-wrappers/pathable-table.scss
sed -n '1,180p' packages/styles/src/stories/components/Basic/Table.stories.js
```

Expected outcome:

- `pathable-table` is the owning source contract.
- Default, borderless, compact, and striped presentations are documented.
- No source-layer change is needed for the planned wrapper.

## Implementation Validation

Build the React package:

```bash
pnpm --filter @pathable/react build
```

Expected outcome:

- The build succeeds and `Table` is exported publicly.
- The entrypoint still imports `@pathable/styles/dist/styles.css`.

Build the standalone React Storybook:

```bash
pnpm --filter @pathable/storybook-react build-storybook
```

Expected outcome:

- Storybook builds successfully.
- Stories cover all four presentations, semantic captions and headers,
  additional classes and attributes, empty content, and fallback behavior.

Check package contents:

```bash
cd packages/react
npm --cache /tmp/pathable-npm-cache pack --dry-run
```

Expected outcome:

- Package output includes the built entrypoint and README.
- Package metadata preserves the runtime `@pathable/styles` dependency.

## Manual Storybook Scenarios

- Default presentation retains caption, header scopes, body rows, and order.
- Borderless, compact, and striped presentations map to their source classes.
- Links and controls inside cells remain operable.
- Root `aria-*`, `data-*`, handlers, and custom classes are preserved.
- Empty children do not produce invented placeholder rows.
- An unsupported presentation renders only the default Pathable treatment.
- No story or component introduces wrapper-only CSS or interaction state.

## Completion Evidence

Implementation is ready for signoff when all commands pass or blockers are
documented, the README and stories cover the contract, and review finds no
source-of-truth, naming, semantic, transitive-style, or lint-policy violation.
