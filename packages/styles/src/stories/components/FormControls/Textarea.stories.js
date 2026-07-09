export default {
  title: 'Components/Form Controls/Textarea',
  tags: ['autodocs'],
}

export const Default = {
  render: () => `
<label class="pathable-label" for="textarea-default">Textarea</label>
<textarea id="textarea-default" class="pathable-textarea" rows="4" cols="40" placeholder="Enter text…"></textarea>
  `,
}

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
}

export const WorkflowSessionNote = {
  render: () => `
<form class="pathable-form">
  <label class="pathable-label" for="session-note">Job Coaching Session Note</label>
  <span class="pathable-hint" id="session-note-hint">
    Document key observations, supports provided, and employment goal progress from this session.
  </span>
  <textarea
    id="session-note"
    class="pathable-textarea"
    aria-describedby="session-note-hint"
    rows="6"
    placeholder="Enter session notes..."
  ></textarea>
</form>
  `,
}

export const WorkflowSupervisorComment = {
  render: () => `
<form class="pathable-form">
  <label class="pathable-label" for="supervisor-comment">Supervisor Approval Comment</label>
  <span class="pathable-hint" id="supervisor-comment-hint">
    Add your supervisory comments and recommendations.
  </span>
  <textarea
    id="supervisor-comment"
    class="pathable-textarea"
    aria-describedby="supervisor-comment-hint"
    rows="4"
    placeholder="Enter supervisory comments..."
  ></textarea>
</form>
  `,
}