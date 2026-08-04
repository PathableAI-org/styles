import type { FormEvent } from 'react'
import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

import { Search } from '../../../components/Search/Search'

const submitSpy = fn()

function handleSubmit(event: FormEvent<HTMLFormElement>) {
  event.preventDefault()
  submitSpy(event)
}

const meta = {
  title: 'Components/Navigation/Search',
  component: Search,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A native search form that pairs an associated search field with a submit button and applies the existing PathAble search contract.

**When to use**: Use Search when a query should submit through a real form boundary. Use the big size when the visible button label needs more prominence.

**When not to use**: Do not use Search as a filter that updates on every keystroke, a command palette, or a results-state manager. The consuming application owns query values, submission handling, and results.

**Underlying elements**: Native \`<form role="search">\`, \`<label>\`, \`<input type="search">\`, and \`<button type="submit">\` elements.

**Accessibility**: The required label is associated with the searchbox. The fixed search SVG is decorative; the button label remains accessible in both sizes. Native Enter and button submission behavior is preserved.`,
      },
    },
  },
  argTypes: {
    size: {
      options: ['default', 'big'],
      control: { type: 'select' },
      description:
        'Selects the default icon-button treatment or the big treatment with visible button text.',
    },
    label: {
      control: { type: 'text' },
      description:
        'Accessible name associated with the native search input. Keep it specific to the searchable content.',
    },
    buttonLabel: {
      control: { type: 'text' },
      description:
        'Submit action label. It is visually hidden at the default size and visible at the big size.',
    },
    inputProps: {
      control: 'object',
      description:
        'Native search input attributes, including controlled or uncontrolled value props, callbacks, name, placeholder, and disabled state.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional class names appended after the PathAble search classes.',
    },
    onSubmit: {
      control: false,
      description:
        'Native form submit handler. Search does not prevent default submission or perform a request.',
    },
  },
  args: {
    size: 'default',
    label: 'Search participant resources',
    buttonLabel: 'Search',
    inputProps: {
      id: 'search-playground',
      name: 'search',
      placeholder: 'Search resources',
    },
    onSubmit: handleSubmit,
  },
} satisfies Meta<typeof Search>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: {
    inputProps: {
      id: 'search-default',
      name: 'query',
      placeholder: 'Search',
    },
  },
}

export const Big: Story = {
  args: {
    size: 'big',
    label: 'Search coaching resources',
    buttonLabel: 'Search resources',
    inputProps: {
      id: 'search-big',
      name: 'query',
      placeholder: 'Search coaching resources',
    },
  },
}

function ControlledSearchStory() {
  const [query, setQuery] = useState('employment coaching')

  return (
    <Search
      size="big"
      label="Search participant records"
      inputProps={{
        id: 'search-controlled',
        name: 'query',
        value: query,
        onChange: (event) => setQuery(event.target.value),
      }}
      onSubmit={handleSubmit}
    />
  )
}

export const ControlledInput: Story = {
  render: () => <ControlledSearchStory />,
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const searchbox = canvas.getByRole('searchbox', {
      name: 'Search participant records',
    })

    await userEvent.clear(searchbox)
    await userEvent.type(searchbox, 'job readiness')
    await expect(searchbox).toHaveValue('job readiness')
  },
}

export const DisabledInput: Story = {
  args: {
    label: 'Search archived records',
    inputProps: {
      id: 'search-disabled',
      name: 'query',
      defaultValue: 'Archived participant',
      disabled: true,
    },
  },
  play: async ({ canvasElement }) => {
    submitSpy.mockClear()
    const canvas = within(canvasElement)
    const searchbox = canvas.getByRole('searchbox', {
      name: 'Search archived records',
    })
    const button = canvas.getByRole('button', { name: 'Search' })

    await expect(searchbox).toBeDisabled()
    await userEvent.type(searchbox, ' changed')
    await expect(searchbox).toHaveValue('Archived participant')
    await expect(button).toBeEnabled()
    await userEvent.click(button)
    await expect(submitSpy).toHaveBeenCalledTimes(1)
  },
}

export const LongLabels: Story = {
  args: {
    size: 'big',
    label:
      'Search employment coaching resources, workplace readiness guides, and participant planning materials',
    buttonLabel: 'Search all participant planning and coaching resources',
    inputProps: {
      id: 'search-long-labels',
      name: 'query',
      placeholder: 'Enter a participant, program, resource, or topic',
    },
  },
}

export const Narrow: Story = {
  args: {
    label: 'Search participant resources',
    inputProps: {
      id: 'search-narrow',
      name: 'query',
      placeholder: 'Search',
    },
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const CustomAttributes: Story = {
  args: {
    className: 'custom-search',
    method: 'get',
    action: '/resources',
    'aria-label': 'Resource catalog search',
    label: 'Search resource catalog',
    inputProps: {
      id: 'resource-search-query',
    },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('search', { name: 'Resource catalog search' })
    await expect(form).toHaveClass('pathable-search', 'custom-search')
    await expect(form).toHaveAttribute('method', 'get')
    await expect(form).toHaveAttribute('action', '/resources')
  },
}

export const KeyboardSubmission: Story = {
  args: {
    label: 'Search programs',
    inputProps: {
      id: 'search-keyboard',
      name: 'query',
    },
  },
  play: async ({ canvasElement }) => {
    submitSpy.mockClear()
    const canvas = within(canvasElement)
    const searchbox = canvas.getByRole('searchbox', {
      name: 'Search programs',
    })
    const button = canvas.getByRole('button', { name: 'Search' })

    await userEvent.tab()
    await expect(searchbox).toHaveFocus()
    await userEvent.type(searchbox, 'employment coaching')
    await userEvent.keyboard('{Enter}')
    await expect(submitSpy).toHaveBeenCalledTimes(1)

    submitSpy.mockClear()
    await userEvent.click(button)
    await expect(submitSpy).toHaveBeenCalledTimes(1)
  },
}

export const ResultsPageComposition: Story = {
  render: () => (
    <main>
      <h1>Participant resources</h1>
      <p>Search coaching guides and workplace readiness materials.</p>
      <Search
        size="big"
        label="Search participant resources"
        buttonLabel="Search resources"
        inputProps={{
          id: 'results-page-search',
          name: 'query',
          defaultValue: 'interview preparation',
        }}
        onSubmit={handleSubmit}
      />
      <section aria-labelledby="results-heading">
        <h2 id="results-heading">Resources</h2>
        <ul className="pathable-list">
          <li>Interview preparation checklist</li>
          <li>Practice interview question bank</li>
          <li>Follow-up conversation guide</li>
        </ul>
      </section>
    </main>
  ),
}
