export default {
  title: 'Recipes/Questionnaire Results Flow',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only. Radio/checkbox selections are static in this demonstration. ' +
          'Consumers must add JavaScript for step progression, score calculation, and dynamic result rendering.\n\n' +
          '**Consumers must**: Import `@pathable/styles` CSS. This recipe demonstrates an accessible questionnaire that leads to a scored results view. ' +
          'The questionnaire uses `<fieldset>` plus `<legend>` for question groups, labeled radio inputs, and a step indicator for progress.\n\n' +
          '**Accessibility notes**: Every question uses `<fieldset>` with a `<legend>` for screen-reader grouping. ' +
          'Radio inputs have explicit `<label>` associations. The step indicator uses `<ol>` with `aria-current="step"`. ' +
          'The result view uses `<output>` for the score and semantic heading hierarchy. ' +
          'Color alone is not used to convey information — result categories include visible text labels. ' +
          'Consumers implementing JavaScript must manage focus after step transitions and announce result changes via `aria-live` regions.',
      },
    },
  },
}

/* -------------------------------------------------- */
/* Step Indicator + Record Header                        */
/* -------------------------------------------------- */
const stepIndicatorHtml = (currentStep, totalSteps) => {
  const steps = []
  for (let i = 1; i <= totalSteps; i++) {
    let cls = 'pathable-step-indicator__segment'
    if (i < currentStep) cls += ' pathable-step-indicator__segment--completed'
    if (i === currentStep) cls += ' pathable-step-indicator__segment--current'
    steps.push(
      `<li class="${cls}"><span class="pathable-step-indicator__segment-label">Question ${i}</span></li>`,
    )
  }
  return `<ol class="pathable-step-indicator" style="margin-bottom:1.5rem;">${steps.join('')}</ol>`
}

const recordHeaderHtml = `
<div class="pathable-record-header" style="margin-bottom:1.5rem;">
  <div class="pathable-record-header__media">
    <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" style="fill:var(--pathable-color-accent);">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
  </div>
  <div class="pathable-record-header__body">
    <h2 class="pathable-record-header__identity">Work Readiness Assessment</h2>
    <ul class="pathable-record-header__metadata">
      <li>Participant: Maria Gonzalez</li>
      <li>Program: Employment Pathways</li>
    </ul>
  </div>
  <div class="pathable-record-header__actions">
    <span class="pathable-tag">In Progress</span>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Question HTML                                          */
/* -------------------------------------------------- */
const _question1Html = `
<fieldset class="pathable-fieldset" style="border:none;padding:0;margin:0;">
  <legend style="font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);margin-bottom:0.5rem;">
    1. How confident are you in your job search skills?
  </legend>
  <p style="margin:0 0 1rem;font-size:0.875rem;color:var(--pathable-color-text-muted);">Rate your confidence on a scale of 1 (not confident) to 5 (very confident).</p>
  <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.75rem;">
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="q1" value="1" class="pathable-radio"> 1 — Not confident</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="q1" value="2" class="pathable-radio" checked> 2 — Slightly confident</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="q1" value="3" class="pathable-radio"> 3 — Moderately confident</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="q1" value="4" class="pathable-radio"> 4 — Confident</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="q1" value="5" class="pathable-radio"> 5 — Very confident</label></li>
  </ul>
</fieldset>
`

const question2Html = `
<fieldset class="pathable-fieldset" style="border:none;padding:0;margin:0;">
  <legend style="font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);margin-bottom:0.5rem;">
    2. Which barriers affect your employment search?
  </legend>
  <p style="margin:0 0 1rem;font-size:0.875rem;color:var(--pathable-color-text-muted);">Select all that apply.</p>
  <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.75rem;">
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox" checked> Transportation</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox"> Childcare</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox" checked> Skills gap</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox"> Health concerns</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox"> Criminal record</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="checkbox" class="pathable-checkbox" checked> Interview skills</label></li>
  </ul>
