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

Default `apps/storybook/.storybook/preview.js` imports `@pathableai/styles/js` for
Accordion/Banner and other USWDS-JS stories. **Do not remove that global import** —
doing so breaks `pnpm test:storybook-styles`.

FR-009 requires the styles Modal **open story** proven without USWDS JS. After
implementation (T005), use the **isolated CSS-only Modal Storybook config** (preview
imports styles CSS/SCSS only — no `@pathableai/styles/js`), e.g.:

```bash
# Dev: Modal-only CSS harness (exact -c path set in T005)
pnpm --filter @pathable/storybook exec storybook dev -c .storybook-modal-css -p 6008
# Automated: build + play/geometry runner for that config (script added in T005)
pnpm test:storybook-modal-css
```

Confirm backdrop + centering from static `.is-visible` markup + PathAble CSS alone.
Keep default `pnpm test:storybook-styles` green (global JS unchanged).

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
# Default styles Storybook (keeps global @pathableai/styles/js for Accordion/Banner)
pnpm test:storybook-styles
# Isolated CSS-only Modal harness (no styles/js) + Modal geometry assertions
pnpm test:storybook-modal-css
# React interaction/a11y (behavior-contract-tagged Modal stories) + React geometry
pnpm test:storybook-react
pnpm test:modal-open-geometry
# Styles visual smoke / coverage after registering Modal IDs (blank/overflow only —
# backdrop/centering are enforced by test:storybook-modal-css + test:modal-open-geometry)
pnpm --filter @pathable/storybook build-storybook
pnpm test:visual
pnpm quality-gates
pnpm storybook:coverage
```

No new lint suppressions. **Backdrop presence and dialog centering** must fail the
dedicated geometry gates (`pnpm test:storybook-modal-css` and
`pnpm test:modal-open-geometry` for styles + React), not only blank/overflow smoke.
Release metadata: Changeset covering `@pathableai/styles` and `@pathableai/react` with
portal DOM migration note (`wrapper → overlay → dialog`).
