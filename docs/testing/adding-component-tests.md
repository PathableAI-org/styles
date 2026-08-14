# Adding tests for a component

Use this workflow when adding a component or expanding the supported behavior
of an existing component.

## 1. Describe the component contract

Before writing test code, state:

- the component's semantic purpose;
- what a user can perceive or do;
- the supported states and variants;
- the keyboard and focus model, when interactive;
- which behavior every package must share;
- which behavior belongs only to one framework adapter.

Use [Choosing what to test](choosing-tests.md) to separate shared behavior from
package-specific implementation requirements.

## 2. Add deterministic stories

In each implementing package, add:

- `Playground` for exploration;
- `Default` with realistic content;
- one fixed story per meaningful state or variant;
- narrow, long-content, and composition stories when relevant.

Do not use dates, random values, live network data, uncontrolled animation, or
state left behind by another story.

For React components, begin with the canonical
[`Button.stories.tsx`](../../packages/react/src/stories/components/Basic/Button.stories.tsx)
and follow the complete
[`STORYBOOK_STANDARD.md`](../../packages/react/STORYBOOK_STANDARD.md).

## 3. Add the baseline validation

Confirm the rendered component has the semantics required for its purpose and
that stable stories pass automated accessibility checks. Add viewport and
content-pressure cases where layout can fail.

See [Baseline component coverage](component-baseline.md) for capability-specific
additions.

## 4. Add interaction tests

Add a focused story for each meaningful interaction or initial state:

```tsx
export const KeyboardActivation: Story = {
  args: { children: 'Continue' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('Enter activates Continue', async () => {
      const button = canvas.getByRole('button', { name: 'Continue' })
      button.focus()
      await userEvent.keyboard('{Enter}')
      await expect(button).toHaveFocus()
    })
  },
}
```

Use accessible queries. Perform the user action, then assert the observable
result. Avoid preliminary existence assertions that the interaction itself
already proves.

## 5. Share parity validations

If more than one package implements the behavior:

1. Give each package a deterministic story with the required initial state.
2. Extract the renderer-neutral interaction and assertions into a focused
   shared helper.
3. Call that helper from each package's story.
4. Confirm that each story exercises its package's real public implementation.
5. Keep framework APIs, callbacks, refs, and state-model tests in the framework
   package.

See [Behavioral parity](behavior-parity.md) for the expected boundary.

## 6. Run the relevant checks

```bash
# Styles and React stories
pnpm test:storybook

# React-only iteration
pnpm test:storybook-react

# Default repository test suite
pnpm test

# Visual smoke tests
pnpm test:visual
```

Also run package-specific type, lint, build, or server-rendering checks required
by the component change.

## Review checklist

- [ ] Tests describe capabilities and observable outcomes.
- [ ] Queries use accessible, user-facing semantics.
- [ ] Supported states have fixed deterministic stories.
- [ ] Interactive behavior covers keyboard and focus.
- [ ] Disabled or unavailable behavior is covered when supported.
- [ ] Shared promises use the same validation in every implementation.
- [ ] Package-specific API behavior remains in package-specific tests.
- [ ] Assertions avoid CSS classes, DOM traversal, and framework internals
      unless those details are the explicit requirement.
- [ ] Accessibility exceptions are narrow and documented.
- [ ] The relevant Storybook and repository commands pass.

Return to the [component testing overview](README.md).
