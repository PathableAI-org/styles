import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { expect, fn, userEvent, waitFor, within } from 'storybook/test'

import { Button } from '../../../components/Button/Button'
import {
  FilterableOptionList,
  type FilterableOption,
} from '../../../components/FilterableOptionList/FilterableOptionList'
import { Form } from '../../../components/Form/Form'
import { FormGroup } from '../../../components/FormGroup/FormGroup'

const OPTIONS: readonly FilterableOption[] = [
  {
    id: 'employment',
    label: 'Employment support',
    description: 'Services related to obtaining or retaining work.',
    meta: 'EMP-01',
  },
  {
    id: 'independent-living',
    label: 'Independent living',
    description: 'Skills and supports for daily community life.',
    meta: 'LIV-02',
  },
  {
    id: 'transportation',
    label: 'Transportation planning',
    description: 'Route planning and travel training.',
    meta: 'TRN-03',
  },
  {
    id: 'workplace',
    label: 'Workplace communication',
    description: 'Communication strategies for work settings.',
    meta: 'COM-04',
  },
]

const MANY_OPTIONS: readonly FilterableOption[] = Array.from(
  { length: 24 },
  (_, index) => ({
    id: `service-${index + 1}`,
    label: `Community service option ${String(index + 1).padStart(2, '0')}`,
    description: 'A fixed catalog entry used to demonstrate bounded scrolling.',
    meta: `SRV-${String(index + 1).padStart(2, '0')}`,
  }),
)

const meta = {
  title: 'Components/Form Controls/FilterableOptionList',
  component: FilterableOptionList,
  tags: ['autodocs', 'client-ssr', 'behavior-contract'],
  parameters: {
    rendering: {
      reason:
        'Owns query and selection state, reset synchronization, and input event handlers while producing meaningful initial server HTML.',
    },
    docs: {
      description: {
        component: `A filterable native-checkbox group for choosing multiple values from dozens or hundreds of known options.

**When to use**: Use FilterableOptionList when people need to compare, filter, and select multiple catalog entries. Use Checkbox for one choice, Radio or Select for one-of-many selection, and ComboBox for one searchable choice. Use virtualization or a product-owned remote-results experience for catalogs too large to render together.

**Ownership**: The component can own initial query and selection state, or the application can control either value. Client filtering matches trimmed, case-insensitive label text by default. External mode reports query changes and renders the options supplied by the application without filtering them again. Data fetching, loading, errors, authorization, validation policy, and domain wording remain application-owned.

**Accessibility and forms**: The underlying fieldset and legend name a group of native checkboxes. The filter has a separate visible label, descriptions and metadata describe rather than rename checkboxes, and one polite status reports selection and result counts. Tab follows native control order and Space toggles a focused checkbox. A supplied name creates repeated hidden form values for every selected ID, including filtered-out or externally absent selections.

**Rendering**: FilterableOptionList produces meaningful server HTML but requires a client boundary for interaction and hydration. It does not require the optional \`@pathableai/styles/js\` bundle.`,
      },
    },
  },
  argTypes: {
    legend: {
      control: { type: 'text' },
      description: 'Visible accessible name for the checkbox group.',
    },
    options: {
      control: { type: 'object' },
      description:
        'Ordered options with unique non-empty IDs, labels, and optional descriptions, metadata, and disabled states.',
    },
    values: {
      control: { type: 'object' },
      description:
        'Controlled ordered selection, including IDs not in options.',
    },
    defaultValues: {
      control: { type: 'object' },
      description: 'Initial ordered selection for uncontrolled usage.',
    },
    onValuesChange: {
      action: 'valuesChange',
      description: 'Called with the complete next ordered selection.',
    },
    filterable: {
      control: { type: 'boolean' },
      description: 'Shows the filter input; enabled by default.',
    },
    filterMode: {
      control: 'inline-radio',
      options: ['client', 'external'],
      description:
        'Chooses built-in matching or application-supplied result filtering.',
    },
    query: {
      control: { type: 'text' },
      description: 'Controlled filter query.',
    },
    defaultQuery: {
      control: { type: 'text' },
      description: 'Initial filter query for uncontrolled usage.',
    },
    onQueryChange: {
      action: 'queryChange',
      description: 'Called whenever the filter query changes.',
    },
    filterOption: {
      control: false,
      description:
        'Optional application-owned predicate used by client filtering.',
    },
    filterLabel: {
      control: { type: 'text' },
      description: 'Visible accessible label for the filter input.',
    },
    filterPlaceholder: {
      control: { type: 'text' },
      description: 'Supplemental placeholder text; never the filter name.',
    },
    name: {
      control: { type: 'text' },
      description: 'Shared native form field name for selected IDs.',
    },
    emptyMessage: {
      control: { type: 'text' },
      description: 'Content shown when the supplied catalog is empty.',
    },
    noMatchesMessage: {
      control: { type: 'text' },
      description: 'Content shown when a client query has no matches.',
    },
    disabled: {
      control: { type: 'boolean' },
      description: 'Disables the fieldset and every control in the group.',
    },
    className: {
      control: { type: 'text' },
      description: 'Additional class names appended to the root fieldset.',
    },
  },
  args: {
    legend: 'Service standards',
    options: OPTIONS,
    filterLabel: 'Filter standards',
    filterPlaceholder: 'Search by label',
  },
} satisfies Meta<typeof FilterableOptionList>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('group', { name: 'Service standards' }),
    ).toBeVisible()
    await expect(
      canvas.getByRole('searchbox', { name: 'Filter standards' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('checkbox')).toHaveLength(4)
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '0 selected, 4 matches',
    )
  },
}

