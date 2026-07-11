export default {
  title: 'Structured Workflow/Wizard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only — composition example\n\n**Consumers must**: Import `@pathable/styles` CSS. This story composes the wizard page layout, step indicator, action footer, and validation summary into a cohesive multi-step form wizard, demonstrating how the patterns work together.\n\n**Sensitive data**: This composition is designed for staff workflows that may display participant or program information. Minimize displayed data to only what is necessary for the current task. Avoid placing sensitive data in decorative examples.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-wizard">
      <ol class="pathable-step-indicator">
        <li class="pathable-step-indicator__step pathable-step-indicator__step--completed">
          <span class="pathable-step-indicator__step-label">Step 1: Create Account</span>
        </li>
        <li class="pathable-step-indicator__step pathable-step-indicator__step--current">
          <span class="pathable-step-indicator__step-label">Step 2: Participant Intake</span>
        </li>
        <li class="pathable-step-indicator__step">
          <span class="pathable-step-indicator__step-label">Step 3: Program Selection</span>
        </li>
        <li class="pathable-step-indicator__step">
          <span class="pathable-step-indicator__step-label">Step 4: Review & Submit</span>
        </li>
      </ol>

      <p class="pathable-wizard__mobile-summary">Step 2 of 4: Participant Intake</p>

      <h2 class="pathable-wizard__heading">Participant Intake</h2>

      <div class="pathable-wizard__content">
        <div class="pathable-form">
          <div class="pathable-form-group">
            <label class="pathable-label" for="first-name">First Name</label>
            <input class="pathable-input" id="first-name" type="text" value="Jordan">
          </div>
          <div class="pathable-form-group">
            <label class="pathable-label" for="last-name">Last Name</label>
            <input class="pathable-input" id="last-name" type="text" value="Taylor">
          </div>
          <div class="pathable-form-group">
            <label class="pathable-label" for="email">Email</label>
            <input class="pathable-input" id="email" type="email" value="jordan.taylor@example.com">
          </div>
        </div>
      </div>

      <div class="pathable-wizard__actions">
        <button class="pathable-button pathable-button--save">Save &amp; Exit</button>
        <button class="pathable-button pathable-button--base">Back</button>
        <button class="pathable-button pathable-button--continue">Continue</button>
      </div>
    </div>
  `,
}

export const Mobile = {
  parameters: {
    viewport: { defaultViewport: 'mobile1' },
    docs: {
      description: {
        story:
          'On viewports smaller than 768px, the wizard shows a compact step summary line instead of the full horizontal step indicator. The action footer becomes a 2-column sticky bar at the bottom of the viewport.',
      },
    },
  },
  render: () => `
    <div class="pathable-wizard">
      <p class="pathable-wizard__mobile-summary">Step 2 of 4: Participant Intake</p>

      <h2 class="pathable-wizard__heading">Participant Intake</h2>

      <div class="pathable-wizard__content">
        <div class="pathable-form">
          <div class="pathable-form-group">
            <label class="pathable-label" for="m-first-name">First Name</label>
            <input class="pathable-input" id="m-first-name" type="text" value="Jordan">
          </div>
          <div class="pathable-form-group">
            <label class="pathable-label" for="m-last-name">Last Name</label>
            <input class="pathable-input" id="m-last-name" type="text" value="Taylor">
          </div>
        </div>
      </div>

      <div class="pathable-wizard__actions">
        <button class="pathable-button pathable-button--save">Save &amp; Exit</button>
        <button class="pathable-button pathable-button--base">Back</button>
        <button class="pathable-button pathable-button--continue">Continue</button>
      </div>
    </div>
  `,
}

export const ValidationError = {
  parameters: {
    docs: {
      description: {
        story:
          'When validation errors are present on the current step, a validation summary appears above the form content. Focus guidance explains how to move to the validation summary or page heading.',
      },
    },
  },
  render: () => `
    <div class="pathable-wizard">
      <ol class="pathable-step-indicator">
        <li class="pathable-step-indicator__step pathable-step-indicator__step--completed">
          <span class="pathable-step-indicator__step-label">Step 1: Create Account</span>
        </li>
        <li class="pathable-step-indicator__step pathable-step-indicator__step--current">
          <span class="pathable-step-indicator__step-label">Step 2: Participant Intake</span>
        </li>
        <li class="pathable-step-indicator__step">
          <span class="pathable-step-indicator__step-label">Step 3: Program Selection</span>
        </li>
        <li class="pathable-step-indicator__step">
          <span class="pathable-step-indicator__step-label">Step 4: Review & Submit</span>
        </li>
      </ol>

      <p class="pathable-wizard__mobile-summary">Step 2 of 4: Participant Intake</p>

      <h2 class="pathable-wizard__heading">Participant Intake</h2>

      <div class="pathable-wizard__validation pathable-wizard__validation--visible usa-validation" role="alert">
        <div class="usa-alert usa-alert--error">
          <div class="usa-alert__body">
            <p class="usa-alert__heading">Please correct the following errors</p>
            <ul class="usa-error-message">
              <li>Email is required</li>
              <li>Phone number format is invalid</li>
            </ul>
            <p class="usa-hint">After correcting errors, continue to move to the next step.</p>
          </div>
        </div>
      </div>

      <div class="pathable-wizard__content">
        <div class="pathable-form">
          <div class="pathable-form-group">
            <label class="pathable-label" for="ve-first-name">First Name</label>
            <input class="pathable-input" id="ve-first-name" type="text" value="Jordan">
          </div>
          <div class="pathable-form-group">
            <label class="pathable-label" for="ve-last-name">Last Name</label>
            <input class="pathable-input" id="ve-last-name" type="text" value="Taylor">
          </div>
          <div class="pathable-form-group">
            <label class="pathable-label" for="ve-email">Email</label>
            <input class="pathable-input usa-input--error" id="ve-email" type="email" aria-describedby="ve-email-error" value="">
            <span class="usa-error-message" id="ve-email-error" role="alert">Email is required</span>
          </div>
        </div>
      </div>

      <div class="pathable-wizard__actions">
        <button class="pathable-button pathable-button--save">Save &amp; Exit</button>
        <button class="pathable-button pathable-button--base">Back</button>
        <button class="pathable-button pathable-button--continue">Continue</button>
      </div>
    </div>
  `,
}

export const FinalStep = {
  parameters: {
    docs: {
      description: {
        story:
          'On the final step of the wizard, the Continue button is replaced by a Submit button. The Back button remains available to return to previous steps.',
      },
    },
  },
  render: () => `
    <div class="pathable-wizard">
      <ol class="pathable-step-indicator">
        <li class="pathable-step-indicator__step pathable-step-indicator__step--completed">
          <span class="pathable-step-indicator__step-label">Step 1: Create Account</span>
        </li>
        <li class="pathable-step-indicator__step pathable-step-indicator__step--completed">
          <span class="pathable-step-indicator__step-label">Step 2: Participant Intake</span>
        </li>
        <li class="pathable-step-indicator__step pathable-step-indicator__step--completed">
          <span class="pathable-step-indicator__step-label">Step 3: Program Selection</span>
        </li>
        <li class="pathable-step-indicator__step pathable-step-indicator__step--current">
          <span class="pathable-step-indicator__step-label">Step 4: Review & Submit</span>
        </li>
      </ol>

      <p class="pathable-wizard__mobile-summary">Step 4 of 4: Review & Submit</p>

      <h2 class="pathable-wizard__heading">Review & Submit</h2>

      <div class="pathable-wizard__content">
        <div class="pathable-surface pathable-surface--raised" style="padding: 1.5rem;">
          <div class="pathable-stack" style="gap: 0.75rem;">
            <p><strong>Name:</strong> Jordan Taylor</p>
            <p><strong>Email:</strong> jordan.taylor@example.com</p>
            <p><strong>Program:</strong> Employment Pathways</p>
          </div>
        </div>
      </div>

      <div class="pathable-wizard__actions">
        <button class="pathable-button pathable-button--save">Save &amp; Exit</button>
        <button class="pathable-button pathable-button--base">Back</button>
        <button class="pathable-button pathable-button--continue">Submit</button>
      </div>
    </div>
  `,
}

export const SingleStep = {
  parameters: {
    docs: {
      description: {
        story:
          'A single-step wizard has no Back button and the Continue button becomes Submit immediately.',
      },
    },
  },
  render: () => `
    <div class="pathable-wizard">
      <p class="pathable-wizard__mobile-summary">Step 1 of 1: Quick Action</p>

      <h2 class="pathable-wizard__heading">Quick Action</h2>

      <div class="pathable-wizard__content">
        <div class="pathable-form">
          <div class="pathable-form-group">
            <label class="pathable-label" for="ss-reason">Reason</label>
            <select class="pathable-select" id="ss-reason">
              <option>Select a reason</option>
              <option>Schedule follow-up</option>
              <option>Add note</option>
            </select>
          </div>
        </div>
      </div>

      <div class="pathable-wizard__actions">
        <button class="pathable-button pathable-button--continue">Submit</button>
      </div>
    </div>
  `,
}

export const WizardLongForm = {
  parameters: {
    docs: {
      description: {
        story:
          'Long forms within a wizard step can be divided into clearly titled sections without requiring excessive nested card containers.',
      },
    },
  },
  render: () => `
    <div class="pathable-wizard">
      <ol class="pathable-step-indicator">
        <li class="pathable-step-indicator__step pathable-step-indicator__step--completed">
          <span class="pathable-step-indicator__step-label">Step 1: Account</span>
        </li>
        <li class="pathable-step-indicator__step pathable-step-indicator__step--current">
          <span class="pathable-step-indicator__step-label">Step 2: Participant Profile</span>
        </li>
      </ol>

      <p class="pathable-wizard__mobile-summary">Step 2 of 2: Participant Profile</p>

      <h2 class="pathable-wizard__heading">Participant Profile</h2>

      <div class="pathable-wizard__content">
        <h3 class="pathable-wizard__section">Personal Information</h3>
        <div class="pathable-form">
          <div class="pathable-form-group">
            <label class="pathable-label" for="lf-fn">First Name</label>
            <input class="pathable-input" id="lf-fn" type="text" value="Jordan">
          </div>
          <div class="pathable-form-group">
            <label class="pathable-label" for="lf-ln">Last Name</label>
            <input class="pathable-input" id="lf-ln" type="text" value="Taylor">
          </div>
          <div class="pathable-form-group">
            <label class="pathable-label" for="lf-dob">Date of Birth</label>
            <input class="pathable-input" id="lf-dob" type="date">
          </div>
        </div>

        <h3 class="pathable-wizard__section">Contact Details</h3>
        <div class="pathable-form">
          <div class="pathable-form-group">
            <label class="pathable-label" for="lf-email">Email</label>
            <input class="pathable-input" id="lf-email" type="email" value="jordan.taylor@example.com">
          </div>
          <div class="pathable-form-group">
            <label class="pathable-label" for="lf-phone">Phone</label>
            <input class="pathable-input" id="lf-phone" type="tel" value="555-0123">
          </div>
        </div>

        <h3 class="pathable-wizard__section">Address</h3>
        <div class="pathable-form">
          <div class="pathable-form-group">
            <label class="pathable-label" for="lf-addr">Street</label>
            <input class="pathable-input" id="lf-addr" type="text" value="123 Main St">
          </div>
          <div class="pathable-form-group">
            <label class="pathable-label" for="lf-city">City</label>
            <input class="pathable-input" id="lf-city" type="text" value="Portland">
          </div>
          <div class="pathable-form-group">
            <label class="pathable-label" for="lf-state">State</label>
            <select class="pathable-select" id="lf-state">
              <option>Oregon</option>
            </select>
          </div>
          <div class="pathable-form-group">
            <label class="pathable-label" for="lf-zip">ZIP</label>
            <input class="pathable-input" id="lf-zip" type="text" value="97201">
          </div>
        </div>
      </div>

      <div class="pathable-wizard__actions">
        <button class="pathable-button pathable-button--save">Save &amp; Exit</button>
        <button class="pathable-button pathable-button--base">Back</button>
        <button class="pathable-button pathable-button--continue">Submit</button>
      </div>
    </div>
  `,
}
