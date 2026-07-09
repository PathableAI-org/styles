# Semantic Alert Pattern Contracts

**File**: `packages/styles/src/pathable-component-wrappers/pathable-alert.scss`

## Interface

The alert component uses existing USWDS alert variants augmented with Pathable semantic tokens. No new CSS classes or modifiers are needed — the existing `.pathable-alert--{type}` classes work with the semantic tokens already defined in `_semantic.scss`.

### CSS Classes (unchanged)

| Class | Purpose | Status |
|-------|---------|--------|
| `.pathable-alert` | Base alert | EXISTING |
| `.pathable-alert--info` | Informational | EXISTING |
| `.pathable-alert--warning` | Warning | EXISTING |
| `.pathable-alert--error` | Error | EXISTING |
| `.pathable-alert--success` | Success | EXISTING |
| `.pathable-alert--emergency` | Emergency | EXISTING |
| `.pathable-alert--slim` | Compact variant | EXISTING |

### Semantic Pattern Mapping

The new Storybook examples demonstrate these semantic contexts using existing alert types:

| Story Example | Alert Type | Semantic Context | Content |
|--------------|-----------|-----------------|---------|
| Compliance Blocking Issue | `--error` | compliance-block | "This participant's documentation is incomplete. Please review the missing items before proceeding." |
| Missing Required Evidence | `--warning` | missing-evidence | "Required evidence for session #482 has not been submitted. 3 items are overdue." |
| Draft Note Not Submitted | `--warning` | draft-not-submitted | "You have an unsaved draft note for participant J. Doe. Would you like to continue editing?" |
| Supervisor Approval Needed | `--info` | supervisor-approval | "Session note #1023 is ready for supervisor review. Approvals pending: 2." |
| Successful Artifact Generation | `--success` | generation-success | "Progress note for participant K. Smith has been generated and saved successfully." |
| Sync/Connectivity Warning | `--warning` | connectivity-warning | "Unable to sync changes. Your work is saved locally and will sync when connection is restored." |

### Token Usage Contract

| Alert Type | Background Token | Foreground Token | Ratio | AA Normal | AA Large |
|-----------|-----------------|-----------------|-------|-----------|----------|
| success | `--pathable-color-status-success-bg` (#1cae96) | `--pathable-color-status-success-text` (#00365c) | 5.5:1 | PASS | PASS |
| warning | `--pathable-color-status-warning-bg` (#f5a623) | `--pathable-color-status-warning-text` (#00365c) | ~5.8:1 | PASS | PASS |
| error | `--pathable-color-status-danger-bg` (#dc3545) | `--pathable-color-status-danger-text` (#ffffff) | ~4.6:1 | PASS | PASS |
| info | USWDS default | USWDS default | USWDS-tested | PASS | PASS |
| emergency | USWDS default | USWDS default | USWDS-tested | PASS | PASS |

### Notes

- Success and warning alerts use dark text (PathAble Blue #00365c) on their colored backgrounds for optimal contrast
- Error and emergency alerts use white text since red backgrounds have better contrast with white
- The semantic tokens are already defined in `_semantic.scss` and compiled into CSS custom properties — no SCSS changes needed for the alert component wrapper