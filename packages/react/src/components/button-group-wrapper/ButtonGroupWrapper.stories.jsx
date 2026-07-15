import React from 'react'
import { ButtonGroupWrapper } from './ButtonGroupWrapper'
import { ButtonWrapper } from '../button-wrapper/ButtonWrapper'

export default {
  title: 'Components/ButtonGroupWrapper',
  component: ButtonGroupWrapper,
}

export const Default = {
  render: () => (
    <ButtonGroupWrapper>
      <li>
        <ButtonWrapper variant="primary">Primary</ButtonWrapper>
      </li>
      <li>
        <ButtonWrapper variant="secondary">Secondary</ButtonWrapper>
      </li>
      <li>
        <ButtonWrapper variant="outline">Outline</ButtonWrapper>
      </li>
    </ButtonGroupWrapper>
  ),
}

export const SingleButton = {
  render: () => (
    <ButtonGroupWrapper>
      <li>
        <ButtonWrapper variant="primary">Submit</ButtonWrapper>
      </li>
    </ButtonGroupWrapper>
  ),
}

export const WithDisabled = {
  render: () => (
    <ButtonGroupWrapper>
      <li>
        <ButtonWrapper variant="primary">Save</ButtonWrapper>
      </li>
      <li>
        <ButtonWrapper variant="secondary" disabled>
          Cancel
        </ButtonWrapper>
      </li>
    </ButtonGroupWrapper>
  ),
}

export const MixedVariants = {
  render: () => (
    <ButtonGroupWrapper>
      <li>
        <ButtonWrapper variant="save">Save</ButtonWrapper>
      </li>
      <li>
        <ButtonWrapper variant="continue">Continue</ButtonWrapper>
      </li>
      <li>
        <ButtonWrapper variant="destructive">Delete</ButtonWrapper>
      </li>
    </ButtonGroupWrapper>
  ),
}
