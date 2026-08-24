import { Heading } from '../../../components/Heading/Heading'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Heading',
  component: Heading,
  tags: ['autodocs', 'behavior-contract'],
  parameters: {
    docs: {
      description: {
        component: `A semantic heading primitive that maps HTML heading levels (h1–h6) to the design system's typography scale.

**When to use**: For any heading that defines the document outline. The \`level\` prop controls both the rendered HTML element and the visual style, ensuring intentional heading selection.

**When not to use**: For body text — use the \`Text\` primitive. \`Heading\` does not accept an \`as\` prop, tone modifiers, or raw typography props (font size, weight, line height, family).

**Underlying element**: Always \`h1\`–\`h6\`, determined by \`level\`. No \`as\` override is available — \`Heading\` is always a heading element.

**Accessibility**: Native heading elements (\`h1\`–\`h6\`) provide correct heading role and level to assistive technology without ARIA overrides. All levels use \`--pathable-color-text\` (12.48:1 contrast on white), meeting WCAG AA requirements.`,
      },
    },
  },
  argTypes: {
    level: {
      options: [1, 2, 3, 4, 5, 6],
      control: { type: 'select' },
      description:
        'Document outline level. Controls the HTML heading element and visual style. Required.',
    },
    visualLevel: {
      options: [1, 2, 3, 4, 5, 6],
      control: { type: 'select' },
      description:
        'Optional visual style override. When set, the element is h{level} but the CSS class is pathable-heading--level-{visualLevel}. Defaults to level.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the heading classes.',
    },
    children: {
      control: { type: 'text' },
      description: 'Heading content.',
    },
  },
  args: {
    level: 2,
    children: 'Heading Text',
  },
} satisfies Meta<typeof Heading>

export default meta
type Story = StoryObj<typeof meta>

// ── Individual Level Stories ───────────────────────────────────────

export const Level1: Story = {
  args: { level: 1, children: 'Level 1 — Display Large' },
}

export const Level2: Story = {
  args: { level: 2, children: 'Level 2 — Heading Large' },
}

export const Level3: Story = {
  args: { level: 3, children: 'Level 3 — Heading Medium' },
}

export const Level4: Story = {
  args: { level: 4, children: 'Level 4 — Heading Small' },
}

export const Level5: Story = {
  args: { level: 5, children: 'Level 5 — Body Medium Bold' },
}

export const Level6: Story = {
  args: { level: 6, children: 'Level 6 — Body Small Bold' },
}

// ── Visual Level Divergence ───────────────────────────────────────

export const VisualLevelDivergence: Story = {
  args: { level: 3, visualLevel: 2, children: 'h3 element styled like h2' },
  parameters: {
    docs: {
      description: {
        story:
          'The element is an `<h3>` (document outline level 3), but has the visual style of a level-2 heading. `level` controls semantics and accessibility; `visualLevel` controls only the CSS class.',
      },
    },
  },
}

// ── Showcase Stories ──────────────────────────────────────────

export const AllLevels: Story = {
  render: () => (
    <div>
      <Heading level={1}>Level 1 — Page Title</Heading>
      <Heading level={2}>Level 2 — Section Heading</Heading>
      <Heading level={3}>Level 3 — Subsection</Heading>
      <Heading level={4}>Level 4 — Sub-subsection</Heading>
      <Heading level={5}>Level 5 — Minor Heading</Heading>
      <Heading level={6}>Level 6 — Small Heading</Heading>
    </div>
  ),
}

export const WithCustomClass: Story = {
  args: {
    level: 2,
    className: 'custom-style',
    children: 'Heading with custom class',
  },
}
