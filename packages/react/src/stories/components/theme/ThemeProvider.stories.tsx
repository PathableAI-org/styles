import type { Meta, StoryObj } from '@storybook/react'
import { ThemeProvider } from '../../../theme/ThemeProvider'
import { createTheme } from '../../../theme/createTheme'
import { defaultTheme } from '../../../theme/defaultTheme'

const brand = createTheme({
  colors: { accent: '#7c3aed', actionPrimaryBg: '#7c3aed' },
})

const meta = {
  title: 'Components/ThemeProvider',
  component: ThemeProvider,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `Scopes a resolved \`ThemeConfig\` to a subtree by emitting all 25
\`--pathable-color-*\` CSS custom properties as an inline \`style\` on a
polymorphic wrapper element. When the passed theme equals \`defaultTheme\`
(or the prop is omitted), the component renders its \`children\` directly
with **no wrapper element**.

**When to use**: Apply a partial brand override to a section of the page
without affecting the rest of the UI. Resolve partial overrides via
\`createTheme\` before passing in.

**When not to use**: Do NOT use \`ThemeProvider\` as a replacement for
\`createTheme\`. Pass validated, complete \`ThemeConfig\` objects only.

**Underlying element**: \`<div>\` by default; use \`as\` to override.

**Wrapper caveat**: A \`<div>\` wrapper is added whenever the resolved theme
differs from \`defaultTheme\`. This can affect sibling selectors and
DOM structure. When you need zero DOM impact, use the default theme.

**Forward-compatible**: The \`colorScheme\` prop (\`'light' | 'dark'\`) is
a documented no-op hook for future dark-mode support. Both values produce
identical output in this release.`,
      },
    },
  },
} satisfies Meta<typeof ThemeProvider>

export default meta
type Story = StoryObj<typeof meta>

// ---------------------------------------------------------------------------
// Fixed state stories
// ---------------------------------------------------------------------------

export const Default: Story = {
  args: {
    theme: defaultTheme,
    children: (
      <div style={{ padding: 16 }}>
        <p>
          This subtree renders with no wrapper element because the theme equals
          the default.
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'No wrapper is rendered when the theme equals `defaultTheme` (or the `theme` prop is omitted). Children are returned as-is.',
      },
    },
  },
}

export const PartialOverride: Story = {
  args: {
    theme: brand,
    children: (
      <div style={{ padding: 16 }}>
        <p>
          This subtree overrides <code>--pathable-color-accent</code> and{' '}
          <code>--pathable-color-action-primary-bg</code> to{' '}
          <code>#7c3aed</code>. All other 23 tokens fall through to their
          defaults.
        </p>
      </div>
    ),
  },
  parameters: {
    docs: {
      description: {
        story:
          'A partial theme resolved via `createTheme({ colors: { accent, actionPrimaryBg } })` emits overridden tokens plus 23 defaults on a wrapper `<div>`.',
      },
    },
  },
}

export const NestedBrandedSection: Story = {
  render: () => (
    <ThemeProvider theme={defaultTheme}>
      <div style={{ padding: 16 }}>
        <p>This content uses the default theme (no wrapper).</p>
      </div>
      <ThemeProvider theme={brand}>
        <div style={{ padding: 16 }}>
          <p>
            This inner section overrides accent and action primary background.
          </p>
        </div>
      </ThemeProvider>
    </ThemeProvider>
  ),
  parameters: {
    docs: {
      description: {
        story:
          'An outer default-themed provider (no wrapper) wraps a partial-theme inner provider. The inner wrapper&apos;s inline style wins for the tokens it emits; outer content resolves defaults.',
      },
    },
  },
}
