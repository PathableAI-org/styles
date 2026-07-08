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
