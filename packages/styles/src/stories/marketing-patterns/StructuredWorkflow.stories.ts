export default {
  title: 'Marketing Patterns/Structured Workflow',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only (no JavaScript required)\n\n**Consumers must**: Import `@pathable/styles` CSS. This page composes participant context, step indicator, objective/prompt, form entry area, save status, validation summary, navigation actions, and completed state from existing public CSS classes.\n\n**Which archetype to start from**: Choose this archetype for guided multi-step processes or form-based workflows. Optional patterns include save status indicators, validation summaries, and record headers. See the structured workflow documentation for detailed usage.',
      },
    },
  },
}

const inProgressHtml = `
<div style="max-width: 800px; margin: 2rem auto; padding: 0 1rem;">
  <ol class="pathable-step-indicator" style="margin-bottom: 2rem;">
    <li class="pathable-step-indicator__segment pathable-step-indicator__segment--completed">
      <span class="pathable-step-indicator__segment-label">Step 1: Participant Info</span>
    </li>
    <li class="pathable-step-indicator__segment pathable-step-indicator__segment--current">
      <span class="pathable-step-indicator__segment-label">Step 2: Assessment</span>
    </li>
    <li class="pathable-step-indicator__segment">
      <span class="pathable-step-indicator__segment-label">Step 3: Goals</span>
    </li>
    <li class="pathable-step-indicator__segment">
      <span class="pathable-step-indicator__segment-label">Step 4: Review & Submit</span>
    </li>
  </ol>

  <div class="pathable-record-header" style="margin-bottom: 1.5rem;">
    <div class="pathable-record-header__media">
      <svg aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" style="fill: var(--pathable-color-accent);">
        <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
      </svg>
    </div>
    <div class="pathable-record-header__body">
      <h2 class="pathable-record-header__identity">Jamie Rivera</h2>
      <ul class="pathable-record-header__metadata">
        <li>ID: JR-2026-0042</li>
        <li>Program: Employment Pathways</li>
      </ul>
      <div class="pathable-record-header__badges">
        <span class="pathable-tag">New Enrollment</span>
        <span class="pathable-tag">Intake Phase</span>
      </div>
    </div>
    <div class="pathable-record-header__actions">
      <button class="pathable-button pathable-button--outline">View Profile</button>
    </div>
  </div>

  <div class="pathable-workflow-panel" style="margin-bottom: 1.5rem;">
    <div class="pathable-workflow-panel__context-header">Current Activity: Initial Assessment</div>
    <div class="pathable-workflow-panel__objective">Complete the initial intake assessment for new program enrollment.</div>
    <div class="pathable-workflow-panel__prompt">
      <strong>Assessment prompt:</strong> Review the participant's background, employment history, and support needs. Document your observations and recommended next steps.
    </div>
    <div class="pathable-workflow-panel__input">
      <div class="pathable-form">
        <div class="pathable-form-group" style="margin-bottom: 1rem;">
          <label class="pathable-label" for="employment-status">Current Employment Status</label>
          <span class="pathable-hint" id="employment-hint">Select the participant's current employment situation.</span>
          <select id="employment-status" class="pathable-select" aria-describedby="employment-hint" style="width: 100%;">
            <option value="">- Select status -</option>
            <option value="unemployed">Unemployed</option>
            <option value="employed-pt">Employed Part-Time</option>
            <option value="employed-ft">Employed Full-Time</option>
            <option value="student">Student</option>
            <option value="other">Other</option>
          </select>
        </div>
        <div class="pathable-form-group" style="margin-bottom: 1rem;">
          <fieldset class="pathable-fieldset" style="border: none; padding: 0; margin: 0;">
            <legend class="pathable-label" style="margin-bottom: 0.25rem;">Primary Support Needs</legend>
            <span class="pathable-hint" id="support-hint">Select all that apply.</span>
            <ul class="pathable-checkbox__list" style="list-style: none; padding: 0; margin: 0;">
              <li style="margin-bottom: 0.5rem;">
                <input type="checkbox" id="need-job-search" class="pathable-checkbox" checked>
                <label for="need-job-search">Job search assistance</label>
              </li>
              <li style="margin-bottom: 0.5rem;">
                <input type="checkbox" id="need-resume" class="pathable-checkbox" checked>
                <label for="need-resume">Resume and interview preparation</label>
              </li>
              <li style="margin-bottom: 0.5rem;">
                <input type="checkbox" id="need-training" class="pathable-checkbox">
                <label for="need-training">Skills training referral</label>
              </li>
              <li style="margin-bottom: 0.5rem;">
                <input type="checkbox" id="need-transport" class="pathable-checkbox">
                <label for="need-transport">Transportation assistance</label>
              </li>
            </ul>
          </fieldset>
        </div>
        <div class="pathable-form-group" style="margin-bottom: 1rem;">
          <label class="pathable-label" for="assessment-notes">Assessment Notes</label>
          <span class="pathable-hint" id="notes-hint">Document key observations from the intake conversation.</span>
          <textarea id="assessment-notes" class="pathable-textarea" aria-describedby="notes-hint" rows="5" placeholder="Enter your observations..." style="width: 100%;">Jamie has previous retail experience and is interested in administrative roles. Expresses concern about gaps in employment history. Strong communication skills.</textarea>
        </div>
        <div class="pathable-summary-box" style="margin-bottom: 1rem;">
          <h3 class="pathable-summary-box__heading">Validation Summary</h3>
          <p class="pathable-summary-box__text">Employment status is required. Please select from the dropdown above.</p>
        </div>
        <div style="display: flex; justify-content: flex-end; font-size: 0.875rem; color: var(--pathable-color-text-muted);">
          <span class="pathable-workflow-panel__status">Draft saved · 2:45 PM</span>
        </div>
      </div>
    </div>
    <div class="pathable-workflow-panel__actions">
      <button class="pathable-button pathable-button--low-emphasis">Cancel</button>
      <button class="pathable-button pathable-button--save">Save Draft</button>
      <button class="pathable-button pathable-button--continue">Continue</button>
    </div>
  </div>

  <div class="pathable-workflow-panel__actions" style="display: flex; justify-content: space-between; padding: 1rem 0;">
    <button class="pathable-button pathable-button--outline">&larr; Previous: Participant Info</button>
    <button class="pathable-button">Next: Goals &rarr;</button>
  </div>
</div>
`