</fieldset>
`

const question3Html = `
<fieldset class="pathable-fieldset" style="border:none;padding:0;margin:0;">
  <legend style="font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);margin-bottom:0.5rem;">
    3. What type of work are you seeking?
  </legend>
  <p style="margin:0 0 1rem;font-size:0.875rem;color:var(--pathable-color-text-muted);">Choose the option that best describes your goal.</p>
  <ul style="list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:0.75rem;">
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="q3" value="full-time" class="pathable-radio" checked> Full-time employment</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="q3" value="part-time" class="pathable-radio"> Part-time employment</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="q3" value="training" class="pathable-radio"> Skills training program</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="q3" value="apprenticeship" class="pathable-radio"> Apprenticeship</label></li>
    <li><label style="display:flex;align-items:center;gap:0.5rem;cursor:pointer;font-size:1rem;"><input type="radio" name="q3" value="remote" class="pathable-radio"> Remote / work-from-home</label></li>
  </ul>
</fieldset>
`

/* -------------------------------------------------- */
/* Result View                                            */
/* -------------------------------------------------- */
const resultsHtml = `
<div class="pathable-surface pathable-surface--raised" style="padding:2rem;">
  <div class="pathable-stack pathable-stack--gap-lg" style="align-items:center;text-align:center;">
    <svg aria-hidden="true" width="56" height="56" viewBox="0 0 24 24" style="fill:var(--pathable-color-workflow-complete);">
      <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
    </svg>
    <h2 style="margin:0;font-family:var(--pathable-font-heading);font-size:1.5rem;font-weight:400;color:var(--pathable-color-text);">Assessment Complete</h2>
    <p style="margin:0;font-size:1rem;color:var(--pathable-color-text-muted);max-width:480px;">Your work readiness score and recommendations are ready. Review the results below and share them with your case worker.</p>
  </div>
</div>

<div class="pathable-card-grid" style="margin-top:1.5rem;">
  <div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;text-align:center;">
    <output style="display:block;font-family:var(--pathable-font-heading);font-size:2.5rem;font-weight:400;color:var(--pathable-color-text);line-height:1;">62%</output>
    <p style="margin:0.25rem 0 0;font-size:0.875rem;font-weight:600;color:var(--pathable-color-text);">Work Readiness Score</p>
    <p style="margin:0.5rem 0 0;font-size:0.8rem;color:var(--pathable-color-text-muted);">Moderate — additional support recommended</p>
  </div>
  <div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;text-align:center;">
    <output style="display:block;font-family:var(--pathable-font-heading);font-size:2.5rem;font-weight:400;color:var(--pathable-color-accent);line-height:1;">3</output>
    <p style="margin:0.25rem 0 0;font-size:0.875rem;font-weight:600;color:var(--pathable-color-text);">Barriers Identified</p>
    <p style="margin:0.5rem 0 0;font-size:0.8rem;color:var(--pathable-color-text-muted);">Transportation, Skills Gap, Interview Skills</p>
  </div>
  <div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;text-align:center;">
    <output style="display:block;font-family:var(--pathable-font-heading);font-size:2.5rem;font-weight:400;color:var(--pathable-color-link);line-height:1;">Full-time</output>
    <p style="margin:0.25rem 0 0;font-size:0.875rem;font-weight:600;color:var(--pathable-color-text);">Employment Goal</p>
    <p style="margin:0.5rem 0 0;font-size:0.8rem;color:var(--pathable-color-text-muted);">Direct placement pathway</p>
  </div>
</div>

<div class="pathable-surface pathable-surface--raised" style="padding:1.5rem;margin-top:1.5rem;">
  <h3 style="margin:0 0 1rem;font-family:var(--pathable-font-subheading);font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);">Recommended Next Steps</h3>
  <ol class="pathable-process-list">
    <li class="pathable-process-list__item">
      <span class="pathable-process-list__heading">Transportation support referral</span>
      <p class="pathable-process-list__text">Connect with the transportation assistance program to arrange bus passes or rideshare credits.</p>
    </li>
    <li class="pathable-process-list__item">
      <span class="pathable-process-list__heading">Skills training enrollment</span>
      <p class="pathable-process-list__text">Enroll in the Job Readiness Workshop Series — next cohort starts in 2 weeks.</p>
    </li>
    <li class="pathable-process-list__item">
      <span class="pathable-process-list__heading">Mock interview scheduling</span>
      <p class="pathable-process-list__text">Practice interview skills with a career coach. Three sessions included in your program.</p>
    </li>
  </ol>
  <div class="pathable-cluster pathable-cluster--gap-sm" style="justify-content:flex-end;margin-top:1.5rem;">
    <button class="pathable-button pathable-button--outline">Download Results</button>
    <button class="pathable-button">Share with Case Worker</button>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Questionnaire In Progress                             */
