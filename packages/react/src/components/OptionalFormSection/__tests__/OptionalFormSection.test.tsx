import React, { act, useState } from 'react'
import '@testing-library/jest-dom/vitest'
import { cleanup, fireEvent, render } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Fieldset } from '../../Fieldset/Fieldset'
import { FormGroup } from '../../FormGroup/FormGroup'
import { Input } from '../../Input/Input'
import { Label } from '../../Label/Label'
import { OptionalFormSection } from '../OptionalFormSection'

afterEach(cleanup)

describe('OptionalFormSection', () => {
  it('is collapsed by default and toggles with native click behavior', () => {
    const { container, getByRole } = render(
      <OptionalFormSection heading="Additional details" headingLevel={3}>
        <p>Optional content</p>
      </OptionalFormSection>,
    )
    const button = getByRole('button', { name: 'Additional details' })
    const region = getByRole('region', { hidden: true })

    expect(button).toHaveAttribute('type', 'button')
    expect(button).toHaveAttribute('aria-expanded', 'false')
    expect(region).toHaveAttribute('hidden')
    expect(
      container.querySelector('.pathable-optional-form-section__indicator'),
    ).toHaveAttribute('aria-hidden', 'true')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
    expect(region).not.toHaveAttribute('hidden')

    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('uses defaultExpanded only as the uncontrolled initial state', () => {
    const { getByRole, rerender } = render(
      <OptionalFormSection
        heading="Preferences"
        headingLevel={2}
        defaultExpanded
      >
        Preferences form
      </OptionalFormSection>,
    )
    const button = getByRole('button', { name: 'Preferences' })

    expect(button).toHaveAttribute('aria-expanded', 'true')
    fireEvent.click(button)
    rerender(
      <OptionalFormSection
        heading="Preferences"
        headingLevel={2}
        defaultExpanded
      >
        Preferences form
      </OptionalFormSection>,
    )
    expect(button).toHaveAttribute('aria-expanded', 'false')
  })

  it('requests controlled changes without changing the supplied state', () => {
    const onExpandedChange = vi.fn(() => {
      expect(button).toHaveAttribute('aria-expanded', 'false')
    })
    const { getByRole, rerender } = render(
      <OptionalFormSection
        heading="Contact options"
        headingLevel={4}
        expanded={false}
        onExpandedChange={onExpandedChange}
      >
        Contact fields
      </OptionalFormSection>,
    )
    const button = getByRole('button', { name: 'Contact options' })

    fireEvent.click(button)
    expect(onExpandedChange).toHaveBeenCalledWith(true)
    expect(button).toHaveAttribute('aria-expanded', 'false')

    rerender(
      <OptionalFormSection
        heading="Contact options"
        headingLevel={4}
        expanded
        onExpandedChange={onExpandedChange}
      >
        Contact fields
      </OptionalFormSection>,
    )
    onExpandedChange.mockImplementation(() => {
      expect(button).toHaveAttribute('aria-expanded', 'true')
    })
    fireEvent.click(button)
    expect(onExpandedChange).toHaveBeenLastCalledWith(false)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it('supports consumer-owned state', () => {
    function ControlledSection() {
      const [expanded, setExpanded] = useState(false)
      return (
        <OptionalFormSection
          heading="More settings"
          headingLevel={5}
          expanded={expanded}
          onExpandedChange={setExpanded}
        >
          Settings
        </OptionalFormSection>
      )
    }

    const { getByRole } = render(<ControlledSection />)
    const button = getByRole('button', { name: 'More settings' })
    fireEvent.click(button)
    expect(button).toHaveAttribute('aria-expanded', 'true')
  })

  it.each([2, 3, 4, 5, 6] as const)(
    'renders the button inside an h%s',
    (headingLevel) => {
      const { getByRole } = render(
        <OptionalFormSection
          heading="Optional fields"
          headingLevel={headingLevel}
        >
          Fields
        </OptionalFormSection>,
      )
      const heading = getByRole('heading', {
        level: headingLevel,
        name: 'Optional fields',
      })
      expect(heading.firstElementChild).toBe(
        getByRole('button', { name: 'Optional fields' }),
      )
    },
  )

  it('creates reciprocal and stable accessible relationships', () => {
    const section = (
      <OptionalFormSection heading="Support needs" headingLevel={3}>
        Support fields
      </OptionalFormSection>
    )
    const { getByRole, rerender } = render(section)
    const button = getByRole('button', { name: 'Support needs' })
    const region = getByRole('region', { hidden: true })
    const initialIds = [button.id, region.id]

    expect(button).toHaveAttribute('aria-controls', region.id)
    expect(region).toHaveAttribute('aria-labelledby', button.id)
    rerender(section)
    expect([button.id, region.id]).toEqual(initialIds)
  })

  it('gives ten sections distinct relationships', () => {
    const { getAllByRole } = render(
      <>
        {Array.from({ length: 10 }, (_, index) => (
          <OptionalFormSection key={index} heading="Details" headingLevel={3}>
            Section {index + 1}
          </OptionalFormSection>
        ))}
      </>,
    )
    const buttons = getAllByRole('button', { name: 'Details' })
    const regions = getAllByRole('region', { hidden: true })

    expect(new Set(buttons.map(({ id }) => id)).size).toBe(10)
    expect(new Set(regions.map(({ id }) => id)).size).toBe(10)
    buttons.forEach((button, index) => {
      expect(button).toHaveAttribute('aria-controls', regions[index].id)
      expect(regions[index]).toHaveAttribute('aria-labelledby', button.id)
    })
  })

  it.each(['Enter', ' '])(
    'toggles through native %s keyboard activation and retains focus',
    (key) => {
      const { getByRole } = render(
        <OptionalFormSection heading="Employment" headingLevel={3}>
          Employment fields
        </OptionalFormSection>,
      )
      const button = getByRole('button', { name: 'Employment' })
      button.focus()

      fireEvent.keyDown(button, { key })
      fireEvent.keyUp(button, { key })
      // Browsers dispatch this click for native Enter and Space activation;
      // jsdom does not synthesize it from keyboard events.
      fireEvent.click(button)

      expect(button).toHaveAttribute('aria-expanded', 'true')
      expect(button).toHaveFocus()
    },
  )

  it('does not submit a containing form when toggled', () => {
    const onSubmit = vi.fn((event: React.FormEvent) => event.preventDefault())
    const { getByRole } = render(
      <form onSubmit={onSubmit}>
        <OptionalFormSection heading="Optional address" headingLevel={3}>
          Address fields
        </OptionalFormSection>
      </form>,
    )

    fireEvent.click(getByRole('button', { name: 'Optional address' }))
    expect(onSubmit).not.toHaveBeenCalled()
  })

  it('excludes collapsed descendants from the sequential focus order', () => {
    const { container, getByRole } = render(
      <form>
        <OptionalFormSection heading="Optional address" headingLevel={3}>
          <input aria-label="Apartment" />
        </OptionalFormSection>
        <button type="submit">Continue</button>
      </form>,
    )
    const sequentialControls = [...container.querySelectorAll('button, input')]
      .filter((element) => element.closest('[hidden]') === null)
      .map(
        (element) => element.textContent || element.getAttribute('aria-label'),
      )

    expect(sequentialControls).toEqual(['Optional address', 'Continue'])
    expect(
      getByRole('textbox', { name: 'Apartment', hidden: true }),
    ).not.toBeVisible()
  })

  it('retains field state and submits the same successful fields while collapsed', () => {
    const { getByRole, getByLabelText } = render(
      <form aria-label="Profile form">
        <OptionalFormSection
          heading="Profile details"
          headingLevel={3}
          defaultExpanded
        >
          <label htmlFor="nickname">Nickname</label>
          <input id="nickname" name="nickname" defaultValue="Initial" />
          <label>
            <input name="updates" type="checkbox" value="yes" /> Updates
          </label>
          <label htmlFor="frequency">Frequency</label>
          <select id="frequency" name="frequency" defaultValue="weekly">
            <option value="daily">Daily</option>
            <option value="weekly">Weekly</option>
          </select>
        </OptionalFormSection>
      </form>,
    )
    const input = getByLabelText('Nickname') as HTMLInputElement
    const checkbox = getByLabelText('Updates') as HTMLInputElement
    const select = getByLabelText('Frequency') as HTMLSelectElement
    fireEvent.change(input, { target: { value: 'Sam' } })
    fireEvent.click(checkbox)
    fireEvent.change(select, { target: { value: 'daily' } })
    const form = getByRole('form', { name: 'Profile form' }) as HTMLFormElement
    const expandedData = Object.fromEntries(new FormData(form))
    fireEvent.click(getByRole('button', { name: 'Profile details' }))

    const collapsedData = Object.fromEntries(new FormData(form))
    expect(input.value).toBe('Sam')
    expect(checkbox.checked).toBe(true)
    expect(select.value).toBe('daily')
    expect(collapsedData).toEqual(expandedData)
    expect(collapsedData).toEqual({
      nickname: 'Sam',
      updates: 'yes',
      frequency: 'daily',
    })

    fireEvent.click(getByRole('button', { name: 'Profile details' }))
    fireEvent.click(getByRole('button', { name: 'Profile details' }))
    fireEvent.click(getByRole('button', { name: 'Profile details' }))
    expect(getByLabelText('Nickname')).toBe(input)
    expect(input.value).toBe('Sam')
    expect(select.value).toBe('daily')
  })

  it('preserves FormGroup and Fieldset composition', () => {
    const { getByRole, getByLabelText } = render(
      <OptionalFormSection
        heading="Service preferences"
        headingLevel={3}
        defaultExpanded
      >
        <FormGroup>
          <Label>Service location</Label>
          <Input name="location" />
        </FormGroup>
        <Fieldset>
          <legend>Contact method</legend>
          <label>
            <input name="contact" type="radio" value="email" /> Email
          </label>
        </Fieldset>
      </OptionalFormSection>,
    )

    expect(getByLabelText('Service location')).toHaveAttribute(
      'name',
      'location',
    )
    expect(getByRole('group', { name: 'Contact method' })).toHaveClass(
      'pathable-fieldset',
    )
    expect(getByLabelText('Email')).toHaveAttribute('name', 'contact')
  })

  it('forwards root attributes, consumer id, and classes', () => {
    const { getByTestId } = render(
      <OptionalFormSection
        heading="Other information"
        headingLevel={6}
        id="other-information"
        className="consumer-section"
        data-testid="optional-section"
        title="Optional participant information"
      >
        Fields
      </OptionalFormSection>,
    )
    const root = getByTestId('optional-section')

    expect(root).toHaveClass(
      'pathable-optional-form-section',
      'consumer-section',
    )
    expect(root).toHaveAttribute('id', 'other-information')
    expect(root).toHaveAttribute('title', 'Optional participant information')
  })

  it.each([
    ['empty', ''],
    ['whitespace-only', '  \n\t'],
  ])('rejects a %s heading', (_name, heading) => {
    expect(() =>
      render(
        <OptionalFormSection heading={heading} headingLevel={3}>
          Fields
        </OptionalFormSection>,
      ),
    ).toThrow('OptionalFormSection heading must be a non-empty string.')
  })

  it('rejects a non-string heading at runtime', () => {
    expect(() =>
      render(
        <OptionalFormSection
          heading={null as unknown as string}
          headingLevel={3}
        >
          Fields
        </OptionalFormSection>,
      ),
    ).toThrow('OptionalFormSection heading must be a non-empty string.')
  })

  it('rejects an invalid heading level at runtime', () => {
    expect(() =>
      render(
        <OptionalFormSection heading="Invalid level" headingLevel={1 as 2}>
          Fields
        </OptionalFormSection>,
      ),
    ).toThrow('headingLevel must be an integer from 2 through 6')
  })

  it('rejects a non-numeric heading level at runtime', () => {
    expect(() =>
      render(
        <OptionalFormSection
          heading="Invalid level"
          headingLevel={'toString' as unknown as 2}
        >
          Fields
        </OptionalFormSection>,
      ),
    ).toThrow('headingLevel must be an integer from 2 through 6')
  })

  it('server-renders meaningful collapsed markup', () => {
    const html = renderToString(
      <OptionalFormSection heading="Server details" headingLevel={2}>
        <input name="serverField" defaultValue="retained" />
      </OptionalFormSection>,
    )

    expect(html).toContain('<h2')
    expect(html).toContain('aria-expanded="false"')
    expect(html).toContain('role="region"')
    expect(html).toContain('hidden=""')
    expect(html).toContain('name="serverField"')
  })

  it('hydrates server markup without warnings or changed associations', async () => {
    const section = (
      <OptionalFormSection heading="Hydrated details" headingLevel={3}>
        <input aria-label="Hydrated field" />
      </OptionalFormSection>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(section)
    document.body.append(container)
    const serverButtonId = container.querySelector('button')!.id
    const serverRegionId = container.querySelector('[role="region"]')!.id
    const onRecoverableError = vi.fn()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

    try {
      const root = hydrateRoot(container, section, { onRecoverableError })
      await act(async () => undefined)

      expect(container.querySelector('button')!.id).toBe(serverButtonId)
      expect(container.querySelector('[role="region"]')!.id).toBe(
        serverRegionId,
      )
      expect(onRecoverableError).not.toHaveBeenCalled()
      expect(consoleError).not.toHaveBeenCalled()

      await act(async () => root.unmount())
    } finally {
      consoleError.mockRestore()
      container.remove()
    }
  })
})
