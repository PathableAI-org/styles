# Quickstart: React Communication Wrapper Validation

## Prerequisites

- Install workspace dependencies.
- Stay on branch `033-react-communication-wrappers`.
- Confirm `.specify/feature.json` points to
  `specs/033-react-communication-wrappers`.

## Source Contract Audit

```bash
rg -n "pathable-(accordion|alert|banner|modal|process-list|site-alert|step-indicator|summary-box)" packages/styles/src/pathable-component-wrappers
rg -n "pathable-(accordion|alert|banner|modal|process-list|site-alert|step-indicator|summary-box)" packages/styles/src/stories/components/Communication
```

Expected outcome:

- All eight owning source contracts are present.
- React public states match selectors in source SCSS.
- Border-box Accordion, warning Site Alert, dismissal Site Alert, and absent
  story-only subelement classes are not exposed.
- Banner documentation and markup describe disclosure, not dismissal.

## Static Package Validation

```bash
pnpm --filter @pathable/react typecheck
pnpm --filter @pathable/react lint
pnpm --filter @pathable/react build
pnpm lint:md
pnpm check:format
```

Expected outcome:

- TypeScript emits usable declarations for all eight components and item types.
- Lint and formatting pass without suppressions or exclusions.
- The React package builds with all eight public exports.

## Storybook Validation

Build and test the source Storybook after story-contract corrections:

```bash
pnpm build:docs
pnpm test:storybook
```

Build and test the standalone React Storybook:

```bash
pnpm build:docs-react
pnpm test:storybook-react
```

Expected outcome:

- Both Storybooks build independently.
- Fixed stories cover the matrix in [contracts/stories.md](./contracts/stories.md).
- Accordion, Banner, and Modal interaction tests pass using accessible queries.
- Stable stories pass rendered accessibility checks and visual fixtures remain
  deterministic.

## Package Consumer Validation

```bash
pnpm --filter @pathable/react check:package
pnpm --filter @pathable/react check:types
cd packages/react
npm --cache /tmp/pathable-npm-cache pack --dry-run
```

Expected outcome:

- Package metadata, exports, entrypoints, and declarations are valid.
- The package includes built JavaScript, declarations, README, and transitive
  `@pathable/styles` dependency metadata.
- Consumers need no direct styles or JavaScript-helper import.

## Manual Behavioral Scenarios

- Accordion: Enter and Space toggle the associated panel; single and multiple
  modes are deterministic; disabled items do not toggle.
- Banner: its disclosure control keeps `aria-expanded` and hidden content in
  sync; it does not dismiss the whole Banner.
- Modal: open moves focus inside, Tab remains contained, Escape and visible
  close request closure, scroll restores, and focus returns to the invoker.
- Alert and SiteAlert: every exposed status maps to an implemented class, and
  role overrides remain possible.
- ProcessList and StepIndicator: order is semantic and preserved; valid progress
  has at most one current step.
- SummaryBox: rich content and links remain intact.
- Long and localized-looking content remains readable at narrow widths and
  increased text size.

## Completion Evidence

Implementation is ready for signoff when all commands pass or blockers are
documented, source and React stories agree with the verified contracts, package
contents expose all eight typed components, and review finds no wrapper-only
styles, undocumented states, lost content, focus defects, or validation bypasses.
