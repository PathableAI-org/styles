# Quickstart: Resource Discovery Patterns

**Created**: 2026-07-11

## Quick Reference

| Pattern | SCSS File | Import Path | Bundle Package |
|---------|-----------|-------------|----------------|
| Resource Card | `pathable-resource-card.scss` | `@forward 'pathable-resource-card'` | `pathable-discovery` |
| Filter Bar | `pathable-filter-bar.scss` | `@forward 'pathable-filter-bar'` | `pathable-discovery` |
| Filter Pill | `pathable-filter-pill.scss` | `@forward 'pathable-filter-pill'` | `pathable-discovery` |
| Wayfinder | `pathable-wayfinder.scss` | `@forward 'pathable-wayfinder'` | `pathable-discovery` |
| Discovery Bundle | `pathable-discovery.scss` | `@forward 'pathable-discovery'` | N/A |
| All-in-one | `pathable-all.scss` | `@forward 'pathable-all'` | N/A |

## Using in Markup

### Basic resource card grid

```html
<div class="pathable-card-grid">
  <div class="pathable-resource-card pathable-resource-card--grid pathable-resource-card--interactive">
    <div class="pathable-resource-card__media">
      <img src="thumb.jpg" alt="" aria-hidden="true">
    </div>
    <div class="pathable-resource-card__body">
      <a href="#" class="pathable-resource-card__link">
        <h3 class="pathable-resource-card__title">Resource Title</h3>
      </a>
      <p class="pathable-resource-card__provider">Provider Name</p>
      <p class="pathable-resource-card__summary">Description...</p>
    </div>
  </div>
</div>
```

### Filter bar with active filters

```html
<div class="pathable-filter-bar pathable-filter-bar--has-filters">
  <input class="pathable-filter-bar__search" type="search" placeholder="Search...">
  <div class="pathable-filter-bar__count" role="status" aria-live="polite">12 results</div>
  <div class="pathable-filter-bar__filters">
    <span class="pathable-filter-pill">
      <span class="pathable-filter-pill__label">Category: Training</span>
      <button class="pathable-filter-pill__dismiss" aria-label="Remove filter">&times;</button>
    </span>
  </div>
  <button class="pathable-filter-bar__clear">Clear all</button>
</div>
```

### Wayfinder panel

```html
<div class="pathable-wayfinder pathable-wayfinder--raised" role="region" aria-label="Find the right resource">
  <h2 class="pathable-wayfinder__heading">What are you looking for?</h2>
  <p class="pathable-wayfinder__text">Answer a few questions to find the right resources.</p>
  <div class="pathable-wayfinder__questions">
    <fieldset class="pathable-wayfinder__question">
      <legend class="pathable-wayfinder__question-label">Who are you helping?</legend>
      <div class="pathable-wayfinder__question-controls">
        <label><input type="radio" name="audience" value="self"> Myself</label>
        <label><input type="radio" name="audience" value="team"> My team</label>
      </div>
    </fieldset>
  </div>
  <button class="pathable-wayfinder__action pathable-button">Show results</button>
</div>
```

## Validation Checklist

- [ ] Resource cards render correctly in both grid and list layout
- [ ] Long descriptions are clamped without hiding title or status badges
- [ ] Secondary action receives independent focus state (tab to card link, tab again to action)
- [ ] Missing image/rating/status fallbacks display correctly
- [ ] Filter bar controls wrap without horizontal overflow below 1024px
- [ ] Active filter pills are individually removable with visible focus on dismiss button
- [ ] Wayfinder collapses to single column below 1024px
- [ ] No selections forced on wayfinder initial render
- [ ] All patterns pass forced-colors mode (visible boundaries on all interactive elements)
- [ ] All patterns function at 200% browser zoom
- [ ] Storybook examples render: populated, sparse, loading, and empty-result variants