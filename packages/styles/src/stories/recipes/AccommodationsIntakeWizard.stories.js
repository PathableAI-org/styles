export default {
  title: 'Recipes/Accommodations Intake Wizard',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only. Form inputs and step navigation are static in this demonstration. ' +
          'Consumers must add JavaScript for step progression, form validation, draft saving, and final submission.\n\n' +
          '**Consumers must**: Import `@pathable/styles` CSS. This recipe composes a multi-step accommodations intake wizard with a step indicator, ' +
          'participant record header, form panels with contextual help, validation summary, save-status indicator, and navigation actions from existing public CSS classes.\n\n' +
          '**Accessibility notes**: The step indicator uses `<ol>` with `--completed` and `--current` modifier classes. ' +
          'Each step is a landmark-free panel with a visible heading. Form controls use `<label>` associations and `<fieldset>` with `<legend>` for checkbox groups. ' +
          'The validation summary box alerts users to required fields. Save status text includes a timestamp. ' +
          'Navigation buttons are labeled with step names in the visible text (not hidden). ' +
          'Consumers implementing JavaScript must: move focus to the step heading after transitions, announce validation errors via `aria-live`, ' +
          'and ensure the save status region updates with `aria-live="polite"`.',
      },
    },
  },
}

/* -------------------------------------------------- */
/* Step Indicator                                         */
/* -------------------------------------------------- */
const stepIndicator = (current) => {
  const steps = [
    { num: 1, label: 'Participant Info' },
    { num: 2, label: 'Accommodation Needs' },
    { num: 3, label: 'Workspace Details' },
    { num: 4, label: 'Review & Submit' },
  ]
  return `<ol class="pathable-step-indicator" style="margin-bottom:1.5rem;">${steps
    .map((s) => {
      let cls = 'pathable-step-indicator__segment'
      if (s.num < current) cls += ' pathable-step-indicator__segment--completed'
      if (s.num === current) cls += ' pathable-step-indicator__segment--current'
      return `<li class="${cls}"><span class="pathable-step-indicator__segment-label">${s.label}</span></li>`
    })
    .join('')}</ol>`
}

/* -------------------------------------------------- */
/* Record Header                                         */
/* -------------------------------------------------- */
const recordHeader = (badge) => `
<div class="pathable-record-header" style="margin-bottom:1.5rem;">
  <div class="pathable-record-header__media">
    <svg aria-hidden="true" width="48" height="48" viewBox="0 0 24 24" style="fill:var(--pathable-color-accent);">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 3c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm0 14.2c-2.5 0-4.71-1.28-6-3.22.03-1.99 4-3.08 6-3.08 1.99 0 5.97 1.09 6 3.08-1.29 1.94-3.5 3.22-6 3.22z"/>
    </svg>
  </div>
  <div class="pathable-record-header__body">
    <h2 class="pathable-record-header__identity">James Chen</h2>
    <ul class="pathable-record-header__metadata">
      <li>ID: JC-2026-0083</li>
      <li>Program: Disability Support</li>
      <li>Employer: TechCorp Industries</li>
    </ul>
    <div class="pathable-record-header__badges">
      <span class="pathable-tag">Accommodation Request</span>
      ${badge}
    </div>
  </div>
  <div class="pathable-record-header__actions">
    <button class="pathable-button pathable-button--outline">View Profile</button>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Step 1 — Participant Info                             */
/* -------------------------------------------------- */
const _step1Html = `
<div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;margin-bottom:1.5rem;">
  <h3 style="margin:0 0 1rem;font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);">Participant Information</h3>
  <div class="pathable-form">
    <div class="pathable-form-group" style="margin-bottom:1rem;">
      <label class="pathable-label" for="acc-full-name">Full Name</label>
      <input type="text" id="acc-full-name" class="pathable-input" value="James Chen" style="width:100%;">
    </div>
    <div class="pathable-form-group" style="margin-bottom:1rem;">
      <label class="pathable-label" for="acc-email">Email Address</label>
      <input type="email" id="acc-email" class="pathable-input" value="james.chen@email.com" style="width:100%;">
    </div>
    <div style="display:flex;gap:1rem;flex-wrap:wrap;">
      <div class="pathable-form-group" style="flex:1;min-width:180px;margin-bottom:1rem;">
        <label class="pathable-label" for="acc-phone">Phone Number</label>
        <input type="tel" id="acc-phone" class="pathable-input" value="(555) 234-5678" style="width:100%;">
      </div>
      <div class="pathable-form-group" style="flex:1;min-width:180px;margin-bottom:1rem;">
        <label class="pathable-label" for="acc-role">Job Role</label>
        <select id="acc-role" class="pathable-select" style="width:100%;">
          <option value="">Select role</option>
          <option value="admin" selected>Administrative Assistant</option>
          <option value="analyst">Data Analyst</option>
          <option value="developer">Software Developer</option>
          <option value="manager">Program Manager</option>
        </select>
      </div>
    </div>
    <div class="pathable-form-group" style="margin-bottom:1rem;">
      <label class="pathable-label" for="acc-employer">Employer</label>
      <input type="text" id="acc-employer" class="pathable-input" value="TechCorp Industries" style="width:100%;">
    </div>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Step 2 — Accommodation Needs                          */
