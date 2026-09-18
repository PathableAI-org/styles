# Research: Fix Modal Backdrop

Resolves design questions for dual-package Modal open presentation
(`packages/styles` class/CSS ownership, `packages/react` stateful `Modal`).

## 1. Root cause

**Decision**: Treat the defect as a **contract mismatch**: compiled CSS positions and
dims modals via `.usa-modal-wrapper` / `.usa-modal-overlay` (and `.is-visible`), while
React portals only `.pathable-modal`, and styles stories/docs currently omit the shell.
`.pathable-modal` alone is `position: relative; display: inline-block`, so the dialog
appears at the end of the document with no backdrop.

**Rationale**: Confirmed in shipped `packages/styles/dist/styles.css` and
`packages/react/src/components/Modal/Modal.tsx` (`createPortal` of a single dialog
node). Issue #246 matches this evidence.

**Alternatives considered**:

- Document that consumers must wrap Modal — rejected by spec (FR-006/FR-014).
- Rely on USWDS modal JS to inject the shell for React — rejected; React owns
  behavior and must not require separate USWDS modal JS (spec assumption).

## 2. Styles own the open shell classes

**Decision**: Extend `pathable-modal.scss` so `packages/styles` defines PathAble-owned
shell classes for the open presentation:

- `.pathable-modal-wrapper` — full-viewport positioning / visibility layer
- `.pathable-modal-overlay` — dimmed backdrop + centering context

Implement by `@extend` of `.usa-modal-wrapper` / `.usa-modal-overlay` **plus**
**required** explicit PathAble rules for `.pathable-modal-wrapper.is-visible` (and
overlay geometry) so PathAble-only markup does not depend on Sass `@extend` failing to
rewrite USWDS compound selectors like `.usa-modal-wrapper.is-visible`.

Documented open markup:

- **Styles Storybook**: MUST use PathAble-only wrapper/overlay + `.is-visible` and MUST
  NOT depend on USWDS JS (proves styles SSOT).
- **React**: MUST emit PathAble shell **and** USWDS companion classes on wrapper and
  overlay when dual-classing.

Dialog keeps dual classes `.pathable-modal` + `.usa-modal` per BRAND_RULES.

**Rationale**: Constitution I/III — styles owns class definitions and CSS/SCSS.
Clarifications require styles to ship the open presentation; React only applies it.
Explicit open-state rules avoid brittle `@extend` gaps on compound selectors.

**Alternatives considered**:

- React-only inline styles for overlay — rejected; invents visuals outside styles.
- Use only `.usa-modal-wrapper` / `.usa-modal-overlay` without PathAble names —
  weaker PathAble ownership; still acceptable as dual-class companions, but PathAble
  wrappers must exist as the documented contract with working PathAble-only CSS.
- CSS-only `:target` / checkbox hacks for open — out of scope; styles need not own
  React-equivalent transitions.

## 3. React emits the styles-owned open shell; closed stays unmount

**Decision**: When `open === true`, React portals:

```text
.pathable-modal-wrapper.usa-modal-wrapper.is-visible
  └── .pathable-modal-overlay.usa-modal-overlay
        └── .pathable-modal.usa-modal[role=dialog] …
```

When `open === false`, keep current behavior: render `null` (no distinct closed
styles component required for acceptance). Preserve focus trap, Escape, scroll lock,
and focus restore on the dialog / effects as today.

Keep `ref`, ARIA, `onKeyDown`, and `...rest` on the **dialog** element (not wrapper
or overlay). Add `.usa-modal` alongside `.pathable-modal` on the dialog (currently
missing).

**Rationale**: Spec FR-002/FR-006 — one React `Modal` owns transitions; closed styles
presentation is optional. Unmount-on-close already satisfies “no open backdrop when
closed.” Dual-class on dialog and shell matches BRAND_RULES / open-presentation
contract.

**Alternatives considered**:

- Distinct closed styles classes applied when `open={false}` — optional later; not
  required for acceptance.
- Keep portal of bare dialog and only change CSS to style `.pathable-modal` as fixed
  overlay — rejected; loses shared shell contract with styles markup/USWDS geometry
  and fights existing USWDS modal CSS assumptions.

## 4. Backdrop click dismiss (React prop)

**Decision**: Add React prop `closeOnBackdropClick` (default `false`).

- **Default (`false`)**: Backdrop is visual-only. Dismiss paths remain Escape, close
  control, and consumer `onClose` triggers — same as current React Modal behavior.
