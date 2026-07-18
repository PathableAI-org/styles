import { ButtonGroup } from '../../../components/button-group/ButtonGroup'
import { Button } from '../../../components/Button/Button'
import type { Meta, StoryObj } from '@storybook/react'

const meta = {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>

export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </ButtonGroup>
  ),
}

export const SingleButton: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Submit</Button>
    </ButtonGroup>
  ),
}

export const WithDisabled: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Save</Button>
      <Button variant="secondary" disabled>
        Cancel
      </Button>
    </ButtonGroup>
  ),
}

export const MixedVariants: Story = {
  render: () => (
    <ButtonGroup>
      <Button variant="save">Save</Button>
      <Button variant="continue">Continue</Button>
      <Button variant="destructive">Delete</Button>
    </ButtonGroup>
  ),
}
