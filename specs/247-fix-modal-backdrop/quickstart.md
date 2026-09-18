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
# open styles Storybook (repo script for styles storybook)
pnpm --filter @pathableai/styles storybook
```

Open **Components/Communication/Modal** open fixture:

- Dimmed full-viewport overlay is visible
- dialog is centered over the page
- title sits above body/footer

## 2. React open presentation

```bash
pnpm --filter @pathableai/react storybook
```

Open **Components/Communication/Modal → Open**:

- Same external backdrop + centering as styles
- Inspect portal: wrapper → overlay → `.pathable-modal.usa-modal`

## 3. React interaction (no regression)

In Storybook, run play tests / interaction stories:

- `EscapeCloses`
- `TabContainment`
- `OpenCloseBehavior`

Or package test script if wired:

```bash
pnpm --filter @pathableai/react test
```

Expected: Escape/close still call `onClose`; focus trap still cycles; closing removes
shell and restores scroll/focus.

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

## 5. Gates

```bash
pnpm --filter @pathableai/styles lint
pnpm --filter @pathableai/react lint
pnpm --filter @pathableai/react typecheck
```

No new lint suppressions. Visual regression on styles open + React `Open` fixtures
should fail if backdrop/centering regress.
