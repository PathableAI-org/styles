export default {
  title: 'Components/Layout/Media Block',
  tags: ['autodocs'],
}

export const Default = {
  render: () => `
<div class="pathable-media-block" style="display: flex; gap: 1rem; align-items: flex-start; max-width: 600px;">
  <div class="pathable-media-block__media" style="flex-shrink: 0;">
    <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" style="display: block; border-radius: 4px;">
      <rect width="64" height="64" rx="4" fill="#00365c" />
      <circle cx="32" cy="24" r="8" fill="white" fill-opacity="0.8" />
      <ellipse cx="32" cy="52" rx="20" ry="12" fill="white" fill-opacity="0.8" />
    </svg>
  </div>
  <div class="pathable-media-block__body">
    <h3 class="pathable-media-block__title" style="margin: 0 0 0.5rem; font-size: 1.125rem;">Media block title</h3>
    <p class="pathable-media-block__description" style="margin: 0; font-size: 0.875rem; line-height: 1.5;">
      This is the media block description. It sits beside or below the media element
      and provides supporting content for the media item.
    </p>
  </div>
</div>
  `,
}
