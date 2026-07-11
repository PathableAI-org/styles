export default {
  title: 'Dashboard/Record Header',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. The record header uses `.pathable-record-header` with child regions. Images should use an `img` tag; for fallback presentation, omit the image or apply `.pathable-record-header--no-image` modifier with an inline SVG icon.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-record-header">
      <div class="pathable-record-header__media">
        <img src="https://placehold.co/80x80/00365c/ffffff?text=JD" alt="Jane Doe profile photo">
      </div>
      <div class="pathable-record-header__body">
        <h2 class="pathable-record-header__identity">Jane Doe</h2>
        <ul class="pathable-record-header__metadata">
          <li>Employment Specialist</li>
          <li>Seattle Region</li>
          <li>Joined Jan 2024</li>
        </ul>
        <div class="pathable-record-header__badges">
          <span class="pathable-tag">Certified</span>
          <span class="pathable-tag">Mentor</span>
        </div>
      </div>
      <div class="pathable-record-header__actions">
        <button class="pathable-button">View Profile</button>
        <button class="pathable-button pathable-button--outline">Message</button>
      </div>
    </div>
  `,
}

export const WithOverflow = {
  render: () => `
    <div class="pathable-record-header">
      <div class="pathable-record-header__media">
        <img src="https://placehold.co/80x80/015a76/ffffff?text=CO" alt="Community Outreach logo">
      </div>
      <div class="pathable-record-header__body">
        <h2 class="pathable-record-header__identity">Community Outreach Program</h2>
        <ul class="pathable-record-header__metadata">
          <li>Nonprofit Organization</li>
          <li>Portland, OR</li>
          <li>Partner since 2023</li>
        </ul>
        <div class="pathable-record-header__badges">
          <span class="pathable-tag">Active</span>
          <span class="pathable-tag">Verified</span>
        </div>
      </div>
      <div class="pathable-record-header__actions">
        <button class="pathable-button">Open</button>
        <div class="pathable-record-header__overflow">
          <button class="pathable-button pathable-button--outline" aria-label="More actions">&hellip;</button>
        </div>
      </div>
    </div>
  `,
}

export const NoImage = {
  render: () => `
    <div class="pathable-record-header pathable-record-header--no-image">
      <div class="pathable-record-header__media" aria-hidden="true">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
      </div>
      <div class="pathable-record-header__body">
        <h2 class="pathable-record-header__identity">New Participant</h2>
        <ul class="pathable-record-header__metadata">
          <li>Status: Pending</li>
          <li>Referral: Self</li>
        </ul>
      </div>
      <div class="pathable-record-header__actions">
        <button class="pathable-button">Add Details</button>
      </div>
    </div>
  `,
}

export const Centered = {
  render: () => `
    <div class="pathable-record-header pathable-record-header--centered">
      <div class="pathable-record-header__media">
        <img src="https://placehold.co/80x80/1cae96/ffffff?text=SS" alt="Support Services icon">
      </div>
      <div class="pathable-record-header__body">
        <h2 class="pathable-record-header__identity">Support Services</h2>
        <ul class="pathable-record-header__metadata">
          <li>12 active cases</li>
          <li>4 staff members</li>
        </ul>
      </div>
      <div class="pathable-record-header__actions">
        <button class="pathable-button">View Details</button>
      </div>
    </div>
  `,
}

export const Loading = {
  render: () => `
    <div class="pathable-record-header">
      <div class="pathable-record-header__media">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/>
          <circle cx="12" cy="10" r="3"/>
          <path d="M6 21l0-2a4 4 0 0 1 4-4h4a4 4 0 0 1 4 4l0 2"/>
        </svg>
      </div>
      <div class="pathable-record-header__body">
        <h2 class="pathable-record-header__identity">Loading...</h2>
        <ul class="pathable-record-header__metadata">
          <li>Fetching details</li>
        </ul>
      </div>
    </div>
  `,
}

export const LongName = {
  render: () => `
    <div class="pathable-record-header" style="max-width: 400px;">
      <div class="pathable-record-header__media">
        <img src="https://placehold.co/80x80/00365c/ffffff?text=JD" alt="Profile photo">
      </div>
      <div class="pathable-record-header__body">
        <h2 class="pathable-record-header__identity">Dr. Jonathan Michael Williamson the Third</h2>
        <ul class="pathable-record-header__metadata">
          <li>Senior Clinical Director</li>
          <li>Department of Vocational Rehabilitation Services</li>
        </ul>
      </div>
    </div>
  `,
}

export const Mobile = {
  parameters: {
    viewport: { defaultViewport: 'mobile' },
  },
  render: () => `
    <div class="pathable-record-header" style="max-width: 375px;">
      <div class="pathable-record-header__media">
        <img src="https://placehold.co/80x80/00365c/ffffff?text=JD" alt="Jane Doe profile photo">
      </div>
      <div class="pathable-record-header__body">
        <h2 class="pathable-record-header__identity">Jane Doe</h2>
        <ul class="pathable-record-header__metadata">
          <li>Employment Specialist</li>
          <li>Seattle Region</li>
        </ul>
        <div class="pathable-record-header__badges">
          <span class="pathable-tag">Certified</span>
        </div>
      </div>
      <div class="pathable-record-header__actions">
        <button class="pathable-button">View Profile</button>
      </div>
    </div>
  `,
}
