# Quickstart: Interaction States, Icon Conventions, and Compact Controls

## Validation Path

Use this guide to verify each pattern works correctly after implementation.

### Prerequisites

- `@pathable/styles` is installed and the build compiles
- Storybook or a test page is accessible

### 1. Interaction States

**Test**: Apply shared states to a custom element.

```html
<div class="my-custom-card">Click me</div>
```

```scss
@use 'pathable-component-wrappers/pathable-interaction-states' as states;

.my-custom-card {
  @include states.interaction-states;
  padding: var(--space-16);
  background: var(--pathable-color-surface);
  border: 1px solid var(--pathable-color-border);
  border-radius: var(--radius-md);
  cursor: pointer;
}
```

**Verify**:
- [ ] Hover: element gains elevation or background shift
- [ ] Focus-visible: visible outline ring using `--pathable-color-focus-ring`
- [ ] Active: elevation drops
- [ ] Selected (add `.is-selected`): border/weight change visible
- [ ] Disabled (add `disabled` attr): no hover/focus response, reduced opacity

### 2. Icon Button

```html
<button class="pathable-icon-button pathable-icon-button--subtle" aria-label="Close">
  <svg class="pathable-icon" aria-hidden="true"><use href="#close"/></svg>
</button>
```

Apply loading presentation with the dedicated modifier and native busy/disabled
semantics:

```html
<button
  class="pathable-icon-button pathable-icon-button--subtle pathable-icon-button--loading"
  type="button"
  aria-label="Saving changes"
  aria-busy="true"
  disabled
>
  <svg class="pathable-icon" aria-hidden="true" focusable="false">
    <use href="#save"/>
  </svg>
</button>
```

The modifier supplies visual presentation only. Native `disabled` prevents
pointer and keyboard activation, while `aria-busy="true"` exposes the busy
state. Applications that require an announced completion message should also
update an appropriate live status region.

**Verify**:
- [ ] Default size is 44px square
- [ ] Focus ring visible on tab
- [ ] `--circle` modifier makes it circular
- [ ] All appearance variants render: bare, subtle, bordered, inverse, destructive
- [ ] Compact (32px) and large (52px) variants render correctly
- [ ] Loading keeps compact/default/large targets at 32px/44px/52px
- [ ] Loading spinner follows compact/default/large icon sizes at 16px/20px/24px
- [ ] Loading hides the decorative SVG and preserves the button dimensions
- [ ] Loading uses native `disabled` and `aria-busy="true"`
- [ ] Existing `.is-loading` usage retains the same IconButton presentation
- [ ] Forced-colors mode preserves focus boundary
- [ ] `prefers-reduced-motion` removes non-essential transitions

### 3. Segmented Control

```html
<div class="pathable-segmented-control" role="radiogroup" aria-label="View mode">
  <button type="button" class="pathable-segmented-control__option" role="radio" aria-checked="true" tabindex="0">List</button>
  <button type="button" class="pathable-segmented-control__option" role="radio" aria-checked="false" tabindex="-1">Grid</button>
  <button type="button" class="pathable-segmented-control__option" role="radio" aria-checked="false" tabindex="-1">Detail</button>
</div>
```

The CSS package provides presentation only. Application JavaScript must update `aria-checked` and roving `tabindex` while moving focus with Arrow keys, or consumers can use the React wrapper.

**Verify**:
- [ ] Selected option visually distinct via background + border + weight
- [ ] Focus ring visible on each segment
- [ ] Multi-select variant (`--multi`) allows independent toggling
- [ ] Forced-colors mode preserves selected segment boundary
- [ ] Vertical (`--vertical`) orientation renders correctly
- [ ] Long or exceptional option sets scroll internally without page overflow
- [ ] One-option usage renders as a noninteractive `--static` indicator

### 4. Icon Tile

```html
<span class="pathable-icon-tile" aria-hidden="true">
  <svg class="pathable-icon" aria-hidden="true"><use href="#bell"/></svg>
</span>
```

**Verify**:
- [ ] Icon centered within the tile
- [ ] Square (`pathable-icon-tile`, default) and circular (`--circle`) shapes
- [ ] Compact, default, large sizes
- [ ] Semantic surface/foreground tokens applied

### 5. Bundle Compilation

```bash
cd packages/styles && pnpm build
```

**Verify**:
- [ ] No compilation errors
- [ ] Selective `@forward 'pathable-icon-button'` works
- [ ] `@forward 'pathable-interaction-controls'` includes all patterns
- [ ] `pathable-all.scss` includes the new bundle
