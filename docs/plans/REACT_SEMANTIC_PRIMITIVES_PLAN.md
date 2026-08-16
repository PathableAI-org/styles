# React Semantic Primitives Architecture Plan

## Purpose

This document proposes an architecture and phased implementation plan for exposing the design-system utilities owned by `@pathable/styles` through an idiomatic, typed React API in `@pathable/react`.

It is intended to guide specification, implementation, review, and follow-up work by other agents and contributors. It describes the desired end state, but it does not replace inspection of the current SCSS, emitted CSS, React components, tests, Storybook stories, or package conventions before implementation begins.

## Motivation

`@pathable/styles` already owns useful tokens and utility classes, including sizing utilities such as width and maximum width. React consumers can use those classes through `className`, but doing so requires them to know class spellings and gives TypeScript no way to validate values or communicate design-system intent.

The React package needs a more ergonomic interface without creating a second styling system or encouraging deeply nested wrapper markup. In particular, application authors should be able to express common intent such as:

```tsx
<Card width="full" maxWidth="tablet" marginX="auto">
  ...
</Card>
```

The semantic props in this example should add classes to the `Card` root that already exists. They should not produce an extra element around the card.

React also needs a typed way to create genuine layout or semantic elements:

```tsx
<Box as="section" width="full" maxWidth="desktop">
  ...
</Box>
```

In this case, the rendered `section` is intentional structure. `Box` replaces the element the author would otherwise have written; it is not an incidental wrapper created solely to carry a utility class.

The desired result is a small semantic vocabulary that:

- makes existing Pathable styles easier and safer to consume from React;
- preserves clean, meaningful HTML;
- keeps React and SCSS responsibilities separate;
- expresses design intent instead of arbitrary CSS declarations;
- remains compatible with server rendering by resolving props deterministically, without browser-only state; and
- can grow incrementally based on demonstrated application needs.

## Design Principles

### SCSS is the source of truth

`@pathable/styles` owns design tokens, utility generation, selectors, and visual behavior. The React package must not duplicate token values, reimplement CSS rules in JavaScript, or invent classes that are not emitted by the styles package.

React provides a typed adapter from semantic props to existing classes:

```text
semantic React value -> validated class mapping -> class emitted by SCSS
```

Before exposing a React prop or value, implementation work must verify the owning SCSS contract and built CSS. Storybook examples may demonstrate the contract, but they are not a substitute for verifying the source styles.

### Typed semantic props form the foundation

The primary primitive is not a wrapper component. It is a reusable, typed prop capability plus a deterministic class resolver.

For example:

```ts
export interface SizingProps {
  width?: Width
  minWidth?: Width
  maxWidth?: Width
}
```

Individual components opt into appropriate capabilities. The system must not mechanically add every system prop to every component merely because the underlying CSS could apply to it.

### Never add a wrapper solely for a system prop

System props modify the root element a component already owns. A component such as `Card`, `Alert`, `Button`, or `TextInput` must merge supported system classes with its existing component classes and the consumer's `className`.

Expected:

```tsx
<Card maxWidth="tablet" marginX="auto" />
```

```html
<div
  class="pathable-card pathable-max-width-tablet pathable-margin-x-auto"
></div>
```

Not expected:

```html
<div class="pathable-max-width-tablet pathable-margin-x-auto">
  <div class="pathable-card"></div>
</div>
```

Tests should treat preservation of the existing DOM structure as a public invariant.

### Prefer semantic intent over raw CSS

The React API should describe supported design-system concepts, not reproduce the entire CSS language as JSX props.

Prefer:

```tsx
<Stack gap="4" />
<Text variant="caption" tone="muted" />
<Button width="full" />
```

Avoid an unrestricted API such as:

```tsx
<Box
  background="#fa3321"
  border="1px dashed green"
  fontSize="17px"
  transform="rotate(13deg)"
/>
```

`className` remains the escape hatch for supported utilities that do not yet have typed props and for application-specific classes. Native `style` remains available where the underlying element supports it, but it is not the design-system API.

### Keep capabilities selective and composable

Different components have different responsibilities. `Card` may reasonably support sizing and external margin. A form control or `Button` may support `width="full"`. A `Breadcrumb` probably should not expose arbitrary padding, grid, or typography controls.

Prop capabilities should therefore be reusable at the type and resolver level while remaining explicitly selected in each public component API. Internal component layout and appearance must not become accidentally overridable through broad system-prop inheritance.

### Preserve native semantics and accessibility

