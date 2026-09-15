import React, { Fragment, act } from 'react'
import { cleanup, render } from '@testing-library/react'
import { hydrateRoot } from 'react-dom/client'
import { renderToString } from 'react-dom/server'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { ErrorMessage } from '../../ErrorMessage/ErrorMessage'
import { Hint } from '../../Hint/Hint'
import { Input } from '../../Input/Input'
import { Label } from '../../Label/Label'
import { Range } from '../../Range/Range'
import { Select } from '../../Select/Select'
import { Textarea } from '../../Textarea/Textarea'
import { FormGroup } from '../FormGroup'

afterEach(cleanup)

function describedByIds(control: Element): string[] {
  return (control.getAttribute('aria-describedby') ?? '')
    .split(/\s+/)
    .filter(Boolean)
}

describe('FormGroup', () => {
  it.each([
    ['Input', <Input name="name" />],
    [
      'Select',
      <Select name="name">
        <option>Alex</option>
      </Select>,
    ],
    ['Textarea', <Textarea name="name" />],
    ['Range', <Range name="name" min={0} max={10} />],
  ])('associates a Label with a supported %s', (_name, control) => {
    const { container, getByLabelText, getByText } = render(
      <FormGroup>
        <Label>Participant name</Label>
        <Hint>Use the participant record.</Hint>
        {control}
      </FormGroup>,
    )

    const labeledControl = getByLabelText('Participant name')
    const label = container.querySelector('label')!
    const hint = getByText('Use the participant record.')

    expect(labeledControl.id).not.toBe('')
    expect(label.getAttribute('for')).toBe(labeledControl.id)
    expect(describedByIds(labeledControl)).toEqual([hint.id])
  })

  it('associates Hint and ErrorMessage in rendered order', () => {
    const { container, getByLabelText, getByText } = render(
      <FormGroup>
        <Label>Email</Label>
        <Hint>Use your work address.</Hint>
        <Input aria-invalid="true" />
        <ErrorMessage>Enter a valid email address.</ErrorMessage>
      </FormGroup>,
    )

    const control = getByLabelText('Email')
    const hint = getByText('Use your work address.')
    const error = getByText('Enter a valid email address.')

    expect(hint.id).not.toBe('')
    expect(error.id).not.toBe('')
    expect(hint.id).not.toBe(error.id)
    expect(describedByIds(control)).toEqual([hint.id, error.id])
    expect(control.getAttribute('aria-invalid')).toBe('true')
    expect(container.firstElementChild?.className).toBe('pathable-form-group')
  })

  it('associates supported children nested in Fragments', () => {
    const { getByLabelText, getByText } = render(
      <FormGroup>
        <Fragment>
          <Label>Goal</Label>
          <Fragment>
            <Hint>Choose one goal.</Hint>
            <Select>
              <option>Employment</option>
            </Select>
          </Fragment>
        </Fragment>
      </FormGroup>,
    )

    const control = getByLabelText('Goal')
    const hint = getByText('Choose one goal.')

    expect(describedByIds(control)).toEqual([hint.id])
  })

  it('preserves explicit association props', () => {
    const { container } = render(
      <FormGroup>
        <Label htmlFor="consumer-control">Email</Label>
        <Hint id="consumer-hint">Use your work address.</Hint>
        <Input
          id="consumer-control"
          aria-label="Account email"
          aria-labelledby="external-label"
          aria-describedby="consumer-hint external-description"
          aria-invalid="grammar"
        />
      </FormGroup>,
    )

    const label = container.querySelector('label')!
    const hint = container.querySelector('.pathable-hint')!
    const control = container.querySelector('input')!

    expect(label.getAttribute('for')).toBe('consumer-control')
    expect(hint.id).toBe('consumer-hint')
    expect(control.id).toBe('consumer-control')
    expect(control.getAttribute('aria-label')).toBe('Account email')
    expect(control.getAttribute('aria-labelledby')).toBe('external-label')
    expect(control.getAttribute('aria-describedby')).toBe(
      'consumer-hint external-description',
    )
    expect(control.getAttribute('aria-invalid')).toBe('grammar')
  })

  it('does not add Label wiring when aria-labelledby names the control', () => {
    const { container, getByRole } = render(
      <FormGroup>
        <span id="external-label">External account email</span>
        <Label>Local email label</Label>
        <Input aria-labelledby="external-label" />
      </FormGroup>,
    )

    const label = container.querySelector('label')!
    const control = getByRole('textbox', { name: 'External account email' })

    expect(label.hasAttribute('for')).toBe(false)
    expect(control.getAttribute('aria-labelledby')).toBe('external-label')
  })

  it('uses an explicit Label htmlFor as the missing control id', () => {
    const { container, getByLabelText } = render(
      <FormGroup>
        <Label htmlFor="preferred-name">Preferred name</Label>
        <Input />
      </FormGroup>,
    )

    expect(getByLabelText('Preferred name').id).toBe('preferred-name')
    expect(container.querySelector('label')?.getAttribute('for')).toBe(
      'preferred-name',
    )
  })

  it('does not replace conflicting explicit control and Label associations', () => {
    const { container } = render(
      <FormGroup>
        <Label htmlFor="external-control">External control</Label>
        <Input id="local-control" />
      </FormGroup>,
    )

    expect(container.querySelector('label')?.getAttribute('for')).toBe(
      'external-control',
    )
    expect(container.querySelector('input')?.id).toBe('local-control')
  })

  it('treats an empty aria-describedby as an explicit opt-out', () => {
    const { container } = render(
      <FormGroup>
        <Label>Email</Label>
        <Hint>Not automatically associated.</Hint>
        <Input aria-describedby="" />
      </FormGroup>,
    )

    const control = container.querySelector('input')!
    const hint = container.querySelector('.pathable-hint')!

    expect(control.getAttribute('aria-describedby')).toBe('')
    expect(hint.hasAttribute('id')).toBe(false)
  })

  it.each([
    ['null', null],
    ['empty', ''],
  ])(
    'replaces %s association ids with usable generated ids',
    (_name, value) => {
      const unusableId = value as unknown as string
      const { container, getByLabelText, getByText } = render(
        <FormGroup>
          <Label htmlFor={unusableId}>Email</Label>
          <Input id={unusableId} />
          <Hint id={unusableId}>Use your work address.</Hint>
        </FormGroup>,
      )

      const control = getByLabelText('Email')
      const label = container.querySelector('label')!
      const hint = getByText('Use your work address.')

      expect(control.id).not.toBe('')
      expect(label.getAttribute('for')).toBe(control.id)
      expect(hint.id).not.toBe('')
      expect(describedByIds(control)).toEqual([hint.id])
    },
  )

  it('associates descriptions when no Label is present', () => {
    const { container, getByText } = render(
      <FormGroup>
        <Input aria-label="Email" />
        <Hint>Use your work address.</Hint>
      </FormGroup>,
    )

    const control = container.querySelector('input')!
    const hint = getByText('Use your work address.')

    expect(describedByIds(control)).toEqual([hint.id])
  })

  it('assigns unique ids when the same description element is reused', () => {
    const repeatedHint = <Hint>Shared guidance.</Hint>
    const { container, getAllByText } = render(
      <FormGroup>
        <Input aria-label="Email" />
        {repeatedHint}
        {repeatedHint}
      </FormGroup>,
    )

    const control = container.querySelector('input')!
    const hints = getAllByText('Shared guidance.')
    const hintIds = hints.map((hint) => hint.id)

    expect(new Set(hintIds).size).toBe(2)
    expect(describedByIds(control)).toEqual(hintIds)
  })

  it('keeps keyed description ids stable across insertion and reordering', () => {
    function DynamicField({
      includeHint,
      reverse,
    }: {
      includeHint: boolean
      reverse: boolean
    }) {
      const hint = <Hint key="hint">Stable hint.</Hint>
      const error = <ErrorMessage key="error">Stable error.</ErrorMessage>
      const descriptions = reverse ? [error, hint] : [hint, error]

      return (
        <FormGroup>
          <Input aria-label="Email" />
          {includeHint
            ? descriptions
            : descriptions.filter(({ key }) => key === 'error')}
        </FormGroup>
      )
    }

    const { container, getByText, rerender } = render(
      <DynamicField includeHint reverse={false} />,
    )
    const initialHintId = getByText('Stable hint.').id
    const initialErrorId = getByText('Stable error.').id

    rerender(<DynamicField includeHint reverse />)

    expect(getByText('Stable hint.').id).toBe(initialHintId)
    expect(getByText('Stable error.').id).toBe(initialErrorId)
    expect(describedByIds(container.querySelector('input')!)).toEqual([
      initialErrorId,
      initialHintId,
    ])

    rerender(<DynamicField includeHint={false} reverse />)

    expect(getByText('Stable error.').id).toBe(initialErrorId)
    expect(describedByIds(container.querySelector('input')!)).toEqual([
      initialErrorId,
    ])
  })

  it('does not serialize React keys into generated ids', () => {
    const sensitiveKey = `participant-record-${'private-identifier-'.repeat(8)}`
    const { getByText } = render(
      <FormGroup>
        <Input aria-label="Email" />
        <Hint key={sensitiveKey}>Private-key guidance.</Hint>
      </FormGroup>,
    )

    const generatedDescriptionId = getByText('Private-key guidance.').id

    expect(generatedDescriptionId).not.toContain(sensitiveKey)
    expect(generatedDescriptionId.length).toBeLessThan(sensitiveKey.length)
  })

  it('keeps identical keys in separate nested arrays uniquely scoped', () => {
    const descriptions = [
      [<Hint key="shared">Nested hint.</Hint>],
      [<ErrorMessage key="shared">Nested error.</ErrorMessage>],
    ]
    const { container, getByText } = render(
      <FormGroup>
        <Input aria-label="Email" />
        {descriptions}
      </FormGroup>,
    )

    const control = container.querySelector('input')!
    const hint = getByText('Nested hint.')
    const error = getByText('Nested error.')

    expect(hint.id).not.toBe(error.id)
    expect(describedByIds(control)).toEqual([hint.id, error.id])
  })

  it('supports malformed Unicode keys without throwing', () => {
    const malformedKey = '\ud800'
    const { container, getByText } = render(
      <FormGroup>
        <Input aria-label="Email" />
        <Hint key={malformedKey}>Encoded hint.</Hint>
      </FormGroup>,
    )

    const control = container.querySelector('input')!
    const hint = getByText('Encoded hint.')

    expect(hint.id).not.toBe('')
    expect(describedByIds(control)).toEqual([hint.id])
  })

  it.each([
    ['non-ASCII whitespace', '\u00a0'],
    ['vertical tab', '\u000b'],
  ])('preserves valid ids containing %s', (_name, separator) => {
    const explicitId = `participant${separator}email`
    const hintId = `participant${separator}email${separator}hint`
    const { container } = render(
      <FormGroup>
        <Label htmlFor={explicitId}>Email</Label>
        <Input id={explicitId} />
        <Hint id={hintId}>Use your work address.</Hint>
      </FormGroup>,
    )

    const control = container.querySelector('input')!

    expect(control.id).toBe(explicitId)
    expect(container.querySelector('label')?.getAttribute('for')).toBe(
      explicitId,
    )
    expect(control.getAttribute('aria-describedby')).toBe(hintId)
  })

  it('leaves multiple Labels unassociated while wiring descriptions', () => {
    const { container, getByText } = render(
      <FormGroup>
        <Label>Primary name</Label>
        <Label>Alternate name</Label>
        <Input aria-label="Name" />
        <Hint>Enter the participant name.</Hint>
      </FormGroup>,
    )

    const control = container.querySelector('input')!
    const hint = getByText('Enter the participant name.')

    for (const label of container.querySelectorAll('label')) {
      expect(label.hasAttribute('for')).toBe(false)
    }
    expect(describedByIds(control)).toEqual([hint.id])
  })

  it('leaves ambiguous multiple-control compositions unchanged', () => {
    const { container } = render(
      <FormGroup>
        <Label>Name</Label>
        <Input />
        <Textarea />
        <Hint>Enter a name.</Hint>
      </FormGroup>,
    )

    expect(container.querySelector('label')?.hasAttribute('for')).toBe(false)
    expect(container.querySelector('input')?.hasAttribute('id')).toBe(false)
    expect(container.querySelector('textarea')?.hasAttribute('id')).toBe(false)
    expect(container.querySelector('.pathable-hint')?.hasAttribute('id')).toBe(
      false,
    )
  })

  it('preserves control identity when composition becomes unambiguous', () => {
    function DynamicField({ includeExtra }: { includeExtra: boolean }) {
      return (
        <FormGroup>
          <Label>Name</Label>
          <Input defaultValue="Initial value" />
          {includeExtra && <Textarea aria-label="Additional notes" />}
        </FormGroup>
      )
    }

    const { container, rerender } = render(<DynamicField includeExtra />)
    const initialControl = container.querySelector('input')!
    initialControl.value = 'Consumer value'
    initialControl.focus()

    rerender(<DynamicField includeExtra={false} />)

    expect(container.querySelector('input')).toBe(initialControl)
    expect(initialControl.value).toBe('Consumer value')
    expect(document.activeElement).toBe(initialControl)

    rerender(<DynamicField includeExtra />)

    expect(container.querySelector('input')).toBe(initialControl)
    expect(initialControl.value).toBe('Consumer value')
    expect(document.activeElement).toBe(initialControl)
    expect(container.querySelector('label')?.hasAttribute('for')).toBe(false)
    expect(initialControl.hasAttribute('id')).toBe(false)
  })

  it('leaves native and custom wrapper compositions unchanged', () => {
    function FieldWrapper({ children }: { children: React.ReactNode }) {
      return <div>{children}</div>
    }

    const { container } = render(
      <FormGroup>
        <label>
          Native label
          <input />
        </label>
        <FieldWrapper>
          <Label>Wrapped label</Label>
          <Input />
        </FieldWrapper>
      </FormGroup>,
    )

    for (const element of container.querySelectorAll('label, input')) {
      expect(element.hasAttribute('id')).toBe(false)
    }
    expect(
      container.querySelector('.pathable-label')?.hasAttribute('for'),
    ).toBe(false)
  })

  it('keeps generated associations stable across rerenders and unique per group', () => {
    const fields = (
      <>
        <FormGroup>
          <Label>First name</Label>
          <Input />
        </FormGroup>
        <FormGroup>
          <Label>Last name</Label>
          <Input />
        </FormGroup>
      </>
    )
    const { container, rerender } = render(fields)
    const initialIds = Array.from(
      container.querySelectorAll('input'),
      (input) => input.getAttribute('id'),
    )

    rerender(fields)

    expect(initialIds[0]).not.toBe(initialIds[1])
    expect(
      Array.from(container.querySelectorAll('input'), (input) =>
        input.getAttribute('id'),
      ),
    ).toEqual(initialIds)
  })

  it('hydrates server-generated associations without replacing ids', async () => {
    const field = (
      <FormGroup>
        <Label>Service area</Label>
        <Hint>Choose the category that applies.</Hint>
        <Select>
          <option>Employment</option>
        </Select>
      </FormGroup>
    )
    const container = document.createElement('div')
    container.innerHTML = renderToString(field)
    document.body.append(container)
    const serverControl = container.querySelector('select')!
    const serverControlId = serverControl.id
    const serverDescription = serverControl.getAttribute('aria-describedby')
    const onRecoverableError = vi.fn()

    const root = hydrateRoot(container, field, { onRecoverableError })
    await act(async () => undefined)

    const hydratedControl = container.querySelector('select')!
    expect(hydratedControl.id).toBe(serverControlId)
    expect(hydratedControl.getAttribute('aria-describedby')).toBe(
      serverDescription,
    )
    expect(onRecoverableError).not.toHaveBeenCalled()

    await act(async () => root.unmount())
    container.remove()
  })
})
