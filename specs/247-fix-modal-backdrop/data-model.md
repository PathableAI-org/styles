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
  - Open visibility on the wrapper (e.g. `.is-visible` and/or PathAble-documented
    open modifier), with CSS that works for PathAble-only class lists
- **Optional**: Distinct closed presentation classes/component (not required for
  acceptance).
- **Invariants**: All class definitions and raw CSS/SCSS live in styles; React must
  not invent overlay class names.
- **Relationships**: Consumed by styles Storybook markup and by React `Modal` portal.

### 2. Modal open presentation

- **Kind**: Rendered structure (markup + classes).
- **Shape**:

```text
wrapper (pathable-modal-wrapper [+ usa-modal-wrapper], open/visible)
  └── overlay (pathable-modal-overlay [+ usa-modal-overlay])
        └── dialog (pathable-modal usa-modal, role=dialog, aria-modal=true)
              └── content (pathable-modal__content)
                    ├── heading (title + close)
                    ├── description / body (optional)
                    └── footer (optional)
```

- **Invariants**: Full-viewport dimmed backdrop; dialog centered/intentionally
  placed; title/body/footer visual order matches DOM intent (`flex-direction: column`
  for PathAble content); page behind visually obscured.
- **Relationships**: Produced by styles static markup or React when `open === true`.

### 3. Modal closed presentation

- **Kind**: Optional styles-owned non-open class presentation; or React `null`.
- **Default for React**: Unmount (`return null` when `!open`) — no closed CSS required.
- **Invariants**: No open backdrop left visible; scroll/focus restore is React-owned.

### 4. React Modal (component)

- **Kind**: Single stateful function component in `packages/react`.
- **Props (unchanged surface)**: `open`, `onClose`, `title`, `description?`,
  `children?`, `footer?`, `closeLabel?`, `initialFocusRef?`, plus div HTML attributes.
- **Behavior**:
  1. `open === false` → `null` (SSR-safe).
  2. `open === true` → portal open presentation to `document.body`.
  3. Own Escape, Tab trap, body scroll lock, focus restore.
- **Invariants**: Applies styles-owned classes only; dual-class dialog; no consumer
  CSS required for backdrop.

### 5. Modal dialog content

- **Kind**: Title, optional description/body, optional footer actions.
- **Invariants**: Accessible name from title; close control has accessible name;
  synthetic Storybook copy only.

## State transitions (React)

| From | To | Trigger | Effects |
|------|-----|---------|---------|
| Closed (`null`) | Open (shell+dialog portaled) | `open` → `true` | Lock body scroll; store prior focus; focus initial/close |
| Open | Closed (`null`) | `open` → `false` / Escape / close / `onClose` path | Remove shell; restore scroll; restore focus |

Styles package does not model this transition; it may show open (and optionally closed)
as separate static fixtures.

## Validation rules

- Open presentation MUST include wrapper + overlay + dialog for accepted fixtures.
- Dialog MUST include `.pathable-modal` and `.usa-modal` while dual-class rule holds.
- React MUST NOT leave `.pathable-modal-wrapper` / overlay in the DOM when closed.
- New PathAble shell class names MUST be defined in styles before React references them.
