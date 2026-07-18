# Quickstart: React Link and Tag Wrapper Validation

## Prerequisites

- Install workspace dependencies.
- Stay on branch `032-react-link-tag-wrappers`.
- Confirm `.specify/feature.json` points to
  `specs/032-react-link-tag-wrappers`.

## Source Contract Check

```bash
sed -n '1,160p' packages/styles/src/pathable-component-wrappers/pathable-link.scss
sed -n '1,160p' packages/styles/src/pathable-component-wrappers/pathable-tag.scss
sed -n '1,100p' packages/styles/src/stories/components/Basic/Link.stories.ts
sed -n '1,100p' packages/styles/src/stories/components/Basic/Tag.stories.ts
```

Expected outcome:

- `pathable-link` and `pathable-tag` are the owning source contracts.
- Link base/external and Tag base/big classes are implemented.
- `pathable-link--nav` is not implemented and is not exposed by this feature.
- No source-layer change is needed for the planned wrappers.

## Implementation Validation

Build the React package:

```bash
pnpm --filter @pathable/react build
```

Expected outcome:

- The build succeeds and `Link` and `Tag` are exported publicly.
- The entrypoint still imports `@pathable/styles/dist/styles.css`.

Build the standalone React Storybook:

```bash
pnpm --filter @pathable/storybook-react build-storybook
```

Expected outcome:

- Storybook builds successfully.
- Stories cover default/external Link and default/big Tag treatments, content
  and attribute preservation, custom classes, and fallback behavior.

Check package contents:

```bash
cd packages/react
npm --cache /tmp/pathable-npm-cache pack --dry-run
```

Expected outcome:

- Package output includes the built entrypoint and README.
- Package metadata preserves the runtime `@pathable/styles` dependency.

Run repository quality checks:

```bash
pnpm lint:js
pnpm check:format
```

Expected outcome: all checks pass without suppressions or lint bypasses.

## Manual Storybook Scenarios

- Default Link preserves content, `href`, accessible naming, handlers, data
  attributes, and custom classes.
- External Link adds only its documented modifier and leaves `target` and `rel`
  consumer-controlled.
- Default and big Tag preserve rich inline content and valid attributes.
- Empty children do not produce invented content.
- Unsupported Link presentation and Tag size render only their base classes.
- Neither story nor component introduces wrapper-only CSS or interaction state.

## Completion Evidence

Implementation is ready for signoff when all commands pass or blockers are
documented, README and stories cover the contract, and review finds no
source-of-truth, naming, semantic, transitive-style, or lint-policy violation.
