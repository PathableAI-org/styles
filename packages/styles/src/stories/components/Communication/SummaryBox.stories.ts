export default {
  title: 'Components/Communication/Summary Box',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\n**Purpose**: The Summary Box highlights key information that users should be aware of. It is typically used to call out critical details or provide a brief overview of key points. It draws visual attention without being a status alert.\n\n**Misuse**: Do not use the Summary Box for:\n- Alerts or error messages — use Alert or Site Alert instead.\n- Navigation or interactive content — this is a presentational container.\n- Large blocks of dense text — keep content concise.\n\n**Rich content support**: The Summary Box can contain headings, paragraphs, and lists. The `.pathable-summary-box__heading` provides the title, and any additional semantic HTML can follow within the root container. All selectors are implemented: `.pathable-summary-box`, `.pathable-summary-box__heading`, `.pathable-summary-box__text`.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-summary-box">
      <h3 class="pathable-summary-box__heading">Key Information</h3>
      <p class="pathable-summary-box__text">This summary box highlights important information that users should be aware of. It is typically used to call out critical details or provide a brief overview of key points.</p>
    </div>
  `,
}
