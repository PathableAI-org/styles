export default {
  title: 'Components/Feedback/Toast',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. Manage toast visibility, queuing, and auto-dismiss in application code.\n\n**Role convention**: Use `role="status"` for polite notifications and `role="alert"` for urgent time-sensitive messages.',
      },
    },
  },
}

export const Info = {
  render: () => `
    <div class="pathable-toast__region" style="position:relative;inset:auto;max-width:28rem">
      <div class="pathable-toast pathable-toast--info pathable-toast--dismissible" role="status">
        <span class="pathable-toast__icon" aria-hidden="true">&#9432;</span>
        <span class="pathable-toast__message">Your data has been synced.</span>
        <button class="pathable-toast__dismiss" aria-label="Dismiss">&times;</button>
      </div>
    </div>
  `,
}

export const Progress = {
  render: () => `
    <div class="pathable-toast__region" style="position:relative;inset:auto;max-width:28rem">
      <div class="pathable-toast pathable-toast--progress" role="status">
        <span class="pathable-toast__icon" aria-hidden="true">&#9881;</span>
        <span class="pathable-toast__message">Uploading document...</span>
      </div>
    </div>
  `,
}

export const Success = {
  render: () => `
    <div class="pathable-toast__region" style="position:relative;inset:auto;max-width:28rem">
      <div class="pathable-toast pathable-toast--success pathable-toast--dismissible" role="status">
        <span class="pathable-toast__icon" aria-hidden="true">&#10003;</span>
        <span class="pathable-toast__message">Document saved successfully.</span>
        <button class="pathable-toast__dismiss" aria-label="Dismiss">&times;</button>
      </div>
    </div>
  `,
}

export const Warning = {
  render: () => `
    <div class="pathable-toast__region" style="position:relative;inset:auto;max-width:28rem">
      <div class="pathable-toast pathable-toast--warning pathable-toast--dismissible pathable-toast--has-action" role="alert">
        <span class="pathable-toast__icon" aria-hidden="true">&#9888;</span>
        <span class="pathable-toast__message">Connection lost. Your changes are saved locally.</span>
        <a href="#" class="pathable-toast__action">Retry</a>
        <button class="pathable-toast__dismiss" aria-label="Dismiss">&times;</button>
      </div>
    </div>
  `,
}

export const Error = {
  render: () => `
    <div class="pathable-toast__region" style="position:relative;inset:auto;max-width:28rem">
      <div class="pathable-toast pathable-toast--error pathable-toast--dismissible" role="alert">
        <span class="pathable-toast__icon" aria-hidden="true">&#10007;</span>
        <span class="pathable-toast__message">Failed to save. Please try again.</span>
        <button class="pathable-toast__dismiss" aria-label="Dismiss">&times;</button>
      </div>
    </div>
  `,
}

export const Stacked = {
  render: () => `
    <div class="pathable-toast__region" style="position:relative;inset:auto;max-width:28rem">
      <div class="pathable-toast pathable-toast--info pathable-toast--dismissible" role="status">
        <span class="pathable-toast__icon" aria-hidden="true">&#9432;</span>
        <span class="pathable-toast__message">Background sync complete.</span>
        <button class="pathable-toast__dismiss" aria-label="Dismiss">&times;</button>
      </div>
      <div class="pathable-toast pathable-toast--success pathable-toast--dismissible" role="status">
        <span class="pathable-toast__icon" aria-hidden="true">&#10003;</span>
        <span class="pathable-toast__message">Document saved.</span>
        <button class="pathable-toast__dismiss" aria-label="Dismiss">&times;</button>
      </div>
      <div class="pathable-toast pathable-toast--warning" role="alert">
        <span class="pathable-toast__icon" aria-hidden="true">&#9888;</span>
        <span class="pathable-toast__message">Low disk space on server.</span>
      </div>
    </div>
  `,
}

export const LongText = {
  render: () => `
    <div class="pathable-toast__region" style="position:relative;inset:auto;max-width:28rem">
      <div class="pathable-toast pathable-toast--info pathable-toast--dismissible" role="status">
        <span class="pathable-toast__icon" aria-hidden="true">&#9432;</span>
        <span class="pathable-toast__message">The scheduled maintenance window has been extended by approximately two hours. Please save your work and log out if you plan to leave before the window closes.</span>
        <button class="pathable-toast__dismiss" aria-label="Dismiss">&times;</button>
      </div>
    </div>
  `,
}

export const Mobile = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => `
    <div class="pathable-toast__region" style="position:relative;inset:auto;max-width:none">
      <div class="pathable-toast pathable-toast--info pathable-toast--dismissible" role="status">
        <span class="pathable-toast__icon" aria-hidden="true">&#9432;</span>
        <span class="pathable-toast__message">Data synced.</span>
        <button class="pathable-toast__dismiss" aria-label="Dismiss">&times;</button>
      </div>
    </div>
  `,
}
