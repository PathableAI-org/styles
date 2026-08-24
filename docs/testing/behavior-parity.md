# Behavioral parity

`@pathableai/styles` owns the base design and markup contracts. Framework
packages adapt those contracts for their runtimes. Equivalent components should
not drift in the capabilities they provide.

## Define parity at the user boundary

Two implementations have behavioral parity when a user or assistive technology
can perform the same supported actions and observe equivalent results.

Parity does not require:

- identical rendering code;
- identical component APIs;
- identical state management;
- identical generated IDs;
- identical internal DOM wrappers.

## Share validations, not rendering infrastructure

Each package owns a deterministic Storybook story that renders the component in
the required initial state. A renderer-neutral helper performs the interaction
and assertions through the story's `canvasElement`.

```text
shared behavior validation
          |
     +----+----+
     |         |
styles story  React story
raw markup    React component
```

The package story answers, "How is this implementation rendered?" The shared
validation answers, "What must every implementation do?"

## Write focused shared validations

Prefer one function per meaningful behavior:

```ts
export async function verifyEnterExpandsDisclosure(canvasElement: HTMLElement) {
  const canvas = within(canvasElement)
  const disclosure = canvas.getByRole('button', {
    name: 'First Amendment',
  })

  disclosure.focus()
  await userEvent.keyboard('{Enter}')

  await expect(disclosure).toHaveAttribute('aria-expanded', 'true')
  await expect(disclosure).toHaveFocus()
}
```

Both implementations call the same helper from a `play` function:

```ts
play: async ({ canvasElement, step }) => {
  await step('Enter expands the disclosure', async () => {
    await verifyEnterExpandsDisclosure(canvasElement)
  })
}
```

Keep renderer-specific Storybook context types out of shared helpers. A plain
`HTMLElement` or a small structural interface works across HTML and React
renderers.

## Keep initial states deterministic

Each behavior should begin from a named, known state. Do not rely on another
test having mutated the story.

For Accordion parity, useful cases include:

- all disclosures collapsed;
- first disclosure expanded;
- disabled disclosure;
- single-open mode;
- multiple-open mode, if it is part of the shared contract.

Only require a state across packages after deciding that it is a shared product
promise. A framework-only feature should remain in that framework's stories and
tests.

## Avoid false parity

A React story must exercise the React implementation. It must not load a DOM
enhancement runtime that silently supplies the behavior and masks a broken
wrapper. Likewise, a styles story should exercise the public styles-package
runtime a consumer would use.

Passing the same helper is useful only when each story reaches its package
through a representative public entry point.

For CSS-only patterns such as SegmentedControl, the Styles story may install a
deterministic, story-owned reference runtime to demonstrate consumer-owned
keyboard and state behavior. The story and contract documentation must say that
the runtime is fixture code rather than published package JavaScript. Framework
adoption still waits for that Styles reference proof and invokes the unchanged
renderer-neutral helper.

Next: [Tooling and structure](tooling-and-structure.md).
