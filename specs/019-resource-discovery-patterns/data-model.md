# Data Model: Resource Discovery Patterns

**Created**: 2026-07-11

**Note**: This feature produces CSS class-based design objects, not persistent data entities. The "data model" describes the CSS class API and the relationship between markup patterns, modifier classes, and design tokens.

## Resource Card

| Element | CSS Class | Description |
|---------|-----------|-------------|
| Card Container | `.pathable-resource-card` | Primary card wrapper — flex column (grid) or flex row (list) |
| Media / Icon | `.pathable-resource-card__media` | Thumbnail or category icon slot — uses fallback styling when empty |
| Title | `.pathable-resource-card__title` | Resource name, uses `--pathable-font-heading` token |
| Provider | `.pathable-resource-card__provider` | Source provider name, muted text |
| Summary | `.pathable-resource-card__summary` | Short description — clamped to configurable lines |
| Badges | `.pathable-resource-card__badges` | Category/status badge container |
| Metadata | `.pathable-resource-card__metadata` | Secondary info line (e.g., date, version) |
| Rating | `.pathable-resource-card__rating` | Star rating display — hidden when absent |
| Source | `.pathable-resource-card__source` | Attribution credit line |
| Primary Link | `.pathable-resource-card__link` | Main card link — wraps title and optionally summary |
| Secondary Action | `.pathable-resource-card__action` | Save/favorite/etc. — sibling of link, independent focus |

### Modifiers

| Modifier | CSS Class | Description |
|----------|-----------|-------------|
| Grid layout | `.pathable-resource-card--grid` | Media above content, multi-column compatible |
| List layout | `.pathable-resource-card--list` | Media beside content, single-column row |
| Interactive | `.pathable-resource-card--interactive` | Enables hover/focus-within emphasis on card surface |
| Has action | `.pathable-resource-card--has-action` | Adjusts layout padding when secondary action present |
| No image | `.pathable-resource-card--no-image` | Fallback icon-only media area |

### Overridable Custom Properties

| Property | Default | Purpose |
|----------|---------|---------|
| `--pathable-resource-card-summary-lines` | `3` | Max lines for clamped description |
| `--pathable-resource-card-media-width` | `160px` | Media region width in list layout |
| `--pathable-resource-card-media-height` | `120px` | Media region height in grid layout |

## Filter Bar

| Element | CSS Class | Description |
|---------|-----------|-------------|
| Container | `.pathable-filter-bar` | Composite filter bar wrapper — flex row/column |
| Search | `.pathable-filter-bar__search` | Search input region |
| Facets | `.pathable-filter-bar__facets` | Facet control group (checkboxes, dropdowns, chips) |
| Sort | `.pathable-filter-bar__sort` | Sort control region |
| Result Count | `.pathable-filter-bar__count` | Visible result count text |
| Active Filters | `.pathable-filter-bar__filters` | Container for active-filter pills |
| Clear All | `.pathable-filter-bar__clear` | Clear-all action |
| Drawer Trigger | `.pathable-filter-bar__drawer-trigger` | Mobile-only trigger for consumer-provided filter drawer |

### Modifiers

| Modifier | CSS Class | Description |
|----------|-----------|-------------|
| Has filters | `.pathable-filter-bar--has-filters` | Applied when at least one filter is active |
| Drawer mode | `.pathable-filter-bar--drawer-mode` | Shows drawer trigger, hides facet/sort inline controls on narrow screens |

## Filter Pill

| Element | CSS Class | Description |
|---------|-----------|-------------|
| Pill | `.pathable-filter-pill` | Removable active-filter chip |
| Label | `.pathable-filter-pill__label` | Filter value text |
| Dismiss | `.pathable-filter-pill__dismiss` | Removable button with visible focus and accessible label |

## Guided Wayfinder

| Element | CSS Class | Description |
|---------|-----------|-------------|
| Container | `.pathable-wayfinder` | Raised panel — flex column with surface styling |
| Icon | `.pathable-wayfinder__icon` | Decorative intro icon (`aria-hidden="true"`) |
| Heading | `.pathable-wayfinder__heading` | Primary title text |
| Text | `.pathable-wayfinder__text` | Explanatory body text |
| Questions | `.pathable-wayfinder__questions` | Container for question groups — flex row (wide) / column (narrow) |
| Question Group | `.pathable-wayfinder__question` | Individual question with label + controls — flex column |
| Question Label | `.pathable-wayfinder__question-label` | Question heading text |
| Question Controls | `.pathable-wayfinder__question-controls` | Choice input group (radios, checkboxes, chips) |
| Action | `.pathable-wayfinder__action` | Primary result action button |

### Modifiers

| Modifier | CSS Class | Description |
|----------|-----------|-------------|
| Raised | `.pathable-wayfinder--raised` | Default appearance — elevated surface with shadow |

## State Transitions

```
[no resource cards] ──(data available)──> [resource card(s) populated]

[resource cards hidden] ──(loading)──> [.pathable-skeleton children visible]

[populated cards] ──(filter changes)──> [fewer or different cards shown]

[filtered cards] ──(zero results)──> [.pathable-empty-state--no-results visible]

[filter applied] ──(filter removed)──> [.pathable-filter-pill removed from bar]

[wayfinder idle] ──(user selects choices)──> [wayfinder with selections visible]
```

Loading/empty states for the resource grid reuse the existing `.pathable-skeleton` and `.pathable-empty-state` patterns defined elsewhere.