/* -------------------------------------------------- */
const step2Html = `
<div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;margin-bottom:1.5rem;">
  <h3 style="margin:0 0 1rem;font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);">Accommodation Needs</h3>
  <div class="pathable-form">
    <div class="pathable-form-group" style="margin-bottom:1rem;">
      <label class="pathable-label" for="acc-category">Accommodation Category</label>
      <span class="pathable-hint" id="acc-category-hint">Select the primary category for this accommodation request.</span>
      <select id="acc-category" class="pathable-select" aria-describedby="acc-category-hint" style="width:100%;">
        <option value="">Select category</option>
        <option value="physical">Physical / Mobility</option>
        <option value="visual" selected>Visual</option>
        <option value="hearing">Hearing</option>
        <option value="cognitive">Cognitive / Neurodiversity</option>
        <option value="ergonomic">Ergonomic</option>
        <option value="other">Other</option>
      </select>
    </div>
    <div class="pathable-form-group" style="margin-bottom:1rem;">
      <label class="pathable-label" for="acc-description">Describe the accommodation need</label>
      <span class="pathable-hint" id="acc-desc-hint">Describe what the participant needs and how it relates to their job functions.</span>
      <textarea id="acc-description" class="pathable-textarea" aria-describedby="acc-desc-hint" rows="4" placeholder="Describe the need&hellip;" style="width:100%;">James requires screen magnification software (200% zoom) and a large-format monitor (27"+) to read on-screen text. Current 22" monitor is insufficient for extended reading tasks.</textarea>
    </div>
    <fieldset class="pathable-fieldset" style="border:none;padding:0;margin:0 0 1rem;">
      <legend class="pathable-label">Requested Support Types</legend>
      <span class="pathable-hint" id="acc-types-hint">Select all that apply.</span>
      <ul style="list-style:none;padding:0;margin:0.5rem 0 0;">
        <li style="margin-bottom:0.5rem;"><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox" checked> Assistive technology</label></li>
        <li style="margin-bottom:0.5rem;"><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox" checked> Equipment / furniture</label></li>
        <li style="margin-bottom:0.5rem;"><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox"> Workspace modification</label></li>
        <li style="margin-bottom:0.5rem;"><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox"> Schedule flexibility</label></li>
        <li style="margin-bottom:0.5rem;"><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox"> Transportation</label></li>
        <li style="margin-bottom:0.5rem;"><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox"> Job coach / support person</label></li>
      </ul>
    </fieldset>
    <div class="pathable-form-group" style="margin-bottom:0;">
      <label class="pathable-label" for="acc-urgency">Urgency Level</label>
      <span class="pathable-hint" id="acc-urgency-hint">How soon is this accommodation needed?</span>
      <ul style="list-style:none;padding:0;margin:0.5rem 0 0;display:flex;flex-direction:column;gap:0.5rem;">
        <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="acc-urgency" value="high" class="pathable-radio"> High — needed immediately to perform essential job functions</label></li>
        <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="acc-urgency" value="medium" class="pathable-radio" checked> Medium — needed within 2 weeks</label></li>
        <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="acc-urgency" value="low" class="pathable-radio"> Low — needed within 30 days</label></li>
      </ul>
    </div>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Step 3 — Workspace Details                            */
/* -------------------------------------------------- */
const _step3Html = `
<div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;margin-bottom:1.5rem;">
  <h3 style="margin:0 0 1rem;font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);">Workspace Details</h3>
  <div class="pathable-form">
    <div class="pathable-form-group" style="margin-bottom:1rem;">
      <label class="pathable-label" for="acc-work-type">Work Environment</label>
      <select id="acc-work-type" class="pathable-select" style="width:100%;">
        <option value="">Select environment</option>
        <option value="office" selected>Office / desk-based</option>
        <option value="warehouse">Warehouse / industrial</option>
        <option value="retail">Retail / customer-facing</option>
        <option value="remote">Remote / home office</option>
        <option value="mixed">Mixed / rotating</option>
      </select>
    </div>
    <div style="display:flex;gap:1rem;flex-wrap:wrap;">
      <div class="pathable-form-group" style="flex:1;min-width:180px;margin-bottom:1rem;">
        <label class="pathable-label" for="acc-building">Building / Location</label>
        <input type="text" id="acc-building" class="pathable-input" value="Building A, 3rd Floor" style="width:100%;">
      </div>
      <div class="pathable-form-group" style="flex:1;min-width:180px;margin-bottom:1rem;">
        <label class="pathable-label" for="acc-workspace">Workspace Type</label>
        <select id="acc-workspace" class="pathable-select" style="width:100%;">
          <option value="">Select type</option>
          <option value="cubicle" selected>Cubicle</option>
          <option value="private">Private office</option>
          <option value="open">Open plan</option>
          <option value="shared">Shared desk</option>
        </select>
      </div>
    </div>
    <div class="pathable-form-group" style="margin-bottom:1rem;">
      <label class="pathable-label" for="acc-constraints">Current Workspace Constraints</label>
      <span class="pathable-hint" id="acc-constraints-hint">Describe any barriers or limitations in the current workspace.</span>
      <textarea id="acc-constraints" class="pathable-textarea" aria-describedby="acc-constraints-hint" rows="3" placeholder="Describe workspace constraints&hellip;" style="width:100%;">Cubicle lighting is overhead fluorescent with no dimming control. Monitor arm does not support larger displays. No adjustable-height desk.</textarea>
    </div>
    <div class="pathable-summary-box">
      <h3 class="pathable-summary-box__heading">Facilities Assessment Required</h3>
      <p class="pathable-summary-box__text">A workspace evaluation is recommended before ordering equipment. Please schedule a facilities walkthrough after completing this intake.</p>
    </div>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Step 4 — Review & Submit                              */
