# Interface Contracts: Resource Discovery Patterns

**Created**: 2026-07-11

## Public CSS Class API

The following CSS classes are the public contract for consumers.

### Resource Card

```
.pathable-resource-card                   → Card container
  .pathable-resource-card--grid            → Grid layout (default)
  .pathable-resource-card--list            → Horizontal list layout
  .pathable-resource-card--interactive     → Hover/focus-within card emphasis
  .pathable-resource-card--has-action      → Secondary action present
  .pathable-resource-card--no-image        → Fallback icon-only media
  .pathable-resource-card__media           → Thumbnail or category icon
  .pathable-resource-card__title           → Resource name
  .pathable-resource-card__provider        → Source provider
  .pathable-resource-card__summary         → Short description (clamped)
  .pathable-resource-card__badges          → Category/status badges
  .pathable-resource-card__metadata        → Secondary info line
  .pathable-resource-card__rating          → Star rating display
  .pathable-resource-card__source          → Attribution credit
  .pathable-resource-card__link            → Primary card link
  .pathable-resource-card__action          → Secondary action (sibling of link)
```

### Filter Bar

```
.pathable-filter-bar                      → Filter bar container
  .pathable-filter-bar--has-filters        → At least one filter active
  .pathable-filter-bar--drawer-mode        → Show drawer trigger on narrow screens
  .pathable-filter-bar__search             → Search input region
  .pathable-filter-bar__facets             → Facet control group
  .pathable-filter-bar__sort               → Sort control
  .pathable-filter-bar__count              → Result count display
  .pathable-filter-bar__filters            → Active-filter pill container
  .pathable-filter-bar__clear              → Clear-all action
  .pathable-filter-bar__drawer-trigger     → Mobile drawer trigger
```

### Filter Pill

```
.pathable-filter-pill                     → Active-filter chip
  .pathable-filter-pill__label             → Filter value text
  .pathable-filter-pill__dismiss           → Dismiss button
```

### Guided Wayfinder

```
.pathable-wayfinder                       → Wayfinder panel container
  .pathable-wayfinder--raised              → Elevated surface appearance
  .pathable-wayfinder__icon                → Decorative intro icon (aria-hidden)
  .pathable-wayfinder__heading             → Primary title
  .pathable-wayfinder__text                → Explanatory body text
  .pathable-wayfinder__questions           → Question group container
  .pathable-wayfinder__question            → Individual question group
  .pathable-wayfinder__question-label      → Question heading
  .pathable-wayfinder__question-controls   → Choice input group
  .pathable-wayfinder__action              → Primary result action
```

## HTML Contract Examples

### Resource Card (grid, interactive, with action)

```html
<div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive pathable-resource-card--has-action">
  <div class="pathable-resource-card__media">
    <img src="thumbnail.jpg" alt="" aria-hidden="true">
  </div>
  <div class="pathable-resource-card__body">
    <a href="#" class="pathable-resource-card__link">
      <h3 class="pathable-resource-card__title">Resource Title</h3>
    </a>
    <p class="pathable-resource-card__provider">Provider Name</p>
    <p class="pathable-resource-card__summary">Brief description of the resource content...</p>
    <div class="pathable-resource-card__badges">
      <span class="pathable-tag">Category</span>
      <span class="pathable-tag">Active</span>
    </div>
    <div class="pathable-resource-card__metadata">Updated 2 days ago</div>
    <div class="pathable-resource-card__rating">★★★★☆</div>
    <p class="pathable-resource-card__source">Source: Attribution</p>
  </div>
  <button class="pathable-resource-card__action pathable-icon-button pathable-icon-button--bare"
          aria-label="Save resource">☆</button>
</div>
```

### Resource Card (list layout, no image, no action)

```html
<div class="pathable-resource-card pathable-resource-card--list pathable-resource-card--no-image">
  <div class="pathable-resource-card__media" aria-hidden="true">
    <svg><!-- category fallback icon --></svg>
  </div>
  <div class="pathable-resource-card__body">
    <a href="#" class="pathable-resource-card__link">
      <h3 class="pathable-resource-card__title">Another Resource</h3>
    </a>
    <p class="pathable-resource-card__provider">Provider Name</p>
    <p class="pathable-resource-card__summary">Description text...</p>
  </div>
</div>
```

### Filter Bar (with active filters)

