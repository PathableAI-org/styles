export default {
  title: 'Components/Communication/Process List',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\n**CSS markup**: Requires `.pathable-process-list`, `.pathable-process-list__item`, `.pathable-process-list__heading`. Note: `pathable-process-list__body` is NOT implemented — body content is semantic HTML without the absent class.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <ol class="pathable-process-list">
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Research</h4>
        <p>Conduct initial research to understand user needs and project requirements.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Design</h4>
        <p>Create wireframes and prototypes based on research findings.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Develop</h4>
        <p>Build the solution following design specifications and accessibility guidelines.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Test</h4>
        <p>Validate the implementation through user testing and quality assurance.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Launch</h4>
        <p>Deploy the solution and monitor for any issues.</p>
      </li>
    </ol>
  `,
}
