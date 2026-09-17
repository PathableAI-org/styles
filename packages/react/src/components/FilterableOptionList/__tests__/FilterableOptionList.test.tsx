import React, { act, useState } from 'react'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  FilterableOptionList,
  type FilterableOption,
  type FilterableOptionListProps,
} from '../FilterableOptionList'

afterEach(cleanup)

const options: FilterableOption[] = [
  {
    id: 'employment',
    label: 'Employment support',
    description: 'Help finding work',
    meta: 'EMP-01',
  },
  { id: 'transport', label: 'Transportation', disabled: true },
  { id: 'housing', label: 'Housing support' },
]

// @ts-expect-error External filtering delegates matching and cannot accept a client predicate.
const invalidExternalFilteringProps: FilterableOptionListProps = {
  legend: 'Services',
  options,
  filterMode: 'external',
  filterOption: () => true,
}
void invalidExternalFilteringProps

const invalidLegendProps: FilterableOptionListProps = {
  // @ts-expect-error Accessible names must be non-empty strings, not nullable nodes.
  legend: null,
  options,
}
void invalidLegendProps

const invalidFilterLabelProps: FilterableOptionListProps = {
  legend: 'Services',
  options,
  // @ts-expect-error Accessible names must be non-empty strings, not arbitrary nodes.
  filterLabel: <span>Filter services</span>,
}
void invalidFilterLabelProps

async function resetForm(form: HTMLFormElement) {
  await act(async () => {
    form.reset()
    await Promise.resolve()
  })
}

