# Research: Optional Form Section

## Decision 1 - Use a dedicated optional-form primitive

**Decision**: Name the shared class contract
`pathable-optional-form-section` and the React component
`OptionalFormSection`.

**Rationale**: The name is domain-neutral while clearly limiting the component
to optional form content. It follows Styles/React naming parity.

**Alternatives considered**: Reusing `Accordion`, `Disclosure`, or a
product-specific advanced-settings component. Accordion implies general content
grouping and broader behavior; Disclosure is too generic; product names would
embed application policy.

## Decision 2 - Use a heading containing a native button

**Decision**: Render a required `h2`-`h6` containing a native
`button type="button"` with `aria-expanded` and `aria-controls`.

**Rationale**: A button provides native pointer, Enter, and Space activation,
does not submit its containing form, and retains focus without custom keyboard
handlers. The heading preserves document structure selected by the consumer.

**Alternatives considered**: `details`/`summary`, the existing `Accordion`, and
a clickable heading. `details` does not provide the required controlled API;
Accordion introduces unrelated multi-item semantics; a clickable heading would
need recreated button semantics.

## Decision 3 - Require a non-empty string heading and level 2-6

**Decision**: Require `heading: string` and
`headingLevel: 2 | 3 | 4 | 5 | 6`; reject an empty or whitespace-only heading
at runtime.

**Rationale**: A string gives the control a predictable visible accessible name.
Requiring the level prevents the component from guessing document hierarchy,
while excluding level 1 avoids creating repeated page titles in a form helper.

**Alternatives considered**: `ReactNode` headings, a fixed `h3`, a default
level, and supporting `h1`. Each either weakens naming guarantees or guesses a
hierarchy the component cannot know.

## Decision 4 - Support controlled and uncontrolled expansion

**Decision**: Use `expanded`/`onExpandedChange` for controlled state and
`defaultExpanded`/`onExpandedChange` for uncontrolled state. `expanded !==
undefined` selects controlled mode; `defaultExpanded` defaults to `false`.

**Rationale**: Simple forms get local state while coordinated workflows remain
application-authoritative. The callback always reports the requested next
boolean state.

**Alternatives considered**: Controlled-only and uncontrolled-only APIs. The
former adds unnecessary state plumbing; the latter prevents application-owned
workflows such as revealing errors.

## Decision 5 - Keep children mounted and use `hidden`

**Decision**: Always render the content container and its children. Apply the
HTML `hidden` attribute while collapsed.

**Rationale**: `hidden` removes content from visual presentation and sequential
keyboard navigation while preserving DOM identity, nested component state, and
form controls. It also gives meaningful server-rendered initial state.

**Alternatives considered**: Conditional rendering, CSS-only visibility,
`inert`, and disabling descendants. Conditional rendering loses state; CSS-only
hiding can leave accessible or focusable content; `inert` is redundant with
`hidden`; disabling descendants excludes successful controls from submission.

## Decision 6 - Preserve collapsed form submission

**Decision**: Do not rename, disable, clone, serialize, or otherwise manage
nested form controls. Successful controls submit normally while collapsed.

**Rationale**: Collapse is a presentation action, not a request to clear or
exclude a response. Native form ownership and field grouping remain intact.

**Alternatives considered**: Disabling descendants, clearing values, and hidden
mirror inputs. These alter consumer data, break native semantics, or risk
duplicate values.

## Decision 7 - Keep validation application-owned

**Decision**: The component does not inspect validity, automatically expand,
focus invalid descendants, or coordinate error summaries. Applications must
expand a collapsed section before reviewing or focusing hidden invalid fields.

**Rationale**: Validation timing and error policy depend on the form workflow.
The disclosure cannot infer when hidden invalid content should be revealed.

**Alternatives considered**: Automatic expansion on submit or invalid events.
That would introduce form-wide policy, event ownership, and focus side effects.

## Decision 8 - Use a neutral root and labelled content region

**Decision**: Render a root `div` with no landmark role. Render the content as a
`div` with `role="region"`, `aria-labelledby` pointing to the disclosure button,
and an ID referenced by the button's `aria-controls`.

**Rationale**: The root remains composition-neutral, while the disclosed form
section has an explicit accessible relationship and unique name when exposed.

**Alternatives considered**: Root `section`, root `fieldset`, and an unlabelled
content `div`. `section` adds an unnecessary landmark, `fieldset` would imply a
single field grouping that arbitrary children may not share, and an unlabelled
container weakens the relationship.

## Decision 9 - Generate hydration-stable instance relationships

**Decision**: Use React `useId` to derive opaque button and content IDs for each
instance and use the same structure during server and client rendering.

**Rationale**: Multiple sections may share visible headings. `useId` provides
collision-free, hydration-stable relationships without consumer ID plumbing.

**Alternatives considered**: Heading-derived IDs, random IDs, and a required
consumer ID. Heading IDs collide, randomness breaks hydration, and consumer IDs
add avoidable setup.

## Decision 10 - Provide no disabled state in v1

**Decision**: Do not expose a component-level `disabled` prop or render a
disabled disclosure button.

**Rationale**: The requested primitive always allows a person to review optional
responses. A disabled disclosure could conceal content and errors without a
defined read-only policy.

**Alternatives considered**: Native button disabling and inherited disabled
fieldset behavior. Neither establishes what hidden content should mean or how it
can be reviewed.

## Decision 11 - Introduce no animation

**Decision**: Expansion and collapse switch the `hidden` state immediately.

**Rationale**: Immediate state is deterministic, avoids height-measurement and
hydration complexity, and creates no reduced-motion burden.

**Alternatives considered**: CSS transitions and measured height animation.
Both add motion and failure modes without serving the core form workflow.

## Decision 12 - Establish Styles-first visual ownership

**Decision**: Add a dedicated Styles stylesheet and static stories before the
React wrapper. React renders only shared `pathable-optional-form-section`
classes and does not use `usa-accordion__*` enhancement selectors.

**Rationale**: The constitution makes Styles authoritative for visual and class
contracts. Avoiding Accordion selectors also prevents competing DOM and React
interaction owners.

**Alternatives considered**: Wrapper-only CSS, utility-only markup, and reuse of
USWDS Accordion selectors. These either violate ownership, omit a reusable class
contract, or risk dual behavior.

## Decision 13 - Classify React as `client-ssr`

**Decision**: Document `OptionalFormSection` as `client-ssr`: it requires a
client boundary for state and activation but emits meaningful, deterministic
initial server markup.

**Rationale**: React state and callbacks require client behavior, while `useId`,
the heading, and initial `hidden` state can hydrate consistently.

**Alternatives considered**: Server-compatible or client-only classification.
The first ignores interactivity; the second understates useful SSR output.

## Decision 14 - Keep issue #235 independent

**Decision**: Treat issue #235's filterable option list only as a possible child
composition, not a prerequisite.

**Rationale**: `OptionalFormSection` accepts arbitrary children and can be
implemented, tested, and released with ordinary controls, FormGroup, and
fieldset content.

**Alternatives considered**: Stacking on or importing issue #235 work. That
would couple unrelated delivery and contradict the domain-agnostic API.
