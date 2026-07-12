export default {
  title: 'Discovery/Wayfinder',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. The wayfinder uses `.pathable-wayfinder` with a `.pathable-wayfinder--raised` modifier. Question groups use `<fieldset>` and `<legend>` for accessible grouping. The decorative icon carries `aria-hidden="true"`.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-wayfinder pathable-wayfinder--raised" role="region" aria-label="Find the right resource" style="max-width: 50rem;">
      <svg class="pathable-wayfinder__icon" aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="11" cy="11" r="8"/>
        <path d="m21 21-4.3-4.3"/>
      </svg>
      <h2 class="pathable-wayfinder__heading">What are you looking for?</h2>
      <p class="pathable-wayfinder__text">Answer a few questions to discover the best resources for your needs.</p>
      <div class="pathable-wayfinder__questions">
        <fieldset class="pathable-wayfinder__question">
          <legend class="pathable-wayfinder__question-label">Who are you helping?</legend>
          <div class="pathable-wayfinder__question-controls">
            <label><input type="radio" name="audience" value="self"> Myself</label>
            <label><input type="radio" name="audience" value="team"> My team</label>
            <label><input type="radio" name="audience" value="client"> A client</label>
          </div>
        </fieldset>
        <fieldset class="pathable-wayfinder__question">
          <legend class="pathable-wayfinder__question-label">What do you need?</legend>
          <div class="pathable-wayfinder__question-controls">
            <label><input type="radio" name="need" value="learn"> Training & education</label>
            <label><input type="radio" name="need" value="assess"> Assessment & tools</label>
            <label><input type="radio" name="need" value="support"> Support & guidance</label>
          </div>
        </fieldset>
      </div>
      <button class="pathable-wayfinder__action pathable-button">Show results</button>
    </div>
  `,
}

export const SingleQuestion = {
  render: () => `
    <div class="pathable-wayfinder pathable-wayfinder--raised" role="region" aria-label="Find the right resource" style="max-width: 30rem;">
      <svg class="pathable-wayfinder__icon" aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
        <circle cx="12" cy="12" r="10"/>
        <path d="M12 16v-4"/>
        <path d="M12 8h.01"/>
      </svg>
      <h2 class="pathable-wayfinder__heading">How can we help?</h2>
      <p class="pathable-wayfinder__text">Select the option that best describes your situation.</p>
      <div class="pathable-wayfinder__questions">
        <fieldset class="pathable-wayfinder__question">
          <legend class="pathable-wayfinder__question-label">What best describes your role?</legend>
          <div class="pathable-wayfinder__question-controls">
            <label><input type="radio" name="role" value="educator"> Educator</label>
            <label><input type="radio" name="role" value="developer"> Developer</label>
            <label><input type="radio" name="role" value="administrator"> Administrator</label>
          </div>
        </fieldset>
      </div>
      <button class="pathable-wayfinder__action pathable-button">Show results</button>
    </div>
  `,
}
