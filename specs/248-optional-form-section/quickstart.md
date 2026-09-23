# Quickstart Validation: Optional Form Section

## Prerequisites

- Install workspace dependencies with the repository-pinned pnpm version.
- Use branch `248-optional-form-section`.
- Issue #235 is not required; use ordinary inputs, FormGroup, and fieldset
  fixtures for validation.

## 1. Validate Shared Styles

```powershell
pnpm --filter @pathableai/styles lint:styles
pnpm --filter @pathableai/styles build
pnpm lint:tokens
pnpm build:docs
pnpm test:storybook-styles
```

Expected outcome:

- The optional-form-section classes compile into the published component CSS.
- Static Collapsed, Expanded, NestedFormGroup, NestedFieldset, LongContent,
  Narrow, IncreasedText, and ForcedColors stories use the contract in
  `contracts/semantic-markup.md`.
- Heading text, indicator, focus treatment, nested content, and spacing do not
  clip or overflow, and no animation or Accordion enhancement is present.

## 2. Validate React Behavior

```powershell
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react typecheck
pnpm --filter @pathableai/react test:unit
pnpm --filter @pathableai/react build
pnpm test:storybook-react
```

Expected outcome:

- Required heading levels render the correct `h2`-`h6`; empty or whitespace
  headings fail descriptively.
- Pointer, Enter, and Space toggle uncontrolled state, retain button focus, and
  do not submit an ancestor form.
- Controlled activation reports the requested state without changing until the
  controlling prop changes.
- Content IDs and button IDs are unique across at least ten instances and remain
  stable through server rendering and hydration.
- Collapsed children stay mounted, leave sequential navigation, retain entered
  values, and reappear with the same state.
- Submitting while collapsed includes the same successful controls and values as
  submitting while expanded.
- The component does not manage validation or expose a disabled state.

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

- Styles and React Storybooks build and test independently.
- Stable stories pass axe, visual smoke, coverage, and quality gates.
- Narrow, long-content, increased-text, and forced-colors fixtures preserve
  wrapping, visible focus, state indication, and page width.
- The server audit recognizes the documented `client-ssr` boundary and initial
  markup hydrates without ID replacement or recoverable errors.

## 4. Validate Published Consumption

```powershell
pnpm --filter @pathableai/react check:package
pnpm --filter @pathableai/react check:types
pnpm test:next-consumer
pnpm changeset:status
```

Expected outcome:

- Package-root exports and declarations expose the component and public types.
- React 18 and React 19 consumers build without a direct application import of
  `@pathableai/styles`.
- Minor Styles and React changesets are valid and package contents include the
  compiled class contract and declarations.

## 5. Run Repository Gates

```powershell
pnpm check:agent-guidance
pnpm lint:js
pnpm lint:md
pnpm check:format
git diff --check
```

Expected outcome: all applicable checks pass without exclusions, suppressions,
warning-only substitutions, or unrelated issue #235 changes.