Layout convenience must not replace meaningful HTML. Polymorphic primitives should preserve valid native props, ref behavior, accessible names, keyboard behavior, and semantic relationships for the selected element. A visual heading style and an HTML heading level must be modeled deliberately rather than conflated accidentally.

## Target Architecture

The layers and their ownership are:

```text
Design tokens in SCSS
        |
        v
Utility and semantic classes generated by @pathable/styles
        |
        v
Typed semantic prop values and pure class resolvers in @pathable/react
        |
        +-----------------------------+
        |                             |
        v                             v
Layout/semantic primitives       Existing components
Box, Container, Stack,           Card, Button, inputs,
Inline, Cluster, Grid,           Alert, and others
Text, Heading                    opt in selectively
        |                             |
        +--------------+--------------+
                       v
          Classes on the element's owned root
```

The class-resolution layer should be framework-local but package-independent in behavior: it maps documented semantic values to the public class contract owned by `@pathable/styles`. It should be pure, deterministic, easy to unit test, and safe to execute during server rendering.

A conceptual resolver may look like:

```ts
function systemClasses(props: SupportedSystemProps): string[] {
  return [
    props.width && widthClass(props.width),
    props.maxWidth && maxWidthClass(props.maxWidth),
    props.marginX && marginXClass(props.marginX),
  ].filter(Boolean)
}
```

Each component should merge classes in a consistent order:

1. required component or primitive classes;
2. resolved semantic/system classes; and
3. consumer-provided `className`.

The exact conflict policy must be documented and tested. The API should avoid exposing combinations whose class precedence would be ambiguous or whose use would violate a component's contract.

## System Props and Layout Primitives Are Different Concepts

### System props

System props are typed capabilities applied to an element that a component already owns. They do not render anything by themselves.

Examples:

```tsx
<Card maxWidth="tablet" marginX="auto" />
<TextInput width="full" />
<Button width="full" />
```

System props are appropriate when the property naturally describes that component's root and the component can support it without compromising its intrinsic behavior.

### Layout primitives

Layout primitives render an element because the layout relationship or semantic structure genuinely requires one.

Examples:

```tsx
<Container size="desktop">
  <Stack gap="6">...</Stack>
</Container>
```

`Container` establishes a constrained page region. `Stack` establishes a relationship among its immediate children. Their elements are meaningful participants in layout rather than implementation artifacts.

The decision rule is:

```text
Does an existing component naturally own the property?
  -> Apply a supported system prop to that component's root.

Is a semantic or layout element needed?
  -> Render a suitable primitive, using `as` where appropriate.

Would the new element exist only to avoid typing a class?
  -> Do not add the wrapper; use a supported prop or `className`.
```

## Box Philosophy

`Box` is the lowest-level generic React adapter for intentional Pathable layout utilities. It is useful when an author needs an element but no more specific Pathable component expresses the element's purpose.

The proposed baseline is:

- default to `div`;
- support a polymorphic `as` prop;
- expose only approved design-system capabilities;
- merge native element props, resolved classes, and `className`;
- forward refs correctly;
- remain deterministic and server-renderable; and
- avoid owning styles that belong in SCSS.

Example:

```tsx
<Box as="main" width="full" maxWidth="desktop" marginX="auto" paddingX="4">
  ...
</Box>
```

This should render one `main` element. Authors should prefer it to nesting a `Box` inside a `main` solely for sizing.

`Box` should replace an element the author already needs, not become a universal wrapper around existing Pathable components. If `Box` usage repeatedly expresses the same combination of properties, that is evidence for a more semantic primitive such as `Container`, `Stack`, or `Surface`.

An `asChild` composition model could eliminate a wrapper in advanced cases, but it should not be part of the initial design. It introduces child restrictions and nontrivial rules for refs, class names, native props, and event-handler merging. Direct opt-in system props and existing `className` composition solve the primary use case more transparently.

## Why Context Is Not Appropriate

Width, maximum width, spacing, display, and similar properties belong to a specific rendered element. They are not ambient configuration and do not naturally inherit through the React tree or through CSS.

A context-based API would leave essential behavior unclear:

```tsx
<WidthProvider width="tablet">
  <Card>
    <Button />
  </Card>
</WidthProvider>
```

It would be ambiguous whether the width applies to the card, the button, both, the first child, or every descendant that knows about the context. It would also hide which DOM element receives the class.

Context remains appropriate for genuinely shared descendant state or configuration, such as a theme, coordinated form state, or an application-shell relationship. It should not be used to distribute element-local styling props.

