export default {
  title: 'Components/Layout/Icon',
  tags: ['autodocs'],
}

export const AllIcons = {
  render: () => `
<div style="display: flex; flex-wrap: wrap; gap: 1rem; padding: 1rem;">
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">clock</span>
  </div>
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">activity</span>
  </div>
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">bell</span>
  </div>
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
      <line x1="3" y1="9" x2="21" y2="9" />
      <line x1="9" y1="21" x2="9" y2="9" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">archive</span>
  </div>
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M21.5 2v6h-6M2.5 22v-6h6M2 2l20 20" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">external-link</span>
  </div>
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
      <polyline points="10 9 9 9 8 9" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">file</span>
  </div>
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <circle cx="11" cy="11" r="8" />
      <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">search</span>
  </div>
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">shield</span>
  </div>
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">trending</span>
  </div>
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
      <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">check-circle</span>
  </div>
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">user</span>
  </div>
  <div class="pathable-icon" style="display: flex; flex-direction: column; align-items: center; gap: 0.25rem; width: 100px; text-align: center;">
    <svg class="pathable-icon__svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
    <span class="pathable-icon__label" style="font-size: 0.75rem;">mail</span>
  </div>
</div>
  `,
}
