# Choosing what to test

Begin with a requirement, not a tool. State the capability or risk in plain
language, then choose the narrowest layer that can prove it.

## Classify the requirement

Use these questions in order:

1. **Is this a product workflow spanning pages or services?** Use an
   application E2E test.
2. **Must equivalent components behave the same in every package?** Use a
   shared component behavior validation.
3. **Is this behavior specific to one framework API?** Use a package-specific
   test.
4. **Is this a supported visual state?** Add a deterministic fixed story and
   visual-regression coverage.
5. **Can an automated accessibility rule detect the problem?** Cover the story
   with the accessibility runner.
6. **Does the requirement involve keyboard operation, focus, or changing
   state?** Add a Storybook `play` test; static accessibility scanning cannot
   prove these behaviors.

Several answers may be yes. Use complementary tests when they protect different
risks, but avoid repeating the same assertion at every layer.

## Shared versus package-specific behavior

A requirement belongs in the shared parity contract when all implementations
promise it to consumers. Examples include:

- Enter and Space operate an Accordion disclosure;
- opening a disclosure updates the accessible expanded state;
- a disabled control cannot be activated;
- closing a Modal restores focus to its trigger.

A requirement remains package-specific when it describes the wrapper API or
implementation. Examples include:

- a React callback receives particular arguments;
- controlled and uncontrolled React state remain synchronized;
- a ref is forwarded;
- server rendering emits meaningful initial markup;
- a styles entry point initializes enhancement JavaScript correctly.

Shared tests protect the common promise. Package tests protect the adapter.

## Observable semantics versus DOM structure

Some structural details are legitimate requirements because they expose
meaning to browsers and assistive technologies. Test the semantic effect, not
the arbitrary tree shape.

| Usually contractual | Usually incidental |
| --- | --- |
| Accessible role and name | Wrapper element count |
| Programmatic label association | CSS class used for styling |
| Expanded, selected, checked, or invalid state | React component state |
| Control-to-panel relationship | Element ancestry |
| Focus placement and restoration | Internal event handler |
| Content availability | Generated implementation ID value |

For an association such as `aria-controls`, verify that it resolves to the
correct panel. Do not require a particular generated ID string.

## Test supported behavior, not every implementation branch

Component behavior tests are executable specifications. They should cover
meaningful supported states and user paths. Fine-grained algorithm branches,
error guards, and internal utilities belong in package-level unit tests when
they need coverage.

Next: [Baseline component coverage](component-baseline.md).
