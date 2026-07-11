# Data Model: App Feedback Patterns

**Created**: 2026-07-11

**Note**: This feature produces CSS class-based design objects, not persistent data entities. The "data model" describes the CSS class API and the relationship between markup patterns, modifier classes, and design tokens.

## Toast Notification

| Element | CSS Class | Description |
|---------|-----------|-------------|
| Toast Region (container) | `.pathable-toast__region` | Fixed-position container where toasts stack. A single instance per viewport. |
| Toast (individual) | `.pathable-toast` | Individual notification. Flex row: icon, body, optional dismiss/action. |

### Modifiers

| Modifier | CSS Class | Description |
|----------|-----------|-------------|
| Informational | `.pathable-toast--info` | Blue accent — neutral update |
| Progress | `.pathable-toast--progress` | Animated spinner or progress icon |
| Success | `.pathable-toast--success` | Green accent — successful completion |
| Warning | `.pathable-toast--warning` | Yellow/amber accent — caution |
| Error | `.pathable-toast--error` | Red accent — failure or error |
| Dismissible | `.pathable-toast--dismissible` | Adjusts padding to accommodate close button |
| Has Action | `.pathable-toast--has-action` | Adjusts layout when an action link is present |

### Overridable Custom Properties

| Property | Default | Purpose |
|----------|---------|---------|
| `--pathable-toast-inset-block-start` | `var(--pathable-space-4)` | Vertical position from top |
| `--pathable-toast-inset-inline-end` | `var(--pathable-space-4)` | Horizontal position from right |
| `--pathable-toast-max-width` | `28rem` | Maximum width before wrapping |

## Inline Loading Indicator

| Element | CSS Class | Description |
|---------|-----------|-------------|
| Container | `.pathable-loading` | Inline flex row: spinner + text |
| Spinner | `.pathable-loading__spinner` | Rotating SVG icon (24px default) |
| Status Text | `.pathable-loading__text` | Visible text describing what is loading |

### Modifiers

| Modifier | CSS Class | Description |
|----------|-----------|-------------|
| Large | `.pathable-loading--large` | 40px spinner for page-level loading |

## Skeleton Placeholder

| Element | CSS Class | Description |
|---------|-----------|-------------|
| Container | `.pathable-skeleton` | Block-level placeholder with shimmer animation |
| Text line | `.pathable-skeleton--text` | Thin rectangular block simulating a line of text |
| Text (heading) | `.pathable-skeleton--text-heading` | Wider, taller block simulating a heading line |
| Text (body) | `.pathable-skeleton--text-body` | Standard line, typically in multiples (e.g., 3 lines) |
| Avatar | `.pathable-skeleton--avatar` | Circular placeholder (48px default) |
| Card | `.pathable-skeleton--card` | Rectangular block with rounded corners (card outline) |
| Table Row | `.pathable-skeleton--table-row` | Horizontal bar simulating a table row |

### Custom Properties

| Property | Default | Purpose |
|----------|---------|---------|
| `--pathable-skeleton-lines` | `1` | Number of body text lines (for --text-body) |
| `--pathable-skeleton-width` | `100%` | Width override per instance |

## Empty State

| Element | CSS Class | Description |
|---------|-----------|-------------|
| Container | `.pathable-empty-state` | Centered flex column layout |
| Icon | `.pathable-empty-state__icon` | Optional decorative icon (aria-hidden) |
| Heading | `.pathable-empty-state__heading` | Primary message (e.g., "No data yet") |
| Body | `.pathable-empty-state__body` | Explanation text |
| Action | `.pathable-empty-state__action` | Primary call-to-action (e.g., button, link) |

### Variants

| Variant | CSS Class | Description |
|---------|-----------|-------------|
| No Data | `.pathable-empty-state--no-data` | First-time visitor, no content exists |
| No Results | `.pathable-empty-state--no-results` | Search/filter returned nothing |
| Setup Required | `.pathable-empty-state--setup-required` | Action needed before content appears |
| Completed | `.pathable-empty-state--completed` | All items processed, nothing remaining |

## Page Error

| Element | CSS Class | Description |
|---------|-----------|-------------|
| Compact Panel | `.pathable-page-error`, `.pathable-page-error--compact` | Inline panel within a page layout |
| Full Page | `.pathable-page-error--full-page` | Full-viewport centered layout |
| Decorative Icon | `.pathable-page-error__icon` | Optional illustration, aria-hidden |
| Heading | `.pathable-page-error__heading` | Primary error message |
| Explanation | `.pathable-page-error__body` | Secondary explanation text |
| Retry Action | `.pathable-page-error__retry` | Retry/refresh button |
| Navigation Action | `.pathable-page-error__nav` | Alternate navigation link (e.g., "Go home") |
| Not Found | `.pathable-page-error--not-found` | 404-specific messaging variant |
| Access Restricted | `.pathable-page-error--access-restricted` | 403/permissions-specific messaging variant |

## State Transitions

```
[skeleton/loading] ──(data loaded)──> [real content]

[no empty state] ──(no data)──> [empty state variant]

[no page error] ──(error)──> [error panel or full-page error]

[real content] ──(error)──> [error panel (inline)] or [full-page error]
```

Loading/skeleton states transition out via standard CSS (replaced by real content). Error states replace or overlay content. Empty states render in place of content when collections are empty.