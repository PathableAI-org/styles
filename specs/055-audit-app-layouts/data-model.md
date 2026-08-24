# Data Model: Audit of Real Application Layouts

**Feature**: 055-audit-app-layouts
**Date**: 2026-08-24

## Overview

This feature is a research and documentation effort — it produces no code or database schema. The data model describes the structure of the **audit findings**, which are the only persistent artifacts.

## Entities

### Pattern

The core entity discovered and recorded by the audit.

| Field | Type | Description |
|-------|------|-------------|
| `name` | string | Short descriptive label (e.g., "Full-width Centered Container") |
| `category` | string | Intent category (e.g., "Page Shell", "Form Layout", "Action Grouping") — determined by the pattern's purpose, not predefined |
| `frequency` | integer | Raw count of occurrences across all searched application repositories |
| `repoCount` | integer | Number of distinct application repositories where the pattern appears |
| `intent` | string | Semantic description of what the pattern expresses |
| `classification` | enum: `reusable`, `domain-specific`, `incidental` | Whether the pattern belongs in `@pathable/react`, belongs in an application, or is a copy-paste artifact |
| `canonicalForm` | string | The representative code snippet (className string or JSX structure) |
| `variations` | string[] | Near-identical forms grouped under this canonical pattern |
| `apiSketch` | string? | For reusable patterns: proposed component name and prop signature. Null for other classifications. |
| `scssContractStatus` | string? | For reusable patterns: "exists" with class names or "needs creation". Null for other classifications. |
| `notes` | string | Any additional context — why reusable/domain-specific, limitations of frequency count |

### Relationships

- A `Pattern` belongs to one `Category`.
- A `Pattern` with `classification = reusable` has exactly one `apiSketch` and one `scssContractStatus`.
- A `Pattern` with `classification != reusable` has `apiSketch = null` and `scssContractStatus = null`.

### State Transitions

Patterns have no lifecycle states — they are discovered, classified, and recorded. The classification is a final judgment for a given audit snapshot.

## Deliverable File Format

The audit deliverable uses Markdown sections mirroring this model:

```
## Category: {category}

### Pattern: {name}
- **Frequency**: {frequency} occurrences across {repoCount} applications
- **Intent**: {intent}
- **Classification**: {classification}
- **Canonical form**: {canonicalForm}
- **Variations**: {variations as bullet list} (if any)
- **API sketch**: {apiSketch} (reusable only)
- **SCSS contract**: {scssContractStatus} (reusable only)
- **Notes**: {notes}
```