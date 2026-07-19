<!-- SPECKIT START -->

For additional context about technologies to be used, project structure,
shell commands, and other important information, read the current plan
at specs/032-react-link-tag-wrappers/plan.md

## Storybook conventions

When editing or adding React component stories in `packages/react/src/stories/`:

- Every supported component state should normally have a fixed named story.
- Controls (`Playground` story) are for exploratory use, not regression coverage.
- Interactive components require keyboard-focused `play` tests using `@storybook/test`.
- Prefer accessible queries (`getByRole`, `getByLabelText`, `getByText`) over `getByTestId` or CSS selectors in interaction tests.
- Stable stories must be deterministic — no dates, random values, or live network data.
- Broad a11y rule exceptions are prohibited. Story-level exceptions require narrow, documented justification.
- Story documentation must explain semantic intent (what the component is for, when to use it, when not to use it).
- Component stories (exhaustive supported states) and pattern/composition stories (realistic integrations) serve different purposes.
- New components must follow the canonical reference: `packages/react/src/stories/components/Basic/Button.stories.tsx`.
- Full conventions are documented in `packages/react/STORYBOOK_STANDARD.md`.

### Story checklist

When adding a new React component, ensure:

- [ ] Meta uses `satisfies Meta<typeof Component>`
- [ ] `tags: ['autodocs']` is present
- [ ] Component description explains semantic purpose and usage guidance
- [ ] `Playground` story exists with all controls
- [ ] One fixed story per meaningful visual/behavioral variant
- [ ] Interaction tests for keyboard activation, focus management, and disabled behavior
- [ ] Stories use accessible queries (`getByRole`, `getByLabelText`)
- [ ] Narrow/mobile viewport story exists where layout could break
- [ ] Long content story exists where text overflow is relevant
- [ ] At least one composition story showing realistic usage
- [ ] Stories are deterministic (no random content, network calls)

### Running React Storybook

```bash
# Start the React Storybook (port 6007)
pnpm docs:react

# Build React Storybook
pnpm build:docs-react

# Run React Storybook tests (build + test-runner)
pnpm test:storybook-react
```

<!-- SPECKIT END -->
