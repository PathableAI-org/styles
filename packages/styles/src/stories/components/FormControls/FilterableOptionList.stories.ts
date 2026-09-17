import { expect, userEvent, within } from 'storybook/test'

type Option = {
  id: string
  label: string
  description?: string
  meta?: string
  checked?: boolean
  disabled?: boolean
}

const defaultOptions: Option[] = [
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

const manyOptions: Option[] = Array.from({ length: 18 }, (_, index) => ({
  id: `service-${index + 1}`,
  label: `Community service option ${String(index + 1).padStart(2, '0')}`,
  description: 'A fixed catalog entry used to demonstrate bounded scrolling.',
  meta: `SRV-${String(index + 1).padStart(2, '0')}`,
  checked: index === 1 || index === 10,
}))

function renderOptions(options: Option[]) {
  return options
    .map((option) => {
      const detailsId = `filterable-${option.id}-details`
      const details =
        option.description || option.meta
          ? `<span class="pathable-filterable-option-list__details" id="${detailsId}">
              ${option.description ? `<span class="pathable-filterable-option-list__description">${option.description}</span>` : ''}
              ${option.meta ? `<span class="pathable-filterable-option-list__meta">${option.meta}</span>` : ''}
            </span>`
          : ''

      return `<li class="pathable-filterable-option-list__option">
        <label class="pathable-checkbox">
          <input
            class="pathable-checkbox__input"
            type="checkbox"
            value="${option.id}"
            ${details ? `aria-describedby="${detailsId}"` : ''}
            ${option.checked ? 'checked' : ''}
            ${option.disabled ? 'disabled' : ''}
          />
          <span class="pathable-checkbox__label">${option.label}</span>
        </label>
        ${details}
      </li>`
    })
    .join('')
}

function renderList({
  id,
  options = defaultOptions,
  query = '',
  status = '0 selected, 4 matches',
  empty,
  disabled = false,
  style = '',
}: {
  id: string
  options?: Option[]
  query?: string
  status?: string
  empty?: string
  disabled?: boolean
  style?: string
}) {
  return `<fieldset
    class="pathable-fieldset pathable-filterable-option-list"
    ${disabled ? 'disabled' : ''}
    ${style ? `style="${style}"` : ''}
  >
    <legend class="pathable-legend">Service standards</legend>
    <div class="pathable-filterable-option-list__filter">
      <label class="pathable-label" for="${id}-filter">Filter standards</label>
      <input
        class="pathable-input pathable-filterable-option-list__filter-input"
        id="${id}-filter"
        type="search"
        value="${query}"
        placeholder="Search by label"
      />
    </div>
    <p
      class="pathable-filterable-option-list__status"
      role="status"
      aria-live="polite"
      aria-atomic="true"
    >${status}</p>
    ${
      empty
        ? `<p class="pathable-filterable-option-list__empty">${empty}</p>`
        : `<ul class="pathable-checkbox__list pathable-filterable-option-list__options">${renderOptions(options)}</ul>`
    }
  </fieldset>`
}

export default {
  title: 'Components/Form Controls/Filterable Option List',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: Framework-neutral semantic shell for a labeled search input and native checkbox group. These Styles stories are static; consumers own filtering and selection behavior.\n\n**Semantics**: Preserve the fieldset and legend, explicit filter label, native list and checkboxes, descriptive `aria-describedby` relationships, and one polite atomic status. Empty and no-match messages are not fake options.\n\n**Resilience**: The option region is vertically bounded, content wraps without horizontal scrolling, and native control states remain visible in narrow, increased-text, and forced-color environments.',
      },
    },
  },
}

export const Default = {
  render: () => renderList({ id: 'default' }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const group = canvas.getByRole('group', { name: 'Service standards' })
    const filter = canvas.getByRole('searchbox', { name: 'Filter standards' })

    await expect(group).toBeVisible()
    await expect(filter).toBeVisible()
    await expect(canvas.getAllByRole('checkbox')).toHaveLength(4)
    await expect(canvas.getByRole('status')).toHaveTextContent(
      '0 selected, 4 matches',
    )
  },
}

