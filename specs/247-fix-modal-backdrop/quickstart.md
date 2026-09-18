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
# open styles Storybook (repo script for styles storybook)
pnpm --filter @pathableai/styles storybook
```

Open **Components/Communication/Modal** open fixture (PathAble-only shell; no USWDS JS):

- Dimmed full-viewport overlay is visible
- dialog is centered over the page
- title sits above body/footer
- wrapper has `.pathable-modal-wrapper.is-visible`; overlay is `.pathable-modal-overlay`

## 2. React open presentation

```bash
pnpm --filter @pathableai/react storybook
```

Open **Components/Communication/Modal → Open**:

- Same external backdrop + centering as styles
- Inspect portal: `.pathable-modal-wrapper.usa-modal-wrapper.is-visible` →
  `.pathable-modal-overlay.usa-modal-overlay` → `.pathable-modal.usa-modal`

## 3. React interaction (no regression)

In Storybook, run play tests / interaction stories:

- `EscapeCloses`
- `TabContainment`
- `OpenCloseBehavior`

Plays MUST assert wrapper/overlay (or dialog inside overlay) when open, and assert
those shell nodes are **absent** when closed.

Or package test script if wired:

```bash
pnpm --filter @pathableai/react test
```

Expected: Escape/close still call `onClose`; focus trap still cycles; closing removes
shell and restores scroll/focus.

### Backdrop click (`closeOnBackdropClick`)

Required automated checks (Storybook play and/or unit):

- Default / `closeOnBackdropClick={false}`: click overlay does **not** call `onClose`
  (backdrop visual-only).
- `closeOnBackdropClick={true}`: click overlay calls `onClose`; click inside dialog
  does not (stop propagation on dialog).

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
pnpm --filter @pathableai/styles lint
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react typecheck
```

No new lint suppressions. Visual regression on styles open + React `Open` fixtures
should fail if backdrop/centering regress. Changelog should note portal DOM shape
(`wrapper → overlay → dialog`) for DOM-query consumers.