export const Uncontrolled: Story = {
  args: {
    defaultValues: ['employment'],
    defaultQuery: 'support',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('searchbox', { name: 'Filter standards' }),
    ).toHaveValue('support')
    await expect(
      canvas.getByRole('checkbox', { name: 'Employment support' }),
    ).toBeChecked()
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '1 selected, 1 match for "support"',
    )
  },
}

export const Controlled: Story = {
  args: {
    onValuesChange: fn(),
    onQueryChange: fn(),
  },
  render: (args) => {
    const [values, setValues] = useState<readonly string[]>(['employment'])
    const [query, setQuery] = useState('')

    return (
      <div>
        <FilterableOptionList
          {...args}
          values={values}
          query={query}
          onValuesChange={(nextValues) => {
            args.onValuesChange?.(nextValues)
            setValues(nextValues)
          }}
          onQueryChange={(nextQuery) => {
            args.onQueryChange?.(nextQuery)
            setQuery(nextQuery)
          }}
        />
        <p>Application selection: {values.join(', ')}</p>
        <p>Application query: {query || 'none'}</p>
      </div>
    )
  },
  play: async ({ canvasElement, args }) => {
    const canvas = within(canvasElement)
    const filter = canvas.getByRole('searchbox', { name: 'Filter standards' })

    await userEvent.type(filter, 'transport')
    await userEvent.click(
      canvas.getByRole('checkbox', { name: 'Transportation planning' }),
    )

    await expect(
      canvas.getByText('Application selection: employment, transportation'),
    ).toBeVisible()
    await expect(canvas.getByText('Application query: transport')).toBeVisible()
    await expect(args.onQueryChange).toHaveBeenLastCalledWith('transport')
    await expect(args.onValuesChange).toHaveBeenLastCalledWith([
      'employment',
      'transportation',
    ])
  },
}

export const ClientFiltering: Story = {
  args: {
    filterOption: (option, query) =>
      `${option.label} ${String(option.meta ?? '')}`
        .toLowerCase()
        .includes(query.trim().toLowerCase()),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const filter = canvas.getByRole('searchbox', { name: 'Filter standards' })

    await userEvent.type(filter, 'trn-03')

    await expect(
      canvas.getByRole('checkbox', { name: 'Transportation planning' }),
    ).toBeVisible()
    await expect(canvas.getAllByRole('checkbox')).toHaveLength(1)
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '0 selected, 1 match for "trn-03"',
    )
  },
}

export const ExternalFiltering: Story = {
  render: (args) => {
    const [query, setQuery] = useState('')
    const normalizedQuery = query.trim().toLowerCase()
    const results = normalizedQuery
      ? OPTIONS.filter((option) =>
          option.label.toLowerCase().includes(normalizedQuery),
        )
      : OPTIONS

    return (
      <FilterableOptionList
        {...args}
        options={results}
        values={['transportation']}
        filterMode="external"
        query={query}
        onQueryChange={setQuery}
      />
    )
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const filter = canvas.getByRole('searchbox', { name: 'Filter standards' })

    await userEvent.type(filter, 'workplace')

    await expect(
      canvas.getByRole('checkbox', { name: 'Workplace communication' }),
    ).toBeVisible()
    await expect(
      canvas.queryByRole('checkbox', { name: 'Transportation planning' }),
    ).not.toBeInTheDocument()
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '1 selected, 1 match for "workplace"',
    )
  },
}

