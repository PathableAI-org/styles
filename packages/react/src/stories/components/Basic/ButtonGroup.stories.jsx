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
      <li>
        <Button variant="primary">Primary</Button>
      </li>
      <li>
        <Button variant="secondary">Secondary</Button>
      </li>
      <li>
        <Button variant="outline">Outline</Button>
      </li>
    </ButtonGroup>
  ),
}

export const SingleButton = {
  render: () => (
    <ButtonGroup>
      <li>
        <Button variant="primary">Submit</Button>
      </li>
    </ButtonGroup>
  ),
}

export const WithDisabled = {
  render: () => (
    <ButtonGroup>
      <li>
        <Button variant="primary">Save</Button>
      </li>
      <li>
        <Button variant="secondary" disabled>
          Cancel
        </Button>
      </li>
    </ButtonGroup>
  ),
}

export const MixedVariants = {
  render: () => (
    <ButtonGroup>
      <li>
        <Button variant="save">Save</Button>
      </li>
      <li>
        <Button variant="continue">Continue</Button>
      </li>
      <li>
        <Button variant="destructive">Delete</Button>
      </li>
    </ButtonGroup>
  ),
}
