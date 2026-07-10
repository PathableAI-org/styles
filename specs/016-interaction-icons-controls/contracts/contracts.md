# Interface Contracts: Interaction States, Icon Conventions, and Compact Controls

## Public SCSS API

### 1. Interaction State Mixins

**File**: `packages/styles/src/pathable-component-wrappers/pathable-interaction-states.scss`

**Consumption**: SCSS `@use` / `@forward`

```scss
// Example: applying shared states to a custom component
@use 'pathable-component-wrappers/pathable-interaction-states' as states;

.my-custom-card {
  @include states.interaction-states;
  // or granular: @include states.state-hover;
  //              @include states.state-focus;
}
```

**Contract**:

| Mixin | Selectors Generated | CSS Custom Properties Consumed |
|---|---|---|
| `interaction-states` | `&:hover`, `&:focus-visible`, `&:focus-within`, `&:active`, `&.is-selected`, `&:disabled`, `&[aria-disabled="true"]`, `&.is-loading` | `--pathable-color-focus-ring`, `--elevation-sm`, `--elevation-md`, `--pathable-color-surface`, `--pathable-color-bg` |
| `state-hover` | `&:hover` | `--elevation-md` |
| `state-focus` | `&:focus-visible`, `&:focus-within` | `--pathable-color-focus-ring` |
| `state-active` | `&:active` | `--elevation-sm` |
| `state-selected` | `&.is-selected`, `&[aria-selected="true"]` | `--pathable-color-surface`, `--pathable-color-border` |
| `state-pressed` | `&:active` (alt style) | `--elevation-none` |
| `state-disabled` | `&:disabled`, `&[aria-disabled="true"]`, `&[aria-busy="true"]` | none (opacity/pointer-events) |
| `state-loading` | `&.is-loading` | none (pseudo-element spinner) |

### 2. Icon Button Classes

**File**: `packages/styles/src/pathable-component-wrappers/pathable-icon-button.scss`

**Selectors**:

| Selector | Purpose |
|---|---|
| `.pathable-icon-button` | Base class for all icon buttons |
| `.pathable-icon-button--bare` | No visible background, icon only |
| `.pathable-icon-button--subtle` | Light background, no border |
| `.pathable-icon-button--bordered` | Transparent with visible border |
| `.pathable-icon-button--inverse` | Dark background for dark surfaces |
| `.pathable-icon-button--destructive` | Danger signaling |
| `.pathable-icon-button--compact` | 32px target (or `--size-compact`) |
| `.pathable-icon-button--large` | 52px target (or `--size-large`) |
| `.pathable-icon-button--circle` | Circular shape |

**CSS Custom Properties**:

| Property | Default | Description |
|---|---|---|
| `--pathable-icon-button-size` | `44px` | Target size (width/height) |
| `--pathable-icon-button-icon-size` | `20px` | SVG icon dimensions |
| `--pathable-icon-button-padding` | `calc((var(--pathable-icon-button-size) - var(--pathable-icon-button-icon-size)) / 2)` | Internal padding |

### 3. Segmented Control Classes

**File**: `packages/styles/src/pathable-component-wrappers/pathable-segmented-control.scss`

**Selectors**:

| Selector | Purpose |
|---|---|
| `.pathable-segmented-control` | Base class for container (single-select) |
| `.pathable-segmented-control--multi` | Multi-select variant |
| `.pathable-segmented-control__option` | Individual segment |
| `.pathable-segmented-control__option--selected` | Selected state |
| `.pathable-segmented-control--vertical` | Vertical orientation |

**CSS Custom Properties**:

| Property | Default | Description |
|---|---|---|
| `--pathable-segmented-control-radius` | `var(--radius-md)` | Container border radius |
| `--pathable-segmented-control-gap` | `var(--space-2)` | Gap between segments |

### 4. Icon Tile Classes

**File**: `packages/styles/src/pathable-component-wrappers/pathable-icon-tile.scss`

**Selectors**:

| Selector | Purpose |
|---|---|
| `.pathable-icon-tile` | Base class for square icon container |
| `.pathable-icon-tile--circle` | Circular variant |
| `.pathable-icon-tile--compact` | 32px tile |
| `.pathable-icon-tile--large` | 52px tile |

**CSS Custom Properties**:

| Property | Default | Description |
|---|---|---|
| `--pathable-icon-tile-size` | `44px` | Tile dimensions |
| `--pathable-icon-tile-icon-size` | `20px` | Inner icon size |
| `--pathable-icon-tile-padding` | `calc((var(--pathable-icon-tile-size) - var(--pathable-icon-tile-icon-size)) / 2)` | Internal padding |

## Accessibility Contract

| Pattern | ARIA Role | Keyboard | States |
|---|---|---|---|
| Icon button (action) | `button` | Enter/Space to activate | hover, focus-visible, active, disabled, loading |
| Icon button (toggle) | `button` + `aria-pressed` | Enter/Space to toggle | + pressed/selected |
| Segmented control (single) | `radiogroup` + `radio` + `aria-checked` | Arrow keys between options, wrapping | + selected, disabled |
| Segmented control (multi) | `group` + `button` + `aria-pressed` | Tab between groups, Space to toggle | + pressed, disabled |
| Decorative icon | `aria-hidden="true"` | N/A | N/A |
| Meaningful icon | `role="img"` + `aria-label` | N/A | N/A |

## Import Contract

**Selective import** (consumers pick only what they need):
```scss
@use 'pathable-component-wrappers/pathable-interaction-states';
@use 'pathable-component-wrappers/pathable-icon-button';
@use 'pathable-component-wrappers/pathable-segmented-control';
@use 'pathable-component-wrappers/pathable-icon-tile';
```

**Bundle import** (all interaction controls):
```scss
@use 'pathable-component-wrappers/pathable-interaction-controls';
// Forwards: pathable-interaction-states, pathable-icon-button,
//           pathable-segmented-control, pathable-icon-tile
```

**All-in-one import** (everything):
```scss
@use 'pathable-component-wrappers/pathable-all';
// Now includes interaction-controls