describe('FilterableOptionList', () => {
  it('renders native group, search, list, checkbox, and detail semantics', () => {
    const { getByRole, getAllByRole, getByText } = render(
      <FilterableOptionList legend="Services" options={options} />,
    )

    expect(getByRole('group', { name: 'Services' })).toBeTruthy()
    expect(getByRole('searchbox', { name: 'Filter options' })).toBeTruthy()
    expect(getByRole('list')).toBeTruthy()
    expect(getAllByRole('listitem')).toHaveLength(3)
    expect(getAllByRole('checkbox')).toHaveLength(3)

    const employment = getByRole('checkbox', {
      name: 'Employment support',
    })
    const description = getByText('Help finding work')
    const meta = getByText('EMP-01')
    expect(employment.getAttribute('aria-describedby')).toBe(
      description.parentElement?.id,
    )
    expect(meta.parentElement).toBe(description.parentElement)
    expect(getByRole('status').textContent).toBe('0 selected, 3 matches')
  })

  it('filters trimmed case-insensitive label substrings by default', () => {
    const { getByRole, queryByRole } = render(
      <FilterableOptionList legend="Services" options={options} />,
    )

    fireEvent.change(getByRole('searchbox'), {
      target: { value: '  HOUSING  ' },
    })

    expect(getByRole('checkbox', { name: 'Housing support' })).toBeTruthy()
    expect(queryByRole('checkbox', { name: 'Employment support' })).toBeNull()
    expect(getByRole('status').textContent).toBe(
      '0 selected, 1 match for "HOUSING"',
    )
  })

  it('supports custom matching and controlled query state', () => {
    const onQueryChange = vi.fn()
    const filterOption = vi.fn(
      (option: FilterableOption, query: string) =>
        option.meta === query.toUpperCase(),
    )
    const { getByRole, rerender } = render(
      <FilterableOptionList
        legend="Services"
        options={options}
        query="EMP-01"
        onQueryChange={onQueryChange}
        filterOption={filterOption}
      />,
    )

    expect(getByRole('checkbox', { name: 'Employment support' })).toBeTruthy()
    fireEvent.change(getByRole('searchbox'), { target: { value: 'housing' } })
    expect(onQueryChange).toHaveBeenCalledWith('housing')
    expect((getByRole('searchbox') as HTMLInputElement).value).toBe('EMP-01')

    rerender(
      <FilterableOptionList
        legend="Services"
        options={options}
        query="housing"
        onQueryChange={onQueryChange}
        filterOption={filterOption}
      />,
    )
    expect(getByRole('status').textContent).toBe(
      '0 selected, no matches for "housing"',
    )
  })

  it('changes the live status when equal-count queries replace results', () => {
    const { getByRole } = render(
      <FilterableOptionList legend="Services" options={options} />,
    )
    const searchbox = getByRole('searchbox')
    const status = getByRole('status')

    fireEvent.change(searchbox, { target: { value: 'employment' } })
    expect(status.textContent).toBe('0 selected, 1 match for "employment"')

    fireEvent.change(searchbox, { target: { value: 'housing' } })
    expect(status.textContent).toBe('0 selected, 1 match for "housing"')
  })

  it('delegates filtering in external mode while reporting query changes', () => {
    const onQueryChange = vi.fn()
    const { getByRole, getAllByRole } = render(
      <FilterableOptionList
        legend="Services"
        options={options}
        filterMode="external"
        defaultQuery="server query"
        onQueryChange={onQueryChange}
      />,
    )

    expect(getAllByRole('checkbox')).toHaveLength(3)
    fireEvent.change(getByRole('searchbox'), { target: { value: 'next' } })
    expect(onQueryChange).toHaveBeenCalledWith('next')
    expect(getAllByRole('checkbox')).toHaveLength(3)
  })

  it('rejects a client predicate in external mode at runtime', () => {
    const unsafeProps = {
      filterMode: 'external',
      filterOption: () => true,
    } as unknown as Partial<FilterableOptionListProps>

    expect(() =>
      render(
        <FilterableOptionList
          legend="Services"
          options={options}
          {...unsafeProps}
        />,
      ),
    ).toThrow('filterOption is only valid in client mode')
  })

  it('reports the restored uncontrolled query so external results reset', async () => {
    const onQueryChange = vi.fn()

    function ExternalFilteringForm() {
      const [externalQuery, setExternalQuery] = useState('')
      const externalOptions = externalQuery
        ? options.filter((option) =>
            option.label.toLowerCase().includes(externalQuery.toLowerCase()),
          )
        : options

      return (
        <form>
          <FilterableOptionList
            legend="Services"
            options={externalOptions}
            filterMode="external"
            onQueryChange={(nextQuery) => {
              onQueryChange(nextQuery)
              setExternalQuery(nextQuery)
            }}
          />
        </form>
      )
    }

    const { container, getAllByRole, getByRole } = render(
      <ExternalFilteringForm />,
    )
    const form = container.querySelector('form')!
    const searchbox = getByRole('searchbox') as HTMLInputElement

    fireEvent.change(searchbox, { target: { value: 'housing' } })
    expect(searchbox.value).toBe('housing')
    expect(getAllByRole('checkbox')).toHaveLength(1)

    onQueryChange.mockClear()
    await resetForm(form)

    expect(searchbox.value).toBe('')
    expect(getAllByRole('checkbox')).toHaveLength(3)
    expect(onQueryChange).toHaveBeenCalledTimes(1)
    expect(onQueryChange).toHaveBeenCalledWith('')
  })

  it('supports uncontrolled selection and preserves unknown defaults', () => {
    const onValuesChange = vi.fn()
    const { getByRole } = render(
      <FilterableOptionList
        legend="Services"
        options={options}
        defaultValues={['unknown', 'employment', 'employment']}
        onValuesChange={onValuesChange}
      />,
    )

    expect(getByRole('status').textContent).toBe('2 selected, 3 matches')
    expect(
      (
        getByRole('checkbox', {
          name: 'Employment support',
        }) as HTMLInputElement
      ).checked,
    ).toBe(true)

    fireEvent.click(getByRole('checkbox', { name: 'Housing support' }))
    expect(onValuesChange).toHaveBeenLastCalledWith([
      'unknown',
      'employment',
      'housing',
    ])
    expect(getByRole('status').textContent).toBe('3 selected, 3 matches')
  })

  it('does not expose uncontrolled state to callback mutation', () => {
    const onValuesChange = vi.fn((nextValues: readonly string[]) => {
      const mutableValues = nextValues as string[]
      mutableValues.push('consumer-mutation')
    })
    const { container, getByRole } = render(
      <form>
        <FilterableOptionList
          legend="Services"
          options={options}
          defaultValues={['employment']}
          onValuesChange={onValuesChange}
          name="services"
        />
      </form>,
    )

    fireEvent.click(getByRole('checkbox', { name: 'Housing support' }))

    expect(onValuesChange).toHaveBeenCalledWith([
      'employment',
      'housing',
      'consumer-mutation',
    ])
    expect(getByRole('status').textContent).toBe('2 selected, 3 matches')
    expect(
      new FormData(container.querySelector('form')!).getAll('services'),
    ).toEqual(['employment', 'housing'])
  })

  it('keeps controlled selection unchanged until its owner updates values', () => {
    const onValuesChange = vi.fn()
    const controlledValues = ['housing', 'missing', 'housing']
    const { getByRole, rerender } = render(
      <FilterableOptionList
        legend="Services"
        options={options}
        values={controlledValues}
        onValuesChange={onValuesChange}
      />,
    )

    const employment = getByRole('checkbox', { name: 'Employment support' })
    fireEvent.click(employment)
    expect(onValuesChange).toHaveBeenCalledWith([
      'housing',
      'missing',
      'employment',
    ])
    expect(controlledValues).toEqual(['housing', 'missing', 'housing'])
    expect(onValuesChange.mock.calls[0][0]).not.toBe(controlledValues)
    expect((employment as HTMLInputElement).checked).toBe(false)

    rerender(
      <FilterableOptionList
        legend="Services"
        options={options}
        values={['housing', 'missing', 'employment']}
        onValuesChange={onValuesChange}
      />,
    )
    expect((employment as HTMLInputElement).checked).toBe(true)
    expect(getByRole('status').textContent).toBe('3 selected, 3 matches')
  })

  it('blocks disabled group and option changes', () => {
    const onValuesChange = vi.fn()
    const { getByRole, rerender } = render(
      <FilterableOptionList
        legend="Services"
        options={options}
        onValuesChange={onValuesChange}
      />,
    )

    const transport = getByRole('checkbox', { name: 'Transportation' })
    expect((transport as HTMLInputElement).disabled).toBe(true)
    fireEvent.click(transport)
    expect(onValuesChange).not.toHaveBeenCalled()

    rerender(
      <FilterableOptionList
        legend="Services"
        options={options}
        disabled
        onValuesChange={onValuesChange}
      />,
    )
    const employment = getByRole('checkbox', { name: 'Employment support' })
    expect((employment as HTMLInputElement).disabled).toBe(true)
    fireEvent.click(employment)
    expect(onValuesChange).not.toHaveBeenCalled()
  })

  it('submits repeated hidden values and excludes a disabled group', () => {
    const { container, rerender } = render(
      <form>
        <FilterableOptionList
          legend="Services"
          options={options}
          values={['missing', 'housing', 'housing']}
          name="services"
        />
      </form>,
    )
    const form = container.querySelector('form')!

    expect(new FormData(form).getAll('services')).toEqual([
      'missing',
      'housing',
    ])

    rerender(
      <form>
        <FilterableOptionList
          legend="Services"
          options={options}
          values={['missing', 'housing']}
          name="services"
          disabled
        />
      </form>,
    )
    expect(new FormData(form).getAll('services')).toEqual([])
  })

  it('associates hidden values and reset behavior with an external form', async () => {
    const { container, getByRole } = render(
      <>
        <form id="service-form" />
        <FilterableOptionList
          legend="Services"
          options={options}
          defaultValues={['employment']}
          defaultQuery="support"
          name="services"
          form="service-form"
        />
      </>,
    )
    const form = container.querySelector('form')!

    expect(new FormData(form).getAll('services')).toEqual(['employment'])
    fireEvent.click(getByRole('checkbox', { name: 'Housing support' }))
    fireEvent.change(getByRole('searchbox'), { target: { value: 'housing' } })
    expect(new FormData(form).getAll('services')).toEqual([
      'employment',
      'housing',
    ])

    await resetForm(form)
    expect((getByRole('searchbox') as HTMLInputElement).value).toBe('support')
    expect(new FormData(form).getAll('services')).toEqual(['employment'])
  })

  it('restores uncontrolled defaults on native form reset', async () => {
    const { container, getByRole } = render(
      <form>
        <FilterableOptionList
          legend="Services"
          options={options}
          defaultValues={['employment']}
          defaultQuery="support"
        />
      </form>,
    )
    const form = container.querySelector('form')!

    fireEvent.click(getByRole('checkbox', { name: 'Housing support' }))
    fireEvent.change(getByRole('searchbox'), { target: { value: 'housing' } })
    expect(getByRole('status').textContent).toBe(
      '2 selected, 1 match for "housing"',
    )

    await resetForm(form)
    expect((getByRole('searchbox') as HTMLInputElement).value).toBe('support')
    expect(getByRole('status').textContent).toBe(
      '1 selected, 2 matches for "support"',
    )
    expect(
      (
        getByRole('checkbox', {
          name: 'Employment support',
        }) as HTMLInputElement
      ).checked,
    ).toBe(true)
  })

  it('reapplies controlled query and selection after native form reset', async () => {
    const { container, getByRole, rerender } = render(
      <form>
        <FilterableOptionList
          legend="Services"
          options={options}
          filterMode="external"
          values={['employment']}
          query="support"
        />
      </form>,
    )
    const form = container.querySelector('form')!

    rerender(
      <form>
        <FilterableOptionList
          legend="Services"
          options={options}
          filterMode="external"
          values={['housing']}
          query="housing"
        />
      </form>,
    )

    const searchbox = getByRole('searchbox') as HTMLInputElement
    const employment = getByRole('checkbox', {
      name: 'Employment support',
    }) as HTMLInputElement
    const housing = getByRole('checkbox', {
      name: 'Housing support',
    }) as HTMLInputElement
    expect(searchbox.value).toBe('housing')
    expect(employment.checked).toBe(false)
    expect(housing.checked).toBe(true)

    await resetForm(form)

    expect(searchbox.value).toBe('housing')
    expect(employment.checked).toBe(false)
    expect(housing.checked).toBe(true)
  })

  it('restores defaults when the parent rerenders during native reset', async () => {
    function RerenderingResetForm() {
      const [, setResetCount] = useState(0)

      return (
        <form onReset={() => setResetCount((count) => count + 1)}>
          <FilterableOptionList
            legend="Services"
            options={options}
            defaultValues={['employment']}
            defaultQuery="support"
          />
        </form>
      )
    }

    const { container, getByRole } = render(<RerenderingResetForm />)
    const form = container.querySelector('form')!

    fireEvent.click(getByRole('checkbox', { name: 'Housing support' }))
    fireEvent.change(getByRole('searchbox'), { target: { value: 'housing' } })

    await resetForm(form)

    expect((getByRole('searchbox') as HTMLInputElement).value).toBe('support')
    expect(
      (
        getByRole('checkbox', {
          name: 'Employment support',
        }) as HTMLInputElement
      ).checked,
    ).toBe(true)
    expect(
      (
        getByRole('checkbox', {
          name: 'Housing support',
        }) as HTMLInputElement
      ).checked,
    ).toBe(false)
  })

  it('uses defaults and callbacks committed by a parent reset update', async () => {
    const initialOnQueryChange = vi.fn()
    const updatedOnQueryChange = vi.fn()

    function UpdatingResetForm() {
      const [updated, setUpdated] = useState(false)

      return (
        <form onReset={() => setUpdated(true)}>
          <FilterableOptionList
            legend="Services"
            options={options}
            defaultValues={updated ? ['housing'] : ['employment']}
            defaultQuery={updated ? 'housing' : 'support'}
            onQueryChange={
              updated ? updatedOnQueryChange : initialOnQueryChange
            }
          />
        </form>
      )
    }

    const { container, getByRole } = render(<UpdatingResetForm />)
    const form = container.querySelector('form')!

    fireEvent.click(getByRole('checkbox', { name: 'Employment support' }))
    fireEvent.change(getByRole('searchbox'), { target: { value: 'transport' } })
    initialOnQueryChange.mockClear()

    await resetForm(form)

    expect((getByRole('searchbox') as HTMLInputElement).value).toBe('housing')
    expect(
      (getByRole('checkbox', { name: 'Housing support' }) as HTMLInputElement)
        .checked,
    ).toBe(true)
    expect(initialOnQueryChange).not.toHaveBeenCalled()
    expect(updatedOnQueryChange).toHaveBeenCalledOnce()
    expect(updatedOnQueryChange).toHaveBeenCalledWith('housing')
  })

  it('preserves uncontrolled state when native reset is cancelled', async () => {
    const onQueryChange = vi.fn()
    const { container, getByRole } = render(
      <form onReset={(event) => event.preventDefault()}>
        <FilterableOptionList
          legend="Services"
          options={options}
          defaultValues={['employment']}
          defaultQuery="support"
          onQueryChange={onQueryChange}
        />
      </form>,
    )
    const form = container.querySelector('form')!

    fireEvent.click(getByRole('checkbox', { name: 'Housing support' }))
    fireEvent.change(getByRole('searchbox'), { target: { value: 'housing' } })
    onQueryChange.mockClear()
    await resetForm(form)

    expect((getByRole('searchbox') as HTMLInputElement).value).toBe('housing')
    expect(getByRole('status').textContent).toBe(
      '2 selected, 1 match for "housing"',
    )
    expect(onQueryChange).not.toHaveBeenCalled()
  })

  it('observes an externally associated form mounted after the list', async () => {
    const { container, getByRole } = render(
      <FilterableOptionList
        legend="Services"
        options={options}
        defaultValues={['employment']}
        defaultQuery="support"
        form="late-form"
      />,
    )
    fireEvent.change(getByRole('searchbox'), { target: { value: 'housing' } })

    const form = document.createElement('form')
    form.id = 'late-form'
    container.append(form)
    await resetForm(form)

    expect((getByRole('searchbox') as HTMLInputElement).value).toBe('support')
  })

  it('retains selection and stable associations across option replacement', () => {
    const { getByRole, rerender } = render(
      <FilterableOptionList
        legend="Services"
        options={options}
        defaultValues={['employment', 'housing']}
        name="services"
      />,
    )
    const housingId = getByRole('checkbox', { name: 'Housing support' }).id

    rerender(
      <FilterableOptionList
        legend="Services"
        options={[options[2], options[1]]}
        defaultValues={['employment', 'housing']}
        name="services"
      />,
    )
    expect(getByRole('checkbox', { name: 'Housing support' }).id).toBe(
      housingId,
    )
    expect(getByRole('status').textContent).toBe('2 selected, 2 matches')

    rerender(
      <FilterableOptionList
        legend="Services"
        options={[options[2], options[0], options[1]]}
        defaultValues={['employment', 'housing']}
        name="services"
      />,
    )
    expect(getByRole('checkbox', { name: 'Housing support' }).id).toBe(
      housingId,
    )
    expect(
      (
        getByRole('checkbox', {
          name: 'Employment support',
        }) as HTMLInputElement
      ).checked,
    ).toBe(true)
  })

  it('renders empty and no-match states without fake options', () => {
    const { getByRole, queryByRole, rerender } = render(
      <FilterableOptionList
        legend="Services"
        options={[]}
        emptyMessage="Catalog unavailable"
      />,
    )

    expect(getByRole('status').textContent).toBe(
      '0 selected, no options available',
    )
    expect(getByRole('group').textContent).toContain('Catalog unavailable')
    expect(queryByRole('list')).toBeNull()

    rerender(
      <FilterableOptionList
        legend="Services"
        options={[]}
        query="not present"
        emptyMessage="Catalog unavailable"
        noMatchesMessage="Nothing found"
      />,
    )
    expect(getByRole('status').textContent).toBe(
      '0 selected, no options available for "not present"',
    )
    expect(getByRole('group').textContent).toContain('Catalog unavailable')
    expect(getByRole('group').textContent).not.toContain('Nothing found')

    rerender(
      <FilterableOptionList
        legend="Services"
        options={options}
        query="not present"
        noMatchesMessage="Nothing found"
      />,
    )
    expect(getByRole('status').textContent).toBe(
      '0 selected, no matches for "not present"',
    )
    expect(getByRole('group').textContent).toContain('Nothing found')
    expect(queryByRole('list')).toBeNull()

    rerender(
      <FilterableOptionList
        legend="Services"
        options={[]}
        filterMode="external"
        query="not present"
        emptyMessage="Catalog unavailable"
        noMatchesMessage="Nothing found"
      />,
    )
    expect(getByRole('status').textContent).toBe(
      '0 selected, no matches for "not present"',
    )
    expect(getByRole('group').textContent).toContain('Nothing found')
  })

  it('can render without filtering and forwards fieldset attributes', () => {
    const { getByRole, queryByRole } = render(
      <FilterableOptionList
        legend="Services"
        options={options}
        filterable={false}
        className="consumer-class"
        data-testid="service-picker"
      />,
    )

    expect(queryByRole('searchbox')).toBeNull()
    expect(getByRole('group').className).toBe(
      'pathable-fieldset pathable-filterable-option-list consumer-class',
    )
    expect(getByRole('group').getAttribute('data-testid')).toBe(
      'service-picker',
    )
  })

  it('fails clearly for empty labels and empty or duplicate option ids', () => {
    expect(() =>
      render(
        <FilterableOptionList
          legend="Services"
          options={[{ id: ' ', label: 'Empty id' }]}
        />,
      ),
    ).toThrow('option ids must be non-empty')

    expect(() =>
      render(
        <FilterableOptionList
          legend="Services"
          options={[{ id: 'empty-label', label: ' ' }]}
        />,
      ),
    ).toThrow('option labels must be non-empty')

    expect(() =>
      render(
        <FilterableOptionList
          legend="Services"
          options={[
            { id: 'same', label: 'One' },
            { id: 'same', label: 'Two' },
          ]}
        />,
      ),
    ).toThrow('option ids must be unique')
  })

  it('rejects missing accessible names from untyped callers', () => {
    const invalidLegend = {
      legend: null,
    } as unknown as Partial<FilterableOptionListProps>
    const invalidFilterLabel = {
      filterLabel: ' ',
    } as Partial<FilterableOptionListProps>

    expect(() =>
      render(
        <FilterableOptionList
          legend="Services"
          options={options}
          {...invalidLegend}
        />,
      ),
    ).toThrow('legend must be non-empty')

    expect(() =>
      render(
        <FilterableOptionList
          legend="Services"
          options={options}
          {...invalidFilterLabel}
        />,
      ),
    ).toThrow('filterLabel must be non-empty')

    expect(() =>
      render(
        <FilterableOptionList
          legend="Services"
          options={options}
          filterable={false}
          {...invalidFilterLabel}
        />,
      ),
    ).not.toThrow()
  })

  it('drops unsafe fieldset content props supplied at runtime', () => {
    const unsafeProps = {
      dangerouslySetInnerHTML: {
        __html: '<span data-injected="true">Injected content</span>',
      },
    } as unknown as Partial<FilterableOptionListProps>

    const { container, getByRole } = render(
      <FilterableOptionList
        legend="Services"
        options={options}
        {...unsafeProps}
      />,
    )

    expect(getByRole('group', { name: 'Services' })).toBeTruthy()
    expect(container.querySelector('[data-injected="true"]')).toBeNull()
  })

  it('handles 500 local options', () => {
    const manyOptions = Array.from({ length: 500 }, (_, index) => ({
      id: `option-${index}`,
      label: `Option ${index}`,
    }))
    const { getByRole, getAllByRole } = render(
      <FilterableOptionList legend="Large catalog" options={manyOptions} />,
    )

    expect(getAllByRole('checkbox')).toHaveLength(500)
    const searchbox = getByRole('searchbox')
    const startedAt = performance.now()
    fireEvent.change(searchbox, {
      target: { value: 'Option 499' },
    })
    const elapsed = performance.now() - startedAt
    expect(getAllByRole('checkbox')).toHaveLength(1)
    expect(getByRole('status').textContent).toBe(
      '0 selected, 1 match for "Option 499"',
    )
    expect(elapsed).toBeLessThan(100)
  })

  it('generates collision-free associations across multiple instances', () => {
    const { container, getAllByRole } = render(
      <>
        <FilterableOptionList legend="Primary services" options={options} />
        <FilterableOptionList legend="Backup services" options={options} />
      </>,
    )
    const controls = getAllByRole('searchbox').concat(
      getAllByRole('checkbox'),
    ) as HTMLInputElement[]
    const ids = controls.map((control) => control.id)
    const descriptions = Array.from(
      container.querySelectorAll<HTMLElement>('[id$="-details"]'),
    ).map((description) => description.id)

    expect(new Set(ids).size).toBe(ids.length)
    expect(new Set(descriptions).size).toBe(descriptions.length)
    for (const checkbox of getAllByRole('checkbox')) {
      const descriptionId = checkbox.getAttribute('aria-describedby')
      if (descriptionId)
        expect(document.getElementById(descriptionId)).toBeTruthy()
    }
  })

  it('server-renders and hydrates with stable associations', async () => {
    const element = <FilterableOptionList legend="Services" options={options} />
    const html = renderToString(element)
    const container = document.createElement('div')
    container.innerHTML = html
    document.body.appendChild(container)
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    let root: ReturnType<typeof hydrateRoot>
    await act(async () => {
      root = hydrateRoot(container, element)
    })

    const filter = container.querySelector('input[type="search"]')!
    const filterLabel = container.querySelector(
      '.pathable-filterable-option-list__filter label',
    )!
    const describedCheckbox = container.querySelector(
      'input[aria-describedby]',
    )!
    expect(filterLabel.getAttribute('for')).toBe(filter.id)
    expect(
      document.getElementById(
        describedCheckbox.getAttribute('aria-describedby')!,
      ),
    ).not.toBeNull()
    expect(consoleError).not.toHaveBeenCalled()

    await act(async () => root!.unmount())
    consoleError.mockRestore()
    container.remove()
  })
})