```html
<div class="pathable-filter-bar pathable-filter-bar--has-filters">
  <input class="pathable-filter-bar__search" type="search" placeholder="Search resources...">
  <div class="pathable-filter-bar__facets">
    <select aria-label="Category">
      <option>All categories</option>
      <option>Training</option>
    </select>
  </div>
  <div class="pathable-filter-bar__sort">
    <select aria-label="Sort by">
      <option>Most relevant</option>
      <option>Newest</option>
    </select>
  </div>
  <div class="pathable-filter-bar__count" role="status" aria-live="polite">
    12 results
  </div>
  <div class="pathable-filter-bar__filters">
    <span class="pathable-filter-pill">
      <span class="pathable-filter-pill__label">Category: Training</span>
      <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Category: Training">&times;</button>
    </span>
  </div>
  <button class="pathable-filter-bar__clear">Clear all</button>
</div>
```

### Filter Bar (drawer mode on mobile)

```html
<div class="pathable-filter-bar pathable-filter-bar--drawer-mode">
  <input class="pathable-filter-bar__search" type="search" placeholder="Search...">
  <div class="pathable-filter-bar__count" role="status" aria-live="polite">12 results</div>
  <button class="pathable-filter-bar__drawer-trigger" aria-label="Open filters">Filters</button>
  <div class="pathable-filter-bar__filters">
    <span class="pathable-filter-pill">
      <span class="pathable-filter-pill__label">Category: Training</span>
      <button class="pathable-filter-pill__dismiss" aria-label="Remove filter: Category: Training">&times;</button>
    </span>
  </div>
</div>
```

### Guided Wayfinder

```html
<div class="pathable-wayfinder pathable-wayfinder--raised" role="region" aria-label="Find the right resource">
  <svg class="pathable-wayfinder__icon" aria-hidden="true"><!-- decorative icon --></svg>
  <h2 class="pathable-wayfinder__heading">What are you looking for?</h2>
  <p class="pathable-wayfinder__text">Answer a few questions to discover the best resources for your needs.</p>
  <div class="pathable-wayfinder__questions">
    <fieldset class="pathable-wayfinder__question">
      <legend class="pathable-wayfinder__question-label">Who are you helping?</legend>
      <div class="pathable-wayfinder__question-controls">
        <label><input type="radio" name="audience" value="self"> Myself</label>
        <label><input type="radio" name="audience" value="team"> My team</label>
        <label><input type="radio" name="audience" value="client"> A client</label>
      </div>
    </fieldset>
    <fieldset class="pathable-wayfinder__question">
      <legend class="pathable-wayfinder__question-label">What do you need?</legend>
      <div class="pathable-wayfinder__question-controls">
        <label><input type="radio" name="need" value="learn"> Training & education</label>
        <label><input type="radio" name="need" value="assess"> Assessment & tools</label>
        <label><input type="radio" name="need" value="support"> Support & guidance</label>
      </div>
    </fieldset>
  </div>
  <button class="pathable-wayfinder__action pathable-button">Show results</button>
</div>
```

## SCSS Import Contract

```scss
// Selective import — single pattern
@forward 'pathable-resource-card';

// Bundle import — discovery group
@forward 'pathable-discovery';

// All-in-one import
@forward 'pathable-all';
```

## CSS Custom Property Contract

Consumers may override these per-instance custom properties via inline `style` attribute or their own CSS:

```css
--pathable-resource-card-summary-lines  /* Default: 3 — max lines for clamped description */
--pathable-resource-card-media-width    /* Default: 160px — media width in list layout */
--pathable-resource-card-media-height   /* Default: 120px — media height in grid layout */
```

## Semantic Role Contract

| Pattern | Default role | When to change |
|---------|-------------|----------------|
| Resource card | No special role on container | Add `role="article"` when cards represent distinct content items |
| Resource card link | Standard `<a>` semantics | No change needed |
| Resource card action | Standard `<button>` semantics | Use `aria-label` to describe action |
| Filter bar search | `type="search"` input | No change needed |
| Filter bar result count | `role="status"` with `aria-live="polite"` | Change to `aria-live="assertive"` for critical count changes |
| Filter pill dismiss | Standard `<button>` with `aria-label` | No change needed |
| Wayfinder panel | `role="region"` with `aria-label` | No change needed |
| Wayfinder question | `<fieldset>` with `<legend>` | No change needed |
| Wayfinder icon | `aria-hidden="true"` | No change needed |