# Button Brand Contract

**File**: `packages/styles/src/pathable-component-wrappers/pathable-button.scss`

## Interface

The button component exposes SCSS classes and CSS custom properties that consumers use to render branded buttons.

### CSS Classes (unchanged)

| Class | Purpose | Status |
| ------- | --------- | -------- |
| `.pathable-button` | Base button | EXISTING |
| `.pathable-button--primary` | Primary CTA | NEW (alias for default) |
| `.pathable-button--secondary` | Secondary action | EXISTING, BRANDED |
| `.pathable-button--accent-cool` | Supportive/tertiary action | EXISTING, BRANDED |
| `.pathable-button--accent-warm` | Alternative accent | EXISTING |
| `.pathable-button--outline` | Outline variant | EXISTING |
| `.pathable-button--inverse` | Inverse variant | EXISTING |
| `.pathable-button--base` | Base/minimal variant | EXISTING, BRANDED |
| `.pathable-button--big` | Large button | EXISTING |
| `.pathable-button--unstyled` | Transparent button | EXISTING |

### Brand Mapping Contract

```
.pathable-button                              → PathAble Blue bg, white text (primary CTA)
.pathable-button--secondary                   → Intelligent Jade bg, PathAble Blue text
.pathable-button--accent-cool                 → Bright Blue Brooks bg, dark text
.pathable-button--base                        → Shilling Silver bg, PathAble Blue text
```

### CSS Custom Properties Consumed

| Property | Used By | Source |
| ---------- | --------- | -------- |
| `--pathable-color-action-primary-bg` | Primary button bg | `_semantic.scss` |
| `--pathable-color-action-primary-text` | Primary button text | `_semantic.scss` |
| `--pathable-color-action-secondary-bg` | Secondary button bg | `_semantic.scss` |
| `--pathable-color-action-secondary-text` | Secondary button text | `_semantic.scss` |

### Contrast Contract

| Variant | Foreground | Background | Ratio | AA Normal | AA Large |
| --------- | ----------- | ----------- | ------- | ----------- | ---------- |
| Primary | white (#ffffff) | PathAble Blue (#162e51 USWDS) | 13.2:1 | PASS | PASS |
| Secondary | PathAble Blue (#00365c) | Intelligent Jade (#1cae96) | 5.5:1 | PASS | PASS |
| Accent-cool | PathAble Blue (#00365c) | Bright Blue Brooks (#58b4ff USWDS) | ~3.8:1 | FAIL | PASS |

### Notes

- Add `.pathable-button--primary` as an explicit alias for the default state so consumers can be explicit about intent
- The base `.pathable-button` retains PathAble Blue styling — this is the opinionated default
- Lived-In Lime buttons must be explicitly contrast-tested and documented if used; not provided as a built-in variant
