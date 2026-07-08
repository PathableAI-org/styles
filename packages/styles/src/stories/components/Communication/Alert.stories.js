export default {
  title: 'Components/Communication/Alert',
  tags: ['autodocs'],
};

export const Info = {
  render: () => `
    <div class="pathable-alert pathable-alert--info" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Informational Notice</h3>
        <p class="pathable-alert__text">This is an informational alert providing helpful context or guidance.</p>
      </div>
    </div>
  `,
};

export const Warning = {
  render: () => `
    <div class="pathable-alert pathable-alert--warning" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Warning</h3>
        <p class="pathable-alert__text">This is a warning alert indicating caution or potential issues.</p>
      </div>
    </div>
  `,
};

export const Error = {
  render: () => `
    <div class="pathable-alert pathable-alert--error" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Error</h3>
        <p class="pathable-alert__text">This is an error alert for critical issues or failures.</p>
      </div>
    </div>
  `,
};

export const Success = {
  render: () => `
    <div class="pathable-alert pathable-alert--success" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Success</h3>
        <p class="pathable-alert__text">This is a success alert confirming a positive outcome.</p>
      </div>
    </div>
  `,
};

export const Emergency = {
  render: () => `
    <div class="pathable-alert pathable-alert--emergency" role="alert">
      <div class="pathable-alert__body">
        <h3 class="pathable-alert__heading">Emergency Alert</h3>
        <p class="pathable-alert__text">This is an emergency alert for urgent situations requiring immediate attention.</p>
      </div>
    </div>
  `,
};

export const Slim = {
  render: () => `
    <div class="pathable-alert pathable-alert--slim" role="alert">
      <div class="pathable-alert__body">
        <p class="pathable-alert__text">This is a slim alert variant with reduced padding for compact layouts.</p>
      </div>
    </div>
  `,
};