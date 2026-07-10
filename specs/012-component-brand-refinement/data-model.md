# Data Model: Component-to-Brand Mapping

**Phase 1** — Domain model for component brand properties and their relationships.

## Entity: ButtonVariant

A specific visual treatment of the button component with defined brand colors.

| Field | Type | Values | Description |
| ------- | ------ | -------- | ------------- |
| name | string | primary, secondary, accent-cool, accent-warm, outline, inverse, base, big, unstyled | USWDS variant name |
| brandColor | string | PathAble Blue, Intelligent Jade, Bright Blue Brooks, Tech Teal, Lived-In Lime, Shilling Silver | Pathable brand color |
| semanticToken | string | `--pathable-color-action-primary-bg`, `--pathable-color-action-secondary-bg`, etc. | CSS custom property |
| foregroundToken | string | `--pathable-color-action-primary-text`, etc. | Text color token |
| wcagAANormal | boolean | true/false | Passes WCAG AA for normal text |
| wcagAALarge | boolean | true/false | Passes WCAG AA for large text |
| role | string | primary-cta, secondary-action, supportive, tertiary, surface | Design intent hierarchy |

**Relationships**: A button component MAY have multiple variants. Each variant maps to exactly one brand color as primary expression.

## Entity: WorkflowCard

A Pathable-specific card pattern for staff workflow presentation.

| Field | Type | Description |
| ------- | ------ | ------------- |
| surfaceToken | string | `--pathable-color-surface` (#ffffff) or `--pathable-color-bg` (#dde2e8) |
| headingColor | string | `--pathable-color-text` (#00365c, PathAble Blue) |
| statusToken | string (optional) | `--pathable-color-accent` or `--pathable-color-success` (#1cae96, Intelligent Jade) |
| linkColor | string | `--pathable-color-link` (#4899e8, Bright Blue Brooks) |
| metadataColor | string | `--pathable-color-text-muted` (#015a76, Tech Teal) |
| focusColor | string | `--pathable-color-focus-ring` (#4497f5) |
| spacing | tokens | USWDS spacing scale tokens for generous padding |

**State transitions**: A workflow card may transition between states: default → focused, default → hovered. Color transitions are managed via USWDS native `:hover` and `:focus` pseudo-classes with the focus-ring token.

## Entity: SemanticAlert

An alert component with Pathable-specific semantic meaning.

| Field | Type | Values | Description |
| ------- | ------ | -------- | ------------- |
| type | string | success, warning, error, info, emergency | USWDS alert type |
| semanticContext | string | compliance-block, missing-evidence, draft-not-submitted, supervisor-approval, generation-success, connectivity-warning | Pathable workflow context |
| backgroundToken | string | `--pathable-color-status-*-bg` | Background color |
| foregroundToken | string | `--pathable-color-status-*-text` | Text color |
| accessible | boolean | true/false | Passes WCAG AA contrast |

## Entity: WorkflowPattern

A Storybook example demonstrating a component in a Pathable staff workflow context.

| Field | Type | Values | Description |
| ------- | ------ | -------- | ------------- |
| name | string | session-note, participant-goal, intervention-checklist, progress-signal, compliance-field, supervisor-comment | Pattern identifier |
| primaryComponent | string | textarea, select, checkbox, radio/range, input, textarea | Main form component |
| relatedComponents | string[] | form, label, hint, error-message, validation, fieldset, legend | Supporting components |
| workflowArea | string | session-guidance, compliance, approval | Pathable domain |
| requiresErrorState | boolean | true/false | Whether the pattern includes error recovery |

## Entity: NavigationItem

A Pathable staff workflow navigation label used in navigation component stories.

| Field | Type | Values | Description |
| ------- | ------ | -------- | ------------- |
| label | string | Today's Sessions, Participants, Approvals, Reports, Templates, Settings | Display text |
| section | string | primary, secondary, tertiary | Navigation section |
| icon | string (optional) | — | Icon identifier if applicable |
| order | number | 1-6 | Display order |

## Relationship Diagram

```
ButtonComponent
  ├── hasVariant ──▶ ButtonVariant
  │                   ├── mapsTo ──▶ BrandColor
  │                   └── references ──▶ SemanticToken
  │
CardComponent
  ├── hasModifier ──▶ WorkflowCard
  │                    ├── references ──▶ SemanticToken
  │                    └── displays ──▶ StatusSignal
  │
AlertComponent
  └── hasType ──▶ SemanticAlert
                   ├── references ──▶ StatusToken
                   └── hasContext ──▶ WorkflowPattern context

FormComponents (group)
  └── demonstrates ──▶ WorkflowPattern
                        └── covers ──▶ WorkflowArea

NavigationComponent
  └── shows ──▶ NavigationItem
```

## Validation Rules

1. **FR-002 constraint**: Primary button background MUST have contrast ratio ≥ 4.5:1 with its foreground text. (PathAble Blue #00365c on white #ffffff = 14.3:1 — passes)
2. **FR-003 constraint**: Secondary button MUST only use Intelligent Jade background if contrast with foreground ≥ 4.5:1. (Intelligent Jade #1cae96 with PathAble Blue text #00365c = 5.5:1 — passes; white text = 2.25:1 — fails)
3. **FR-005 constraint**: Workflow card must specify all seven visual properties (surface, heading, status, link, metadata, spacing, focus) or the variant is incomplete
4. **FR-008 constraint**: Error state examples must include human-readable recovery guidance — this is a content requirement, not structural
