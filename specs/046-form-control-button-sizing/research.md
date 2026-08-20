# Research: Form Controls and Button Adopt Sizing Props

**Feature**: specs/046-form-control-button-sizing
**Date**: 2026-08-20

## Decision 1: Which components to include in this slice

**Decision**: Include `Button`, `Input`, `Select`, and `Textarea`. Exclude `Checkbox`, `Radio`, `Range`, `ComboBox`, `DatePicker`, `DateRangePicker`, `Search`, `Form`, `FormGroup`, `Fieldset`, `Label`, `ErrorMessage`, and `Hint`.

**Rationale**: The audit of `packages/react/src/components/` revealed four categories of components:

**Simple form controls** (single root element, ideal candidates):
- `Button` — root `<button>`, manual array-join class construction, no ref forwarding
- `Input` — root `<input>`, template-literal class construction, no ref forwarding
- `Select` — root `<select>`, template-literal class construction, no ref forwarding
- `Textarea` — root `<textarea>`, template-literal class construction, no ref forwarding

**Composite controls** (internal DOM structure — sizing semantics less clear):
- `Checkbox` — root `<label>` wrapping `<input>` + `<span>`. Applying `width="full"` to a `<label>` is semantically ambiguous.
- `Radio` — same composite structure as Checkbox.
- `Range` — root `<input type="range">`. While structurally simple, its sizing is tightly coupled to the component's visual layout. Defer to a future slice.
- `ComboBox` — complex `<div>` root with `<label>`, `<select>`, `<input>`, buttons, `<ul>`. Too complex for this slice.
- `DatePicker`, `DateRangePicker` — composite `<div>`-rooted components with calendar sub-components. Defer.
- `Search` — composite `<form>`-rooted component wrapping `<Input>` + `<Button>`. Sizing should propagate to children; defer.

**Form helpers** (not form controls):
- `Form`, `FormGroup`, `Fieldset`, `Label`, `ErrorMessage`, `Hint` — these support form layout but are not user-input controls. Excluded per spec scope.

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Include `Range` as a simple input | While structurally simple, its sizing behavior is tightly coupled to its track/fill visual layout. Adding sizing props without visual verification risks breaking the component's appearance. Defer to a dedicated slice. |
| Include all simple controls including Checkbox/Radio | These have composite `<label>` root elements. The sizing semantics of a label-wrapped checkbox are different from an input — `width="full"` on a `<label>` stretches the label, not just the checkbox. Defer requiring design review. |
| Rename Input to TextInput per spec terminology | The spec uses "TextInput" as a semantic name but the component is called `Input` in code and exports. Changing the export name is a breaking change and out of scope. |

## Decision 2: Class construction strategy — adopt mergeClasses

**Decision**: Replace each component's manual class concatenation with the `mergeClasses` utility from `packages/react/src/internal/resolvers/mergeClasses.ts`.

**Rationale**: Two distinct manual patterns exist across the target components:

1. **Array filter + join** (Button): `['pathable-button', variantClass, sizeClass, className].filter(Boolean).join(' ')`
2. **Template literal + trim** (Input, Select, Textarea): `` `${BASE_CLASS} ${className || ''}`.trim() ``

Both patterns have issues:
- Neither enforces the documented merge order (required → semantic → consumer).
- The template-literal pattern produces a trailing space when `className` is undefined, requiring `trim()`.
- Neither filters `null`/`undefined` values from intermediate sources (though currently only one source).

Adopting `mergeClasses` for all four components ensures:
- Consistent merge order across the entire component library.
- Proper handling of `undefined` returns from resolvers when props are omitted.
- The Card component (slice 02) already uses this pattern — this slice extends consistency.

**Component-specific merge calls**:

```typescript
// Button
const classes = mergeClasses(
  'pathable-button',
  variantClass,
  sizeClass,
  widthClass(width),
  maxWidthClass(maxWidth),
  className,
)

// Input
const classes = mergeClasses(
  'pathable-input',
  widthClass(width),
  maxWidthClass(maxWidth),
  className,
)

// Select
const classes = mergeClasses(
  'pathable-select',
  widthClass(width),
  maxWidthClass(maxWidth),
  className,
)

// Textarea
const classes = mergeClasses(
  'pathable-textarea',
  widthClass(width),
  maxWidthClass(maxWidth),
  className,
)
```

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Keep existing class construction and append sizing classes manually | Duplicates logic, doesn't enforce merge order, inconsistent with Card (slice 02). |
| Use a per-component helper instead of shared mergeClasses | `mergeClasses` is already the shared utility; wrapping it per component is unnecessary abstraction. |

