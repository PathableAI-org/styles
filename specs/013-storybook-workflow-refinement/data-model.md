# Data Model: Storybook Workflow-Context Refinement

**Created**: 2026-07-09

**Feature**: [spec.md](spec.md)

## Entities

### StoryFile

A `.stories.js` file under `packages/styles/src/stories/` that documents a USWDS component or utility in the PathAble styles package.

| Field | Type | Description |
| --- | --- | --- |
| `path` | String | Relative path from `packages/styles/src/stories/` |
| `componentName` | String | Human-readable component name (e.g., "Header", "Banner") |
| `category` | Enum | `brand`, `basic`, `communication`, `form-controls`, `layout`, `navigation`, `utilities` |
| `interactionModel` | Enum | `css-only`, `requires-uswds-js`, `requires-app-state`, `not-yet-complete` |
| `needsWorkflowCopy` | Boolean | Whether this story uses generic placeholder text that should be replaced |
| `hasJsNote` | Boolean | Whether the story already documents USWDS JS requirements |
| `workflowLabels` | String[] | Product-specific labels used in this story after refinement |

### ButtonVariant

A CSS class extending `.usa-button` with a PathAble brand opinion.

| Field | Type | Description |
| --- | --- | --- |
| `className` | String | CSS class name (e.g., `.pathable-button--save`) |
| `baseVariant` | String | USWDS variant it extends (e.g., `--secondary`, `--primary`) |
| `semanticToken` | String | Brand semantic token used for background (e.g., `--pathable-color-danger`) |
| `workflowIntent` | String | Human description of when to use this variant |
| `wcagAARating` | Number | Contrast ratio for text on this variant's background |

### BrandColorProperty

A CSS custom property defined in `_colors.scss`.

| Field | Type | Description |
| --- | --- | --- |
| `name` | String | Property name (e.g., `--intelligent-jade`) |
| `value` | Hex | Color value (e.g., `#1cae96`) |
| `namespace` | Enum | `short` (removed), `brand-prefixed` (canonical) |
| `canonicalName` | String | The replacement property name |
| `status` | Enum | `active`, `removed` |
| `migrationNotice` | String | Migration instruction for consumers |

### InteractionModel

A standardized annotation describing how much behavior a component wrapper provides.

| Value | Description |
| --- | --- |
| `css-only` | Visual styling works without JavaScript. No interactive behavior. |
| `requires-uswds-js` | USWDS JavaScript (`@pathable/styles/js`) needed for interactivity. |
| `requires-app-state` | Consuming app must manage state (open/close, values, validation). |
| `not-yet-complete` | Wrapper has known behavioral gaps from full USWDS component. |

## State Transitions

### Story File Refinement

```
[Generic copy] → [Annotate interaction model] → [Replace with workflow copy] → [Verified in Storybook]
```

### Button Variant Addition

```
[Design mapping] → [Implement SCSS class] → [Add Storybook example] → [Verify WCAG AA contrast]
```

### CSS Property Deprecation

```
[Identify canonical name] → [Add deprecation comment] → [Update documentation] → [Future: remove in major version]
```

## Validation Rules

1. Every story file must have exactly one `interactionModel` value.
2. Every story file marked `requires-uswds-js` must document which USWDS JS behaviors are needed.
3. Every story file marked `requires-app-state` must describe what state the app must manage.
4. Every workflow-intent button variant must satisfy WCAG 2.1 AA contrast (minimum 4.5:1 for normal text, 3:1 for large text).
5. Deprecated CSS custom properties must remain functional — only annotation comments change.
6. No visual styling may change for stories — only copy/labels and documentation notes.
