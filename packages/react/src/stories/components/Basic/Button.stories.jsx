import React from 'react'
import { Button } from '../../../components/Button/Button'

export default {
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
      defaultValue: 'primary',
    },
    size: {
      options: ['default', 'big'],
      control: { type: 'select' },
      description: 'The size variant of the button.',
      defaultValue: 'default',
    },
    children: {
      control: { type: 'text' },
      description: 'The content of the button.',
      defaultValue: 'Button Text',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Whether the button is disabled.',
      defaultValue: false,
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names.',
      defaultValue: '',
    },
  },
}

const Template = (args) => <Button {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Primary Button',
  variant: 'primary',
  size: 'default',
}

export const Primary = Template.bind({})
Primary.args = {
  children: 'Primary Button',
  variant: 'primary',
}

export const Secondary = Template.bind({})
Secondary.args = {
  children: 'Secondary Button',
  variant: 'secondary',
}

export const AccentCool = Template.bind({})
AccentCool.args = {
  children: 'Accent Cool Button',
  variant: 'accent-cool',
}

export const AccentWarm = Template.bind({})
AccentWarm.args = {
  children: 'Accent Warm Button',
  variant: 'accent-warm',
}

export const Outline = Template.bind({})
Outline.args = {
  children: 'Outline Button',
  variant: 'outline',
}

export const Inverse = Template.bind({})
Inverse.args = {
  children: 'Inverse Button',
  variant: 'inverse',
}

export const Base = Template.bind({})
Base.args = {
  children: 'Base Button',
  variant: 'base',
}

export const Unstyled = Template.bind({})
Unstyled.args = {
  children: 'Unstyled Button',
  variant: 'unstyled',
}

export const Save = Template.bind({})
Save.args = {
  children: 'Save Button',
  variant: 'save',
}

export const Continue = Template.bind({})
Continue.args = {
  children: 'Continue Button',
  variant: 'continue',
}

export const Review = Template.bind({})
Review.args = {
  children: 'Review Button',
  variant: 'review',
}

export const Destructive = Template.bind({})
Destructive.args = {
  children: 'Destructive Button',
  variant: 'destructive',
}

export const LowEmphasis = Template.bind({})
LowEmphasis.args = {
  children: 'Low Emphasis Button',
  variant: 'low-emphasis',
}

export const SizeBig = Template.bind({})
SizeBig.args = {
  children: 'Big Button',
  variant: 'primary',
  size: 'big',
}

export const Disabled = Template.bind({})
Disabled.args = {
  children: 'Disabled Button',
  variant: 'primary',
  disabled: true,
}