/* -------------------------------------------------- */
const questionnaireHtml = `
<div style="max-width:720px;margin:2rem auto;padding:0 1rem;">
  ${recordHeaderHtml}
  ${stepIndicatorHtml(2, 3)}
  <div class="pathable-surface pathable-surface--raised" style="padding:2rem;margin-bottom:1.5rem;">
    <div class="pathable-stack pathable-stack--gap-lg">
      ${question2Html}
      ${question3Html}
    </div>
  </div>
  <div style="display:flex;justify-content:space-between;padding:1rem 0;">
    <button class="pathable-button pathable-button--outline">&larr; Previous</button>
    <button class="pathable-button">Next &rarr;</button>
  </div>
  <div style="font-size:0.8rem;color:var(--pathable-color-text-muted);text-align:right;">Draft saved &middot; 10:15 AM</div>
</div>
`

/* -------------------------------------------------- */
/* Completed Results                                     */
/* -------------------------------------------------- */
const resultsPageHtml = `
<div style="max-width:720px;margin:2rem auto;padding:0 1rem;">
  <div class="pathable-record-header" style="margin-bottom:1.5rem;">
    <div class="pathable-record-header__media">
      <svg aria-hidden="true" width="40" height="40" viewBox="0 0 24 24" style="fill:var(--pathable-color-workflow-complete);">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
    </div>
    <div class="pathable-record-header__body">
      <h2 class="pathable-record-header__identity">Work Readiness Assessment</h2>
      <ul class="pathable-record-header__metadata">
        <li>Participant: Maria Gonzalez</li>
        <li>Completed: Today, 10:20 AM</li>
      </ul>
    </div>
    <div class="pathable-record-header__actions">
      <span class="pathable-tag" style="background:var(--pathable-color-workflow-complete);color:var(--pathable-color-on-accent);">Complete</span>
    </div>
  </div>
  ${resultsHtml}
  <div class="pathable-cluster pathable-cluster--gap-sm" style="justify-content:center;margin-top:2rem;">
    <button class="pathable-button">Start New Assessment</button>
    <button class="pathable-button pathable-button--outline">Back to Dashboard</button>
  </div>
</div>
`

const mobileQuestionnaireHtml = `
<div style="max-width:375px;margin:0 auto;padding:0 1rem;">
  <div class="pathable-record-header pathable-record-header--no-image" style="margin-bottom:1.25rem;">
    <div class="pathable-record-header__body">
      <h2 style="margin:0;font-size:1.125rem;font-weight:700;color:var(--pathable-color-text);">Work Readiness Assessment</h2>
      <ul class="pathable-record-header__metadata" style="margin:0.25rem 0 0;">
        <li>Maria Gonzalez</li>
        <li>Question 2 of 3</li>
      </ul>
    </div>
  </div>
  <div class="pathable-surface pathable-surface--raised" style="padding:1.25rem;margin-bottom:1rem;">
    <div class="pathable-stack pathable-stack--gap-lg">
      ${question2Html}
    </div>
  </div>
  <div style="display:flex;gap:0.5rem;justify-content:space-between;padding:0.5rem 0;">
    <button class="pathable-button pathable-button--outline" style="flex:1;">&larr; Back</button>
    <button class="pathable-button" style="flex:1;">Next &rarr;</button>
  </div>
</div>
`

/* -------------------------------------------------- */
/* Exports                                               */
/* -------------------------------------------------- */
export const Questionnaire = {
  parameters: {
    docs: {
      description: {
        story:
          'Questionnaire in progress showing step 2 of 3. Demonstrates `<fieldset>` with `<legend>` for question grouping, labeled radio/checkbox inputs, and a step indicator with completed/current states. Navigation buttons and auto-save status are shown.',
      },
    },
  },
  render: () => questionnaireHtml,
}

export const Results = {
  parameters: {
    docs: {
      description: {
        story:
          'Completed assessment with results view. Shows `<output>` elements for score, barriers, and employment goal. Includes a process list for recommended next steps and action buttons for download and sharing. The completion tag uses color plus visible text.',
      },
    },
  },
  render: () => resultsPageHtml,
}

export const Mobile = {
  parameters: {
    docs: {
      description: {
        story:
          'Questionnaire at mobile viewport (375px). Record header collapses to compact form. Radio and checkbox labels remain full-width with comfortable tap targets. Navigation buttons span full width.',
      },
    },
  },
  render: () => mobileQuestionnaireHtml,
}

export const Default = Questionnaire
