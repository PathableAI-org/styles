export default {
  title: 'Structured Workflow/Workflow Panel',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only — composition example\n\n**Consumers must**: Import `@pathable/styles` CSS. This story composes the workflow panel with context header, objective, prompt/instruction, observation/note input, progress/save-status region, and completion actions.\n\n**Sensitive data**: This composition is designed for staff workflows that may display participant or program information. Minimize displayed data to only what is necessary for the current task. Avoid placing sensitive data in decorative examples.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-workflow-panel">
      <div class="pathable-workflow-panel__context-header">Participant: Jamie Rivera — Employment Pathways</div>
      <div class="pathable-workflow-panel__objective">Complete intake assessment for new program enrollment</div>
      <div class="pathable-workflow-panel__current-activity">Current activity: Initial Assessment</div>
      <div class="pathable-workflow-panel__prompt">
        <strong>Assessment prompt:</strong><br>
        Review the participant's background and goals. Document any relevant employment history, skills, and barriers to employment. Consider transportation, childcare, and other support needs.
      </div>
      <div class="pathable-workflow-panel__input">
        <label for="default-notes" class="usa-sr-only">Assessment notes</label>
        <textarea class="pathable-textarea" id="default-notes" rows="4" aria-label="Assessment notes" placeholder="Enter your observations and notes here..." style="width: 100%;">Jamie has 3 years of retail experience and expresses interest in healthcare roles. Primary barrier identified is lack of reliable transportation. Recommended: connect with transportation assistance program.</textarea>
      </div>
      <div class="pathable-workflow-panel__status"></div>
      <div class="pathable-workflow-panel__actions">
        <button class="pathable-button pathable-button--low-emphasis">Cancel</button>
        <button class="pathable-button pathable-button--save">Save Draft</button>
        <button class="pathable-button pathable-button--continue">Continue Assessment</button>
      </div>
    </div>
  `,
}

export const Loading = {
  parameters: {
    docs: {
      description: {
        story:
          'The loading state displays a loading indicator while the workflow data is being fetched.',
      },
    },
  },
  render: () => `
    <div class="pathable-workflow-panel pathable-workflow-panel--loading">
      <div class="pathable-workflow-panel__context-header">Participant: Loading...</div>
      <div class="pathable-workflow-panel__status"></div>
    </div>
  `,
}

export const Saving = {
  parameters: {
    docs: {
      description: {
        story:
          'The saving state displays a saving indicator while the consuming application persists the data.',
      },
    },
  },
  render: () => `
    <div class="pathable-workflow-panel pathable-workflow-panel--saving">
      <div class="pathable-workflow-panel__context-header">Participant: Jamie Rivera — Employment Pathways</div>
      <div class="pathable-workflow-panel__objective">Complete intake assessment for new program enrollment</div>
      <div class="pathable-workflow-panel__prompt"><strong>Assessment prompt:</strong> Review the participant's background...</div>
      <div class="pathable-workflow-panel__input">
        <label for="saving-notes" class="usa-sr-only">Assessment notes</label>
        <textarea class="pathable-textarea" id="saving-notes" rows="3" aria-label="Assessment notes" style="width: 100%;">Jamie has 3 years of retail experience...</textarea>
      </div>
      <div class="pathable-workflow-panel__status"></div>
      <div class="pathable-workflow-panel__actions">
        <button class="pathable-button pathable-button--save">Save Draft</button>
        <button class="pathable-button pathable-button--continue">Continue</button>
      </div>
    </div>
  `,
}

export const Saved = {
  parameters: {
    docs: {
      description: {
        story:
          'The saved state confirms that the data has been persisted successfully, shown with a checkmark and "Saved" text.',
      },
    },
  },
  render: () => `
    <div class="pathable-workflow-panel pathable-workflow-panel--saved">
      <div class="pathable-workflow-panel__context-header">Participant: Jamie Rivera — Employment Pathways</div>
      <div class="pathable-workflow-panel__objective">Complete intake assessment for new program enrollment</div>
      <div class="pathable-workflow-panel__prompt"><strong>Assessment prompt:</strong> Review the participant's background...</div>
      <div class="pathable-workflow-panel__input">
        <label for="saved-notes" class="usa-sr-only">Assessment notes</label>
        <textarea class="pathable-textarea" id="saved-notes" rows="3" aria-label="Assessment notes" style="width: 100%;">Jamie has 3 years of retail experience...</textarea>
      </div>
      <div class="pathable-workflow-panel__status"></div>
      <div class="pathable-workflow-panel__actions">
        <button class="pathable-button pathable-button--save">Save Draft</button>
        <button class="pathable-button pathable-button--continue">Continue</button>
      </div>
    </div>
  `,
}

export const Offline = {
  parameters: {
    docs: {
      description: {
        story:
          'The offline state displays a warning banner indicating network connectivity was lost. Primary actions are disabled until the connection is restored.',
      },
    },
  },
  render: () => `
    <div class="pathable-workflow-panel pathable-workflow-panel--offline">
      <div class="pathable-workflow-panel__context-header">Participant: Jamie Rivera — Employment Pathways</div>
      <div class="pathable-workflow-panel__objective">Complete intake assessment for new program enrollment</div>
      <div class="pathable-workflow-panel__prompt"><strong>Assessment prompt:</strong> Review the participant's background...</div>
      <div class="pathable-workflow-panel__input">
        <label for="offline-notes" class="usa-sr-only">Assessment notes</label>
        <textarea class="pathable-textarea" id="offline-notes" rows="3" aria-label="Assessment notes" style="width: 100%;">Jamie has 3 years of retail experience...</textarea>
      </div>
      <div class="pathable-workflow-panel__status"></div>
      <div class="pathable-workflow-panel__actions">
        <button class="pathable-button pathable-button--save">Save Draft</button>
        <button class="pathable-button pathable-button--continue" disabled>Continue</button>
      </div>
    </div>
  `,
}

export const ValidationError = {
  parameters: {
    docs: {
      description: {
        story:
          'The validation error state displays an error banner and highlights the fields that need attention.',
      },
    },
  },
  render: () => `
    <div class="pathable-workflow-panel pathable-workflow-panel--validation-error">
      <div class="pathable-workflow-panel__context-header">Participant: Jamie Rivera — Employment Pathways</div>
      <div class="pathable-workflow-panel__objective">Complete intake assessment for new program enrollment</div>
      <div class="pathable-workflow-panel__current-activity">Current activity: Initial Assessment</div>
      <div class="pathable-workflow-panel__prompt"><strong>Assessment prompt:</strong> Review the participant's background...</div>
      <div class="pathable-workflow-panel__input">
        <label for="ve-notes" class="usa-sr-only">Assessment notes</label>
        <textarea class="pathable-textarea" id="ve-notes" rows="3" aria-label="Assessment notes" style="width: 100%;"></textarea>
        <span class="usa-error-message" role="alert">Assessment notes are required before continuing.</span>
      </div>
      <div class="pathable-workflow-panel__status"></div>
      <div class="pathable-workflow-panel__actions">
        <button class="pathable-button pathable-button--save">Save Draft</button>
        <button class="pathable-button pathable-button--continue">Continue</button>
      </div>
    </div>
  `,
}

export const Completed = {
  parameters: {
    docs: {
      description: {
        story:
          'The completed state shows a completion summary and hides the prompt and input regions, making it clear the workflow has finished.',
      },
    },
  },
  render: () => `
    <div class="pathable-workflow-panel pathable-workflow-panel--completed">
      <div class="pathable-workflow-panel__context-header">Participant: Jamie Rivera — Employment Pathways</div>
      <div class="pathable-workflow-panel__objective">Complete intake assessment for new program enrollment</div>
      <div class="pathable-workflow-panel__prompt"><strong>Assessment prompt:</strong> Review the participant's background...</div>
      <div class="pathable-workflow-panel__input">
        <label for="completed-notes" class="usa-sr-only">Assessment notes</label>
        <textarea class="pathable-textarea" id="completed-notes" rows="3" aria-label="Assessment notes" style="width: 100%;">Assessment completed. Jamie enrolled in Employment Pathways program.</textarea>
      </div>
      <div class="pathable-workflow-panel__status"></div>
      <div class="pathable-workflow-panel__actions">
        <button class="pathable-button pathable-button--continue">Start New Assessment</button>
      </div>
    </div>
  `,
}

export const LongPrompt = {
  parameters: {
    docs: {
      description: {
        story:
          'When prompts or entered notes are very long, the content scrolls within its region instead of overflowing the layout.',
      },
    },
  },
  render: () => `
    <div class="pathable-workflow-panel">
      <div class="pathable-workflow-panel__context-header">Participant: Casey Morgan — Career Counseling</div>
      <div class="pathable-workflow-panel__objective">Comprehensive career assessment and goal planning session</div>
      <div class="pathable-workflow-panel__prompt" tabindex="0">
        <strong>Extended prompt:</strong><br>
        This is a comprehensive career counseling session. Please review the following areas with the participant:<br><br>
        <strong>1. Employment History</strong><br>
        Discuss the participant's work history for the past 5 years, including job titles, responsibilities, reasons for leaving, and any gaps in employment.<br><br>
        <strong>2. Skills Assessment</strong><br>
        Evaluate both hard skills (technical abilities, certifications, languages) and soft skills (communication, teamwork, problem-solving).<br><br>
        <strong>3. Educational Background</strong><br>
        Review formal education, vocational training, and any continuing education or professional development.<br><br>
        <strong>4. Barriers to Employment</strong><br>
        Identify potential barriers including transportation, childcare, housing stability, health issues, legal barriers, and access to technology.<br><br>
        <strong>5. Short-term Goals (0-6 months)</strong><br>
        Help the participant identify immediate next steps including job applications, training programs, and support services.<br><br>
        <strong>6. Long-term Goals (6-24 months)</strong><br>
        Discuss career trajectory, advanced training, and sustainable employment objectives.<br><br>
        <strong>7. Support Network</strong><br>
        Identify family, community, and organizational support systems available to the participant.<br><br>
        <em>Please document all observations thoroughly in the notes below.</em>
      </div>
      <div class="pathable-workflow-panel__input">
        <label for="lp-notes" class="usa-sr-only">Comprehensive assessment notes</label>
        <textarea class="pathable-textarea" id="lp-notes" rows="6" aria-label="Comprehensive assessment notes" placeholder="Enter your comprehensive assessment notes here..." style="width: 100%;">Casey has 8+ years of experience in customer service and retail management. Strong communication skills identified. Expresses interest in transitioning to healthcare administration. Completed some college coursework in business administration. Primary barriers: lack of healthcare industry connections and need for additional certification.</textarea>
      </div>
      <div class="pathable-workflow-panel__status"></div>
      <div class="pathable-workflow-panel__actions">
        <button class="pathable-button pathable-button--low-emphasis">Cancel</button>
        <button class="pathable-button pathable-button--save">Save Draft</button>
        <button class="pathable-button pathable-button--continue">Complete Assessment</button>
      </div>
    </div>
  `,
}

export const Mobile = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          'On mobile viewports, the workflow panel action buttons become sticky at the bottom of the viewport.',
      },
    },
  },
  render: () => `
    <div class="pathable-workflow-panel">
      <div class="pathable-workflow-panel__context-header">Participant: Jamie Rivera</div>
      <div class="pathable-workflow-panel__objective">Complete intake assessment</div>
      <div class="pathable-workflow-panel__prompt">
        <strong>Assessment prompt:</strong><br>
        Review the participant's background and goals. Document any relevant employment history, skills, and barriers to employment.
      </div>
      <div class="pathable-workflow-panel__input">
        <label for="mobile-notes" class="usa-sr-only">Assessment notes</label>
        <textarea class="pathable-textarea" id="mobile-notes" rows="4" aria-label="Assessment notes" placeholder="Enter your observations..." style="width: 100%;">Initial assessment in progress...</textarea>
      </div>
      <div class="pathable-workflow-panel__status"></div>
      <div class="pathable-workflow-panel__actions">
        <button class="pathable-button pathable-button--low-emphasis">Cancel</button>
        <button class="pathable-button pathable-button--save">Save Draft</button>
        <button class="pathable-button pathable-button--continue">Continue</button>
      </div>
    </div>
  `,
}
