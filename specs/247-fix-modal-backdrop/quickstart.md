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

Note: default `apps/storybook/.storybook/preview.js` imports `@pathableai/styles/js`.
PathAble-only acceptance also requires a CSS-only proof path from the tasks
(isolated harness or scoped preview) so the fixture is not validated solely under
global USWDS JS.

## 2. React open presentation

```bash
# React Storybook is @pathable/storybook-react (not @pathableai/react)
pnpm --filter @pathable/storybook-react storybook
```

Open **Components/Communication/Modal → Open**:

- Same external backdrop + centering as styles
- Inspect portal: `.pathable-modal-wrapper.usa-modal-wrapper.is-visible` →
  `.pathable-modal-overlay.usa-modal-overlay` → `.pathable-modal.usa-modal`

Also run the React unit/integration check that mounts `Modal` **without** importing
`@pathableai/styles/js` (proves backdrop/centering from styles CSS + React portal, not
USWDS modal JS).

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
    <Modal
      open={open}
      onClose={onClose}
      // closeOnBackdropClick={false} by default — backdrop is visual-only
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
pnpm --filter @pathableai/styles lint:styles
pnpm --filter @pathableai/styles lint:tokens
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react typecheck
pnpm --filter @pathableai/react check:types
pnpm --filter @pathableai/react check:package
pnpm --filter @pathableai/styles build
pnpm --filter @pathableai/react build
```

No new lint suppressions. Visual regression on styles open + React `Open` fixtures
should fail if backdrop/centering regress. Release metadata: Changeset covering
`@pathableai/styles` and `@pathableai/react` with portal DOM migration note
(`wrapper → overlay → dialog`).
