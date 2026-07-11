# Interface Contracts: App Feedback Patterns

**Created**: 2026-07-11

## Public CSS Class API

The following CSS classes are the public contract for consumers.

### Toast

```
.pathable-toast__region         → Fixed-position toast overlay container
.pathable-toast                 → Individual toast notification
.pathable-toast--info           → Informational variant
.pathable-toast--progress       → Progress variant
.pathable-toast--success        → Success variant
.pathable-toast--warning        → Warning variant
.pathable-toast--error          → Error variant
.pathable-toast--dismissible    → Has dismiss button
.pathable-toast--has-action     → Has action link/button
```

### Loading

```
.pathable-loading               → Inline loading container
  .pathable-loading__spinner    → Spinner icon element
  .pathable-loading__text       → Status text element
.pathable-loading--large        → Large (40px) spinner variant
```

### Skeleton

```
.pathable-skeleton              → Skeleton placeholder container
  .pathable-skeleton--text-heading → Heading-shaped block
  .pathable-skeleton--text-body → Body text line
  .pathable-skeleton--avatar    → Circular avatar shape
  .pathable-skeleton--card      → Card-shaped block
  .pathable-skeleton--table-row → Table row bar
```

### Empty State

```
.pathable-empty-state                       → Empty state container
  .pathable-empty-state--no-data            → No content exists variant
  .pathable-empty-state--no-results         → Search/filter no results variant
  .pathable-empty-state--setup-required     → Setup needed variant
  .pathable-empty-state--completed          → All done variant
  .pathable-empty-state__icon               → Decorative icon (aria-hidden)
  .pathable-empty-state__heading            → Primary message
  .pathable-empty-state__body               → Explanation text
  .pathable-empty-state__action             → Call-to-action slot
```

### Page Error

```
.pathable-page-error                        → Error container
  .pathable-page-error--compact             → Inline panel variant
  .pathable-page-error--full-page           → Full-viewport variant
  .pathable-page-error--not-found           → 404-specific variant
  .pathable-page-error--access-restricted   → 403-specific variant
  .pathable-page-error__icon                → Decorative icon (aria-hidden)
  .pathable-page-error__heading             → Error heading
  .pathable-page-error__body                → Explanation text
  .pathable-page-error__retry               → Retry action
  .pathable-page-error__nav                 → Alternate navigation action
```

## HTML Contract Examples

### Toast (minimal)

```html
<div class="pathable-toast__region">
  <div class="pathable-toast pathable-toast--success" role="status">
    <span class="pathable-toast__icon" aria-hidden="true"></span>
    <span class="pathable-toast__message">Document saved.</span>
  </div>
</div>
```

### Toast (with action + dismiss)

```html
<div class="pathable-toast pathable-toast--warning pathable-toast--dismissible pathable-toast--has-action" role="alert">
  <span class="pathable-toast__icon" aria-hidden="true"></span>
  <span class="pathable-toast__message">Connection lost.</span>
  <a href="#" class="pathable-toast__action">Retry</a>
  <button class="pathable-toast__dismiss" aria-label="Dismiss">&times;</button>
</div>
```

### Loading

```html
<div class="pathable-loading" aria-live="polite">
  <span class="pathable-loading__spinner" aria-hidden="true"></span>
  <span class="pathable-loading__text">Loading messages...</span>
</div>
```

### Skeleton

```html
<div class="pathable-skeleton" aria-hidden="true">
  <div class="pathable-skeleton--text-heading"></div>
  <div class="pathable-skeleton--text-body" style="--pathable-skeleton-lines: 3"></div>
  <div class="pathable-skeleton--avatar"></div>
</div>
```

### Empty State (no-results)

```html
<div class="pathable-empty-state pathable-empty-state--no-results">
  <svg class="pathable-empty-state__icon" aria-hidden="true">...</svg>
  <h2 class="pathable-empty-state__heading">No matching results</h2>
  <p class="pathable-empty-state__body">Try adjusting your search or filters.</p>
  <a href="#" class="pathable-empty-state__action pathable-button">Clear filters</a>
</div>
```

### Page Error (full-page)

```html
<div class="pathable-page-error pathable-page-error--full-page">
  <svg class="pathable-page-error__icon" aria-hidden="true">...</svg>
  <h1 class="pathable-page-error__heading">Something went wrong</h1>
  <p class="pathable-page-error__body">We couldn't load this page. Please try again.</p>
  <button class="pathable-page-error__retry pathable-button">Try again</button>
  <a href="/" class="pathable-page-error__nav">Go to home</a>
</div>
```

## SCSS Import Contract

```scss
// Selective import — single pattern
@forward 'pathable-toast';

// Bundle import — communication group
@forward 'pathable-communication';

// All-in-one import
@forward 'pathable-all';
```

## CSS Custom Property Contract

Consumers may override these per-instance custom properties via inline `style` attribute or their own CSS:

```css
--pathable-toast-inset-block-start  /* Default: var(--pathable-space-4) */
--pathable-toast-inset-inline-end  /* Default: var(--pathable-space-4) */
--pathable-toast-max-width         /* Default: 28rem */
--pathable-skeleton-lines          /* Default: 1 */
--pathable-skeleton-width          /* Default: 100% */
```

## Semantic Role Contract

| Pattern | Default role | When to change |
|---------|-------------|----------------|
| General toast | `role="status"` | Polite, non-urgent updates |
| Error/warning toast | `role="alert"` | Time-sensitive, urgent messages |
| Loading indicator | `aria-live="polite"` on container | No change needed |
| Skeleton placeholder | `aria-hidden="true"` on container | No change needed |
| Empty state | No special role | Text content is self-explanatory |
| Page error heading | Use appropriate heading level (`h1` or `h2`) based on page context | Match document outline |