import {
  verifyAccessibleLabel,
  verifyHintErrorAssociation,
  verifyRequiredInvalidAssociation,
  type StoryHarness,
} from '@pathable/storybook-contracts'
import { expect, userEvent, within } from 'storybook/test'

export default {
  title: 'Components/Form Controls/Checkbox',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: Native checkbox activation with CSS-only presentation.\n\n**States verified**: Default checkboxes retain native keyboard and label activation, disabled checkboxes suppress activation and focus, required and invalid states are exposed, and validation guidance retains its hint and error associations.\n\n**Consumers must**: Import `@pathableai/styles` CSS, provide an accessible label, use native `disabled` and `required` attributes where applicable, and connect validation guidance with `aria-invalid` and `aria-describedby`. Applications remain responsible for persisted checked state and validation decisions.',
      },
    },
  },
}

function harnessFor(root: HTMLElement): StoryHarness {
  return {
    root,
    within,
    userEvent,
    expect,
  }
}

export const Default = {
  tags: ['contract-checkbox'],
  render: () => `
<label class="pathable-checkbox">
  <input type="checkbox" class="pathable-checkbox__input" />
  <span class="pathable-checkbox__label">Checkbox label</span>
</label>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const harness = harnessFor(canvasElement)
    const checkbox = within(canvasElement).getByRole('checkbox', {
      name: 'Checkbox label',
    })
    const label = within(canvasElement).getByText('Checkbox label')

    await verifyAccessibleLabel(harness, 'Checkbox label')
    await expect(checkbox).not.toBeChecked()
    await userEvent.tab()
    await expect(checkbox).toHaveFocus()
    await userEvent.keyboard(' ')
    await expect(checkbox).toBeChecked()
    await userEvent.click(label)
    await expect(checkbox).not.toBeChecked()
  },
}

export const Tile = {
  render: () => `
<label class="pathable-checkbox pathable-checkbox--tile">
  <input type="checkbox" class="pathable-checkbox__input" />
  <span class="pathable-checkbox__label">Tile checkbox label</span>
</label>
  `,
}

export const Disabled = {
  tags: ['contract-checkbox'],
  render: () => `
<label class="pathable-checkbox">
  <input type="checkbox" class="pathable-checkbox__input" disabled />
  <span class="pathable-checkbox__label">Unavailable option</span>
</label>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const harness = harnessFor(canvasElement)
    const checkbox = within(canvasElement).getByRole<HTMLInputElement>(
      'checkbox',
      { name: 'Unavailable option' },
    )

    await verifyAccessibleLabel(harness, 'Unavailable option')
    await expect(checkbox).toBeDisabled()
    await userEvent.click(checkbox)
    await expect(checkbox).not.toBeChecked()
    checkbox.focus()
    await expect(checkbox).not.toHaveFocus()
  },
}

export const Required = {
  tags: ['contract-checkbox'],
  render: () => `
<label class="pathable-checkbox">
  <input type="checkbox" class="pathable-checkbox__input" required />
  <span class="pathable-checkbox__label">Accept participation terms</span>
</label>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const harness = harnessFor(canvasElement)
    const checkbox = within(canvasElement).getByRole<HTMLInputElement>(
      'checkbox',
      { name: 'Accept participation terms' },
    )

    await verifyAccessibleLabel(harness, 'Accept participation terms')
    await expect(checkbox).toBeRequired()
    await expect(checkbox.checkValidity()).toBe(false)
    await userEvent.click(checkbox)
    await expect(checkbox).toBeChecked()
    await expect(checkbox.checkValidity()).toBe(true)
  },
}

export const Invalid = {
  tags: ['contract-checkbox'],
  render: () => `
<label class="pathable-checkbox">
  <input
    type="checkbox"
    class="pathable-checkbox__input"
    required
    aria-invalid="true"
  />
  <span class="pathable-checkbox__label">Confirm participation consent</span>
</label>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const harness = harnessFor(canvasElement)

    await verifyAccessibleLabel(harness, 'Confirm participation consent')
    await verifyRequiredInvalidAssociation(
      harness,
      'Confirm participation consent',
    )
  },
}

export const WithHintAndError = {
  tags: ['contract-checkbox'],
  render: () => `
<fieldset class="pathable-fieldset">
  <legend class="pathable-legend">Participation consent</legend>
  <span class="pathable-hint" id="participation-consent-hint">
    Confirm that the participant reviewed the consent terms.
  </span>
  <label class="pathable-checkbox">
    <input
      type="checkbox"
      class="pathable-checkbox__input"
      required
      aria-invalid="true"
      aria-describedby="participation-consent-hint participation-consent-error"
    />
    <span class="pathable-checkbox__label">Consent terms reviewed</span>
  </label>
  <span class="pathable-error-message" id="participation-consent-error" role="alert">
    Confirm consent before continuing.
  </span>
</fieldset>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const harness = harnessFor(canvasElement)

    await verifyAccessibleLabel(harness, 'Consent terms reviewed')
    await verifyHintErrorAssociation(
      harness,
      'Consent terms reviewed',
      'Confirm that the participant reviewed the consent terms.',
      'Confirm consent before continuing.',
    )
    await expect(
      within(canvasElement).getByRole('checkbox', {
        name: 'Consent terms reviewed',
      }),
    ).toHaveAttribute(
      'aria-describedby',
      'participation-consent-hint participation-consent-error',
    )
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'Confirm consent before continuing.',
    )
  },
}

export const WorkflowCoachingSupports = {
  render: () => `
<form class="pathable-form">
  <fieldset class="pathable-fieldset">
    <legend class="pathable-legend">Coaching Supports Addressed</legend>
    <span class="pathable-hint">Select all supports addressed in this session.</span>
    <ul class="pathable-checkbox__list">
      <li>
        <input type="checkbox" id="support-job-readiness" class="pathable-checkbox" checked />
        <label for="support-job-readiness">Job readiness practice</label>
      </li>
      <li>
        <input type="checkbox" id="support-workplace" class="pathable-checkbox" checked />
        <label for="support-workplace">Workplace communication</label>
      </li>
      <li>
        <input type="checkbox" id="support-employer" class="pathable-checkbox" />
        <label for="support-employer">Employer follow-up</label>
      </li>
      <li>
        <input type="checkbox" id="support-transportation" class="pathable-checkbox" />
        <label for="support-transportation">Transportation planning</label>
      </li>
    </ul>
  </fieldset>
</form>
  `,
}
