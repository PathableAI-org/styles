import { expect, within } from 'storybook/test'

const renderUnevenHints = (className = 'pathable-form-row') => `
  <form aria-label="Participant filters">
    <div class="${className}" data-testid="form-row">
      <div class="pathable-form-group" data-testid="service-field">
        <label class="pathable-label" for="form-row-service">Service area</label>
        <span class="pathable-hint" id="form-row-service-hint">
          Choose the category that best matches the participant's current goal.
        </span>
        <select
          class="pathable-select"
          id="form-row-service"
          name="service"
          aria-describedby="form-row-service-hint"
        >
          <option value="">Select a service</option>
          <option>Employment support</option>
          <option>Independent living</option>
        </select>
      </div>
      <div class="pathable-form-group" data-testid="status-field">
        <label class="pathable-label" for="form-row-status">Status</label>
        <select class="pathable-select" id="form-row-status" name="status">
          <option>Active</option>
          <option>Paused</option>
        </select>
      </div>
    </div>
  </form>
`

async function expectAligned(...elements: HTMLElement[]) {
  const [first, ...rest] = elements
  const expectedTop = first.getBoundingClientRect().top

  for (const element of rest) {
    await expect(
      Math.abs(element.getBoundingClientRect().top - expectedTop),
    ).toBeLessThanOrEqual(1)
  }
}

async function expectEqualHorizontalColumns(...elements: HTMLElement[]) {
  const [first, ...rest] = elements
  const firstBounds = first.getBoundingClientRect()

  for (const [index, element] of rest.entries()) {
    const bounds = element.getBoundingClientRect()
    const previousBounds = elements[index].getBoundingClientRect()

    await expect(bounds.left).toBeGreaterThanOrEqual(previousBounds.right)
    await expect(
      Math.abs(bounds.width - firstBounds.width),
    ).toBeLessThanOrEqual(1)
  }
}

async function expectStackedColumns(...elements: HTMLElement[]) {
  const [first, ...rest] = elements
  const firstBounds = first.getBoundingClientRect()

  for (const [index, element] of rest.entries()) {
    const bounds = element.getBoundingClientRect()
    const previousBounds = elements[index].getBoundingClientRect()

    await expect(bounds.top).toBeGreaterThanOrEqual(previousBounds.bottom)
    await expect(Math.abs(bounds.left - firstBounds.left)).toBeLessThanOrEqual(
      1,
    )
    await expect(
      Math.abs(bounds.width - firstBounds.width),
    ).toBeLessThanOrEqual(1)
  }
}

const renderGapRow = (gap: 'sm' | 'md' | 'lg' | 'xl') => `
  <div
    class="pathable-form-row pathable-form-row--gap-${gap}"
    data-testid="gap-${gap}"
  >
    <div class="pathable-form-group">
      <label class="pathable-label" for="gap-${gap}-first">First field</label>
      <input class="pathable-input" id="gap-${gap}-first" name="gap-${gap}-first" />
    </div>
    <div class="pathable-form-group">
      <label class="pathable-label" for="gap-${gap}-second">Second field</label>
      <input class="pathable-input" id="gap-${gap}-second" name="gap-${gap}-second" />
    </div>
  </div>
`

const renderGapOverrideRow = (name: string, className: string) => `
  <div class="${className}" data-testid="gap-${name}">
    <div class="pathable-form-group"><label class="pathable-label" for="gap-${name}-first">First field</label><input class="pathable-input" id="gap-${name}-first" name="gap-${name}-first" /></div>
    <div class="pathable-form-group"><label class="pathable-label" for="gap-${name}-second">Second field</label><input class="pathable-input" id="gap-${name}-second" name="gap-${name}-second" /></div>
  </div>
`

