# Quickstart Validation: Filterable Option List

## Prerequisites

- Install workspace dependencies with the repository's pinned pnpm version.
- Build from branch `064-filterable-option-list`, rebased onto `main` after the
  FormGroup composite-registry work from PR #243 landed.

## 1. Validate Shared Styles

```powershell
pnpm --filter @pathableai/styles lint:styles
pnpm --filter @pathableai/styles build
pnpm lint:tokens
pnpm build:docs
pnpm test:storybook-styles
```

Expected outcome:

- The shared stylesheet compiles into package output.
- Static stories show labeled, selected, disabled, empty, no-match, long,
  scrollable, narrow, increased-text, and forced-color states without overflow
  or clipped focus treatment.

## 2. Validate React Behavior

```powershell
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react typecheck
pnpm --filter @pathableai/react test:unit
pnpm --filter @pathableai/react build
pnpm test:storybook-react
```

Expected outcome:

- Client and external filtering produce the expected visible options.
- Controlled and uncontrolled selections notify with stable unique ID order.
- Hidden and absent selections remain counted and selected.
- Tab reaches the filter and enabled checkboxes; Space toggles the focused
  checkbox; filtering retains input focus.
- Exactly one live status reports selected and result counts.
- Descriptions and metadata are associated without inflating checkbox names.
- Form submission includes every selected value exactly once and reset restores
  uncontrolled defaults.
- Server output hydrates without ID replacement or recoverable errors.

## 3. Validate Catalog Quality

```powershell
pnpm build:docs-react
pnpm test:storybook
pnpm storybook:coverage
pnpm quality-gates
pnpm test:visual
pnpm test:storybook-react-server
```

Expected outcome:

- Both Storybooks build and test independently.
- Stable stories pass axe, visual smoke, coverage, and quality gates.
- The server audit recognizes the documented `client-ssr` boundary and reports
  no unclassified FilterableOptionList finding.

## 4. Validate Published Consumption

```powershell
pnpm --filter @pathableai/react check:package
pnpm --filter @pathableai/react check:types
pnpm test:next-consumer
pnpm changeset:status
```

Expected outcome:

- Root exports and generated declarations expose the component and public types.
- React 18 and React 19 consumers build without a separate Styles dependency or
  application stylesheet import.
- The minor React and Styles changeset is valid.

## 5. Run Repository Gates

```powershell
pnpm check:agent-guidance
pnpm lint:js
pnpm lint:md
pnpm check:format
git diff --check
```

Expected outcome: all applicable checks pass without exclusions, suppressions,
or warning-only substitutions.
