export default {
  title: 'Components/Communication/Alert',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\n**CSS markup**: Requires `.pathable-alert`, `.pathable-alert__body`. Do not use `pathable-alert__heading` or `pathable-alert__text` — only `pathable-alert__body` is implemented. Headings and paragraphs within the body receive alert-specific color theming but use semantic HTML elements, not custom class names.',
      },
    },
  },
}

export const Info = {
  render: () => `
    <div class="pathable-alert pathable-alert--info" role="alert">
      <div class="pathable-alert__body">
        <h3>Informational Notice</h3>
        <p>This is an informational alert providing helpful context or guidance.</p>
      </div>
    </div>
  `,
}

export const Default = Info

export const Warning = {
  render: () => `
    <div class="pathable-alert pathable-alert--warning" role="alert">
      <div class="pathable-alert__body">
        <h3>Warning</h3>
        <p>This is a warning alert indicating caution or potential issues.</p>
      </div>
    </div>
  `,
}

export const Error = {
  render: () => `
    <div class="pathable-alert pathable-alert--error" role="alert">
      <div class="pathable-alert__body">
        <h3>Error</h3>
        <p>This is an error alert for critical issues or failures.</p>
      </div>
    </div>
  `,
}

export const Success = {
  render: () => `
    <div class="pathable-alert pathable-alert--success" role="alert">
      <div class="pathable-alert__body">
        <h3>Success</h3>
        <p>This is a success alert confirming a positive outcome.</p>
      </div>
    </div>
  `,
}

export const Emergency = {
  render: () => `
    <div class="pathable-alert pathable-alert--emergency" role="alert">
      <div class="pathable-alert__body">
        <h3>Emergency Alert</h3>
        <p>This is an emergency alert for urgent situations requiring immediate attention.</p>
      </div>
    </div>
  `,
}

export const Slim = {
  render: () => `
    <div class="pathable-alert pathable-alert--slim" role="alert">
      <div class="pathable-alert__body">
        <p>This is a slim alert variant with reduced padding for compact layouts.</p>
      </div>
    </div>
  `,
}

export const WorkflowComplianceBlocking = {
  render: () => `
    <div class="pathable-alert pathable-alert--error" role="alert">
      <div class="pathable-alert__body">
        <h3>Compliance Blocking Issue</h3>
        <p>This participant's documentation is incomplete. Please review the missing items before proceeding.</p>
      </div>
    </div>
  `,
}

export const WorkflowMissingEvidence = {
  render: () => `
    <div class="pathable-alert pathable-alert--warning" role="alert">
      <div class="pathable-alert__body">
        <h3>Missing Required Evidence</h3>
        <p>Required evidence for session #482 has not been submitted. 3 items are overdue.</p>
      </div>
    </div>
  `,
}

export const WorkflowDraftNotSubmitted = {
  render: () => `
    <div class="pathable-alert pathable-alert--warning" role="alert">
      <div class="pathable-alert__body">
        <h3>Draft Note Not Submitted</h3>
        <p>You have an unsaved draft note for participant J. Doe. Would you like to continue editing?</p>
      </div>
    </div>
  `,
}

export const WorkflowSupervisorApproval = {
  render: () => `
    <div class="pathable-alert pathable-alert--info" role="alert">
      <div class="pathable-alert__body">
        <h3>Supervisor Approval Needed</h3>
        <p>Coaching note #1023 is ready for supervisor review. Approvals pending: 2.</p>
      </div>
    </div>
  `,
}

export const WorkflowGenerationSuccess = {
  render: () => `
    <div class="pathable-alert pathable-alert--success" role="alert">
      <div class="pathable-alert__body">
        <h3>Successful Artifact Generation</h3>
        <p>Employment progress note for participant K. Smith has been generated and saved successfully.</p>
      </div>
    </div>
  `,
}

export const WorkflowConnectivityWarning = {
  render: () => `
    <div class="pathable-alert pathable-alert--warning" role="alert">
      <div class="pathable-alert__body">
        <h3>Sync/Connectivity Warning</h3>
        <p>Unable to sync changes. Your work is saved locally and will sync when connection is restored.</p>
      </div>
    </div>
  `,
}