export default {
  title: 'Components/Form Controls/Form Row',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only and noninteractive.\n\n**When to use**: Arrange direct `pathable-form-group` children in equal columns at viewport widths of 1024px and wider while keeping their control top edges aligned when labels and hints differ. Fields stack below 1024px.\n\n**Supported structure**: Each direct form group contains a direct `pathable-label`, optional `pathable-hint`, `pathable-input` / `pathable-select` / `pathable-textarea`, and optional `pathable-error-message`, in that DOM order. Wrapped composite controls such as DatePicker and ComboBox are not aligned by this contract.\n\n**Spacing**: The default field gap is `--space-8`. Use `pathable-form-row--gap-sm`, `--gap-md`, `--gap-lg`, or `--gap-xl`, or override `--pathable-form-row-gap`.\n\n**Known constraints**: Responsiveness follows the viewport rather than the row container. In mixed-height rows, errors begin below the tallest control. A `pathable-form` keeps its existing narrow max-width unless the consumer supplies a wider form constraint.\n\n**Consumers must**: Preserve explicit label and description associations. Use a fieldset when the fields need a shared semantic group.',
      },
    },
  },
}

export const Default = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  render: () => renderUnevenHints(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByTestId('form-row')
    const serviceField = canvas.getByTestId('service-field')
    const statusField = canvas.getByTestId('status-field')
    const service = canvas.getByLabelText('Service area')
    const status = canvas.getByLabelText('Status')

    await expect(window.innerWidth).toBeGreaterThanOrEqual(1024)
    await expect(window.getComputedStyle(row).display).toBe('grid')
    await expect(window.getComputedStyle(row).columnGap).toBe('8px')
    await expect(service).toHaveAccessibleDescription(
      "Choose the category that best matches the participant's current goal.",
    )
    await expectAligned(service, status)
    await expectEqualHorizontalColumns(serviceField, statusField)
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 2)
  },
}

export const LongLabelsAndHints = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  render: () => `
    <form aria-label="Employment planning" style="max-width: 44rem;">
      <div class="pathable-form-row pathable-form-row--gap-lg" data-testid="long-form-row">
        <div class="pathable-form-group">
          <label class="pathable-label" for="form-row-employment-goal">
            Primary employment goal for the participant's next planning period
          </label>
          <span class="pathable-hint" id="form-row-employment-goal-hint">
            Include the role, workplace setting, schedule, and support needs discussed with the participant.
          </span>
          <input
            class="pathable-input"
            id="form-row-employment-goal"
            name="employmentGoal"
            aria-describedby="form-row-employment-goal-hint"
          />
        </div>
        <div class="pathable-form-group">
          <label class="pathable-label" for="form-row-owner">Plan owner</label>
          <input class="pathable-input" id="form-row-owner" name="planOwner" />
        </div>
      </div>
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByTestId('long-form-row')
    const goal = canvas.getByLabelText(
      "Primary employment goal for the participant's next planning period",
    )
    const owner = canvas.getByLabelText('Plan owner')

    await expectAligned(goal, owner)
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 2)
  },
}

export const MixedControlHeights = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  render: () => `
    <form aria-label="Session details">
      <div class="pathable-form-row pathable-form-row--gap-xl" data-testid="mixed-form-row">
        <div class="pathable-form-group">
          <label class="pathable-label" for="form-row-date">Session date</label>
          <input class="pathable-input" id="form-row-date" name="sessionDate" type="date" />
        </div>
        <div class="pathable-form-group">
          <label class="pathable-label" for="form-row-notes">Session notes</label>
          <span class="pathable-hint" id="form-row-notes-hint">Summarize progress and next steps.</span>
          <textarea
            class="pathable-textarea"
            id="form-row-notes"
            name="sessionNotes"
            aria-describedby="form-row-notes-hint"
            rows="4"
          ></textarea>
        </div>
      </div>
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByTestId('mixed-form-row')
    const date = canvas.getByLabelText('Session date')
    const notes = canvas.getByLabelText('Session notes')

    await expectAligned(date, notes)
    await expect(notes.getBoundingClientRect().height).toBeGreaterThan(
      date.getBoundingClientRect().height,
    )
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 2)
  },
}

