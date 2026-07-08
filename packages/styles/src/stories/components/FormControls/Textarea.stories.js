export default {
  title: 'Components/Form Controls/Textarea',
  tags: ['autodocs'],
};

export const Default = {
  render: () => `
<label class="pathable-label" for="textarea-default">Textarea</label>
<textarea id="textarea-default" class="pathable-textarea" rows="4" cols="40" placeholder="Enter text…"></textarea>
  `,
};

export const InForm = {
  render: () => `
<form class="pathable-form">
  <div class="pathable-form-group">
    <label class="pathable-label" for="textarea-form-name">Name</label>
    <input id="textarea-form-name" class="pathable-input pathable-input--text" type="text" placeholder="Your name" />
  </div>
  <div class="pathable-form-group">
    <label class="pathable-label" for="textarea-form-message">Message</label>
    <textarea id="textarea-form-message" class="pathable-textarea" rows="4" placeholder="Your message…"></textarea>
  </div>
</form>
  `,
};