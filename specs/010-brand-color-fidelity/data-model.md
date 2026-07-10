# Data Model: Brand Color Fidelity & Token Architecture

## Token Naming Convention

All tokens follow the established pattern: `--pathable-{namespace}-{category}-{role}-{property}`

| Namespace | Category | Pattern | Examples |
| ----------- | ---------- | --------- | --------- |
| `--pathable-brand-` | (flat) | `--pathable-brand-{name}` | `--pathable-brand-pathable-blue`, `--pathable-brand-intelligent-jade` |
| `--pathable-color-` | `action` | `--pathable-color-action-{role}-{property}` | `--pathable-color-action-primary-bg`, `--pathable-color-action-primary-text` |
| `--pathable-color-` | `status` | `--pathable-color-status-{name}-{property}` | `--pathable-color-status-success-bg`, `--pathable-color-status-danger-text` |
| `--pathable-color-` | `workflow` | `--pathable-color-workflow-{state}` | `--pathable-color-workflow-active`, `--pathable-color-workflow-complete` |

## Entity: Brand Fidelity Tokens

Represents the exact brand hex values, distinguished from USWDS-mapped values.

| Field | Token Name | Value | Type |
| ------- | ----------- | ------- | ------ |
| PathAble Blue | `--pathable-brand-pathable-blue` | `#00365c` | hex color |
| Intelligent Jade | `--pathable-brand-intelligent-jade` | `#1cae96` | hex color |
| Bright Blue Brooks | `--pathable-brand-bright-blue-brooks` | `#4899e8` | hex color |
| Tech Teal | `--pathable-brand-tech-teal` | `#015a76` | hex color |
| Lived-In Lime | `--pathable-brand-lived-in-lime` | `#d3ff66` | hex color |
| Shilling Silver | `--pathable-brand-shilling-silver` | `#dde2e8` | hex color |

**Validation**: All values must match the exact hex values from BRAND_RULES.md.
**Source of truth**: `packages/styles/src/BRAND_RULES.md` color palette table.

## Entity: Action Role Tokens

| Field | Token Name | Value | Source |
| ------- | ----------- | ------- | -------- |
| Primary action background | `--pathable-color-action-primary-bg` | `#162e51` | `blue-warm-80v` (PathAble Blue mapped) |
| Primary action text | `--pathable-color-action-primary-text` | `#ffffff` | White |
| Secondary action background | `--pathable-color-action-secondary-bg` | `#1dc2ae` | `mint-cool-30v` (Intelligent Jade mapped) |
| Secondary action text | `--pathable-color-action-secondary-text` | `#162e51` | PathAble Blue mapped |

**Validation**: Primary bg+text must have contrast ratio >= 4.5:1 (13.60:1 verified). Secondary bg+text must have contrast ratio >= 4.5:1 (6.08:1 verified).

## Entity: Status Role Tokens

| Field | Token Name | Value | Source |
| ------- | ----------- | ------- | -------- |
| Success background | `--pathable-color-status-success-bg` | `#1dc2ae` | `mint-cool-30v` (Intelligent Jade mapped) |
| Success text | `--pathable-color-status-success-text` | `#162e51` | PathAble Blue mapped |
| Warning background | `--pathable-color-status-warning-bg` | `#f5a623` | `gold-20v` |
| Warning text | `--pathable-color-status-warning-text` | `#162e51` | PathAble Blue mapped |
| Danger background | `--pathable-color-status-danger-bg` | `#dc3545` | `red-60v` (existing) |
| Danger text | `--pathable-color-status-danger-text` | `#ffffff` | White |

**Validation**: Each bg+text pair must have contrast ratio >= 4.5:1. Success: 6.08:1 verified. Warning: 6.71:1 verified. Danger: 4.53:1 verified.

## Entity: Workflow State Tokens

| Field | Token Name | Value | Source |
| ------- | ----------- | ------- | -------- |
| Active state | `--pathable-color-workflow-active` | `#58b4ff` | `blue-30v` (Bright Blue Brooks mapped) |
| Complete state | `--pathable-color-workflow-complete` | `#1dc2ae` | `mint-cool-30v` (Intelligent Jade mapped) |
| Blocked state | `--pathable-color-workflow-blocked` | `#dc3545` | `red-60v` (existing) |

**Validation**: Workflow tokens are visual indicators, not text backgrounds. No contrast requirements apply directly. Designers should use these with appropriate backgrounds.

## State Transitions

N/A — tokens are static values. No state transitions.

## Relationships

- `--pathable-color-status-success-bg` = `--pathable-color-action-secondary-bg` = `--pathable-color-workflow-complete` = `--pathable-color-accent` = `#1dc2ae` (Intelligent Jade mapped)
- `--pathable-color-status-danger-bg` = `--pathable-color-workflow-blocked` = `--pathable-color-danger` = `#dc3545`
- `--pathable-color-action-primary-bg` = `--pathable-color-text` = `#162e51` (PathAble Blue mapped)

These relationships should be documented in the Brand / Color Usage page and in SCSS comments.
