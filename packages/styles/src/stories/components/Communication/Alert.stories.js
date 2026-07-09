export default {
  title: 'Components/Communication/Alert',
  tags: ['autodocs'],
}

export const Info = {
  render: () => `
    <div class="pathable-alert pathable-alert--info" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Informational Notice</h3>
        <p class="pathable-alert__text">This is an informational alert providing helpful context or guidance.</p>
      </div>
    </div>
  `,
}

export const Default = Info

export const Warning = {
  render: () => `
    <div class="pathable-alert pathable-alert--warning" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Warning</h3>
        <p class="pathable-alert__text">This is a warning alert indicating caution or potential issues.</p>
      </div>
    </div>
  `,
}

export const Error = {
  render: () => `
    <div class="pathable-alert pathable-alert--error" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Error</h3>
        <p class="pathable-alert__text">This is an error alert for critical issues or failures.</p>
      </div>
    </div>
  `,
}

export const Success = {
  render: () => `
    <div class="pathable-alert pathable-alert--success" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Success</h3>
        <p class="pathable-alert__text">This is a success alert confirming a positive outcome.</p>
      </div>
    </div>
  `,
}

export const Emergency = {
  render: () => `
    <div class="pathable-alert pathable-alert--emergency" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Emergency Alert</h3>
        <p class="pathable-alert__text">This is an emergency alert for urgent situations requiring immediate attention.</p>
      </div>
    </div>
  `,
}

export const Slim = {
  render: () => `
    <div class="pathable-alert pathable-alert--slim" role="alert">
      <div class="pathable-alert__body">
        <p class="pathable-alert__text">This is a slim alert variant with reduced padding for compact layouts.</p>
      </div>
    </div>
  `,
}

// Workflow-specific semantic alert patterns
export const WorkflowComplianceBlocking = {
  render: () => `
    <div class="pathable-alert pathable-alert--error" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Compliance Blocking Issue</h3>
        <p class="pathable-alert__text">This participant's documentation is incomplete. Please review the missing items before proceeding.</p>
      </div>
    </div>
  `,
}

export const WorkflowMissingEvidence = {
  render: () => `
    <div class="pathable-alert pathable-alert--warning" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Missing Required Evidence</h3>
        <p class="pathable-alert__text">Required evidence for session #482 has not been submitted. 3 items are overdue.</p>
      </div>
    </div>
  `,
}

export const WorkflowDraftNotSubmitted = {
  render: () => `
    <div class="pathable-alert pathable-alert--warning" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Draft Note Not Submitted</h3>
        <p class="pathable-alert__text">You have an unsaved draft note for participant J. Doe. Would you like to continue editing?</p>
      </div>
    </div>
  `,
}

export const WorkflowSupervisorApproval = {
  render: () => `
    <div class="pathable-alert pathable-alert--info" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Supervisor Approval Needed</h3>
        <p class="pathable-alert__text">Session note #1023 is ready for supervisor review. Approvals pending: 2.</p>
      </div>
    </div>
  `,
}

export const WorkflowGenerationSuccess = {
  render: () => `
    <div class="pathable-alert pathable-alert--success" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Successful Artifact Generation</h3>
        <p class="pathable-alert__text">Progress note for participant K. Smith has been generated and saved successfully.</p>
      </div>
    </div>
  `,
}

export const WorkflowConnectivityWarning = {
  render: () => `
    <div class="pathable-alert pathable-alert--warning" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Sync/Connectivity Warning</h3>
        <p class="pathable-alert__text">Unable to sync changes. Your work is saved locally and will sync when connection is restored.</p>
      </div>
    </div>
  `,
}