/* -------------------------------------------------- */
const _step4Html = `
<div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;margin-bottom:1.5rem;">
  <h3 style="margin:0 0 1rem;font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);">Review &amp; Submit</h3>

  <div class="pathable-stack pathable-stack--gap-md">
    <div class="pathable-surface pathable-surface--inset" style="padding:1rem;">
      <h4 style="margin:0 0 0.5rem;font-size:0.875rem;font-weight:600;color:var(--pathable-color-text);">Participant</h4>
      <p style="margin:0;font-size:0.875rem;color:var(--pathable-color-text-muted);"><strong>James Chen</strong> &middot; james.chen@email.com &middot; (555) 234-5678</p>
      <p style="margin:0.25rem 0 0;font-size:0.875rem;color:var(--pathable-color-text-muted);">Administrative Assistant &middot; TechCorp Industries &middot; Building A, 3rd Floor</p>
    </div>

    <div class="pathable-surface pathable-surface--inset" style="padding:1rem;">
      <h4 style="margin:0 0 0.5rem;font-size:0.875rem;font-weight:600;color:var(--pathable-color-text);">Accommodation Request</h4>
      <p style="margin:0;font-size:0.875rem;color:var(--pathable-color-text-muted);"><strong>Category:</strong> Visual</p>
      <p style="margin:0.25rem 0 0;font-size:0.875rem;color:var(--pathable-color-text-muted);"><strong>Need:</strong> Screen magnification software (200% zoom) and large-format monitor (27"+)</p>
      <p style="margin:0.25rem 0 0;font-size:0.875rem;color:var(--pathable-color-text-muted);"><strong>Support types:</strong> Assistive technology, Equipment / furniture</p>
      <p style="margin:0.25rem 0 0;font-size:0.875rem;color:var(--pathable-color-text-muted);"><strong>Urgency:</strong> Medium — within 2 weeks</p>
    </div>

    <div class="pathable-surface pathable-surface--inset" style="padding:1rem;">
      <h4 style="margin:0 0 0.5rem;font-size:0.875rem;font-weight:600;color:var(--pathable-color-text);">Workspace</h4>
      <p style="margin:0;font-size:0.875rem;color:var(--pathable-color-text-muted);"><strong>Environment:</strong> Office / desk-based &middot; Cubicle &middot; Building A, 3rd Floor</p>
      <p style="margin:0.25rem 0 0;font-size:0.875rem;color:var(--pathable-color-text-muted);"><strong>Constraints:</strong> Overhead fluorescent lighting, monitor arm limited to 22" displays, no adjustable-height desk.</p>
    </div>
  </div>

  <div class="pathable-form-group" style="margin:1.5rem 0 0;">
    <label class="pathable-label" for="acc-notes">Additional Notes (optional)</label>
    <textarea id="acc-notes" class="pathable-textarea" rows="2" placeholder="Any additional context for the reviewer&hellip;" style="width:100%;">Please coordinate installation with James's supervisor (Sarah Mitchell, ext. 4251). Preferred installation: after 5 PM or weekend.</textarea>
  </div>

  <div class="pathable-summary-box" style="margin-top:1rem;">
    <h3 class="pathable-summary-box__heading">Submission Checklist</h3>
    <p class="pathable-summary-box__text">All required fields are complete. Review the summary above before submitting. Once submitted, the request will be routed to the accommodations coordinator for review within 3 business days.</p>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Save Status + Navigation                              */
/* -------------------------------------------------- */
const saveStatusHtml =
  '<span style="font-size:0.8rem;color:var(--pathable-color-text-muted);">Draft saved &middot; 3:15 PM</span>'

const navPrevNext = (prevLabel, nextLabel) => `
<div style="display:flex;justify-content:space-between;align-items:center;padding:1rem 0;">
  <button class="pathable-button pathable-button--outline">&larr; ${prevLabel}</button>
  ${saveStatusHtml}
  <button class="pathable-button">${nextLabel} &rarr;</button>