export const UnevenErrors = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  render: () => `
    <form aria-label="Contact details">
      <div class="pathable-form-row" data-testid="error-form-row">
        <div class="pathable-form-group">
          <label class="pathable-label" for="form-row-email">Email address</label>
          <input
            class="pathable-input pathable-input--error"
            id="form-row-email"
            name="email"
            type="email"
            value="invalid"
            aria-invalid="true"
            aria-describedby="form-row-email-error"
          />
          <span class="pathable-error-message" id="form-row-email-error">
            Enter a valid email address.
          </span>
        </div>
        <div class="pathable-form-group">
          <label class="pathable-label" for="form-row-notes">Notes</label>
          <span class="pathable-hint" id="form-row-notes-hint">Include relevant context.</span>
          <textarea
            class="pathable-textarea"
            id="form-row-notes"
            name="notes"
            rows="4"
            aria-describedby="form-row-notes-hint"
          ></textarea>
        </div>
      </div>
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const email = canvas.getByLabelText('Email address')
    const notes = canvas.getByLabelText('Notes')
    const error = canvas.getByText('Enter a valid email address.')

    await expectAligned(email, notes)
    await expect(notes.getBoundingClientRect().height).toBeGreaterThan(
      email.getBoundingClientRect().height,
    )
    await expect(error.getBoundingClientRect().top).toBeGreaterThanOrEqual(
      Math.max(
        email.getBoundingClientRect().bottom,
        notes.getBoundingClientRect().bottom,
      ),
    )
    await expect(email).toHaveAttribute('aria-invalid', 'true')
    await expect(email).toHaveAccessibleDescription(
      'Enter a valid email address.',
    )
  },
}

export const ConstrainedThreeFields = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  render: () => `
    <form aria-label="Compact scheduling filters" style="max-width: 42rem;">
      <div class="pathable-form-row pathable-form-row--gap-sm" data-testid="constrained-row">
        <div class="pathable-form-group" data-testid="constrained-service">
          <label class="pathable-label" for="constrained-service-control">Service</label>
          <select class="pathable-select" id="constrained-service-control" name="service">
            <option>Employment support</option>
          </select>
        </div>
        <div class="pathable-form-group" data-testid="constrained-status">
          <label class="pathable-label" for="constrained-status-control">Status</label>
          <input class="pathable-input pathable-maxw-mobile" id="constrained-status-control" name="status" />
        </div>
        <div class="pathable-form-group" data-testid="constrained-notes">
          <label class="pathable-label" for="constrained-notes-control">Notes</label>
          <textarea class="pathable-textarea" id="constrained-notes-control" name="notes" rows="2"></textarea>
        </div>
      </div>
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByTestId('constrained-row')
    const groups = [
      canvas.getByTestId('constrained-service'),
      canvas.getByTestId('constrained-status'),
      canvas.getByTestId('constrained-notes'),
    ]
    const controls = [
      canvas.getByLabelText('Service'),
      canvas.getByLabelText('Status'),
      canvas.getByLabelText('Notes'),
    ]
    const expectedMaxWidths = ['none', '320px', 'none']

    await expectEqualHorizontalColumns(...groups)
    await expectAligned(...controls)
    for (const [index, control] of controls.entries()) {
      await expect(window.getComputedStyle(control).boxSizing).toBe(
        'border-box',
      )
      await expect(window.getComputedStyle(control).maxWidth).toBe(
        expectedMaxWidths[index],
      )
      await expect(control.getBoundingClientRect().width).toBeLessThanOrEqual(
        groups[index].getBoundingClientRect().width,
      )
    }
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 2)
  },
}

