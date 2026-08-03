import {
  Skeleton,
  type SkeletonProps,
} from '../../../components/Skeleton/Skeleton'
import type { Meta, StoryObj } from '@storybook/react'
import type { HTMLAttributes } from 'react'
import { expect, userEvent, within } from 'storybook/test'

const focusAttackProps: HTMLAttributes<HTMLDivElement> = {
  contentEditable: true,
  tabIndex: 0,
}

const runtimeUnsupportedVariantProps = {
  variant: 'unsupported',
  'data-skeleton-fallback': 'true',
} as unknown as SkeletonProps

const meta = {
  title: 'Components/Feedback/Skeleton',
  component: Skeleton,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A decorative loading placeholder that preserves the approximate shape of content while it is unavailable. Skeleton maps directly to the existing PathAble skeleton container and shape classes.

**When to use**: Use Skeleton while content is loading when preserving its eventual dimensions will reduce layout shift. Choose the shape that matches the content being replaced, or omit the variant to compose several placeholders.

**When not to use**: Do not use Skeleton for empty, error, or completed states, and do not use it as a progress announcement. Pair the loading region with separate assistive text when users need an update.

**Underlying element**: A decorative \`<div aria-hidden="true">\`. The wrapper always hides the placeholder from assistive technology and does not manage loading state, timers, or replacement content.

**Variants**: \`text-heading\`, \`text-body\`, \`avatar\`, \`card\`, \`table-row\`, and \`row\` map to the implemented PathAble modifiers. Omit \`variant\` for a composition container.

**Accessibility**: Keep interactive or meaningful content outside Skeleton. The root is excluded from the accessibility tree and is not keyboard focusable by default. Provide loading status text separately when an announcement is required.`,
      },
    },
  },
  argTypes: {
    variant: {
      options: [
        'text-heading',
        'text-body',
        'avatar',
        'card',
        'table-row',
        'row',
      ],
      control: { type: 'select' },
      description:
        'The placeholder shape. Omit it for a container of composed Skeleton children.',
    },
    children: {
      control: false,
      description:
        'Optional composed placeholder content. Intended primarily when `variant` is omitted.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended after the PathAble skeleton classes.',
    },
  },
  args: {
    variant: 'text-body',
  },
} satisfies Meta<typeof Skeleton>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    variant: undefined,
    'data-default-skeleton': 'true',
  },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector('[data-default-skeleton]')

    await expect(skeleton).toHaveClass('pathable-skeleton')
    await expect(skeleton?.className).toBe('pathable-skeleton')
  },
}

export const GroupedText: Story = {
  args: {
    variant: undefined,
    children: (
      <>
        <Skeleton variant="text-heading" />
        <Skeleton variant="text-body" />
        <Skeleton variant="text-body" />
      </>
    ),
  },
}

export const TextHeading: Story = {
  args: { variant: 'text-heading' },
}

export const TextBody: Story = {
  args: { variant: 'text-body' },
}

export const Avatar: Story = {
  args: { variant: 'avatar' },
}

export const Card: Story = {
  args: { variant: 'card' },
}

export const TableRow: Story = {
  args: { variant: 'table-row' },
}

export const Row: Story = {
  args: { variant: 'row' },
}

export const UnsupportedVariantFallback: Story = {
  name: 'Unsupported Variant (fallback)',
  render: () => (
    <Skeleton {...runtimeUnsupportedVariantProps}>
      <Skeleton variant="text-body" />
    </Skeleton>
  ),
  play: async ({ canvasElement }) => {
    const fallback = canvasElement.querySelector('[data-skeleton-fallback]')

    await expect(fallback).toHaveClass('pathable-skeleton')
    await expect(fallback).not.toHaveClass('pathable-skeleton--unsupported')
  },
}

export const CustomAttributes: Story = {
  args: {
    variant: 'card',
    id: 'participant-card-placeholder',
    className: 'dashboard-placeholder',
    'data-loading-region': 'participant-card',
  },
  play: async ({ canvasElement }) => {
    const skeleton = canvasElement.querySelector(
      '#participant-card-placeholder',
    )

    await expect(skeleton).toHaveClass(
      'pathable-skeleton',
      'pathable-skeleton--card',
      'dashboard-placeholder',
    )
    await expect(skeleton).toHaveAttribute(
      'data-loading-region',
      'participant-card',
    )
  },
}

export const RowWithAvatar: Story = {
  render: () => (
    <Skeleton>
      <Skeleton variant="row">
        <Skeleton variant="avatar" />
        <Skeleton style={{ flex: 1 }}>
          <Skeleton variant="text-heading" />
          <Skeleton variant="text-body" />
        </Skeleton>
      </Skeleton>
    </Skeleton>
  ),
}

export const ContentGroup: Story = {
  render: () => (
    <Skeleton>
      <Skeleton variant="card" />
      <Skeleton variant="text-heading" />
      <Skeleton variant="text-body" />
      <Skeleton variant="text-body" />
    </Skeleton>
  ),
}

export const Narrow: Story = {
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
  render: () => (
    <Skeleton>
      <Skeleton variant="card" />
      <Skeleton variant="text-heading" />
      <Skeleton variant="text-body" />
    </Skeleton>
  ),
}

export const AccessibilityExclusion: Story = {
  render: () => (
    <div>
      <button type="button">Before placeholder</button>
      <Skeleton
        {...focusAttackProps}
        variant="card"
        aria-hidden={false}
        data-accessibility-skeleton="true"
      />
      <button type="button">After placeholder</button>
    </div>
  ),
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const skeleton = canvasElement.querySelector(
      '[data-accessibility-skeleton]',
    )

    await step(
      'the wrapper enforces accessibility-tree exclusion',
      async () => {
        await expect(skeleton).toHaveAttribute('aria-hidden', 'true')
        await expect(skeleton).toHaveAttribute('contenteditable', 'false')
        await expect(skeleton).not.toHaveAttribute('tabindex')
      },
    )

    await step('keyboard focus skips the decorative placeholder', async () => {
      const before = canvas.getByRole('button', { name: 'Before placeholder' })
      const after = canvas.getByRole('button', { name: 'After placeholder' })

      await userEvent.tab()
      await expect(before).toHaveFocus()
      await userEvent.tab()
      await expect(after).toHaveFocus()
    })
  },
}