## Decision 3: Sizing props scope — width and maxWidth only

**Decision**: Only `width` and `maxWidth` from `SizingProps` are adopted in this slice. No `minWidth`.

**Rationale**: The `SizingProps` interface from the semantic-prop foundation (slice 01) defines `width` and `maxWidth` (no `minWidth`). The `@pathable/styles` inventory confirms:
- `pathable-width-{auto,full}` — exists
- `pathable-maxw-{mobile,mobile-lg,tablet,desktop}` — exists
- No `min-width` utility classes exist

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Add `minWidth` property to `SizingProps` | No `min-width` CSS utility classes exist in `@pathable/styles`. This would require a styles-package change (out of scope). |
| Limit to `width="full"` only, skip `maxWidth` | `maxWidth` uses the same resolver infrastructure and provides valuable responsive control with zero extra complexity. Excluding it would be arbitrary. |

## Decision 4: Component test strategy

**Decision**: Add one focused component test file per component, co-located with the component:

```
packages/react/src/components/Button/__tests__/Button.sizing.test.tsx
packages/react/src/components/Input/__tests__/Input.sizing.test.tsx
packages/react/src/components/Select/__tests__/Select.sizing.test.tsx
packages/react/src/components/Textarea/__tests__/Textarea.sizing.test.tsx
```

Each test file covers:
1. Class presence for `width` and `maxWidth` values
2. No extra wrapper DOM elements (verify exactly one root element)
3. Class merge order (base class → semantic class → consumer className)
4. All existing behavior preserved: ref forwarding (where applicable), native props passthrough, children rendering, disabled state, keyboard/focus behavior (where applicable)
5. No wrapper introduced when sizing props are omitted

**Rationale**: The Card component tests in slice 02 establish a proven pattern. Each component gets its own test file to keep tests focused and independently runnable. The setup structurally mirrors the Card test approach.

Expected assertions per component:
- `render(<Button width="full" />)` → root element has `pathable-width-full` class
- `render(<Input maxWidth="tablet" />)` → root element has `pathable-maxw-tablet` class
- `render(<Select width="full" className="my-class" />)` → class order is correct
- `render(<Textarea width="full" maxWidth="desktop" />)` → both classes present, single root element

## Decision 5: Storybook story scope

**Decision**: Add a single deterministic sizing story per component demonstrating `width="full"`.

**Rationale**: The spec requires at minimum a `width="full"` story per component to serve as a visual-regression fixture and documentation example. A single story per component is sufficient for this slice; the width/maxWidth props are demonstrated through the type system and component tests.

Story format per component:
1. **Button**: `<Button width="full">Full Width Button</Button>`
2. **Input**: `<Input width="full" placeholder="Full width input" />`
3. **Select**: `<Select width="full">...</Select>`
4. **Textarea**: `<Textarea width="full" placeholder="Full width textarea" />`

Each story is deterministic — no dates, random values, or network calls.

**Alternatives considered**:

| Alternative | Why rejected |
|---|---|
| Multiple stories per component (width + maxWidth + combined) | Adds visual noise without meaningful regression value. Component tests handle all combinations. |
| Single combined story with all components | Each component's Storybook file is independent; a combined story would cross component boundaries. |
| Skip Storybook stories entirely | The spec requires them (FR-015), and they serve as visual regression fixtures and documentation. |

## Decision 6: Component naming — spec uses "TextArea" but code uses "Textarea"

**Decision**: Keep the existing component name `Textarea` and `TextArea` in the codebase. The spec refers to the semantic concept, not a rename.

**Rationale**: The spec's key entities section refers to `TextArea` as a concept. The actual exported component is `Textarea` (from `packages/react/src/components/Textarea/Textarea.tsx`). Renaming the component is a breaking API change and out of scope for this slice. The capability matrix should record the actual component name `Textarea`.

Similarly, the spec refers to `TextInput` but the component is `Input`. The capability matrix records `Input`.