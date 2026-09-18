# Feature Specification: Fix Modal Backdrop

**Feature Branch**: `247-fix-modal-backdrop`

**Created**: 2026-09-18

**Status**: Draft

**Input**: User description: "GitHub issue #246 — Modal portals a bare dialog without USWDS wrapper/overlay, so open modals lack a dimmed backdrop and centered layout; consumers using only Modal + open should get the standard overlay dialog contract, with focus/Escape/scroll lock preserved, brand class contract aligned, and Storybook/visual coverage of the open state."

## Table of Contents

- [Clarifications](#clarifications)
- [User Scenarios & Testing](#user-scenarios--testing-mandatory)
- [Requirements](#requirements-mandatory)
- [Success Criteria](#success-criteria-mandatory)
- [Assumptions](#assumptions)

## Clarifications

### Session 2026-09-18

- Q: Which packages implement this Modal backdrop/centering fix, and how should their contracts relate? → A: Implement in both `packages/styles` (SCSS) and `packages/react`; external open-modal behavior must match across packages, while each package may use a different public interface and internal approach.
- Q: How strict should the open-modal DOM/class shell be across packages? → A: `packages/styles` owns all Modal class definitions and raw CSS/SCSS. Styles need not mirror React’s full interactive behavior. Styles MAY expose open and closed as separate class-based presentations/components; React remains one `Modal` that owns transitioning between those states by applying the styles-owned classes.
- Q: Must styles ship a distinct closed Modal presentation for this feature’s acceptance? → A: Open presentation (backdrop + centering) is required; a distinct closed styles component/classes is optional unless React needs specific closed classes to transition cleanly.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Open Modal Shows Overlay and Centered Dialog (Priority: P1)

A product engineer opens a Modal for a blocking message (for example, “session ended”) using either the React Modal API or the styles/SCSS open-state class contract for their stack. Without inventing ad-hoc overlay styles beyond the styles-owned classes, they see a dimmed full-viewport backdrop and a dialog centered over the page content. That open visual presentation matches across packages.

**Why this priority**: Without backdrop and centering, the Modal is not usable as a dialog in real apps—content appears at the bottom of the page and the page behind remains visually interactive. This is the defect that blocks consumers.

**Independent Test**: Show the styles-owned open Modal class presentation in styles Storybook/docs, and open React `Modal` with `open={true}` (React applying those styles-owned classes). Confirm a full-viewport dimmed overlay and a centered dialog for both.

**Acceptance Scenarios**:

1. **Given** the styles-owned open Modal class presentation (no undocumented consumer CSS), **When** that open presentation is shown, **Then** a dimmed overlay covers the full viewport and the dialog is centered (or otherwise intentionally placed per the design-system modal contract).
2. **Given** React `Modal` with `open={true}` applying the styles-owned open classes, **When** the Modal is open, **Then** the same external backdrop and dialog placement outcomes appear.
3. **Given** an open Modal, **When** a reviewer inspects the page behind the dialog, **Then** the page content is visually obscured by the overlay (not fully visible as if no modal shell existed).
4. **Given** an open Modal with title, description, and footer, **When** the dialog is visible, **Then** content order matches the intended modal layout (title and body above footer actions; footer does not appear above the title solely because centering context is missing).

---

### User Story 2 - React Owns Open/Closed Transition (Priority: P1)

A React consumer toggles a single `Modal` between closed and open. React applies the styles-owned closed vs open class presentations and owns focus trap, Escape, scroll lock, and focus restore. Styles may document open and closed as separate class-based components without owning that transition behavior.

**Why this priority**: Full interactive behavior is a React concern; styles remain the source of visual/class definitions without needing parity of state-machine behavior.

**Independent Test**: Toggle React Modal open and closed from a trigger; verify styles-owned open classes (with backdrop) appear when open and are removed/replaced by closed presentation when closed, with focus/scroll restore. In styles Storybook, open and closed presentations can be reviewed as separate fixtures if styles splits them.

**Acceptance Scenarios**:

1. **Given** an open React Modal that locked body scroll, **When** the Modal closes, **Then** body scrolling is restored and neither open overlay nor open dialog remains visible.
2. **Given** focus moved into the open React Modal from a trigger control, **When** the Modal closes, **Then** focus is restored to that trigger (or the documented restore target).
3. **Given** an open React Modal, **When** the user presses Escape (or activates the documented close path), **Then** `onClose` runs and React transitions to the closed presentation.
4. **Given** styles documents distinct open and closed Modal class presentations, **When** a styles consumer views them, **Then** each can be understood without styles providing React-equivalent open/close transition logic.

---

### User Story 3 - Documented Package APIs Need No Extra Ad-Hoc Shell (Priority: P2)

A consumer follows the public Modal guidance for their chosen package—React props for `@pathableai/react`, or styles-owned Modal classes/markup for `@pathableai/styles`—and does not invent ad-hoc overlay CSS. The open visual presentation still presents correctly for that package.

**Why this priority**: Styles owns class definitions; React owns the stateful component API. Neither path should force undocumented consumer CSS for backdrop or centering.

**Independent Test**: Reproduce the minimal documented React Modal usage and the minimal documented styles open-class markup; both show backdrop + centered dialog without undocumented extra CSS.

**Acceptance Scenarios**:

1. **Given** only the public React Modal props (`open`, `onClose`, title, description, footer, and related documented props), **When** the Modal opens, **Then** overlay and centering appear by applying styles-owned classes—no consumer-authored overlay CSS.
2. **Given** only the documented styles Modal open-state classes/markup, **When** that presentation is shown, **Then** overlay and centering appear without undocumented extra consumer CSS.
3. **Given** published Modal usage guidance for either package, **When** a consumer follows that package’s docs, **Then** they are not instructed to invent overlay CSS outside the styles-owned class contract solely to get backdrop and centering.

---

### User Story 4 - Open State Is Reviewable in Storybook (Priority: P2)

Designers and engineers review the open Modal presentation in styles and React Storybooks (backdrop + dialog). If styles models open and closed as separate class-based components, styles Storybook MAY expose them as separate stories; React Storybook shows one Modal with open/closed via its API. Visual regression protects the open presentation on each surface.

**Why this priority**: The defect was easy to miss when behavior worked but visuals did not; deterministic stories and visual fixtures prevent regressions in either package.

**Independent Test**: Open the styles open-state story and the React open Modal story; confirm overlay + centered dialog on each; visual regression fixtures include the open presentation for both.

**Acceptance Scenarios**:

1. **Given** styles and React Storybook Modal coverage, **When** a reviewer opens each package’s open/visible presentation, **Then** they can see both the dimmed backdrop and the centered dialog on that surface.
2. **Given** visual regression coverage for Modal, **When** each package’s open-state fixture is captured, **Then** backdrop presence and dialog placement are part of the protected presentation for that package.
3. **Given** styles splits open vs closed into separate class-based components, **When** styles Storybook documents them, **Then** open and closed MAY appear as separate stories without requiring styles to demo React’s transition behavior.

---

### Edge Cases

- **Closed presentation**: Styles MAY define a distinct closed Modal class presentation (possibly as a separate styles “component” from open). React maps `open={false}` to that closed presentation (or unmounts/hides per its API) and MUST NOT leave the open backdrop visible when closed.
- **React closed by default**: When React `open` is false, no open overlay/dialog presentation is shown and page scroll/focus are unaffected by Modal.
- **Long title or body**: Long content remains usable inside the open dialog (scroll within the dialog or documented overflow behavior) without breaking centering or leaving the dialog off-screen.
- **Narrow / mobile viewports**: Overlay still covers the viewport; dialog remains usable and intentionally placed on small screens.
- **Reduced motion**: Overlay and dialog presentation remain understandable; any motion follows reduced-motion expectations if motion is introduced. React owns animated transitions between styles-owned states if motion is used.
- **Forced colors / high contrast**: Overlay and dialog remain distinguishable as a modal layer over page content.
- **Multiple open attempts**: Only the intended open Modal presentation appears; consumers are not required to manually clean up orphan overlays.
- **Portal host**: React Modal continues to present above page content (ported out of local layout) so parent `overflow` or stacking contexts do not clip away the overlay incorrectly under normal document usage.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: Both `packages/styles` and `packages/react` MUST implement this feature. `packages/styles` MUST own all Modal-related class definitions and raw CSS/SCSS for open (and closed, if defined) presentations. When the open presentation is shown—via styles markup using those classes, or via React applying them—the external open visual result MUST match: dialog over a full-viewport dimmed backdrop with intentional centering/placement. Styles MUST NOT be required to provide React-equivalent transition, focus-trap, Escape, or scroll-lock behavior.
- **FR-002**: The `@pathableai/react` `Modal` MUST remain a single component that owns transitioning between closed and open presentations by applying the styles-owned classes/markup contract. It MUST continue to expose its documented React interface (portal dialog, open/close props, focus trap, Escape-to-close, body scroll lock, focus restore) and MUST NOT regress those behaviors when the backdrop/centering presentation is corrected.
- **FR-003**: When the open Modal presentation is shown, page content behind the dialog MUST be visually obscured by the backdrop so the dialog reads as a modal layer, not as an inline block at the end of the document.
- **FR-004**: Open Modal content structure MUST keep the expected reading and visual order for title, description/body, and footer actions (footer MUST NOT appear above the title solely due to missing overlay/centering context).
- **FR-005**: The dialog element class contract MUST remain consistent with brand guidance for JS-driven modal: both `.usa-modal` and `.pathable-modal` on the dialog when that dual-class rule remains required by `packages/styles` BRAND_RULES / agent guidance. Any new open/closed or overlay classes MUST be defined in `packages/styles`, not invented only in React.
- **FR-006**: For this feature’s acceptance, `packages/styles` MUST ship the open Modal class presentation (backdrop + centering). A distinct closed Modal styles component/classes MAY be added but is NOT required for acceptance unless React needs specific closed classes to transition cleanly. React MUST map its `open` state onto the styles-owned open presentation when open (and onto closed classes or unmount/hide when closed). Consumers MUST NOT be required to invent undocumented CSS solely to obtain backdrop or centering.
- **FR-007**: Closing via React MUST remove the open presentation (backdrop and dialog), restore body scroll, and restore focus per existing Modal accessibility behavior. Styles closed presentation (if separate) MUST visually represent the non-open state without claiming React’s interaction semantics.
- **FR-008**: `@pathableai/react` MUST continue to package or import the `@pathableai/styles` CSS (and related assets) needed for Modal presentations so a normal React consumer does not manually assemble modal overlay styles. `packages/styles` remains the authoritative source of Modal class definitions and CSS/SCSS that React consumes.
- **FR-009**: Styles Storybook MUST include at least one deterministic story for the open Modal class presentation (backdrop + dialog). A separate closed styles story is optional for this feature. React Storybook MUST include a deterministic open Modal story (and MAY demonstrate closed via the same component). Stories MUST use accessible queries (`getByRole`, `getByLabelText`) and no non-deterministic data.
- **FR-010**: React interaction expectations MUST remain verifiable: keyboard dismiss (Escape), focus trap while open, and focus restore on close. Styles acceptance for this feature is the correct open (and closed, if defined) visual/class presentations—not full interactive parity with React.
- **FR-011**: Stable open-state stories in both packages MUST serve as visual-regression fixtures protecting backdrop presence, dialog placement, spacing/typography inside the dialog, and focus-visible treatment where applicable.
- **FR-012**: Accessibility for the open Modal MUST preserve dialog semantics (`role="dialog"`, `aria-modal` as documented) in both packages’ open presentations. Keyboard operability and focus management are required where React owns behavior; styles open markup MUST remain accessible as a static dialog presentation. Broad a11y rule disablement is not permitted.
- **FR-013**: Open Modal presentation MUST remain usable on narrow viewports and with long content in both packages, without relying on consumers to add layout workarounds.
- **FR-014**: Public documentation for styles MUST describe the styles-owned Modal classes (including open vs closed if split). Public documentation for React MUST describe the single `Modal` API and that it applies styles-owned classes across open/closed. Neither MUST require undocumented consumer CSS for backdrop/centering.

### Key Entities

- **Styles-owned Modal class contract**: The PathAble Modal CSS classes and SCSS/CSS definitions (including overlay/positioning and any distinct open vs closed presentations) authored only in `packages/styles`.
- **Modal open presentation**: The combination of dimmed full-viewport backdrop plus intentionally placed dialog produced by the styles-owned open classes (also shown when React applies those classes).
- **Modal closed presentation**: Optional styles-owned class presentation for the non-open Modal; may be documented as a separate styles component from open.
- **React Modal**: Single React component that applies styles-owned open/closed presentations and owns transitions plus focus/scroll/keyboard behavior.
- **Modal dialog content**: Title, optional description/body, and optional footer actions associated with the open dialog.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: In a React consumer page that only uses the documented React Modal API, setting open to true yields a visibly dimmed full-viewport layer and a centered (or intentionally placed) dialog on first open, using styles-owned classes with no undocumented consumer CSS.
- **SC-002**: In styles Storybook or a styles consumer page using only the documented styles open Modal classes, the open presentation yields the same external backdrop and dialog placement outcomes as React’s open state.
- **SC-003**: After React close, 100% of tested flows restore page scrolling and remove the open overlay/dialog from view; focus returns to the pre-open control in standard trigger-open-close sequences.
- **SC-004**: Reviewers can identify backdrop + dialog in both styles and React open Modal Storybook presentations in under one minute per surface.
- **SC-005**: Visual regression for each package’s open Modal fixture fails if the backdrop is missing or the dialog returns to an uncentered end-of-page inline appearance.
- **SC-006**: Keyboard-only users can dismiss the open React Modal and return to the trigger without pointer use in the primary documented close paths.
- **SC-007**: Title/body/footer order in the open dialog matches the intended modal layout in default Storybook content for both packages (footer not stacked above the title due to missing shell).
- **SC-008**: Distinct closed styles Modal fixtures are optional for this feature; if present, reviewers can view them without styles providing React’s open/close transition behavior.

## Assumptions

- Implementation spans both `packages/styles` and `packages/react`. Styles owns all Modal class definitions and CSS/SCSS; React owns the single stateful `Modal` and transitions between styles-owned presentations (see Clarifications).
- “Same external behavior” for this feature means matching **open visual presentation** (backdrop + centered dialog), not full interactive parity. Focus trap, Escape, scroll lock, and focus restore remain React-owned.
- For acceptance, styles MUST deliver the open class presentation with backdrop/centering. A distinct closed styles presentation is optional unless React needs closed classes for a clean transition (see Clarifications).
- Source of the observed React defect is a mismatch between React portal markup and styles that still assume a USWDS-style wrapper/overlay shell; styles work updates the authoritative class/CSS contract, and React applies that contract through its API.
- Brand dual-class guidance (`.usa-modal` + `.pathable-modal`) remains in force unless maintainers explicitly retire it; this feature aligns to the current rule.
- React consumers are not expected to load separate USWDS modal JavaScript solely to obtain backdrop/centering when using `@pathableai/react` Modal.
- Large forced-colors or print-specific redesigns of Modal are out of scope beyond keeping the open layer distinguishable.
- Nested or stacked multi-modal orchestration is out of scope unless already supported; this feature targets the single open Modal presentation.
- Issue context: PathAbleAI-org/styles#246 (observed with `@pathableai/react` 0.2.0 and `@pathableai/styles` 0.1.0).
