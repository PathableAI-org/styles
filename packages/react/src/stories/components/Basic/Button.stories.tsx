import { Button } from '../../../components/Button/Button'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/Button',
  component: Button,
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: React component\n\n**Consumers must**: Import from `@pathable/react`. No additional CSS import required.',
      },
    },
  },
  argTypes: {
    variant: {
      options: [
        'primary',
        'secondary',
        'accent-cool',
        'accent-warm',
        'outline',
        'inverse',
        'base',
        'unstyled',
        'save',
        'continue',
        'review',
        'destructive',
        'low-emphasis',
      ],
      control: { type: 'select' },
      description: 'The visual variant of the button.',
    },
    size: {
      options: ['default', 'big'],
      control: { type: 'select' },
      description: 'The size variant of the button.',
    },
    children: {
      control: { type: 'text' },
      description: 'The content of the button.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names.',
    },
  },
} satisfies Meta<typeof Button>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
    size: 'default',
  },
}

export const Primary: Story = {
  args: {
    children: 'Primary Button',
    variant: 'primary',
  },
}

export const Secondary: Story = {
  args: {
    children: 'Secondary Button',
    variant: 'secondary',
  },
}

export const AccentCool: Story = {
  args: {
    children: 'Accent Cool Button',
    variant: 'accent-cool',
  },
}

export const AccentWarm: Story = {
  args: {
    children: 'Accent Warm Button',
    variant: 'accent-warm',
  },
}

export const Outline: Story = {
  args: {
    children: 'Outline Button',
    variant: 'outline',
  },
}

export const Inverse: Story = {
  args: {
    children: 'Inverse Button',
    variant: 'inverse',
  },
}

export const Base: Story = {
  args: {
    children: 'Base Button',
    variant: 'base',
  },
}

export const Unstyled: Story = {
  args: {
    children: 'Unstyled Button',
    variant: 'unstyled',
  },
}

export const Save: Story = {
  args: {
    children: 'Save Button',
    variant: 'save',
  },
}

export const Continue: Story = {
  args: {
    children: 'Continue Button',
    variant: 'continue',
  },
}

export const Review: Story = {
  args: {
    children: 'Review Button',
    variant: 'review',
  },
}

export const Destructive: Story = {
  args: {
    children: 'Destructive Button',
    variant: 'destructive',
  },
}

export const LowEmphasis: Story = {
  args: {
    children: 'Low Emphasis Button',
    variant: 'low-emphasis',
  },
}

export const SizeBig: Story = {
  args: {
    children: 'Big Button',
    variant: 'primary',
    size: 'big',
  },
}

export const Disabled: Story = {
  args: {
    children: 'Disabled Button',
    variant: 'primary',
    disabled: true,
  },
}
