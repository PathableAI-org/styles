# Data Model: Fix Modal Backdrop

Domain model for Modal open presentation across styles and React. No persistence;
runtime state is React `open` only.

## Entities

### 1. Styles-owned Modal class contract

- **Kind**: CSS/SCSS class vocabulary in `packages/styles`.
- **Members (required for open acceptance)**:
  - `.pathable-modal` (+ `.usa-modal` on the same dialog element)
  - `.pathable-modal__content`, `__heading`, `__footer`, `__close` (existing)
  - `.pathable-modal-wrapper` — positioning / visibility shell
  - `.pathable-modal-overlay` — dimmed backdrop + centering context
  - Open visibility: `.pathable-modal-wrapper.is-visible` with **explicit** PathAble
    CSS so PathAble-only class lists produce backdrop + centering (no reliance on
    USWDS compound `@extend` alone; no USWDS JS required)
- **Dual-class companions (React required; styles Storybook PathAble-only proof)**:
  - `.usa-modal-wrapper` / `.usa-modal-overlay` — required companions when React
    dual-classes the shell; styles open fixture proves PathAble-only path
- **Optional**: Distinct closed presentation classes/component (not required for
  acceptance).
- **Invariants**: All class definitions and raw CSS/SCSS live in styles; React must
  not invent overlay class names; styles shell is non-interactive.
- **Relationships**: Consumed by styles Storybook markup and by React `Modal` portal.

### 2. Modal open presentation

- **Kind**: Rendered structure (markup + classes).
- **Shape**:

```text
wrapper (pathable-modal-wrapper [+ usa-modal-wrapper], .is-visible)
  └── overlay (pathable-modal-overlay [+ usa-modal-overlay])
        └── dialog (pathable-modal usa-modal, role=dialog, aria-modal=true)
              └── content (pathable-modal__content)
                    ├── heading (title + close)
                    ├── description / body (optional)
                    └── footer (optional)
```

- **Invariants**: Full-viewport dimmed backdrop; dialog centered within the overlay
  (documented geometry tolerance); title/body/footer visual order matches DOM intent
  (`flex-direction: column` for PathAble content); page behind visually obscured.
- **Relationships**: Produced by styles static markup or React when `open === true`.

### 3. Modal closed presentation

- **Kind**: Optional styles-owned non-open class presentation; or React `null`.
- **Default for React**: Unmount (`return null` when `!open`) — no closed CSS required.
- **Invariants**: No open backdrop left visible; wrapper/overlay nodes absent from DOM
  when closed; scroll/focus restore is React-owned.

### 4. React Modal (component)

- **Kind**: Single stateful function component in `packages/react`.
- **Props**:
  - Existing: `open`, `onClose`, `title`, `description?`, `children?`, `footer?`,
    `closeLabel?`, `initialFocusRef?`, plus div HTML attributes (`...rest` on dialog).
  - **New**: `closeOnBackdropClick?: boolean` — **default `false`**.
    - `false`: backdrop visual-only; dismiss via Escape, close control, or consumer
      `onClose` only.
    - `true`: overlay click → `onClose`; stop propagation on dialog so content clicks
      do not close.
    - React-only; styles have no equivalent control.
- **Behavior**:
  1. `open === false` → `null` (SSR-safe).
  2. `open === true` → portal open presentation to `document.body` (dual-class shell).
  3. Own Escape, Tab trap, body scroll lock, focus restore.
  4. Optional backdrop-click dismiss per `closeOnBackdropClick`.
- **Invariants**: Applies styles-owned classes only; dual-class dialog + dual-class
  wrapper/overlay; `ref`/ARIA/`onKeyDown`/`...rest` on dialog; no consumer CSS
  required for backdrop.

### 5. Modal dialog content

- **Kind**: Title, optional description/body, optional footer actions.
- **Invariants**: Accessible name from title; close control has accessible name;
  synthetic Storybook copy only.

## State transitions (React)

| From | To | Trigger | Effects |
|------|-----|---------|---------|
| Closed (`null`) | Open (shell+dialog portaled) | `open` → `true` | Lock body scroll; store prior focus; focus initial/close |
| Open | Closed (`null`) | `open` → `false` / Escape / close / overlay click (if `closeOnBackdropClick`) / `onClose` path | Remove shell (wrapper+overlay+dialog); restore scroll; restore focus |

Styles package does not model this transition; it may show open (and optionally closed)
as separate static fixtures.

## Validation rules

- Open presentation MUST include wrapper + overlay + dialog for accepted fixtures.
- Styles open fixture MUST work with PathAble-only classes + `.is-visible` (no USWDS JS).
- Dialog MUST include `.pathable-modal` and `.usa-modal` while dual-class rule holds.
- React open portal MUST emit PathAble + USWDS companion classes on wrapper and overlay.
- React MUST NOT leave `.pathable-modal-wrapper` / overlay in the DOM when closed.
- New PathAble shell class names MUST be defined in styles before React references them.
- `closeOnBackdropClick` defaults to `false`; styles shell remains non-interactive.
