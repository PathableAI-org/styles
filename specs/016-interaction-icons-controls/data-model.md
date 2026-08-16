# Data Model: Interaction States, Icon Conventions, and Compact Controls

## Domain Model Overview

This feature defines CSS-only package patterns. The "entities" below represent the logical object model that consumers compose in their markup; the SCSS classes and mixins provide the visual behavior, while consumers own runtime state changes and keyboard event handling.

## Entities

### InteractionStateMixin

A reusable SCSS abstraction that consumers `@include` in their own component selectors to activate standardized interactive behavior.

| Attribute | Type | Description |
|---|---|---|
| `hover` | CSS state | Subtle emphasis via elevation increase or background shift |
| `focus-visible` | CSS state | Visible outline ring using `--pathable-color-focus-ring` |
| `focus-within` | CSS state | Same focus ring on parent when child receives focus |
| `active` | CSS state | Pressed emphasis via elevation drop or border inset |
| `selected` | CSS state | Persistent visual marker (current-color border/weight change + background tint) |
| `pressed` | CSS state | Momentary elevation drop (distinct from selected by lack of border change) |
| `disabled` | CSS state | Contrast-safe disabled presentation with suppressed hover/active responses |
| `loading` | CSS state | Spinner via `::after` pseudo-element; activation prevention is consumer-owned |

**State transition rules**:
- `disabled` takes precedence over hover, active, and pressed responses; selected identity remains visibly identifiable when a selected value is disabled
- Native `disabled` controls are not focusable; focusable `aria-disabled="true"` controls retain visible focus and require consumer-owned activation guards
- `loading` implies disabled presentation; preventing duplicate keyboard or programmatic activation requires native `disabled`, `aria-disabled` with event guards, or another consumer-owned guard
- `selected` + `hover`: selected background persists, hover adds elevation increase
- `selected` + `pressed`: pressed elevation drop is momentary; selected visual markers (border/weight) persist
- `focus-visible` always overrides focus ring color for focusable elements regardless of other active states

### IconButton

A compact, square (or optionally circular) button for single-action SVG icon triggers.

| Attribute | Type | Values | Description |
|---|---|---|---|
| size | modifier | `compact` (32px), `default` (44px), `large` (52px) | Target size of the button |
| appearance | modifier | `bare`, `subtle`, `bordered`, `inverse`, `destructive` | Visual style variant |
| shape | modifier | `default` (square), `--circle` | Border-radius shape |
| state | modifier | `:hover`, `:focus-visible`, `:active`, `:disabled`, `--loading` | Interactive states |

**Appearance variant tokens**:

| Variant | Background | Border | Hover | Focus |
|---|---|---|---|---|
| `bare` | transparent | none | subtle bg shift | focus ring only |
| `subtle` | `--pathable-color-bg` | none | darker bg | focus ring |
| `bordered` | transparent | `1px solid var(--pathable-color-border)` | bg + border darken | focus ring |
| `inverse` | `var(--pathable-color-text)` | none | lighter bg overlay | contrast focus ring |
| `destructive` | transparent | none | `var(--pathable-color-danger)` bg | danger-colored focus ring |

### SegmentedControl

A grouped set of 2-5 option buttons as a contiguous horizontal control. Constrained horizontal controls scroll internally; one-option presentations use a static indicator.

| Attribute | Type | Values | Description |
|---|---|---|---|
| selection mode | semantic | `single-select`, `multi-select` | Whether options are mutually exclusive |
| segment state | modifier/ARIA | `--selected`, `aria-checked`, `aria-pressed`, `:hover`, `:focus-visible`, `:disabled`, `aria-disabled` | State of individual segment |
| orientation | modifier | `horizontal` (default), `vertical` | Layout direction |
| layout spacing | token | `--space-4` | Compact gap and padding foundation |
| static mode | modifier | `--static` | Noninteractive one-option indicator |

**Single-select (radiogroup) properties**:
- Container: `role="radiogroup"`, `.pathable-segmented-control`
- Segment: `role="radio"`, `aria-checked="true/false"`, `.pathable-segmented-control__option`
- Keyboard: Consumer JavaScript handles Arrow key navigation between options, wrapping allowed
- At least one option must always be selected

**Multi-select (toggle button) properties**:
- Container: `role="group"`, `.pathable-segmented-control--multi`
- Segment: `role="button"`, `aria-pressed="true/false"`, `.pathable-segmented-control__option`
- Keyboard: Tab enters/exits group; native button activation or consumer JavaScript toggles individual options
- Zero or more options may be selected independently

**Static one-option properties**:
- Container classes: `.pathable-segmented-control` and `.pathable-segmented-control--static`
- Segment classes: noninteractive text element with `.pathable-segmented-control__option` and `.pathable-segmented-control__option--selected`
- Keyboard: no radio role, button role, or tab stop

### IconTile

A decorative or meaningful icon container with consistent padding and centering.

| Attribute | Type | Values | Description |
|---|---|---|---|
| shape | modifier | `square`, `circle` | Border radius of the tile |
| size | modifier | `compact` (32px), `default` (44px), `large` (52px) | Tile dimensions |
| icon role | convention | `decorative` (`aria-hidden="true"`), `meaningful` (`role="img"` + `aria-label`) | Accessibility semantics |

### StatusIcon

A meaningful icon that conveys application state (success, error, warning, info, required).

| Attribute | Type | Description |
|---|---|---|
| semantic color | token | Maps to state tokens: success→green, error→`--pathable-color-danger`, warning→amber |
| accessible label | attribute | `aria-label` describing the status |
| rendering | SVG | Consumer provides SVG; status icon tile wraps it with semantic foreground color |

## State Diagrams

### Interaction State Transitions

```
         ┌─────────────────────────────────┐
         │           REST (initial)         │
         └──┬──────┬──────┬──────┬─────────┘
            │      │      │      │
            ▼      ▼      ▼      ▼
         ┌────┐ ┌────┐ ┌────┐ ┌────────┐
         │HOVER│ │FOCUS│ │SELECT│ │PRESSED │
         └──┬─┘ └──┬──┘ └──┬──┘ └───┬────┘
            │      │       │        │
            └──────┴───────┴────────┘
                         │
                         ▼
                   ┌─────────┐
                   │ DISABLED│ (suppresses interaction)
                   └─────────┘
                         ▲
                   ┌─────┴──────┐
                   │  LOADING   │ (disabled presentation)
                   └────────────┘
```

**Notes**:
- Selected persists until explicitly deselected (ARIA state or class toggled off)
- Pressed is momentary (active pseudo-class only)
- Hover and focus can coexist with selected
- Disabled suppresses interaction responses while preserving meaningful selected identity
- Loading presentation does not by itself prevent keyboard or programmatic activation
