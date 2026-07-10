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

**Verify**:
- [ ] Default size is 44px square
- [ ] Focus ring visible on tab
- [ ] `--circle` modifier makes it circular
- [ ] All appearance variants render: bare, subtle, bordered, inverse, destructive
- [ ] Compact (32px) and large (52px) variants render correctly
- [ ] Forced-colors mode preserves focus boundary
- [ ] `prefers-reduced-motion` removes non-essential transitions

### 3. Segmented Control

```html
<div class="pathable-segmented-control" role="radiogroup" aria-label="View mode">
  <button class="pathable-segmented-control__option pathable-segmented-control__option--selected" role="radio" aria-checked="true">List</button>
  <button class="pathable-segmented-control__option" role="radio" aria-checked="false">Grid</button>
  <button class="pathable-segmented-control__option" role="radio" aria-checked="false">Detail</button>
</div>
```

**Verify**:
- [ ] Selected option visually distinct via background + border + weight
- [ ] Focus ring visible on each segment
- [ ] Multi-select variant (`--multi`) allows independent toggling
- [ ] Forced-colors mode preserves selected segment boundary
- [ ] Vertical (`--vertical`) orientation renders correctly

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