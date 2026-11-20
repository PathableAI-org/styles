import {
  verifyAccessibleLabel,
  verifyHintErrorAssociation,
  type StoryHarness,
} from '@pathable/storybook-contracts'
import { expect, userEvent, within } from 'storybook/test'

export default {
  title: 'Components/Form Controls/Radio',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n**App State to Manage**: selected option, validation errors\n**Consumers must**: Provide group selection and validation logic in application framework.',
      },
    },
  },
}

export const Default = {
  render: () => `
<label class="pathable-radio">
  <input type="radio" name="radio-group" class="pathable-radio__input" />
  <span class="pathable-radio__label">Radio label</span>
</label>
<label class="pathable-radio">
  <input type="radio" name="radio-group" class="pathable-radio__input" />
  <span class="pathable-radio__label">Radio label</span>
</label>
  `,
}

function harnessFor(root: HTMLElement): StoryHarness {
  return {
    root,
    within,
    userEvent,
    expect,
  }
}

export const WithHintAndError = {
  render: () => `
<fieldset class="pathable-fieldset">
  <legend class="pathable-legend">Employment goal</legend>
  <span class="pathable-hint" id="employment-goal-hint">
    Select the goal the participant is working toward.
  </span>
  <label class="pathable-radio">
    <input
      type="radio"
      name="employment-goal"
      value="job-search"
      class="pathable-radio__input"
      required
      aria-invalid="true"
      aria-describedby="employment-goal-hint employment-goal-error"
    />
    <span class="pathable-radio__label">Job search skills</span>
  </label>
  <label class="pathable-radio">
    <input
      type="radio"
      name="employment-goal"
      value="training"
      class="pathable-radio__input"
      required
      aria-invalid="true"
      aria-describedby="employment-goal-hint employment-goal-error"
    />
    <span class="pathable-radio__label">Skills training</span>
  </label>
  <span class="pathable-error-message" id="employment-goal-error" role="alert">
    Select an employment goal before continuing.
  </span>
</fieldset>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const harness = harnessFor(canvasElement)

    for (const name of ['Job search skills', 'Skills training']) {
      await verifyAccessibleLabel(harness, name)
      await verifyHintErrorAssociation(
        harness,
        name,
        'Select the goal the participant is working toward.',
        'Select an employment goal before continuing.',
      )
    }
    await expect(within(canvasElement).getByRole('alert')).toHaveTextContent(
      'Select an employment goal before continuing.',
    )
  },
}

export const WorkflowProgressSignal = {
  render: () => `
<form class="pathable-form">
  <fieldset class="pathable-fieldset">
    <legend class="pathable-legend">Employment Goal Progress</legend>
    <span class="pathable-hint">Rate the participant's progress toward their employment goal since the last session.</span>
    <label class="pathable-radio">
      <input type="radio" id="progress-significant" name="progress" class="pathable-radio__input" />
      <span class="pathable-radio__label">Significant progress — Goals are being exceeded</span>
    </label>
    <label class="pathable-radio">
      <input type="radio" id="progress-moderate" name="progress" class="pathable-radio__input" checked />
      <span class="pathable-radio__label">Moderate progress — Goals are on track</span>
    </label>
    <label class="pathable-radio">
      <input type="radio" id="progress-none" name="progress" class="pathable-radio__input" />
      <span class="pathable-radio__label">No change — Goals need reassessment</span>
    </label>
    <label class="pathable-radio">
      <input type="radio" id="progress-adjustment" name="progress" class="pathable-radio__input" />
      <span class="pathable-radio__label">Needs adjustment — Goals or approach should be revised</span>
    </label>
  </fieldset>
</form>
  `,
}
