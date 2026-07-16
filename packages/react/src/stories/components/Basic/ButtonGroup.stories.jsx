import React from 'react'
import { ButtonGroup } from '../../../components/button-group/ButtonGroup'
import { Button } from '../../../components/Button/Button'

export default {
  title: 'Components/ButtonGroup',
  component: ButtonGroup,
}

export const Default = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
    </ButtonGroup>
  ),
}

export const SingleButton = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Submit</Button>
    </ButtonGroup>
  ),
}

export const WithDisabled = {
  render: () => (
    <ButtonGroup>
      <Button variant="primary">Save</Button>
      <Button variant="secondary" disabled>
        Cancel
      </Button>
    </ButtonGroup>
  ),
}

export const MixedVariants = {
  render: () => (
    <ButtonGroup>
      <Button variant="save">Save</Button>
      <Button variant="continue">Continue</Button>
      <Button variant="destructive">Delete</Button>
    </ButtonGroup>
  ),
}
