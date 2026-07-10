# Workflow Card Contract

**File**: `packages/styles/src/pathable-component-wrappers/pathable-card.scss`

## Interface

The card component exposes a new `.pathable-card--workflow` modifier for Pathable-specific workflow cards. The base `.pathable-card` classes remain unchanged.

### CSS Classes

| Class | Purpose | Status |
| ------- | --------- | -------- |
| `.pathable-card` | Base card (USWDS default) | EXISTING |
| `.pathable-card__container` | Card inner container | EXISTING |
| `.pathable-card__header` | Card header | EXISTING |
| `.pathable-card__body` | Card body | EXISTING |
| `.pathable-card__footer` | Card footer | EXISTING |
| `.pathable-card__heading` | Card heading | EXISTING |
| `.pathable-card--workflow` | Pathable workflow card | **NEW** |

### Workflow Card Specification

```scss
.pathable-card--workflow {
  // Surface: Shilling Silver or white
  background-color: var(--pathable-color-surface);
  border: 1px solid var(--pathable-color-border);
  
  // Generous spacing
  padding: var(--usa-spacing-4);  // or equivalent spacing token
}

.pathable-card--workflow .pathable-card__heading {
  color: var(--pathable-color-text);  // PathAble Blue #00365c
  font-family: var(--pathable-font-heading);
  font-weight: var(--pathable-font-weight-bold);
}

.pathable-card--workflow .pathable-card__body {
  color: var(--pathable-color-text);
}

// Optional status signal
.pathable-card--workflow .pathable-card__status {
  color: var(--pathable-color-accent);  // Intelligent Jade #1cae96
}

// Actions and links
.pathable-card--workflow .pathable-card__action {
  color: var(--pathable-color-link);  // Bright Blue Brooks #4899e8
}

// Metadata row
.pathable-card--workflow .pathable-card__meta {
  color: var(--pathable-color-text-muted);  // Tech Teal #015a76
  font-size: var(--usa-font-size-sm);
}

// Focus state
.pathable-card--workflow:focus-within {
  outline: 2px solid var(--pathable-color-focus-ring);
  outline-offset: 2px;
}
```

### Visual Contract

| Element | Token | Value | Notes |
| --------- | ------- | ------- | ------- |
| Surface bg | `--pathable-color-surface` | #ffffff | White card surface |
| Border | `--pathable-color-border` | #dde2e8 | Subtle border |
| Heading | `--pathable-color-text` | #00365c | PathAble Blue |
| Body text | `--pathable-color-text` | #00365c | PathAble Blue |
| Muted text | `--pathable-color-text-muted` | #015a76 | Tech Teal |
| Link/action | `--pathable-color-link` | #4899e8 | Bright Blue Brooks |
| Status signal | `--pathable-color-accent` | #1cae96 | Intelligent Jade (optional) |
| Focus ring | `--pathable-color-focus-ring` | #4497f5 | Strong focus visibility |
| Spacing | `--usa-spacing-4` or equivalent | ~2rem | Generous padding |

### Notes

- The `--workflow` modifier only changes visual properties that differ from the base card. All inherited USWDS card behavior (layout, responsive behavior, etc.) remains unchanged.
- Status signal is rendered as a colored left border, small badge, or icon — depends on Storybook example content
- The focus ring should be applied on `:focus-within` so keyboard-navigating to any interactive element inside the card shows the focus indicator