</div>
`

/* -------------------------------------------------- */
/* Completed State                                       */
/* -------------------------------------------------- */
const completedHtml = `
<div style="max-width:720px;margin:2rem auto;padding:0 1rem;">
  ${stepIndicator(5)}
  ${recordHeader('<span class="pathable-tag" style="background:var(--pathable-color-workflow-complete);color:var(--pathable-color-on-accent);">Submitted</span>')}

  <div class="pathable-surface pathable-surface--raised" style="padding:2.5rem 2rem;text-align:center;margin-bottom:1.5rem;">
    <svg aria-hidden="true" width="64" height="64" viewBox="0 0 24 24" style="fill:var(--pathable-color-workflow-complete);margin-bottom:1rem;">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
    <h2 style="margin:0 0 0.5rem;font-family:var(--pathable-font-heading);font-size:1.5rem;font-weight:400;color:var(--pathable-color-text);">Intake Submitted</h2>
    <p style="margin:0 0 0.25rem;font-size:1rem;color:var(--pathable-color-text-muted);">
      Accommodation request for <strong>James Chen</strong> has been submitted.
    </p>
    <p style="margin:0 0 2rem;font-size:0.875rem;color:var(--pathable-color-text-muted);">
      Request #: ACC-2026-0147 &middot; Submitted: Today, 3:22 PM
    </p>
    <div class="pathable-cluster pathable-cluster--gap-sm" style="justify-content:center;">
      <a href="#" class="pathable-button">Start new intake</a>
      <a href="#" class="pathable-button pathable-button--outline">View submitted request</a>
    </div>
  </div>

  <div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;">
    <h3 style="margin:0 0 1rem;font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);">What Happens Next</h3>
    <ol class="pathable-process-list">
      <li class="pathable-process-list__item">
        <span class="pathable-process-list__heading">Review by accommodations coordinator</span>
        <p class="pathable-process-list__text">Your request will be reviewed within 3 business days. The coordinator may reach out for additional details.</p>
      </li>
      <li class="pathable-process-list__item">
        <span class="pathable-process-list__heading">Workspace evaluation</span>
        <p class="pathable-process-list__text">A facilities specialist will conduct a workspace walkthrough to identify any environmental adjustments needed.</p>
      </li>
      <li class="pathable-process-list__item">
        <span class="pathable-process-list__heading">Equipment ordering and installation</span>
        <p class="pathable-process-list__text">Approved equipment will be ordered within 5 business days and installed after-hours at James's preference.</p>
      </li>
      <li class="pathable-process-list__item">
        <span class="pathable-process-list__heading">Follow-up assessment</span>
        <p class="pathable-process-list__text">A 30-day follow-up will be scheduled to verify the accommodation is meeting the participant's needs.</p>
      </li>
    </ol>
  </div>