- **When `true`**: Click on the overlay calls `onClose`; stop propagation on the dialog
  so clicks inside content do not close. Styles shell remains non-interactive; the prop
  is documented on the React side of the contract only.

**Rationale**: Stakeholder answer to critique P4/X2. Default preserves existing
force-action / Escape-or-close patterns; opt-in matches common USWDS-like click-outside
expectations when product wants it. Keeping styles presentational avoids inventing
click behavior in SCSS.

**Alternatives considered**:

- Always dismiss on backdrop click — rejected; changes default UX for existing
  consumers and can undermine force-action modals.
- Never support backdrop click — rejected; full-viewport dimmer makes click-outside a
  natural affordance some products will want.
- Styles-owned interactive overlay — rejected; styles stay non-interactive (constitution
  I / behavior ownership in React).

## 5. PathAble content order vs USWDS `column-reverse`

**Decision**: In `pathable-modal.scss`, set `.pathable-modal__content` to
`flex-direction: column` (normal) after `@extend`, so PathAble’s heading→body→footer
DOM order matches visual order. Do **not** restructure PathAble markup to USWDS’s
`__main` + trailing close-button order in this feature unless a follow-up explicitly
adopts that DOM.

**Rationale**: USWDS `.usa-modal__content` uses `flex-direction: column-reverse`
because close is a sibling after `__main`. PathAble embeds close in
`.pathable-modal__heading` and puts footer last; with `column-reverse`, footer can
appear above the title (called out in #246). PathAble-owned override fixes FR-004
without a markup rewrite.

**Alternatives considered**:

- Restructure React/styles markup to USWDS `__main` + trailing close — larger a11y/DOM
  churn; deferred.
- Leave `column-reverse` and reorder children in React only — styles stories would
  still look wrong; styles must own correct presentation.

## 6. Storybook and visual regression

**Decision**:

- **Styles**: Replace/extend the current Default story so the open fixture includes
  PathAble-only wrapper + overlay + dialog with `.is-visible` (backdrop visible; no
  USWDS JS). Keep dialog name / close-button contract checks. Closed styles story
  optional. Name/document the open fixture for discoverability.
- **React**: Keep existing `Open` (and related) stories; assert backdrop/shell is
  present when open (wrapper/overlay or dialog contained in overlay) and **absent**
  when closed. Preserve Escape / Tab / close interaction stories. MUST cover
  `closeOnBackdropClick` default `false` and `true` (overlay vs dialog-content
  clicks). Ensure `Open` is a stable visual-regression fixture for backdrop +
  placement.

**Rationale**: FR-009/FR-011; React already has `Open` / interaction stories that
need shell assertions added, not replaced. Critique E4/E5/E8.

**Alternatives considered**:

- Only React stories — rejected; styles owns the class contract and must demo open.
- Chromatic-only without story updates — insufficient for local review (SC-004).

## 7. Documentation surfaces and migration

**Decision**: Update styles Modal story docs (remove “overlay is only from USWDS JS”
as the sole story) and React Modal README/story docs to state: open presentation uses
styles-owned wrapper/overlay classes; React applies them when `open` is true; no
consumer CSS required; `closeOnBackdropClick` defaults to `false`. Canonical class list
lives in styles (BRAND_RULES / `pathable-modal.scss` / styles Storybook). Update
BRAND_RULES / AGENTS dual-class tables if wrapper/overlay names are public.

Changelog / migration (constitution XIII): portal DOM shape becomes
`wrapper → overlay → dialog`; consumers who queried `document.body > .pathable-modal`
or added temporary overlay CSS / custom overlay wrappers should update queries and
remove ad-hoc overlays after upgrade to avoid stacked dimmers.

**Rationale**: Constitution XII — Storybook + package docs; styles is canonical for
classes. Critique P3/E10/E11/X3.

## 8. Testing / gates

**Decision**: Use existing package scripts — styles Storybook/tests, React unit +
Storybook interaction tests, eslint/jsx-a11y, typecheck, visual regression on open
fixtures. After SCSS change, grep compiled `dist` for `.pathable-modal-wrapper.is-visible`
(and PathAble overlay) rules before signing off styles. No lint suppressions. Prefer
accessible queries; portal queries may use `document.body` + `getByRole` as existing
Modal stories do. Keep Escape/focus tests; require automated `closeOnBackdropClick`
true/false coverage; do not expand the existing dialog `jsx-a11y` disable.

**Rationale**: Matches constitution validation gates and current Modal test patterns.
Critique E4/E6/E8.
