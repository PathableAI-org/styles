# Quickstart: Validating Modal Backdrop Fix

Proves styles-owned open shell + React portal parity. Full contract:
[`contracts/modal-open-presentation.md`](./contracts/modal-open-presentation.md).

## Prerequisites

- Branch `247-fix-modal-backdrop`
- `pnpm install`

## 1. Styles open presentation

After implementing `pathable-modal.scss` + styles Modal story:

```bash
pnpm --filter @pathableai/styles build
# Confirm PathAble open rules exist in compiled CSS (sign-off gate)
rg "pathable-modal-wrapper\.is-visible|pathable-modal-overlay" packages/styles/dist
# Styles Storybook is the @pathable/storybook workspace (not @pathableai/styles)
pnpm --filter @pathable/storybook storybook
```

Open **Components/Communication/Modal** open fixture (PathAble-only shell; static
`.is-visible` markup — presentation must not require USWDS modal JS to inject the
shell):

- Dimmed full-viewport overlay is visible
- dialog is centered over the page
- title sits above body/footer
- wrapper has `.pathable-modal-wrapper.is-visible`; overlay is `.pathable-modal-overlay`
- Play asserts wrapper/overlay class presence (not only dialog name / close button)

### CSS-only / no-USWDS-JS proof (required)

Default `apps/storybook/.storybook/preview.js` currently imports `@pathableai/styles/js`.
FR-009 requires the **styles Modal open story itself** to prove PathAble-only open CSS
without USWDS JS — not a substitute fixture elsewhere.

After implementation (see tasks T005):

1. Change `apps/storybook/.storybook/preview.js` so Communication/Modal open does **not**
   load `@pathableai/styles/js` (preferred: drop the global import; load USWDS JS only in
   stories that need it).
2. Re-open the Modal open fixture in Storybook and confirm backdrop + centering still
   appear from static `.is-visible` markup + PathAble CSS alone.
3. Run the styles Storybook interaction runner (covers Modal open plays under that
   harness):

```bash
pnpm test:storybook-styles
```

## 2. React open presentation

```bash
# React Storybook is @pathable/storybook-react (not @pathableai/react)
pnpm --filter @pathable/storybook-react storybook
```

Open **Components/Communication/Modal → Open**:

- Same external backdrop + centering as styles
- Inspect portal: `.pathable-modal-wrapper.usa-modal-wrapper.is-visible` →
  `.pathable-modal-overlay.usa-modal-overlay` → `.pathable-modal.usa-modal`

### No-USWDS-modal-JS proof (required)

`apps/storybook-react/.storybook/preview.js` also imports `@pathableai/styles/js`.
Prove React open presentation without that dependency via unit tests that mount `Modal`
with styles CSS only (no `@pathableai/styles/js` import):

```bash
pnpm --filter @pathableai/react test:unit
```

## 3. React interaction (no regression)

In Storybook, run play tests / interaction stories:

- `EscapeCloses`
- `TabContainment`
- Controlled open/close play (trigger → open → close) asserting shell **absent** when
  closed, body scroll restored, and focus restored to the trigger
- `closeOnBackdropClick` false/true plays (or unit tests)

Or package unit tests:

```bash
pnpm --filter @pathableai/react test:unit
```

Expected: Escape/close still call `onClose`; focus trap still cycles; closing removes
shell and restores scroll/focus.

### Backdrop click (`closeOnBackdropClick`)

Required automated checks (Storybook play and/or unit):

- Default / `closeOnBackdropClick={false}`: click overlay does **not** call `onClose`
  (backdrop visual-only).
- `closeOnBackdropClick={true}`: click overlay calls `onClose`; click inside dialog
  does not (stop propagation on dialog; compose with any consumer `onClick` on the
  dialog via `...rest`).

## 4. Minimal React usage (consumer-shaped)

```tsx
'use client'
import { Button, Modal } from '@pathableai/react'

export function Example({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  return (
    // closeOnBackdropClick defaults to false — backdrop is visual-only
    <Modal
      open={open}
      onClose={onClose}
      title="Session ended due to inactivity"
      description="Your session ended because of inactivity."
      footer={
        <Button type="button" variant="primary" onClick={onClose}>
          Log in again
        </Button>
      }
    />
  )
}
```

With `open={true}`: backdrop + centered dialog without extra consumer CSS or wrapper.
After upgrade, remove any temporary consumer overlay CSS to avoid stacked dimmers.

## 5. Gates

```bash
# Root lint pipeline (JS, styles, Markdown, tokens, format)
pnpm lint
pnpm --filter @pathableai/react typecheck
pnpm --filter @pathableai/react check:types
pnpm --filter @pathableai/react check:package
pnpm --filter @pathableai/react test:unit
pnpm --filter @pathableai/styles build
pnpm --filter @pathableai/react build
# Storybook interaction / a11y runners (styles + React)
pnpm test:storybook-styles
pnpm test:storybook-react
# Styles visual smoke (metric-based; requires apps/storybook/storybook-static)
# after registering Modal open stories in CANONICAL_STORIES (see tasks)
pnpm --filter @pathable/storybook build-storybook
pnpm test:visual
pnpm quality-gates
pnpm storybook:coverage
```

No new lint suppressions. Metric-based visual smoke (`pnpm test:visual`) and quality
gates must include the styles Modal open (and narrow/long) story IDs so backdrop /
placement regressions fail the gate. React open is covered by Storybook interaction
runner + unit tests (and any React visual/CI fixture added in tasks). Release
metadata: Changeset covering `@pathableai/styles` and `@pathableai/react` with portal
DOM migration note (`wrapper → overlay → dialog`).
