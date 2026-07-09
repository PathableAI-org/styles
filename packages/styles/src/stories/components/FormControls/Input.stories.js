export default {
  title: 'Components/Form Controls/Input',
  tags: ['autodocs'],
}

export const Text = {
  render: () => `
<label class="pathable-label" for="input-text">Text input</label>
<input
  id="input-text"
  name="input-text"
  class="pathable-input"
  type="text"
  placeholder="Enter text"
/>
  `,
}

export const WorkflowRequiredComplianceField = {
  render: () => `
<form class="pathable-form">
  <label class="pathable-label" for="compliance-field">Medicaid ID <span class="usa-hint">(required)</span></label>
  <span class="pathable-hint" id="compliance-field-hint">
    Enter the participant's Medicaid identification number.
  </span>
  <input
    id="compliance-field"
    name="compliance-field"
    class="pathable-input pathable-input--error"
    type="text"
    aria-describedby="compliance-field-hint compliance-field-error"
    aria-invalid="true"
    placeholder="Enter Medicaid ID"
  />
  <span class="pathable-error-message" id="compliance-field-error" role="alert">
    Medicaid ID is required. Please enter a valid 10-digit Medicaid ID number.
  </span>
</form>
  `,
}