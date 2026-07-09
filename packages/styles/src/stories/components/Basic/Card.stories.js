export default {
  title: 'Components/Card',
  tags: ['autodocs'],
}

export const Default = {
  render: () => `
    <div class="pathable-card">
      <div class="pathable-card__body">
        <h3 class="pathable-card__header">Card Title</h3>
        <p>This is the default card body content. Cards can contain text, links, and other elements.</p>
      </div>
    </div>
  `,
}

export const MediaCard = {
  render: () => `
    <div class="pathable-card pathable-card--media">
      <div class="pathable-card__media">
        <img src="https://placehold.co/600x400" alt="Media placeholder" />
      </div>
      <div class="pathable-card__body">
        <h3 class="pathable-card__header">Media Card Title</h3>
        <p>This card includes a media element alongside the body content.</p>
      </div>
    </div>
  `,
}

export const CardWithVariants = {
  render: () => `
    <div class="pathable-card pathable-card--accent-cool pathable-card--big">
      <div class="pathable-card__body">
        <h3 class="pathable-card__header">Variant Card</h3>
        <p>This card uses accent-cool and big modifiers.</p>
      </div>
    </div>
  `,
}

export const WorkflowCard = {
  render: () => `
    <div class="pathable-card pathable-card--workflow" tabindex="0">
      <div class="pathable-card__container">
        <div class="pathable-card__header">
          <h3 class="pathable-card__heading">Today's Session: J. Doe</h3>
        </div>
        <div class="pathable-card__body">
          <p>Session 12 of 24 — Focus: Cognitive Behavioral Therapy techniques for anxiety management.</p>
          <p class="pathable-card__meta">Last updated: Today, 2:30 PM | Duration: 45 min</p>
          <a href="#" class="pathable-card__action">View session notes →</a>
        </div>
      </div>
    </div>
  `,
}

export const WorkflowCardWithStatus = {
  render: () => `
    <div class="pathable-card pathable-card--workflow" tabindex="0">
      <div class="pathable-card__container">
        <div class="pathable-card__header">
          <h3 class="pathable-card__heading">Progress Report: K. Smith</h3>
          <span class="pathable-card__status">● Completed</span>
        </div>
        <div class="pathable-card__body">
          <p>All 6 intervention goals have been met this period. Next review scheduled for next month.</p>
          <p class="pathable-card__meta">Generated: Jul 8, 2026 | Period: Q2 2026</p>
          <a href="#" class="pathable-card__action">Download full report →</a>
        </div>
      </div>
    </div>
  `,
}