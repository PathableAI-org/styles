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
| `interaction-states` | `&:hover`, `&:focus-visible`, `&:focus-within`, `&:active`, `&.is-selected`, `&[aria-selected="true"]`, `&:disabled`, `&[aria-disabled="true"]`, `&.is-loading` | `--pathable-color-focus-ring`, `--elevation-md`, `--pathable-color-surface`, `--pathable-color-bg`, `--pathable-color-text`, `--pathable-font-weight-bold` |
| `state-hover` | `&:hover` | `--elevation-md`, `--pathable-color-bg` |
| `state-focus` | `&:focus-visible`, `&:focus-within` | `--pathable-color-focus-ring` |
| `state-active` | `&:active` | none (uses `box-shadow: none`) |
| `state-selected` | `&.is-selected`, `&[aria-selected="true"]` | `--pathable-color-surface`, `currentColor`, `--pathable-font-weight-bold` |
| `state-pressed` | `&:active` (alt style) | `--elevation-sm` (inset), `--pathable-color-border` |
| `state-disabled` | `&:disabled`, `&[aria-disabled="true"]` | `--pathable-color-bg`, `--pathable-color-text` |
| `state-loading` | `&.is-loading` | `--pathable-color-border` (spinner border) |

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

### 3. Segmented Control Classes

**File**: `packages/styles/src/pathable-component-wrappers/pathable-segmented-control.scss`

**Selectors**:

| Selector | Purpose |
|---|---|
| `.pathable-segmented-control` | Base class for container (single-select) |
| `.pathable-segmented-control--multi` | Multi-select variant |
| `.pathable-segmented-control--static` | Noninteractive one-option indicator |
| `.pathable-segmented-control__option` | Individual segment |
| `.pathable-segmented-control__option--selected` | Selected state |
| `.pathable-segmented-control--vertical` | Vertical orientation |

**CSS Custom Properties**:

| Property | Default | Description |
|---|---|---|
| `--pathable-segmented-control-radius` | `var(--radius-md)` | Container border radius |
| `--pathable-segmented-control-gap` | `var(--space-4)` | Gap between segments |
| `--pathable-segmented-control-focus-ring` | `var(--pathable-color-text)` | Focus outline color for segmented options |

**State source**: Interactive segmented controls use `aria-checked="true"` for single-select state and `aria-pressed="true"` for multi-select state. These ARIA attributes and `.pathable-segmented-control__option--selected` MUST produce equivalent selected presentation. Consumers remain responsible for synchronizing state when they use both.

**Layout**: Horizontal segmented controls use internal horizontal scrolling when constrained and MUST NOT create page-level horizontal overflow. Normal usage remains 2-5 options; longer sets should use another control such as a native `select` when comparison at a glance is not required.

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

## Accessibility Contract

| Pattern | ARIA Role | Keyboard | States |
|---|---|---|---|
| Icon button (action) | `button` | Enter/Space to activate | hover, focus-visible, active, disabled, loading |
| Icon button (toggle) | `button` + `aria-pressed` | Enter/Space to toggle | + pressed |
| Segmented control (single) | `radiogroup` + `radio` + `aria-checked` | Consumer-owned Arrow key handling between options, wrapping | + selected, disabled |
| Segmented control (multi) | `group` + button + `aria-pressed` | Tab between buttons, Space/Enter to toggle | + pressed, disabled |
| Segmented control (static) | none beyond text semantics | N/A | selected presentation only |
| Decorative icon | `aria-hidden="true"` | N/A | N/A |
| Meaningful icon | `role="img"` + `aria-label` | N/A | N/A |

Native `disabled` controls are removed from the sequential focus order. Controls using `aria-disabled="true"` may remain focusable and therefore MUST retain a visible focus indicator; CSS presentation alone does not prevent their activation. Loading presentation likewise requires native disabled state, `aria-disabled` plus event guards, or another consumer-owned activation guard when duplicate activation must be prevented.

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
