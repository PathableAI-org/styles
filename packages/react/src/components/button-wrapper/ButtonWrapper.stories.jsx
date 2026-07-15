import React from 'react'
import { ButtonWrapper } from './ButtonWrapper'

export default {
  title: 'Components/ButtonWrapper',
  component: ButtonWrapper,
  argTypes: {
    variant: {
      control: 'select',
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
    },
    size: { control: 'select', options: ['default', 'big'] },
    children: { control: 'text' },
    disabled: { control: 'boolean' },
  },
}

const Template = (args) => <ButtonWrapper {...args} />

export const Default = Template.bind({})
Default.args = {
  children: 'Default Button',
  variant: 'primary',
  size: 'default',
}

export const Primary = Template.bind({})
Primary.args = { children: 'Primary', variant: 'primary' }

export const Secondary = Template.bind({})
Secondary.args = { children: 'Secondary', variant: 'secondary' }

export const AccentCool = Template.bind({})
AccentCool.args = { children: 'Accent Cool', variant: 'accent-cool' }

export const AccentWarm = Template.bind({})
AccentWarm.args = { children: 'Accent Warm', variant: 'accent-warm' }

export const Outline = Template.bind({})
Outline.args = { children: 'Outline', variant: 'outline' }

export const Inverse = Template.bind({})
Inverse.args = { children: 'Inverse', variant: 'inverse' }

export const Base = Template.bind({})
Base.args = { children: 'Base', variant: 'base' }

export const Unstyled = Template.bind({})
Unstyled.args = { children: 'Unstyled', variant: 'unstyled' }

export const Save = Template.bind({})
Save.args = { children: 'Save', variant: 'save' }

export const Continue = Template.bind({})
Continue.args = { children: 'Continue', variant: 'continue' }

export const Review = Template.bind({})
Review.args = { children: 'Review', variant: 'review' }

export const Destructive = Template.bind({})
Destructive.args = { children: 'Destructive', variant: 'destructive' }

export const LowEmphasis = Template.bind({})
LowEmphasis.args = { children: 'Low Emphasis', variant: 'low-emphasis' }

export const Big = Template.bind({})
Big.args = { children: 'Big Button', variant: 'primary', size: 'big' }

export const Disabled = Template.bind({})
Disabled.args = { children: 'Disabled', variant: 'primary', disabled: true }