</div>
`

/* -------------------------------------------------- */
/* In-Progress Wizard (Step 2)                          */
/* -------------------------------------------------- */
const inProgressHtml = `
<div style="max-width:720px;margin:2rem auto;padding:0 1rem;">
  ${stepIndicator(2)}
  ${recordHeader('<span class="pathable-tag">In Progress</span>')}
  ${step2Html}
  ${navPrevNext('Participant Info', 'Workspace Details')}
</div>
`

/* -------------------------------------------------- */
/* Mobile (Step 2 only)                                  */
/* -------------------------------------------------- */
const mobileHtml = `
<div style="max-width:375px;margin:0 auto;padding:0 1rem;">
  <div style="font-size:0.875rem;color:var(--pathable-color-text-muted);margin-bottom:0.75rem;">Step 2 of 4: Accommodation Needs</div>

  <div class="pathable-record-header pathable-record-header--no-image" style="margin-bottom:1rem;">
    <div class="pathable-record-header__body">
      <h2 style="margin:0;font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);">James Chen</h2>
      <ul class="pathable-record-header__metadata" style="margin:0.25rem 0 0;">
        <li>TechCorp Industries</li>
      </ul>
      <div class="pathable-record-header__badges" style="margin-top:0.25rem;">
        <span class="pathable-tag">Accommodation Request</span>
      </div>
    </div>
  </div>

  <div class="pathable-surface pathable-surface--raised" style="padding:1.25rem;margin-bottom:1rem;">
    <h3 style="margin:0 0 1rem;font-size:1rem;font-weight:700;color:var(--pathable-color-text);">Accommodation Needs</h3>
    <div class="pathable-form">
      <div class="pathable-form-group" style="margin-bottom:1rem;">
        <label class="pathable-label" for="mob-acc-category">Accommodation Category</label>
        <select id="mob-acc-category" class="pathable-select" style="width:100%;">
          <option value="">Select</option>
          <option value="visual" selected>Visual</option>
          <option value="physical">Physical</option>
          <option value="hearing">Hearing</option>
        </select>
      </div>
      <div class="pathable-form-group" style="margin-bottom:0;">
        <label class="pathable-label" for="mob-acc-desc">Describe the need</label>
        <textarea id="mob-acc-desc" class="pathable-textarea" rows="3" placeholder="Describe the need&hellip;" style="width:100%;">Screen magnification software and 27" monitor needed for reading tasks.</textarea>
      </div>
    </div>
  </div>

  <div style="display:flex;flex-wrap:wrap;gap:0.5rem;justify-content:space-between;padding:0.5rem 0;">
    <button class="pathable-button pathable-button--outline" style="flex:1;">&larr; Back</button>
    <button class="pathable-button" style="flex:1;">Continue &rarr;</button>
  </div>
  <div style="font-size:0.8rem;color:var(--pathable-color-text-muted);text-align:right;">Draft saved &middot; 3:15 PM</div>
</div>
`

/* -------------------------------------------------- */
/* Exports                                               */
/* -------------------------------------------------- */
export const InProgress = {
  parameters: {
    docs: {
      description: {
        story:
          'Accommodations intake wizard in progress at Step 2 (Accommodation Needs). Shows the step indicator, participant record header, accommodation category/description/support types/urgency fields, navigation buttons, and save status.',
      },
    },
  },
  render: () => inProgressHtml,
}

export const Completed = {
  parameters: {
    docs: {
      description: {
        story:
          'Accommodations intake wizard in submitted state. All steps marked complete. Shows success confirmation with request number, timestamp, and a process list explaining the next steps in the accommodations workflow.',
      },
    },
  },
  render: () => completedHtml,
}

export const Mobile = {
  parameters: {
    docs: {
      description: {
        story:
          'Accommodations intake at mobile viewport (375px). Step indicator collapses to text summary. Record header uses compact variant. Form controls go full-width. Navigation buttons stretch to fill available space.',
      },
    },
  },
  render: () => mobileHtml,
}

export const Default = InProgress
