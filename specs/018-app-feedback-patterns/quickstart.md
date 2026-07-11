# Quickstart: App Feedback Patterns

**Created**: 2026-07-11

**Purpose**: Validation path for verifying implementation correctness.

## Build Verification

```sh
# 1. Build the styles package
cd packages/styles
pnpm build

# Verify: compiled CSS includes new pattern classes
rg '.pathable-toast|.pathable-loading|.pathable-skeleton|.pathable-empty-state|.pathable-page-error' dist/styles.css
```

## Storybook Verification

```sh
# Start Storybook from repo root
pnpm --filter @pathable/styles storybook
```

Verify each story:

1. **Toast**: All 5 variants (info, progress, success, warning, error), dismissible variant, action variant, multiple stacked toasts in mobile viewport (320px), 200% zoom
2. **Loading**: Default size, large variant, with and without status text
3. **Skeleton**: All 5 shapes (text-heading, text-body, avatar, card, table-row), reduced-motion state, multiple lines via `--pathable-skeleton-lines`
4. **Empty State**: All 4 variants (no-data, no-results, setup-required, completed)
5. **Page Error**: Compact panel, full-page, not-found, access-restricted

## Accessibility Verification

```sh
# Run Playwright accessibility tests from repo root
npx playwright test --grep "feedback|toast|loading|skeleton|empty|error"
```

Manual checks:

- [ ] Skeleton shimmer stops at `prefers-reduced-motion: reduce`
- [ ] Forced-colors mode shows visible boundaries for all patterns
- [ ] Keyboard navigation reaches all toast dismiss/action controls
- [ ] Screen reader announces toast content (role="status"/"alert")
- [ ] Decorative icons are hidden from screen readers (aria-hidden)
- [ ] 200% zoom does not clip or overflow any pattern
- [ ] Narrow mobile (320px) retains readability for all patterns

## Selective Import Verification

```scss
// Test each import independently compiles
@forward 'pathable-toast';        // Should compile
@forward 'pathable-loading';      // Should compile
@forward 'pathable-skeleton';     // Should compile
@forward 'pathable-empty-state';  // Should compile
@forward 'pathable-page-error';   // Should compile

// Test bundle import
@forward 'pathable-communication'; // Should include toast + loading + skeleton

// Test all-in-one
@forward 'pathable-all';          // Should include all patterns without error
```

## Token Audit

```sh
# Verify no hardcoded values by checking all new files
rg -n 'rgba|#[0-9a-fA-F]|px[^)]' packages/styles/src/pathable-component-wrappers/pathable-toast.scss packages/styles/src/pathable-component-wrappers/pathable-loading.scss packages/styles/src/pathable-component-wrappers/pathable-skeleton.scss packages/styles/src/pathable-component-wrappers/pathable-empty-state.scss packages/styles/src/pathable-component-wrappers/pathable-page-error.scss
```

Expected: no matches (all values via `var(--pathable-*)` tokens).