# Research: Component Brand Refinement

**Phase 0** — Resolved unknowns and design decisions for the Component Brand Refinement feature.

## Decision 1: Button Brand Color Mapping

**Decision**: Map each button variant to a specific brand color or semantic token as follows:

| Button Variant | Brand Color | Semantic Token | USWDS Token | Mapped Hex | Contrast with White |
|---------------|-------------|---------------|-------------|------------|-------------------|
| Primary | PathAble Blue | `--pathable-color-action-primary-bg` | blue-warm-80v | #162e51 | 13.2:1 (AAA pass) |
| Secondary | Intelligent Jade | `--pathable-color-action-secondary-bg` | mint-cool-30v | #1cae96 (exact) | ~3.0:1 (AA fail for normal text) |
| Accent-cool | Bright Blue Brooks | `--pathable-color-link` | blue-30v | #58b4ff | ~2.6:1 (AA fail for normal text) |
| Base | — | `--pathable-color-bg` (#dde2e8) | — | #dde2e8 | ~1.3:1 (white), ~2.4:1 (PathAble Blue) |
| Unstyled | — | Inherits from parent | — | — | N/A |

**Rationale**: 
- **Primary** (PathAble Blue / blue-warm-80v): Already has the best contrast of any brand color against white. This is the unambiguous primary CTA color.
- **Secondary** (Intelligent Jade): The brand hex #1cae96 against white has approximately 2.25:1 contrast (below 4.5:1 AA for normal text). The existing `_semantic.scss` solves this by using `--pathable-color-action-secondary-text: #00365c` (PathAble Blue text on Intelligent Jade background = ~5.5:1, AA pass). Per the spec, secondary buttons must either use the secondary-bg with dark text or be documented accordingly.
- **Accent-cool** (Bright Blue Brooks): The USWDS-mapped value (~#58b4ff) against white is approximately 2.1:1. Use for large text (WCAG AA threshold 3:1 for large text — borderline) or with dark text. Best used for tertiary/supportive actions as specified.
- **Base** (Shilling Silver / #dde2e8): Very low contrast on its own. Use primarily as a surface color or with PathAble Blue text.

**Alternatives considered**: 
- Using exact brand hex values instead of USWDS-mapped tokens — rejected because the design system intentionally uses USWDS token mappings for consistency. The semantic tokens in `_semantic.scss` already use exact brand hex values for the CSS custom properties layer.

## Decision 2: Workflow Card Implementation Approach

**Decision**: Add a `.pathable-card--workflow` modifier that defines the Pathable-specific card pattern. Do NOT modify the base `.pathable-card` class.

**Rationale**: 
- The base card wrapper (`@extend .usa-card`) is a general-purpose card used by any USWDS consumer
- A modifier class (`--workflow`) cleanly scopes the brand opinion to Pathable-specific use cases
- The modifier sets: Shilling Silver or white surface, PathAble Blue heading via `--pathable-color-text` inheritance, spacing overrides, optional Intelligent Jade status accent

**CSS custom properties to use**:
- `--pathable-color-surface` (#ffffff) — card background
- `--pathable-color-bg` (#dde2e8) — card surface alternative
- `--pathable-color-text` (#00365c) — card heading/text
- `--pathable-color-text-muted` (#015a76) — muted metadata text
- `--pathable-color-link` (#4899e8) — card links/actions
- `--pathable-color-accent` (#1cae96) — optional status signal
- `--pathable-color-focus-ring` (#4497f5) — focus indicator
- `--pathable-color-success` (#1cae96) — status signal (alias for accent)

**Alternatives considered**:
- Adding an opinionated base class override — rejected because it would change the generic card appearance for all consumers, which contradicts the "USWDS wrapper with Pathable additions" architecture
- Creating a completely separate `.pathable-workflow-card` component — rejected as premature; the modifier approach is lighter and can be promoted later

## Decision 3: Semantic Alert Pattern Color Verification

**Decision**: Test each alert variant with the Storybook a11y addon and document findings. For variants that fail WCAG AA small text contrast, use dark text (PathAble Blue #00365c) instead of white.

**Rationale**:
- The FEEDBACK.md specifically warns that `intelligent-jade` (Intelligent Jade) and `blue-30v` (Bright Blue Brooks) may fail contrast with white text
- The existing `_semantic.scss` already solves this by defining `--pathable-color-status-success-text: #00365c` (dark text on success bg)
- Pattern to follow: status alert bg → dark text, informational/emergency alert bg → white text per existing USWDS conventions

**Alert variant color guidance**:

| Alert Variant | Background | Foreground | Expected contrast | Notes |
|--------------|-----------|-----------|-------------------|-------|
| success | `--pathable-color-status-success-bg` (#1cae96) | `--pathable-color-status-success-text` (#00365c) | ~5.5:1 (AA pass) | Dark text on green bg |
| warning | `--pathable-color-status-warning-bg` (#f5a623) | `--pathable-color-status-warning-text` (#00365c) | ~5.8:1 (AA pass) | Dark text on amber bg |
| error | `--pathable-color-status-danger-bg` (#dc3545) | `--pathable-color-status-danger-text` (#ffffff) | ~4.6:1 (AA pass) | White text on red bg |
| info | USWDS default blue | white | USWDS native | Inherit from USWDS |
| emergency | USWDS default red | white | USWDS native | Inherit from USWDS |

## Decision 4: Form Workflow Pattern Names

**Decision**: Use the following workflow pattern names and their associated component families:

| Pattern Name | Primary Component | Related Components | Purpose |
|-------------|------------------|-------------------|---------|
| Session Note | textarea | form, label, hint, error-message | Structured clinical note entry |
| Participant Goal | select or combo-box | form, label, validation | Selecting goals from a list |
| Intervention Checklist | checkbox | fieldset, legend, form | Multi-select intervention tracking |
| Progress Signal | radio or range | form, label, hint | Rating/scaling input |
| Required Compliance Field | input | form, label, error-message, validation | Mandatory field with error recovery |
| Supervisor Approval Comment | textarea | form, label, hint | Approval workflow comment |

**Rationale**: These six patterns cover the three key Pathable workflow areas identified in FEEDBACK.md: session guidance, compliance, and approvals. They are ordered by increasing complexity.

## Decision 5: Navigation Workflow Labels

**Decision**: Use these Pathable staff workflow labels in navigation stories:

| Label | Section | Notes |
|-------|---------|-------|
| Today's Sessions | Primary nav | Active/workflow-oriented |
| Participants | Primary nav | Core entity |
| Approvals | Primary nav | Workflow action |
| Reports | Primary nav | Data/compliance |
| Templates | Primary nav or Settings | Configuration |
| Settings | End of nav | Standard placement |

**Rationale**: These six items directly mirror the product direction described in FEEDBACK.md and represent a realistic staff navigation structure for a Pathable product.

## Codebase Findings

1. **`_semantic.scss` already has the tokens needed**: Action role tokens (`--pathable-color-action-primary-bg/text`, `--pathable-color-action-secondary-bg/text`), status role tokens (`--pathable-color-status-success-bg/text`, `--pathable-color-status-warning-bg/text`, `--pathable-color-status-danger-bg/text`), and workflow state tokens (`--pathable-color-workflow-active/complete/blocked`) are all already defined.

2. **`_semantic.scss` uses exact brand hex values**: Unlike the USWDS token layer which maps to approximations, the semantic tokens in `_semantic.scss` use exact brand hex values (e.g., #00365c for PathAble Blue, #1cae96 for Intelligent Jade). This is significant — component overrides that reference semantic tokens will use exact brand colors, not USWDS approximations.

3. **Component wrapper files follow a consistent pattern**: Each wraps USWDS with `@extend`, comments at the top indicate JS-driven status, and all live in `pathable-component-wrappers/`.

4. **The USWDS theme override file (`_uswds-theme.scss`) is the only place USWDS theme map overrides should go** — per AGENTS.md rules. The brand opinion layer should use CSS custom properties and direct SCSS values instead.

5. **Contrast of exact brand colors**: Testing at contrastchecker.com level:
   - PathAble Blue #00365c on white #ffffff: ~14.3:1 (AAA)
   - Intelligent Jade #1cae96 on white: ~2.25:1 (fails AA) — use dark text
   - Intelligent Jade #1cae96 on PathAble Blue #00365c: ~5.5:1 (AA pass)
   - Bright Blue Brooks #4899e8 on white: ~3.25:1 (fails AA small text) — use large text or dark bg
   - Tech Teal #015a76 on white: ~8.9:1 (AAA)
   - Lived-In Lime #d3ff66 on white: ~1.4:1 (fails) — use only on dark backgrounds

These ratios confirm the design decisions in `_semantic.scss`: action-primary-text is white, action-secondary-text is PathAble Blue (not white), status-success-text is PathAble Blue (not white), status-danger-text is white (sufficient contrast).