const completedHtml = `
<div style="max-width: 800px; margin: 2rem auto; padding: 0 1rem;">
  <ol class="pathable-step-indicator" style="margin-bottom: 2rem;">
    <li class="pathable-step-indicator__segment pathable-step-indicator__segment--completed">
      <span class="pathable-step-indicator__segment-label">Step 1: Participant Info</span>
    </li>
    <li class="pathable-step-indicator__segment pathable-step-indicator__segment--completed">
      <span class="pathable-step-indicator__segment-label">Step 2: Assessment</span>
    </li>
    <li class="pathable-step-indicator__segment pathable-step-indicator__segment--completed">
      <span class="pathable-step-indicator__segment-label">Step 3: Goals</span>
    </li>
    <li class="pathable-step-indicator__segment pathable-step-indicator__segment--completed">
      <span class="pathable-step-indicator__segment-label">Step 4: Review & Submit</span>
    </li>
  </ol>

  <div class="pathable-workflow-panel pathable-workflow-panel--completed" style="text-align: center; padding: 3rem 2rem; margin-bottom: 1.5rem;">
    <svg aria-hidden="true" width="64" height="64" viewBox="0 0 24 24" style="fill: var(--pathable-color-success); margin-bottom: 1rem;">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
    <h2 class="pathable-workflow-panel__objective" style="font-size: 1.5rem; font-weight: 700; margin: 0 0 0.5rem;">Intake Complete</h2>
    <p style="margin: 0 0 0.25rem; font-size: 1rem;">Initial assessment for <strong>Jamie Rivera</strong> has been completed and submitted.</p>
    <p style="margin: 0 0 2rem; font-size: 0.875rem; color: var(--pathable-color-text-muted);">Reference #: ASMT-2026-0042</p>
    <div class="pathable-cluster pathable-cluster--gap-sm" style="justify-content: center;">
      <a href="#" class="pathable-button">Start new assessment</a>
      <a href="#" class="pathable-button pathable-button--outline">View summary</a>
    </div>
  </div>
</div>
`

const mobileHtml = `
<div style="max-width: 800px; margin: 2rem auto; padding: 0 1rem;">
  <div style="font-size: 0.875rem; color: var(--pathable-color-text-muted); margin-bottom: 1rem;">Step 2 of 4: Assessment</div>

  <div class="pathable-record-header pathable-record-header--no-image" style="margin-bottom: 1rem;">
    <div class="pathable-record-header__body">
      <h2 class="pathable-record-header__identity" style="font-size: 1.25rem;">Jamie Rivera</h2>
      <ul class="pathable-record-header__metadata">
        <li>Program: Employment Pathways</li>
      </ul>
    </div>
  </div>

  <div class="pathable-workflow-panel" style="margin-bottom: 1rem;">
    <div class="pathable-workflow-panel__objective">Complete the initial intake assessment.</div>
    <div class="pathable-workflow-panel__input">
      <div class="pathable-form">
        <div class="pathable-form-group" style="margin-bottom: 1rem;">
          <label class="pathable-label" for="emp-status-mobile">Current Employment Status</label>
          <select id="emp-status-mobile" class="pathable-select" style="width: 100%;">
            <option value="">- Select -</option>
            <option value="unemployed">Unemployed</option>
            <option value="employed-pt">Employed Part-Time</option>
            <option value="employed-ft">Employed Full-Time</option>
          </select>
        </div>
        <div class="pathable-form-group" style="margin-bottom: 1rem;">
          <label class="pathable-label" for="notes-mobile">Assessment Notes</label>
          <textarea id="notes-mobile" class="pathable-textarea" rows="4" placeholder="Enter observations..." style="width: 100%;"></textarea>
        </div>
      </div>
    </div>
  </div>

  <div style="display: flex; flex-wrap: wrap; gap: 0.5rem; justify-content: space-between; padding: 1rem 0;">
    <button class="pathable-button pathable-button--outline" style="flex: 1;">&larr; Back</button>
    <button class="pathable-button" style="flex: 1;">Continue &rarr;</button>
  </div>
</div>
`

export const InProgress = {
  parameters: {
    docs: {
      description: {
        story:
          'Structured workflow showing step 2 of 4 in progress. Includes participant record header, step indicator, assessment form with select/checkbox/textarea, save status, validation summary, and navigation actions.',
      },
    },
  },
  render: () => inProgressHtml,
}

export const Completed = {
  parameters: {
    docs: {
      description: {
        story:
          'Structured workflow showing the completed state after all 4 steps are finished. Includes success confirmation with checkmark, reference number, and next-step action buttons.',
      },
    },
  },
  render: () => completedHtml,
}

export const Mobile = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          'Structured workflow at mobile viewport (320px). Step indicator collapses to compact summary, record header condenses, form controls go full width.',
      },
    },
  },
  render: () => mobileHtml,
}

export const Default = InProgress
