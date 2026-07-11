# Data Model: Structured Wizard and Guided Workflow Compositions

> This document defines the visual/structural entities managed by the CSS compositions. Since this is a pure styles package, "entities" here refer to layout regions, visual states, and structural roles — not runtime data objects.

## Wizard Composition

### Wizard
The top-level container for a multi-step form flow. Owns the step context, current page heading, content/form region, validation summary, and action footer.

**CSS class**: `.pathable-wizard`
**States**: (none — the wizard is stateless; the consuming application provides the step context)

### Wizard Step
A single step within the wizard flow. Has a position, title, and visual state (current, completed, upcoming).

**CSS classes**:
- `.pathable-wizard__step` — base step element
- `.pathable-wizard__step--current` — the active step
- `.pathable-wizard__step--completed` — a step the user has finished
- `.pathable-wizard__step--upcoming` — a step not yet reached

**Implementation note**: The wizard delegates step rendering to `pathable-step-indicator` (which extends `usa-step-indicator`). Step states use `usa-step-indicator__step--current`, `usa-step-indicator__step--completed`, etc., available through the existing `.pathable-step-indicator` wrapper.

### Wizard Page Heading
A semantic heading (`<h1>`–`<h3>`) that labels the current step's content.

**CSS class**: `.pathable-wizard__heading`
**Accessibility**: Must be an actual heading element, not a styled `<span>`.

### Wizard Content/Form Region
The region where the current step's form controls or content are rendered.

**CSS class**: `.pathable-wizard__content`

### Wizard Validation Summary
A region that appears when form validation errors are present on the current step. Lists errors and provides guidance for moving focus.

**CSS class**: `.pathable-wizard__validation`
**States**:
- `.pathable-wizard__validation--visible` — validation errors present
- `.pathable-wizard__validation--hidden` — no errors (default)

### Wizard Actions Footer
A persistent footer region containing navigation and submission buttons.

**CSS class**: `.pathable-wizard__actions`
**Action positions** (documented, left-to-right):
1. Save & Exit (low emphasis, always visible)
2. Back (base/secondary, hidden on first step)
3. Continue (primary, visible on all non-final steps)
4. Submit (primary, visible only on final step, replaces Continue)

### Wizard Compact Mobile Summary
A compact representation of the current step for mobile viewports when the full step indicator would overflow.

**CSS class**: `.pathable-wizard__mobile-summary`
**Content**: "Step N of M: [Current Step Label]"

## Workflow Panel Composition

### Workflow Panel
The top-level container for a structured staff workflow/session.

**CSS class**: `.pathable-workflow-panel`
**States** (applied as modifier classes on `.pathable-workflow-panel`):
- `.pathable-workflow-panel--loading` — initial data load
- `.pathable-workflow-panel--saving` — save in progress
- `.pathable-workflow-panel--saved` — save confirmed
- `.pathable-workflow-panel--offline` — network unavailable
- `.pathable-workflow-panel--validation-error` — input validation error
- `.pathable-workflow-panel--completed` — workflow finished

### Context Header
Identifies the person or record being worked on.

**CSS class**: `.pathable-workflow-panel__context-header`
**Content**: Name/identifier, optional metadata tags (program name, status badge)

### Objective
The current session objective or goal, displayed prominently.

**CSS class**: `.pathable-workflow-panel__objective`

### Current Activity
The current activity or step within the workflow.

**CSS class**: `.pathable-workflow-panel__current-activity`

### Prompt/Instruction Region
A structured prompt or instruction guiding the staff member's input.

**CSS class**: `.pathable-workflow-panel__prompt`
**Visual distinction**: Uses a distinct background surface or border treatment to differentiate from the user's entered notes.

### Observation/Note Input Region
The area where the staff member records observations, notes, or assessment data.

**CSS class**: `.pathable-workflow-panel__input`
**Visual distinction**: Standard input surface treatment, visually separate from the prompt.

### Progress/Save-Status Region
Indicates session progress and save state.

**CSS class**: `.pathable-workflow-panel__status`
**Sub-states** (controlled by parent modifier):
- Loading indicator (spinner/skeleton)
- Saving indicator
- Saved confirmation (checkmark + "Saved" text)
- Offline banner
- Validation error count
- Completed summary

### Completion Actions
Action buttons for completing or submitting the workflow.

**CSS class**: `.pathable-workflow-panel__actions`
**Buttons**: Cancel/Discard (low emphasis), Save & Continue (primary), Complete/Submit (primary)

## Save-Status Indicator

### Save Status
A standalone indicator for save operation states. Reusable outside the workflow panel context.

**CSS class**: `.pathable-save-status`
**States** (applied as modifier classes on `.pathable-save-status`):
- `.pathable-save-status--loading` — initial load/save starting
- `.pathable-save-status--saving` — save in progress
- `.pathable-save-status--saved` — save completed successfully
- `.pathable-save-status--offline` — network unavailable
- `.pathable-save-status--error` — save failed
- `.pathable-save-status--idle` — no operation in progress (default)

**Content**: Each state displays both a text label (e.g., "Saving...", "Saved", "Offline") and an icon or visual indicator, satisfying FR-019 (status communicated through text or icons in addition to color).

## Validation Rules

The following constraints must hold in the composition (enforced by CSS, not runtime):

| # | Rule | Applies To | Source |
|---|------|-----------|--------|
| 1 | Step indicator must distinguish current/completed/upcoming without color alone | Wizard | FR-002 |
| 2 | Validation summary must be displayed when errors are present | Wizard | FR-005 |
| 3 | Action footer must have documented button positions | Wizard | FR-006 |
| 4 | Mobile compact summary must replace full stepper on small viewports | Wizard | FR-007 |
| 5 | Prompt content and user notes must be visually distinct | Workflow Panel | FR-017 |
| 6 | All states must communicate via text/icon in addition to color | Both | FR-019 |
| 7 | Primary controls must meet minimum touch-target size | Both | FR-020 |
| 8 | Long prompts/notes must not overflow layout | Workflow Panel | FR-022 |

## State Transitions

### Workflow Panel

```
                    ┌─────────┐
                    │ LOADING │
                    └────┬────┘
                         │
                    ┌────▼────┐
         ┌─────────┤  IDLE   │◄────────┐
         │         └────┬────┘         │
         │              │              │
    ┌────▼────┐   ┌────▼────┐   ┌──────┴──┐
    │ SAVING  │   │ OFFLINE │   │ SAVED   │
    └────┬────┘   └────┬────┘   └────┬────┘
         │              │              │
         └──────┬───────┘─────────────┘
                │
          ┌─────▼──────┐
          │ VALIDATION │
          │   ERROR    │
          └─────┬──────┘
                │
          ┌─────▼──────┐
          │ COMPLETED  │
          └────────────┘
```

The consuming application controls state transitions. The composition provides visual styles for each state.