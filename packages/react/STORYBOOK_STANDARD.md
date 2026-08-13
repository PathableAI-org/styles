# Storybook Story Standard

This document defines what a complete React component story file must contain in the `@pathableai/react` package. Stories under `packages/react/src/stories/` act as executable specifications and development workbenches, not just component galleries.

## Required structure

Every component story file must include:

```tsx
import type { Meta, StoryObj } from '@storybook/react'
import { userEvent, within, expect } from 'storybook/test'

import { ComponentName } from '../../components/ComponentName/ComponentName'

const meta = {
  title: 'Components/ComponentName',
  component: ComponentName,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: 'Semantic purpose, when to use it, and when not to use it.',
      },
    },
  },
  argTypes: {
    // Descriptions that explain semantic intent, not just prop names
  },
} satisfies Meta<typeof ComponentName>

export default meta
type Story = StoryObj<typeof meta>
```

## Required story types

When applicable, a component story file must include:

| Story kind           | Name                                        | Purpose                                                              |
| -------------------- | ------------------------------------------- | -------------------------------------------------------------------- |
| Playground           | `Playground`                                | Exploratory Controls use; includes all argTypes for tweaking         |
| Default              | `Default`                                   | The component rendered with its default props                        |
| Disabled             | `Disabled`                                  | When disabled state is supported                                     |
| Long content         | `LongContent`                               | Long label or text overflow behavior                                 |
| Mobile               | `Narrow` or `Mobile`                        | Constrained-width rendering                                          |
| Each variant         | `VariantName`                               | One fixed named story per meaningful variant                         |
| State stories        | `Loading`, `Error`, `Empty`, `Invalid` etc. | Each supported state                                                 |
| Interactive behavior | `Keyboard` or per-behavior story            | Keyboard focus/activation tests with `play`                          |
| Composition          | `WithX` or pattern story                    | Realistic composition when component participates in larger patterns |

## Interaction testing requirements

Interactive components must include `play` functions that test key behaviors:

- Activation by mouse and keyboard (Enter, Space)
- Focus placement and visibility
- Disabled elements not activating
- Accessible names and roles verified via accessible queries

Use accessible queries (`getByRole`, `getByLabelText`, `getByText`) rather than CSS selectors or `data-testid` when possible.

```tsx
export const KeyboardActivation: Story = {
  args: { children: 'Submit', variant: 'primary' },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const button = canvas.getByRole('button', { name: 'Submit' })
    // ... interaction assertions
  },
}
```

## Accessibility

- Stable, named stories render with the Storybook a11y addon checking them automatically.
- Story-level a11y exceptions must be narrow, justified in source comments, and limited to specific rules with documented rationale.
- Broad rule disablement (e.g. `color-contrast: { enabled: false }` for all stories) requires explicit approval and documentation.
- Interaction tests must assert focus management and keyboard behavior that `axe` cannot validate.

Automated accessibility testing is not a substitute for periodic manual keyboard and assistive-technology review.

## Server rendering contract

Server Component compatibility is the default for every public component. Do
not add a `server` tag: the absence of a rendering exception declares that the
component is intended to remain usable directly from a React Server Component.

Components that intentionally require a client boundary must acknowledge that
decision on the component meta with exactly one of these tags:

| Tag           | Contract                                                                    |
| ------------- | --------------------------------------------------------------------------- |
| `client-ssr`  | Requires a client boundary but must produce meaningful initial server HTML. |
| `client-only` | Requires a browser and is not expected to produce meaningful server HTML.   |

Rendering tags belong on the component meta, not individual stories. Every
exception must include a concrete reason:

```tsx
const meta = {
  component: ComponentName,
  tags: ['autodocs', 'client-ssr'],
  parameters: {
    rendering: {
      reason: 'Owns disclosure state and event handlers.',
    },
  },
} satisfies Meta<typeof ComponentName>
```

Run `pnpm test:storybook-react-server` to produce the advisory report under
`apps/storybook-react/test-results/`. The audit reports potential client-only
features without failing. `pnpm test:storybook-react-server:strict` applies the
same contract as a merge-blocking check; it is reserved for the enforcement
phase after existing components have been classified and refactored.

## Visual regression eligibility

Stable fixed-state stories should serve as deterministic visual-regression cases. Stories must be:

- Deterministic across runs (no dates, random values, live network data)
- Free of uncontrolled animation during screenshot capture
- Representative of the supported visual contract

A fully adjustable `Playground` story does not replace fixed regression stories. Each meaningful state variant needs its own fixed story.

## Controls vs. fixed stories

- `Playground` stories provide exploratory Controls for ad-hoc prop toggling. They are not regression coverage.
- Fixed named stories (e.g. `Default`, `Disabled`, `LongContent`) are the regression and documentation surface.
- Every supported state should normally have a fixed named story.

## Accessibility checks

At minimum, each component's stories must verify:

- The component has an appropriate ARIA role
- Interactive elements are keyboard-accessible
- Disabled state is properly communicated
- Color alone is not the only indicator of state

## Documentation

The Meta description should answer:

- What is this component for?
- When should consumers use it?
- When should consumers NOT use it?
- What is the underlying HTML element?
- What are the semantic rules for variants?
- Any known constraints or required prop relationships?

## New component checklist

When adding a new React component to the design system, ensure the following:

- [ ] Meta uses `satisfies Meta<typeof Component>`
- [ ] Story type uses `StoryObj<typeof meta>`
- [ ] `tags: ['autodocs']` is present
- [ ] Component description explains semantic purpose and usage guidance
- [ ] ArgType descriptions explain intent, not prop names
- [ ] `Playground` story exists with all controls
- [ ] `Default` story exists with realistic default props
- [ ] One fixed story per meaningful visual/behavioral variant
- [ ] `Disabled` story if component supports disabled state
- [ ] `LongContent` story for text overflow behavior (if relevant)
- [ ] `Narrow` or `Mobile` story for constrained-width behavior
- [ ] Interactive components have at least one `play`-based interaction test
- [ ] Interaction tests use accessible queries
- [ ] Keyboard activation is tested for interactive components
- [ ] Focus visibility is verified for interactive components
- [ ] Stories are deterministic (no random content, dates, or network calls)
- [ ] At least one composition story showing realistic usage in a known pattern
- [ ] Story-level a11y exceptions are narrow and documented (if any)
- [ ] Component remains Server Component compatible by default
- [ ] Any required `client-ssr` or `client-only` exception is declared on component meta
- [ ] Every rendering exception documents a concrete reason

## Reference implementation

See `packages/react/src/stories/components/Basic/Button.stories.tsx` for the canonical example that demonstrates all required conventions.
