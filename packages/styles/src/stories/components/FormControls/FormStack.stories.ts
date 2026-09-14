import { expect, within } from 'storybook/test'

const formFields = (prefix: string) => `
  <div class="pathable-form-group">
    <label class="pathable-label" for="${prefix}-name">Participant name</label>
    <span class="pathable-hint" id="${prefix}-name-hint">Use the name shown on the participant record.</span>
    <input class="pathable-input" id="${prefix}-name" name="participantName" aria-describedby="${prefix}-name-hint" />
  </div>
  <div class="pathable-form-group">
    <label class="pathable-label" for="${prefix}-service">Service area</label>
    <select class="pathable-select" id="${prefix}-service" name="service">
      <option>Employment support</option>
      <option>Community access</option>
    </select>
  </div>
  <div class="pathable-form-group">
    <label class="pathable-label" for="${prefix}-notes">Planning notes</label>
    <textarea class="pathable-textarea" id="${prefix}-notes" name="notes" rows="3"></textarea>
  </div>
`

export default {
  title: 'Components/Form Controls/Form Stack',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only layout for a native form.\n\n**When to use**: Use `pathable-form-stack` with `pathable-stack` for multi-field or multi-section forms that should use their available column width. Supported PathAble inputs, selects, and textareas expand automatically.\n\n**When not to use**: Use `pathable-form` for short, linear forms that should retain the USWDS 20rem measure. Do not nest either form inside another form.\n\n**Sizing**: Constrain the form itself with a `pathable-maxw-*` utility when a readable maximum is needed. An explicit `pathable-maxw-*` class on a control overrides automatic expansion.\n\n**Consumers must**: Preserve label, hint, and error associations and provide a clearly labeled submit action.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <form class="pathable-stack pathable-form-stack pathable-stack--gap-md" aria-label="Participant planning" data-testid="form-stack">
      ${formFields('form-stack-default')}
      <button class="pathable-button pathable-button--primary" type="submit">Save participant</button>
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', { name: 'Participant planning' })

    await expect(form).toHaveClass('pathable-stack', 'pathable-form-stack')
    for (const control of [
      canvas.getByLabelText('Participant name'),
      canvas.getByLabelText('Service area'),
      canvas.getByLabelText('Planning notes'),
    ]) {
      await expect(window.getComputedStyle(control).maxWidth).toBe('none')
      await expect(control.getBoundingClientRect().width).toBeGreaterThan(480)
    }
    await expect(form.scrollWidth).toBeLessThanOrEqual(form.clientWidth + 2)
  },
}

export const Constrained = {
  render: () => `
    <form class="pathable-stack pathable-form-stack pathable-stack--gap-lg pathable-maxw-tablet" aria-label="Constrained participant planning" data-testid="constrained-form-stack">
      ${formFields('form-stack-constrained')}
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', {
      name: 'Constrained participant planning',
    })

    await expect(window.getComputedStyle(form).maxWidth).toBe('640px')
    await expect(window.getComputedStyle(form).rowGap).toBe('24px')
    await expect(
      canvas.getByLabelText('Participant name').getBoundingClientRect().width,
    ).toBeCloseTo(form.getBoundingClientRect().width, 0)
  },
}

export const ExplicitControlConstraint = {
  render: () => `
    <style>.form-stack-consumer-width { max-width: 12rem; }</style>
    <form class="pathable-stack pathable-form-stack" aria-label="Control width override">
      <div class="pathable-form-row">
        <div class="pathable-form-group">
          <label class="pathable-label" for="form-stack-short-code">Short code</label>
          <input class="pathable-input pathable-maxw-mobile" id="form-stack-short-code" name="shortCode" />
        </div>
        <div class="pathable-form-group">
          <label class="pathable-label" for="form-stack-custom-code">Custom constrained code</label>
          <input class="pathable-input form-stack-consumer-width" id="form-stack-custom-code" name="customCode" />
        </div>
      </div>
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const shortCode = canvas.getByLabelText('Short code')
    const customCode = canvas.getByLabelText('Custom constrained code')

    await expect(window.getComputedStyle(shortCode).maxWidth).toBe('320px')
    await expect(window.getComputedStyle(customCode).maxWidth).toBe('192px')
    await expect(shortCode.getBoundingClientRect().top).toBeCloseTo(
      customCode.getBoundingClientRect().top,
      0,
    )
  },
}

export const WithFormRow = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  render: () => `
    <form class="pathable-stack pathable-form-stack pathable-stack--gap-lg pathable-maxw-desktop" aria-label="Scheduling settings" data-testid="row-form-stack">
      <div class="pathable-form-row">
        <div class="pathable-form-group">
          <label class="pathable-label" for="form-stack-location">Service location</label>
          <span class="pathable-hint" id="form-stack-location-hint">Choose where the participant receives support.</span>
          <select class="pathable-select" id="form-stack-location" name="location" aria-describedby="form-stack-location-hint">
            <option>Community site</option>
          </select>
        </div>
        <div class="pathable-form-group">
          <label class="pathable-label" for="form-stack-status">Status</label>
          <select class="pathable-select" id="form-stack-status" name="status">
            <option>Active</option>
          </select>
        </div>
      </div>
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', { name: 'Scheduling settings' })
    const location = canvas.getByLabelText('Service location')
    const status = canvas.getByLabelText('Status')

    await expect(window.innerWidth).toBeGreaterThanOrEqual(1024)
    await expect(form.getBoundingClientRect().width).toBeGreaterThan(480)
    await expect(location.getBoundingClientRect().top).toBeCloseTo(
      status.getBoundingClientRect().top,
      0,
    )
    await expect(form.scrollWidth).toBeLessThanOrEqual(form.clientWidth + 2)
  },
}

export const Narrow = {
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  render: () => `
    <form class="pathable-stack pathable-form-stack pathable-stack--gap-md" aria-label="Narrow participant planning" data-testid="narrow-form-stack">
      ${formFields('form-stack-narrow')}
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const form = canvas.getByRole('form', {
      name: 'Narrow participant planning',
    })

    await expect(window.innerWidth).toBe(320)
    await expect(form.scrollWidth).toBeLessThanOrEqual(form.clientWidth + 2)
  },
}
