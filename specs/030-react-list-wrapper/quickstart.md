# Quickstart: React List Wrapper Validation

## Prerequisites

- Install workspace dependencies.
- Stay on branch `030-react-list-wrapper`.
- Confirm `.specify/feature.json` points to `specs/030-react-list-wrapper`.

## Source Contract Check

Review the owning styles contract before implementation:

```bash
sed -n '1,120p' packages/styles/src/pathable-component-wrappers/pathable-list.scss
sed -n '1,140p' packages/styles/src/stories/components/Basic/List.stories.js
```

Expected outcome:

- `pathable-list` is the owning styles contract.
- Unordered, ordered, and unstyled presentations are documented in the styles
  Storybook source.

## Implementation Validation

Build the React package:

```bash
pnpm --filter @pathable/react build
```

Expected outcome:

- Build succeeds.
- `List` is exported from the package entrypoint.
- The entrypoint still imports `@pathable/styles/dist/styles.css`.

Build the standalone React Storybook:

```bash
pnpm --filter @pathable/storybook-react build-storybook
```

Expected outcome:

- React Storybook builds successfully.
- List stories cover unordered, ordered, unstyled, custom class names, rich
  content, and empty-list behavior.

Check package contents:

```bash
cd packages/react
npm --cache /tmp/pathable-npm-cache pack --dry-run
```

Expected outcome:

- Package output includes the built entrypoint and README.
- Package metadata preserves the runtime `@pathable/styles` dependency.

## Manual Storybook Scenarios

Validate these scenarios in React Storybook:

- Default unordered list shows items in supplied order.
- Ordered list shows item sequence without reordering content.
- Unstyled list maps to the documented unstyled presentation.
- Rich item content preserves links, labels, and accessible content.
- Additional root class names appear alongside `pathable-list`.
- Empty list does not render misleading placeholder items.

## Completion Evidence

The feature is ready for implementation signoff when:

- All commands above pass or blockers are documented.
- No wrapper-only CSS or new list visual semantics were added in
  `packages/react`.
- `packages/react/README.md` documents the List usage and props.
- Storybook examples demonstrate all documented presentations.