## When Wrappers Are Appropriate

A wrapper is appropriate when it represents real document structure or establishes a layout relationship that cannot belong to a single existing child. Examples include:

- a page-width container shared by a header, main content, and footer;
- a `Stack` or `Grid` that controls the relationship among multiple immediate children;
- a semantic `main`, `section`, `article`, or `nav` element that the document needs;
- a scroll, clipping, positioning, or containment boundary with a clear behavioral purpose; or
- a surface that intentionally coordinates background, foreground, border, elevation, and focus treatment.

A wrapper is not appropriate when the intent is simply to make one existing component full width, constrain its maximum width, or add supported external spacing. In those cases, the component should receive a compatible system prop on its own root.

This distinction matters beyond DOM size. Extra wrappers can change which element is a flex or grid item, interfere with direct-child selectors, obscure semantics, complicate debugging, and make layout ownership unclear.

## Typography and Color Semantics

Typography and color should be more opinionated than generic layout because their values communicate design and product meaning.

### Typography

Do not expose raw font size, line height, font family, or font weight as the primary React API. Define semantic roles that map to cohesive typography styles owned by SCSS.

Proposed primitives include:

```tsx
<Text variant="body" />
<Text variant="small" tone="muted" />
<Text variant="caption" />

<Heading level={2}>Creator Studio</Heading>
```

`Text` may support `as` for cases such as `p`, `span`, `label`, or another valid text element. `Heading` must preserve a deliberate relationship between document outline semantics and visual style. If the API permits semantic level and visual variant to differ, that separation must be explicit, constrained, and documented.

The mapping remains layered:

```text
React semantic role
  -> semantic typography class
  -> SCSS typography tokens
```

### Color and tone

React should expose meanings, not palette values. Prefer APIs such as:

```tsx
<Text tone="default" />
<Text tone="muted" />
<Text tone="danger" />
<Badge variant="success" />
```

over APIs such as `color="gray-600"` or `background="blue-100"`.

The SCSS layer may need to formalize semantic roles before React can expose them consistently. Candidate roles include:

- text: `default`, `muted`, `danger`, `success`, and other validated content roles;
- surfaces: `default`, `subtle`, `primary`, and other validated container roles; and
- borders: `default`, `danger`, and other validated boundary roles.

A `Surface` primitive should be introduced only if real use demonstrates repeated, coordinated foreground, background, border, focus, or elevation behavior. It should not exist merely as a typed alias for `background-color`.

Color semantics must remain meaningful across themes and visual changes. Applications should be able to request “danger” or “muted” without depending on the palette currently used to represent that meaning.

## Proposed Shared Prop Capabilities

The following capability groups are candidates, not a mandate to expose every property on every component. Their final values must be derived from the verified `@pathable/styles` contract.

### Sizing

Candidate props:

- `width`
- `minWidth`
- `maxWidth`

Width and maximum width must remain distinct. A full-width element constrained by a maximum content width expresses different behavior from a fixed-width element.

### External spacing

Candidate props:

- `margin`
- `marginX` and `marginY`
- directional margins such as `marginTop`

External margin is usually safer to share than padding because it describes how a component participates in surrounding layout. Even so, each component must opt in intentionally.

### Internal spacing

Candidate props:

- `padding`
- `paddingX` and `paddingY`
- directional padding where the styles contract supports it

Padding changes internal geometry and may conflict with a component's visual contract. It should primarily belong to generic layout primitives and should be exposed on existing components only when explicitly supported.

### Display and visibility

Candidate props should represent approved responsive or accessibility-safe utilities. They must not make it easy to accidentally hide required accessible content or break component behavior.

### Layout participation

Candidate props may include constrained flex- or grid-item participation such as growth, shrinkage, or alignment where a component's root is intended to be a direct layout child. These should not expand into a complete CSS flexbox or grid language.

### Layout relationships

Properties such as direction, wrapping, gap, child alignment, and columns generally belong to `Stack`, `Inline`, `Cluster`, or `Grid`, because they define relationships among children rather than intrinsic properties of one component.

### Typography and tone

Candidate capabilities include semantic `variant`, `tone`, and deliberately separated heading semantics. These belong primarily to textual primitives and components with defined textual roles, not to generic `Box`.

### Escape hatches

All suitable components continue to accept `className` and their valid native element props. `className` must compose with required and resolved classes rather than replace them.

## Phased Implementation Plan

