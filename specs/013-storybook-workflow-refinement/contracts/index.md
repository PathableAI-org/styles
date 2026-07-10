# Contracts: Storybook Workflow-Context Refinement

**Created**: 2026-07-09

**Feature**: [spec.md](../spec.md)

## 1. Interaction Model Classification Contract

Every Storybook story MUST include the following annotation in its `parameters.docs.description` section:

```
**Interaction Model**: [css-only | requires-uswds-js | requires-app-state | not-yet-complete]

// If requires-uswds-js:
**USWDS JS Behaviors**: [comma-separated list of behaviors, e.g., "open/close, focus trapping"]
**Consumers must**: Import `@pathable/styles/js` to enable interactive behavior.

// If requires-app-state:
**App State to Manage**: [description of state, e.g., "selected option, validation errors"]
**Consumers must**: Provide state management for [list of state properties].

// If css-only:
**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.
```

### Example (Modal — Requires USWDS JS)

```
**Interaction Model**: Requires USWDS JS
**USWDS JS Behaviors**: open/close, focus trapping, keyboard navigation (Escape to close)
**Consumers must**: Import `@pathable/styles/js` to enable interactive behavior.
**App State to Manage**: Visibility (open/closed), focus management after close
```

### Example (Checkbox — CSS-only + app state)

```
**Interaction Model**: CSS-only
**App State to Manage**: checked/unchecked state, validation errors
**Consumers must**: Provide checked state and validation logic in application framework.
```

---

## 2. Workflow-Intent Button Variant Mapping

| Intent Class | Implementation | Background | Text Color | WCAG AA |
|---|---|---|---|---|
| `.pathable-button--save` | `@extend .pathable-button--secondary` | `--pathable-color-action-secondary-bg` (#1cae96) | `--pathable-color-on-accent` (#001a33) | 5.8:1 |
| `.pathable-button--continue` | `@extend .pathable-button--primary` | `--pathable-color-action-primary-bg` (#00365c) | White | > 7:1 |
| `.pathable-button--review` | `@extend .pathable-button--accent-cool` | `--pathable-color-link` (#4899e8) | `--pathable-color-on-accent` (#001a33) | 5.8:1 |
| `.pathable-button--destructive` | `@extend .usa-button` + custom | `--pathable-color-danger` (#b50909) | White | > 7:1 |
| `.pathable-button--low-emphasis` | `@extend .pathable-button--base` | `--pathable-color-bg` (#dde2e8) | `--pathable-color-text` (#00365c) | > 10:1 |

---

## 3. Brand CSS Custom Property — Removed Legacy Short Names

| Removed Name | Canonical Replacement |
|---|---|
| `--pathable-blue` | `--pathable-brand-pathable-blue` |
| `--intelligent-jade` | `--pathable-brand-intelligent-jade` |
| `--bright-blue-brooks` | `--pathable-brand-bright-blue-brooks` |
| `--tech-teal` | `--pathable-brand-tech-teal` |
| `--lived-in-lime` | `--pathable-brand-lived-in-lime` |
| `--shilling-silver` | `--pathable-brand-shilling-silver` |

**Notes**:
- The Sass variables (`$pathable-blue`, `$intelligent-jade`, etc.) are internal to the package and remain valid for use within package SCSS.
- Only the CSS custom property output (`:root { --intelligent-jade: ... }`) was removed. Consumers must migrate to `--pathable-brand-*` equivalents.

---

## 4. Story Workflow Copy Contract

### Header

Replace navigation labels:
- `"Site Title"` → `"PathAble"` or `"CoachBridge"`
- `"Nav Item 1"` → `"Participants"`
- `"Nav Item 2"` → `"Coaching Sessions"`
- `"Nav Item 3"` → `"Support Activities"`

### Banner

Replace government copy with Pathable-relevant contexts:
- "This is an official government website" → coaching session reminder, compliance notification, or goal milestone announcement
- Update "Learn more" link text appropriately

### Combo Box

Replace generic options with realistic data:
- `"Option 1"` → `"Goal Setting"`
- `"Option 2"` → `"Skills Assessment"`
- `"Option 3"` → `"Job Placement"`
- Or use participant names: `"Alex Rivera"`, `"Jordan Kim"`, `"Sam Patel"`

### Modal

Replace generic copy with workflow copy:
- `"Modal Title"` → `"Add Support Activity"` or `"Confirm Goal Approval"`
- Body text → relevant workflow description
- `"Confirm"` / `"Cancel"` → Intent-specific labels

### Button (workflow variants)

Add new story examples for workflow-intent variants:
- `.pathable-button--save` → `"Save Coaching Note"`
- `.pathable-button--continue` → `"Continue to Review"`
- `.pathable-button--review` → `"Review Compliance"`
- `.pathable-button--destructive` → `"Delete Activity"`
- `.pathable-button--low-emphasis` → `"Cancel"`