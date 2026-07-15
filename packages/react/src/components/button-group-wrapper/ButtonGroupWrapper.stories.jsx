import React from 'react'
import { Button } from '../Button/Button' // Update import path

export default {
  title: 'Components/ButtonGroup', // Update story title
  component: Button, // Assuming ButtonGroup component will be rendered using Button, adjust if ButtonGroup is a distinct component
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: React component\n\n**Consumers must**: Import from `@pathable/react`. No additional CSS import required.',
      },
    },
  },
  argTypes: {
    children: {
      control: { type: 'text' },
      description:
        'Button group content (expects Button components or similar).',
      defaultValue: `
        <li><Button variant="save">Save</Button></li>
        <li><Button variant="cancel">Cancel</Button></li>
      `,
    },
    className: {
      control: { type: 'text' },
      description: 'Additional CSS class names for the button group container.',
      defaultValue: '',
    },
  },
}

const Template = (args) => (
  <div className="button-group" {...args}>
    {' '}
    {/* Added a container div with button-group class */}
    {args.children}
  </div>
)

export const Default = Template.bind({})
Default.args = {
  children: (
    <>
      <li>
        <Button variant="save">Save</Button>
      </li>
      <li>
        <Button variant="cancel">Cancel</Button>
      </li>
    </>
  ),
}

export const RowLayout = Template.bind({})
RowLayout.args = {
  children: (
    <>
      <li>
        <Button variant="primary">Option 1</Button>
      </li>
      <li>
        <Button variant="primary">Option 2</Button>
      </li>
      <li>
        <Button variant="primary">Option 3</Button>
      </li>
    </>
  ),
}