export const Selected = {
  render: () =>
    renderList({
      id: 'selected',
      options: defaultOptions.map((option, index) => ({
        ...option,
        checked: index === 0 || index === 2,
      })),
      status: '2 selected, 4 matches',
    }),
}

export const Disabled = {
  render: () =>
    renderList({
      id: 'disabled',
      disabled: true,
      options: defaultOptions.slice(0, 2).map((option, index) => ({
        ...option,
        checked: index === 0,
      })),
      status: '1 selected, 2 matches',
    }),
}

export const Empty = {
  render: () =>
    renderList({
      id: 'empty',
      status: '0 selected, no options available',
      empty: 'No service standards are available.',
    }),
}

export const NoMatches = {
  render: () =>
    renderList({
      id: 'no-matches',
      query: 'aquatic',
      status: '1 selected, no matches for "aquatic"',
      empty:
        'No standards match "aquatic". Clear the filter to view all options.',
    }),
}

export const LongContent = {
  render: () =>
    renderList({
      id: 'long-content',
      options: [
        {
          id: 'long',
          label:
            'Coordinated employment, transportation, communication, and independent-living support planning',
          description:
            'Use this deliberately long localized-looking description to verify that labels and supporting details wrap inside the option region without obscuring the native checkbox or requiring horizontal scrolling.',
          meta: 'EXTREMELY-LONG-CATALOG-REFERENCE-2026-ACCESSIBILITY-REVIEW',
          checked: true,
        },
      ],
      status:
        '1 selected, 1 match for "ExtremelyLongUnbrokenConsumerSuppliedQueryThatMustWrapWithoutOverflowingTheBoundedOptionList"',
    }),
}

export const ManyOptions = {
  render: () =>
    renderList({
      id: 'many-options',
      options: manyOptions,
      status: '2 selected, 18 matches',
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const options = canvasElement.querySelector<HTMLElement>(
      '.pathable-filterable-option-list__options',
    )

    await expect(options).not.toBeNull()
    await expect(options!.scrollHeight).toBeGreaterThan(options!.clientHeight)
    await expect(options!.scrollWidth).toBeLessThanOrEqual(
      options!.clientWidth + 2,
    )

    const checkboxes = canvas.getAllByRole('checkbox')
    canvas.getByRole('searchbox', { name: 'Filter standards' }).focus()
    for (let index = 0; index < checkboxes.length; index += 1) {
      await userEvent.tab()
    }

    const lastCheckbox = checkboxes.at(-1)!
    const focusedLabel = lastCheckbox.closest('label')!
    const optionRect = focusedLabel.getBoundingClientRect()
    const regionRect = options!.getBoundingClientRect()
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

export const Narrow = {
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  render: () =>
    renderList({
      id: 'narrow',
      options: defaultOptions.slice(0, 3),
      status: '0 selected, 3 matches',
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth + 2,
    )
  },
}

export const IncreasedText = {
  render: () =>
    renderList({
      id: 'increased-text',
      options: defaultOptions.slice(0, 3),
      status: '0 selected, 3 matches',
      style: 'font-size: 2rem;',
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await expect(canvasElement.scrollWidth).toBeLessThanOrEqual(
      canvasElement.clientWidth + 2,
    )
  },
}

export const ForcedColors = {
  render: () =>
    renderList({
      id: 'forced-colors',
      options: defaultOptions.map((option, index) => ({
        ...option,
        checked: index === 0,
        disabled: index === 2,
      })),
      status: '1 selected, 4 matches',
    }),
  parameters: {
    docs: {
      description: {
        story:
          'Stable selected and disabled fixture for visual review with the browser forced-colors setting active.',
      },
    },
  },
}