Each phase should produce an independently useful, reviewable result. Before implementation, each slice should follow the repository's normal specification and planning workflow and confirm the live source contract.

### Phase 1: Establish the semantic-prop foundation

**Goal:** Create the internal machinery that allows components to consume existing utilities without adding wrappers.

Tasks:

- Inventory public utility families in `@pathable/styles` and identify their owning SCSS and emitted classes.
- Group verified utilities into semantic capabilities: sizing, spacing, display, alignment, visibility, flex/grid participation, typography, and color/tone.
- Record gaps where a desired semantic role does not yet have an authoritative SCSS contract.
- Define shared TypeScript value types and capability interfaces such as `SizingProps` and `SpacingProps`.
- Implement pure internal resolvers that map typed values to verified class names.
- Define a consistent class-merging and conflict policy.
- Define which capabilities are broadly safe and which require component-specific opt-in.
- Add unit tests for every supported prop-to-class mapping, invalid or omitted values, and class ordering.
- Confirm the resolver has no browser dependency and behaves identically during server and client rendering.
- Document `className` as the escape hatch.

Initial validation target:

```tsx
<Card width="full" maxWidth="tablet" marginX="auto" />
```

**Deliverable:** A typed semantic-prop layer and class resolver, exercised through one or two carefully selected existing components with no DOM changes.

### Phase 2: Retrofit existing components selectively

**Goal:** Allow existing components to participate directly in layout before introducing a broad set of new primitives.

Tasks:

- Define and document a capability matrix for existing components.
- Start with `Card`, form controls, and other container-like components for which sizing is predictable.
- Add external spacing only where it naturally applies to the root.
- Add `width="full"` to buttons and form controls where their contract supports it.
- Avoid exposing internal padding or unrelated layout controls that could break component styling.
- Ensure each component merges its required classes, resolved classes, and consumer `className` consistently.
- Preserve existing refs, native props, server behavior, accessibility, and public markup.
- Add unit and component tests proving that supported props affect the owned root and introduce no wrapper.
- Add Storybook examples for supported semantic props and relevant responsive behavior.
- Add a contribution and review rule: do not introduce a wrapper solely to implement a system prop.

**Deliverable:** Existing Pathable components can participate in common layouts without utility-class memorization or `Box` wrappers.

### Phase 3: Add low-level layout primitives

**Goal:** Cover cases where layout or document semantics genuinely require an element.

Implement in evidence-driven slices, tentatively in this order:

1. `Box`
2. `Container`
3. `Stack`
4. `Inline`
5. `Cluster`
6. `Grid`

Tasks for `Box`:

- Support `as`, defaulting to `div`.
- Consume the approved shared layout capabilities.
- Implement polymorphic native-prop and ref typing.
- Preserve deterministic server-rendered output.
- Test class merging, native props, refs, semantic element selection, and absence of extra nodes.
- Document that `Box` should correspond to an element the author actually needs.

Tasks for `Container`:

- Define named sizes backed by verified maximum-width utilities or semantic classes.
- Standardize full-width, centered content and supported horizontal page padding.
- Avoid leaking arbitrary width combinations when one semantic `size` can express the pattern.

Tasks for `Stack`, `Inline`, and `Cluster`:

- Define distinct relationship semantics for sequential, inline, wrapping, and clustered content.
- Expose constrained `gap`, alignment, and wrapping values backed by the styles contract.
- Test immediate-child layout behavior so wrappers do not change which element participates.

Tasks for `Grid`:

- Support only design-system-approved column and gap patterns.
- Avoid exposing the full CSS Grid language through props.
- Include responsive behavior only after its SCSS contract and API semantics are explicitly specified.

**Deliverable:** Applications can construct common page layouts with meaningful, typed primitives and without manual utility strings.

### Phase 4: Add typography and color semantics

**Goal:** Let applications express textual and visual roles rather than implementation tokens.

Tasks:

- Audit existing SCSS typography tokens, text utilities, heading styles, and color roles.
- Formalize missing semantic classes or tokens in `@pathable/styles` before exposing React APIs.
- Specify and implement `Text` with validated variants, tones, and an appropriate `as` API.
- Specify and implement `Heading` with deliberate HTML-level and visual-style semantics.
- Define semantic text, surface, and border tone vocabularies.
- Ensure contrast, forced-colors behavior, theming, and accessible state communication are evaluated at the styles and component levels.
- Add unit, server-rendering, Storybook, and accessibility evidence for the supported roles.
- Introduce `Surface` only if repeated coordinated surface behavior justifies it.

