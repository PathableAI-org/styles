# Quickstart: Text Primitive Validation

**Feature**: Text Primitive
**Date**: 2026-08-21

This guide describes how to validate that the `Text` component, its SCSS `pathable-text` contract, and the additive token changes work correctly. It covers build, unit test, Storybook, accessibility, and package-validation steps. It links to the [component API contract](./contracts/component-api.md) and [data model](./data-model.md) instead of duplicating them.

## Prerequisites

- pnpm workspace with dependencies installed: `pnpm install`
- `packages/styles` builds cleanly: `pnpm --filter @pathableai/styles build`
- `packages/react` builds cleanly: `pnpm --filter @pathableai/react build`

## Build Verification

```bash
# Build all packages (styles first, then react)
pnpm build

# Verify the SCSS contract is compiled
ls packages/styles/dist/pathable-component-wrappers/pathable-text.css

# Verify Text is in the React build output
ls packages/react/dist/components/Text/Text.d.ts
ls packages/react/dist/components/Text/Text.js
```

**Expected**: Compiled CSS for `pathable-text` exists (via `pathable-typography.scss` bundle). TypeScript declaration and compiled JS for `Text` exist in the React `dist`.

### SCSS Contract Content Check

```bash
# Verify variant and tone modifier classes exist in compiled CSS
cat packages/styles/dist/css/styles.css | rg "pathable-text"
```

**Expected output contains**:
- `.pathable-text { ... }` base rule (font-family, color, token-driven size/line-height)
- `.pathable-text--body`, `.pathable-text--small`, `.pathable-text--caption`
- `.pathable-text--tone-default`, `.pathable-text--tone-muted`, `.pathable-text--tone-danger`, `.pathable-text--tone-success`
- New tokens present in the compiled output: `--pathable-color-text-success`, per-role line-height tokens for small/caption

## Unit and Component Tests

```bash
# Run all Text tests
pnpm --filter @pathableai/react test:unit -- --testPathPattern="Text"

# Run all primitive tests (regression check)
pnpm --filter @pathableai/react test -- --testPathPattern="Text|Grid|Stack|Inline|Cluster|Container"
```

**Validated outcomes** (see the full matrix in [data-model.md](./data-model.md#test-data-model)):

| Test | What it proves |
|------|---------------|
| `<Text />` → `<p class="pathable-text">` | Default element and base class |
| `variant="body/small/caption"` → correct modifier | Variant prop maps to typography class |
| `tone="muted/danger/success/default"` → correct modifier | Tone prop maps to semantic tone class |
| `variant="small" tone="muted"` combines | Both classes present in order |
| `as="span/label/figcaption"` | Element tag changes; classes preserved |
| `as="label" htmlFor` | Native props valid for selected element accepted |
| `className="custom"` | Consumer class appears last |
| `ref` forwarding | `ref.current` is the DOM element (tag matches `as`) |
| Server vs client | Identical class string and markup |
| Single root, no wrapper | No intermediate DOM nodes |
| Unknown variant/tone (runtime) | Class silently omitted (documented fallback) |
| Type-level invalid native prop | Compile-time rejection (FR-012) |

## Type Checking

```bash
# Verify TypeScript compilation including generic polymorphic props
pnpm --filter @pathableai/react exec tsc --noEmit
```

**Expected**: No type errors. A `<Text as="label" htmlFor="x" />` usage compiles; `<Text htmlFor="x" />` (default `p`) fails with a type error.

## Storybook Verification

```bash
# Start the React Storybook
pnpm docs:react
```

**Must render** (see FR-028/029/030 and `Text.stories.tsx`):

1. **Body** — `<Text variant="body">` default paragraph.
2. **SmallMuted** — `<Text variant="small" tone="muted">`.
3. **CaptionDanger** — `<Text variant="caption" tone="danger">`.
4. **Tones** — one story showing all four tones with the same variant.
5. **AsSemanticElements** — `p`, `span`, `label`, `figcaption` outputs.
6. **Default** (no props) — `<Text>` plain paragraph.

**A11y check**: Each story passes Storybook's rendered axe checks (`pnpm --filter @pathable/storybook-react test-storybook` or `pnpm test:storybook-react`). No entries are added to the `skipA11yStoryIds` / `colorContrastExceptionStoryIds` sets in `apps/storybook-react/.storybook/test-runner.js`.

## Manual DOM Inspection

After rendering Text in Storybook, open DevTools and verify:

```javascript
const el = document.querySelector('.pathable-text')
// el.tagName === 'P'
// getComputedStyle(el).fontFamily === '"Nunito", system-ui, sans-serif' (or token-resolved value)
// getComputedStyle(el).color matches the resolved tone token
// No intermediate elements — text nodes are direct children of the root
```

### Contrast Spot-Check

```javascript
// contrast(foreground, background) using axe-playwright or a WCAG tool
// For each tone on the default surface (white):
//   default #00365c → ≥ 4.5:1
//   muted   #015a76 → ≥ 4.5:1
//   danger  #dc3545 → ≥ 4.5:1
//   success <text-success token> → ≥ 4.5:1  (verified in research.md once implemented)
```

### Forced-Colors Spot-Check

Toggle forced-colors/high-contrast in the browser. The text must remain visible using the environment's system colors, and the semantic meaning must not depend on color alone (e.g., caption text keeps its role via element/typography, not only tone). Document findings in the feature branch per the plan's "DONE means".

## Server-Client Consistency

```bash
# Server-compatibility check (bundled in the react package)
pnpm --filter @pathableai/react exec node scripts/check-react-server-compatibility.mjs
# (or the root script) pnpm test:storybook-react-server
```

**Expected**: Text stories render identically on server and client — no hydration mismatches in class strings or markup.

## Lint and Quality Gates

```bash
# Package-level with zero warnings
pnpm --filter @pathableai/styles lint:styles
pnpm --filter @pathableai/styles lint:tokens
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react check:package
pnpm --filter @pathableai/react check:types

# Root aggregate
pnpm lint
```

**Expected**: No violations, no suppressions. Verify no new disable comments:

```bash
git diff -- packages/styles | grep -E "stylelint-disable|prettier-ignore"
git diff -- packages/react | grep -E "eslint-disable|stylelint-disable|prettier-ignore|@ts-ignore|@ts-expect-error"
```

## Regression Check

```bash
# All layout/typography primitive tests
pnpm --filter @pathableai/react test -- --testPathPattern="Text|Grid|Stack|Inline|Cluster|Container"

# Full pipeline
pnpm build
pnpm lint
```

**Expected**: All existing tests pass. The additive `_typography.scss`/`_semantic.scss` changes must not alter any existing token value or break the token lint (`lint:tokens`).

## CI Gate Check

After pushing, verify CI passes for: ESLint (TS), stylelint (SCSS), markdownlint, prettier, `tsc --noEmit`, styles + react builds, all Text tests, all typography/layout primitive regression tests, Storybook build without errors, token lint, package checks, Storybook a11y checks, and server-compat check.