export const FilteringAndKeyboardSelection: Story = {
  args: {
    defaultValues: ['transportation'],
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const filter = canvas.getByRole('searchbox', { name: 'Filter standards' })

    await step(
      'filters without moving focus or clearing hidden selections',
      async () => {
        await userEvent.click(filter)
        await userEvent.type(filter, 'employment')
        await expect(filter).toHaveFocus()
        await expect(
          canvas.queryByRole('checkbox', { name: 'Transportation planning' }),
        ).not.toBeInTheDocument()
        await expect(canvas.getByRole('status')).toHaveTextContent(
          '1 selected, 1 match for "employment"',
        )
      },
    )

    await step(
      'uses native Space behavior to add the visible option',
      async () => {
        const checkbox = canvas.getByRole('checkbox', {
          name: 'Employment support',
        })
        await userEvent.tab()
        await expect(checkbox).toHaveFocus()
        await userEvent.keyboard(' ')
        await expect(checkbox).toBeChecked()
        await expect(canvas.getByRole('status')).toHaveTextContent(
          '2 selected, 1 match for "employment"',
        )
      },
    )

    await step(
      'clears the query and restores the hidden selection',
      async () => {
        await userEvent.click(filter)
        await userEvent.clear(filter)
        await expect(
          canvas.getByRole('checkbox', { name: 'Transportation planning' }),
        ).toBeChecked()
        await expect(canvas.getByRole('status')).toHaveTextContent(
          '2 selected, 4 matches',
        )
      },
    )
  },
}

export const NoResults: Story = {
  args: {
    defaultValues: ['employment'],
    defaultQuery: 'aquatic',
    noMatchesMessage: 'No standards match this filter.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText('No standards match this filter.'),
    ).toBeVisible()
    await expect(canvas.queryAllByRole('checkbox')).toHaveLength(0)
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '1 selected, no matches for "aquatic"',
    )
  },
}

export const Empty: Story = {
  args: {
    options: [],
    emptyMessage: 'No service standards are available.',
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByText('No service standards are available.'),
    ).toBeVisible()
    await expect(canvas.queryByRole('list')).not.toBeInTheDocument()
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '0 selected, no options available',
    )
  },
}

export const Disabled: Story = {
  args: {
    disabled: true,
    options: OPTIONS.slice(0, 2),
    defaultValues: ['employment'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('group', { name: 'Service standards' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('searchbox', { name: 'Filter standards' }),
    ).toBeDisabled()
    for (const checkbox of canvas.getAllByRole('checkbox')) {
      await expect(checkbox).toBeDisabled()
    }
  },
}

export const DisabledOption: Story = {
  args: {
    options: OPTIONS.map((option) =>
      option.id === 'transportation' ? { ...option, disabled: true } : option,
    ),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('checkbox', { name: 'Transportation planning' }),
    ).toBeDisabled()
    await expect(
      canvas.getByRole('checkbox', { name: 'Employment support' }),
    ).toBeEnabled()
  },
}

export const LongContent: Story = {
  args: {
    legend:
      'ServiceStandardsForCoordinatedEmploymentAndIndependentLivingPlanningWithoutBreaks',
    filterLabel:
      'FilterServiceStandardsForCoordinatedEmploymentAndIndependentLivingPlanningWithoutBreaks',
    options: [
      {
        id: 'coordinated-support',
        label:
          'Coordinated employment, transportation, communication, and independent-living support planning',
        description:
          'Use this deliberately long localized-looking description to verify that labels and supporting details wrap without obscuring the native checkbox or requiring horizontal scrolling.',
        meta: 'EXTREMELY-LONG-CATALOG-REFERENCE-2026-ACCESSIBILITY-REVIEW',
      },
    ],
    defaultValues: ['coordinated-support'],
    defaultQuery:
      'ExtremelyLongUnbrokenConsumerSuppliedQueryThatMustWrapWithoutOverflowingTheBoundedOptionList',
    filterMode: 'external',
  },
}

export const ManyOptions: Story = {
  args: {
    options: MANY_OPTIONS,
    defaultValues: ['service-2', 'service-11'],
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const optionRegion = canvasElement.querySelector<HTMLElement>(
      '.pathable-filterable-option-list__options',
    )

    if (!optionRegion) throw new Error('Expected the option region')
    await expect(optionRegion.scrollHeight).toBeGreaterThan(
      optionRegion.clientHeight,
    )
    await expect(optionRegion.scrollWidth).toBeLessThanOrEqual(
      optionRegion.clientWidth + 2,
    )

    const checkboxes = canvas.getAllByRole('checkbox')
    canvas.getByRole('searchbox', { name: 'Filter standards' }).focus()
    for (let index = 0; index < checkboxes.length; index += 1) {
      await userEvent.tab()
    }

    const lastCheckbox = checkboxes.at(-1)!
    const focusedLabel = lastCheckbox.closest('label')!
    const optionRect = focusedLabel.getBoundingClientRect()
    const regionRect = optionRegion.getBoundingClientRect()
    const focusStyle = getComputedStyle(focusedLabel)
    await expect(lastCheckbox).toHaveFocus()
    await expect(focusStyle.outlineStyle).toBe('solid')
    await expect(Number.parseFloat(focusStyle.outlineWidth)).toBeGreaterThan(0)
    await expect(
      Number.parseFloat(focusStyle.outlineOffset),
    ).toBeLessThanOrEqual(0)
    await expect(optionRect.top).toBeGreaterThanOrEqual(regionRect.top)
    await expect(optionRect.bottom).toBeLessThanOrEqual(regionRect.bottom)
  },
}

export const Narrow: Story = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth + 2,
    )
  },
}