**Deliverable:** React application code primarily uses roles such as body, caption, heading, muted, danger, and success rather than raw font or palette values.

### Phase 5: Consolidate higher-level composition patterns

**Goal:** Promote repeated, proven combinations into a small Pathable-specific composition vocabulary.

Potential candidates include:

```tsx
<Page />
<PageHeader />
<PageContent />
<SidebarLayout />
<Section />
<FormStack />
<ActionGroup />
```

Tasks:

- Audit real application usage of the lower-level props and primitives.
- Identify combinations repeated across multiple features or applications with the same intent.
- Distinguish domain-specific components from reusable design-system composition patterns.
- Promote only patterns with stable semantics and demonstrated value.
- Specify ownership of responsive behavior, landmarks, headings, focus order, and child constraints.
- Migrate representative usage incrementally and measure whether the abstraction reduces duplication without hiding important layout behavior.
- Deprecate superseded utility combinations only after adoption evidence and a migration path exist.

**Deliverable:** A small, evidence-based set of higher-level Pathable composition primitives rather than a speculative catalog of wrappers.

## Suggested Independently Mergeable Slices

The roadmap can be divided into the following implementation slices:

1. Semantic utility type system and class resolvers.
2. `Card` adopts selected sizing and spacing props.
3. Form controls and `Button` adopt selected sizing props.
4. `Box`.
5. `Container`.
6. `Stack`.
7. `Inline` and `Cluster`.
8. `Grid`.
9. `Text`.
10. `Heading`.
11. Semantic color and tone model.
12. `Surface`, only if justified.
13. Audit of real application layouts.
14. Promotion of repeated patterns into higher-level primitives.

The architectural proof point is the earliest slice: if `Card` can accept typed sizing and spacing props, map them to existing CSS classes, preserve its public markup, and behave identically during server and client rendering, the core approach is validated before the package adds multiple new components.

## Success Criteria

The architecture is successful when:

- SCSS remains the only source of token values, utility rules, and emitted style behavior.
- Every public semantic prop maps to a verified, documented styles contract.
- React consumers receive autocomplete and compile-time validation for supported values.
- Existing components apply supported system props to their owned root without adding wrappers.
- `Box` with `as` renders exactly one intentional element and preserves valid native props and refs.
- Layout primitives express recognizable layout relationships rather than arbitrary CSS declarations.
- Typography and color APIs express semantic roles rather than raw font and palette values.
- `className` continues to work as a composable escape hatch.
- Server rendering and client hydration produce consistent markup and classes without browser-only resolution.
- Accessibility, responsive behavior, and theming remain owned and tested at the appropriate SCSS and component layers.
- Tests cover prop-to-class resolution, class merging, markup shape, polymorphic behavior, refs, and representative browser behavior.
- Storybook demonstrates supported APIs without being treated as the sole source of contract truth.
- Representative applications can build common layouts with fewer manual utility strings and no culture of wrapper nesting.

## Non-Goals for the Initial Work

The initial implementation should not:

- recreate CSS or design-token values in JavaScript;
- introduce an unrestricted `sx` prop or CSS-in-JS language;
- map every CSS property or every utility class one-to-one into React props;
- expose every shared capability on every component;
- solve arbitrary prop injection with context;
- begin with `asChild` complexity;
- add a large catalog of speculative higher-level components; or
- use new wrappers merely to carry sizing or spacing classes.

## Future Work

After the phased plan has real adoption evidence, consider:

- generating some React value unions or mappings from an authoritative utility manifest to reduce SCSS/TypeScript drift;
- adding development-time diagnostics for unsupported or conflicting semantic-prop combinations;
- evaluating responsive semantic props with a constrained, explicitly specified breakpoint vocabulary;
- evaluating `asChild` only if repeated third-party composition needs cannot be served by direct props, `as`, or `className`;
- adding codemods or migration guidance for common manual utility-class patterns;
- measuring bundle impact, tree shaking, server-rendering behavior, hydration consistency, and DOM depth in representative consumers;
- formalizing a capability matrix in generated API documentation;
- adding cross-package contract tests that verify React mappings against emitted styles;
- reviewing whether semantic surface roles support multiple themes and forced-colors modes coherently; and
- evolving higher-level layout patterns only from repeated application usage.

## Final Architectural Rule

> System props modify the root element a component already owns. Layout primitives create elements only when document semantics or the layout itself requires an element. All visual behavior remains grounded in the SCSS contract, and public React APIs express supported design intent rather than raw CSS.
