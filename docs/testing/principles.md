# Testing principles

These principles adapt the ideas in the team's
[Playwright E2E Testing Best Practices](https://app.notion.com/p/3bb7cbd04b6d81729a42e209d82aad1a)
to component testing.

## Test capabilities, not incidental structure

A component test should describe what a user can perceive or do. It should not
be an inventory of the DOM that happens to implement the component today.

For example, an Accordion test should prove that a user can expand a disclosure
with the keyboard and access its panel. It should not depend on wrapper depth,
CSS classes, React hooks, or event-listener placement.

Ask this during review:

> Would this still be a requirement if the component were reimplemented while
> preserving its purpose and accessible behavior?

If yes, it probably belongs in a component behavior test. If no, it may belong
in a visual, package-specific, integration, or unit test instead.

## Select elements through user-facing semantics

Prefer queries that match how users and assistive technologies identify the
interface:

1. Accessible label
2. Semantic role and accessible name
3. Visible text
4. Other meaningful semantics, such as alt text
5. Test IDs only when no useful user-facing identity exists

Avoid CSS classes, internal IDs, DOM traversal, sibling relationships, and
framework internals unless that structure is the explicit subject of a
package-level test.

Difficulty writing a semantic query can reveal a missing label, role, or name
in the component. Do not immediately conceal that problem with a test ID.

## Let actions prove capabilities

An interaction often proves that a control is available. If a test successfully
focuses a button and activates it, a preceding assertion that the button exists
usually adds no behavioral information.

Assert visibility or availability separately only when it is itself a
requirement.

## Assert observable outcomes

After an action, assert a result that a user or assistive technology can
perceive or use:

- content becomes available;
- an accessible state changes;
- focus moves to or remains on the correct control;
- a value is communicated;
- an unavailable action remains unavailable.

Do not prefer internal state, callback wiring, network activity, or framework
details when an observable result proves the same requirement.

## Treat accessibility as behavior

For components, some DOM semantics are not incidental. They are part of the
accessible interaction contract.

An Accordion's disclosure role, accessible name, `aria-expanded` state,
control-to-panel association, keyboard operation, and focus behavior are valid
contract assertions. A Modal's accessible name, modal semantics, initial focus,
focus containment, and focus restoration can be contractual for the same
reason.

The rule is not "never inspect attributes." The rule is "inspect semantics
only when users or assistive technologies depend on them."

## Preserve implementation freedom

Equivalent components may use different renderers and state management. Shared
tests should allow those differences while enforcing equivalent capabilities.

A shared test must not know whether it is exercising raw HTML enhanced by
JavaScript, a React component, or a future framework wrapper.

## Keep tests readable

Reuse is valuable when it makes a shared promise explicit. It is harmful when
it hides the interaction behind a broad helper whose name no longer explains
what occurs.

Prefer focused names such as `verifyEnterExpandsDisclosure` over broad names
such as `testAccordion`. A reader should be able to understand the action and
expected outcome without opening several abstraction layers.

Next: [Choosing what to test](choosing-tests.md).