export const IncreasedText: Story = {
  args: {
    style: { fontSize: '2rem' },
  },
  play: async ({ canvasElement }) => {
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth + 2,
    )
  },
}

export const ForcedColors: Story = {
  args: {
    options: OPTIONS.map((option) =>
      option.id === 'transportation' ? { ...option, disabled: true } : option,
    ),
    defaultValues: ['employment'],
  },
  parameters: {
    docs: {
      description: {
        story:
          'Stable selected and disabled fixture for visual review with the browser forced-colors setting active.',
      },
    },
  },
}

export const FormSubmission: Story = {
  render: (args) => {
    const [submission, setSubmission] = useState('not submitted')

    return (
      <form
        aria-label="Service plan"
        onSubmit={(event) => {
          event.preventDefault()
          const values = new FormData(event.currentTarget).getAll('services')
          setSubmission(values.join(', ') || 'none')
        }}
      >
        <FilterableOptionList
          {...args}
          name="services"
          defaultValues={['employment', 'transportation']}
          defaultQuery="employment"
        />
        <Button type="submit">Save service plan</Button>
        <Button type="reset" variant="secondary">
          Reset service plan
        </Button>
        <p>Submitted values: {submission}</p>
      </form>
    )
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)
    const filter = canvas.getByRole('searchbox', { name: 'Filter standards' })

    await step(
      'submits selected IDs hidden by the current filter',
      async () => {
        await userEvent.click(
          canvas.getByRole('button', { name: 'Save service plan' }),
        )
        await expect(
          canvas.getByText('Submitted values: employment, transportation'),
        ).toBeVisible()
      },
    )

    await step('native reset restores uncontrolled defaults', async () => {
      await userEvent.clear(filter)
      await userEvent.click(
        canvas.getByRole('checkbox', { name: 'Employment support' }),
      )
      await userEvent.click(
        canvas.getByRole('button', { name: 'Reset service plan' }),
      )

      await waitFor(() => expect(filter).toHaveValue('employment'))
      await expect(
        canvas.getByRole('checkbox', { name: 'Employment support' }),
      ).toBeChecked()
      await expect(canvas.getByRole('status')).toHaveTextContent(
        '2 selected, 1 match for "employment"',
      )
    })
  },
}

export const FormComposition: Story = {
  render: (args) => (
    <Form>
      <FormGroup>
        <FilterableOptionList
          {...args}
          name="services"
          defaultValues={['employment']}
        />
      </FormGroup>
    </Form>
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Service standards' })
    const filter = canvas.getByRole('searchbox', { name: 'Filter standards' })

    await expect(group.closest('.pathable-form-group')).toBeVisible()
    await expect(filter.id).not.toBe('')
    await expect(canvas.getAllByRole('status')).toHaveLength(1)
  },
}
