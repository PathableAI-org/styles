# Contract: Modal Open Presentation

Public markup/class and React behavior contract for Modal backdrop + centering.
Canonical class definitions: `packages/styles` (`pathable-modal.scss`).

## Styles: open markup

Consumers (and styles Storybook) show an open Modal with:

| Layer | Required classes | Notes |
|-------|------------------|-------|
| Wrapper | `.pathable-modal-wrapper` (+ `.usa-modal-wrapper` recommended) | Open/visible state class as documented (e.g. `.is-visible`) |
| Overlay | `.pathable-modal-overlay` (+ `.usa-modal-overlay` recommended) | Dimmed full-viewport backdrop |
| Dialog | `.pathable-modal` **and** `.usa-modal` | `role="dialog"`, `aria-modal="true"`, labelled by title |
| Content | `.pathable-modal__content` | PathAble `flex-direction: column` (not USWDS reverse) |
| Heading | `.pathable-modal__heading` | Contains title + `.pathable-modal__close` |
| Footer | `.pathable-modal__footer` | Optional |

**Observable outcomes when open**

- Overlay covers the viewport and dims page content behind the dialog.
- Dialog is centered (or intentionally placed) within the overlay.
- Title appears above body/footer (footer not stacked above title due to reverse flex).

**Styles package does not require**: React-equivalent focus trap, Escape handling, or
scroll lock for acceptance.

## React: `Modal` API (unchanged props)

| Prop | Type | Contract |
|------|------|----------|
| `open` | `boolean` | `true` portals open presentation; `false` renders `null` |
| `onClose` | `() => void` | Escape, close button; consumer-driven footer actions |
| `title` | `ReactNode` | Dialog accessible name source |
| `description?` | `ReactNode` | Optional `aria-describedby` target |
| `children?` | `ReactNode` | Body |
| `footer?` | `ReactNode` | Footer region |
| `closeLabel?` | `string` | Default `"Close modal"` |
| `initialFocusRef?` | `RefObject` | Optional initial focus override |

**Portal tree when `open`**

Must match the styles open markup layers (wrapper → overlay → dialog) using
styles-owned class names. Dialog must include both `.pathable-modal` and `.usa-modal`.

**Behavior preserved**

- Body scroll lock while open; restore on close.
- Focus restore to prior element on close.
- Tab cycle within dialog; Escape calls `onClose`.
- No separate consumer import of `@pathableai/styles` beyond normal `@pathableai/react`
  entry CSS wiring.

## Story fixtures (required)

| Package | Story | Must show |
|---------|-------|-----------|
| styles | Open (or updated Default) | Wrapper + overlay + dialog; backdrop visible |
| react | `Open` | Same external presentation via component API |

Interaction (React): existing Escape / Tab / close plays remain green and may assert
shell presence.

## Non-goals

- Distinct closed styles component (optional).
- Requiring USWDS modal JS for `@pathableai/react` Modal.
- Nested/stacked multi-modal orchestration.