export const InPathableForm = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  render: () => `
    <form class="pathable-form" aria-label="PathAble form integration">
      <div class="pathable-form-row pathable-form-row--gap-sm" data-testid="pathable-form-row">
        <div class="pathable-form-group" data-testid="pathable-form-service">
          <label class="pathable-label" for="pathable-form-service-control">Service</label>
          <select class="pathable-select" id="pathable-form-service-control" name="service">
            <option>Employment</option>
          </select>
        </div>
        <div class="pathable-form-group" data-testid="pathable-form-status">
          <label class="pathable-label" for="pathable-form-status-control">Status</label>
          <select class="pathable-select" id="pathable-form-status-control" name="status">
            <option>Active</option>
          </select>
        </div>
      </div>
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByTestId('pathable-form-row')

    await expectEqualHorizontalColumns(
      canvas.getByTestId('pathable-form-service'),
      canvas.getByTestId('pathable-form-status'),
    )
    await expectAligned(
      canvas.getByLabelText('Service'),
      canvas.getByLabelText('Status'),
    )
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 2)
  },
}

export const GapSizes = {
  globals: { viewport: { value: 'desktop', isRotated: false } },
  render: () => `
    <style>.form-row-custom-gap { --pathable-form-row-gap: 14px; }</style>
    <form aria-label="Form row gap sizes">
      ${renderGapRow('sm')}
      ${renderGapRow('md')}
      ${renderGapRow('lg')}
      ${renderGapRow('xl')}
      <div class="pathable-form-row" data-testid="gap-custom" style="--pathable-form-row-gap: 12px;">
        <div class="pathable-form-group"><label class="pathable-label" for="gap-custom-first">First custom field</label><input class="pathable-input" id="gap-custom-first" name="gap-custom-first" /></div>
        <div class="pathable-form-group"><label class="pathable-label" for="gap-custom-second">Second custom field</label><input class="pathable-input" id="gap-custom-second" name="gap-custom-second" /></div>
      </div>
      <div style="--pathable-form-row-gap: 13px;">
        ${renderGapOverrideRow('inherited', 'pathable-form-row')}
      </div>
      ${renderGapOverrideRow(
        'class-override',
        'pathable-form-row pathable-form-row--gap-sm form-row-custom-gap',
      )}
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const expectedGaps = {
      sm: '4px',
      md: '8px',
      lg: '16px',
      xl: '24px',
    }

    for (const [size, gap] of Object.entries(expectedGaps)) {
      const row = canvas.getByTestId(`gap-${size}`)
      await expect(window.getComputedStyle(row).columnGap).toBe(gap)
    }
    await expect(
      window.getComputedStyle(canvas.getByTestId('gap-custom')).columnGap,
    ).toBe('12px')
    await expect(
      window.getComputedStyle(canvas.getByTestId('gap-inherited')).columnGap,
    ).toBe('13px')
    await expect(
      window.getComputedStyle(canvas.getByTestId('gap-class-override'))
        .columnGap,
    ).toBe('14px')
  },
}

export const AtDesktopBreakpoint = {
  globals: {
    viewport: { value: 'desktopBreakpoint', isRotated: false },
  },
  render: () => renderUnevenHints(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)

    await expect(window.innerWidth).toBe(1024)
    await expectEqualHorizontalColumns(
      canvas.getByTestId('service-field'),
      canvas.getByTestId('status-field'),
    )
    await expectAligned(
      canvas.getByLabelText('Service area'),
      canvas.getByLabelText('Status'),
    )
  },
}

export const BelowDesktopBreakpoint = {
  globals: {
    viewport: { value: 'belowDesktopBreakpoint', isRotated: false },
  },
  render: () => renderUnevenHints(),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)

    await expect(window.innerWidth).toBe(1023)
    await expectStackedColumns(
      canvas.getByTestId('service-field'),
      canvas.getByTestId('status-field'),
    )
  },
}

export const Narrow = {
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  render: () =>
    renderUnevenHints('pathable-form-row pathable-form-row--gap-lg'),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const row = canvas.getByTestId('form-row')
    const serviceField = canvas.getByTestId('service-field')
    const statusField = canvas.getByTestId('status-field')
    const serviceLabel = canvas.getByText('Service area')
    const statusLabel = canvas.getByText('Status')

    await expect(window.innerWidth).toBe(320)
    await expectStackedColumns(serviceField, statusField)
    await expect(window.getComputedStyle(row).rowGap).toBe('16px')
    for (const element of [
      serviceField,
      statusField,
      serviceLabel,
      statusLabel,
    ]) {
      await expect(window.getComputedStyle(element).marginTop).toBe('0px')
    }
    await expect(row.scrollWidth).toBeLessThanOrEqual(row.clientWidth + 2)
  },
}
