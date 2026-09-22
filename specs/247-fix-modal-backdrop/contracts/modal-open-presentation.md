# Contract: Modal Open Presentation

Public markup/class and React behavior contract for Modal backdrop + centering.
Canonical class definitions: `packages/styles` (`pathable-modal.scss`).

## Styles: open markup

Consumers (and styles Storybook) show an open Modal with:

| Layer | Required classes | Notes |
|-------|------------------|-------|
| Wrapper | `.pathable-modal-wrapper.is-visible` | Styles MUST emit CSS so this PathAble-only list shows the open shell (backdrop + fixed/centering geometry). When dual-classing, also include `.usa-modal-wrapper` (React MUST emit both PathAble and USWDS wrapper classes). |
| Overlay | `.pathable-modal-overlay` | Dimmed full-viewport backdrop + centering. When dual-classing, also include `.usa-modal-overlay` (React MUST emit both). |
| Dialog | `.pathable-modal` **and** `.usa-modal` | Unchanged dual-class rule. `role="dialog"`, `aria-modal="true"`, labelled by title. |
| Content | `.pathable-modal__content` | PathAble `flex-direction: column` (not USWDS reverse). |
| Heading | `.pathable-modal__heading` | Contains title + `.pathable-modal__close`. |
| Footer | `.pathable-modal__footer` | Optional. |

**Dual-class policy (required vs optional)**

- **Styles Storybook open fixture (required)**: MUST use PathAble wrapper/overlay classes with `.is-visible` on the wrapper. MUST prove PathAble-only open markup works (backdrop + centering) without USWDS JS and without depending on `.usa-modal-wrapper` / `.usa-modal-overlay` for the PathAble CSS path.
- **React open portal (required)**: MUST emit PathAble shell classes **and** USWDS companion classes on wrapper and overlay (`.pathable-modal-wrapper.usa-modal-wrapper.is-visible` → `.pathable-modal-overlay.usa-modal-overlay` → `.pathable-modal.usa-modal`).
- **Dialog dual-class**: Always required (`.pathable-modal` + `.usa-modal`) on both packages’ open fixtures.

**Observable outcomes when open**

- Overlay covers the viewport and dims page content behind the dialog (non-transparent
  dimmer; page content is visually obscured).
- Dialog is **centered** within the overlay for the supported open fixtures (default,
  narrow viewport, and long-content). Geometry gates MUST assert centering within a
  documented pixel/percentage tolerance — end-of-page / uncentered inline placement is
  a failure. Do not use an unspecified “intentional placement” escape hatch for these
  fixtures.
- Title appears above body/footer (footer not stacked above title due to reverse flex).

**Styles package does not require**: React-equivalent focus trap, Escape handling,
scroll lock, or backdrop-click dismiss for acceptance. Styles shell remains
non-interactive (presentational CSS only).

## React: `Modal` API

| Prop | Type | Default | Contract |
|------|------|---------|----------|
| `open` | `boolean` | — | `true` portals open presentation; `false` renders `null` |
| `onClose` | `() => void` | — | Escape, close button; consumer-driven footer actions; overlay click when `closeOnBackdropClick` |
| `closeOnBackdropClick` | `boolean` | `false` | When `false` (default): backdrop is visual-only; dismiss via Escape, close control, or consumer `onClose` only. When `true`: click on overlay calls `onClose`; stop propagation on the dialog so content clicks do not close. Documented on React only — styles markup has no equivalent control. |
| `title` | `ReactNode` | — | Dialog accessible name source |
| `description?` | `ReactNode` | — | Optional `aria-describedby` target |
| `children?` | `ReactNode` | — | Body |
| `footer?` | `ReactNode` | — | Footer region |
| `closeLabel?` | `string` | `"Close modal"` | Accessible name for close control |
| `initialFocusRef?` | `RefObject` | — | Optional initial focus override |

**Portal tree when `open`**

```text
.pathable-modal-wrapper.usa-modal-wrapper.is-visible
  └── .pathable-modal-overlay.usa-modal-overlay
        └── .pathable-modal.usa-modal[role=dialog] …
```

Must match the styles open markup layers (wrapper → overlay → dialog) using
styles-owned class names. Dialog must include both `.pathable-modal` and `.usa-modal`.

**Attribute placement**

- Keep `ref`, ARIA attributes, `onKeyDown`, and `...rest` HTML attributes on the
  **dialog** element — not the wrapper or overlay.

**Behavior preserved / defined**

- Body scroll lock while open; restore on close.
- Focus restore to prior element on close.
- Tab cycle within dialog; Escape calls `onClose`.
- Backdrop click: default non-dismissive; optional via `closeOnBackdropClick`.
- No separate consumer import of `@pathableai/styles` beyond normal `@pathableai/react`
  entry CSS wiring.

## Story fixtures (required)

| Package | Story | Must show |
|---------|-------|-----------|
| styles | Open (or updated Default) | PathAble-only wrapper + overlay + dialog with `.is-visible`; backdrop visible; **no USWDS JS** |
| react | `Open` | Same external presentation via component API; dual-class shell emitted |

Interaction (React): existing Escape / Tab / close plays remain green. Plays MUST
assert wrapper/overlay (or dialog contained in overlay) when open, and assert those
shell nodes are absent when closed. MUST cover `closeOnBackdropClick` default
(`false`: overlay click does not call `onClose`) and `true` (overlay → `onClose`;
dialog content clicks do not). Prefer accessible outcomes over CSS-only asserts.

## Migration / changelog note

Portal DOM shape changes from a bare dialog under `document.body` to
`wrapper → overlay → dialog`. Changelog MUST call out:

- Additive shell wrap for open presentation (DOM-structure consumers may need query updates).
- Consumers who added temporary overlay CSS or custom overlay wrappers SHOULD remove
  them after upgrade to avoid double backdrops / stacked dimmers.

## Non-goals

- Distinct closed styles component (optional).
- Requiring USWDS modal JS for `@pathableai/react` Modal.
- Nested/stacked multi-modal orchestration.
- Interactive backdrop behavior in styles (React-only via `closeOnBackdropClick`).
