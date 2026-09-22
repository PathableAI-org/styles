import { expect, within } from 'storybook/test'

type SectionOptions = {
  content?: string
  expanded?: boolean
  heading?: string
  headingLevel?: 2 | 3 | 4 | 5 | 6
  id: string
}

const fieldContent = (id: string) => `
  <div class="pathable-form-group">
    <label class="pathable-label" for="${id}-reference">Reference note</label>
    <span class="pathable-hint" id="${id}-reference-hint">Add context only when it is useful.</span>
    <input
      class="pathable-input"
      id="${id}-reference"
      name="referenceNote"
      aria-describedby="${id}-reference-hint"
    />
  </div>
`

const optionalSection = ({
  content,
  expanded = false,
  heading = 'Add a reference note',
  headingLevel = 2,
  id,
}: SectionOptions) => `
  <div class="pathable-optional-form-section" data-testid="${id}-section">
    <h${headingLevel} class="pathable-optional-form-section__heading">
      <button
        class="pathable-optional-form-section__button"
        id="${id}-button"
        type="button"
        aria-expanded="${expanded}"
        aria-controls="${id}-content"
      >
        <span>${heading}</span>
        <span class="pathable-optional-form-section__indicator" aria-hidden="true"></span>
      </button>
    </h${headingLevel}>
    <div
      class="pathable-optional-form-section__content"
      id="${id}-content"
      role="region"
      aria-labelledby="${id}-button"
      ${expanded ? '' : 'hidden'}
    >
      ${content ?? fieldContent(id)}
    </div>
  </div>
`

async function verifySection(
  canvasElement: HTMLElement,
  name: string,
  expanded: boolean,
) {
  const canvas = within(canvasElement)
  const button = canvas.getByRole('button', { name })
  const contentId = button.getAttribute('aria-controls')
  const content = contentId
    ? canvasElement.querySelector(`#${contentId}`)
    : null
  const section = button.closest('.pathable-optional-form-section')

  await expect(button).toHaveAttribute('type', 'button')
  await expect(button).toHaveAttribute('aria-expanded', String(expanded))
  await expect(content).not.toBeNull()
  await expect(content).toHaveAttribute('aria-labelledby', button.id)
  await expect(content).toHaveAttribute('role', 'region')
  if (expanded) await expect(content).not.toHaveAttribute('hidden')
  else await expect(content).toHaveAttribute('hidden')
  await expect(section?.scrollWidth).toBeLessThanOrEqual(
    (section?.clientWidth ?? 0) + 2,
  )
}

export default {
  title: 'Components/Form Controls/Optional Form Section',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction model**: A framework-neutral styles contract. Consumers render a level 2-6 heading containing a `type="button"` control, own disclosure behavior, and synchronize `aria-expanded` with the content `hidden` attribute. The button keeps focus when toggled; no animation is provided.\n\n**Relationships**: Give each button and content region unique IDs. Point `aria-controls` to the content and `aria-labelledby` back to the button. Keep collapsed content in the DOM with `hidden` so field values remain successful form values.\n\n**When to use**: Optional groups of form fields. Use the general Accordion for page-content disclosures. Applications remain responsible for opening a collapsed section when a hidden invalid field needs review. Do not add USWDS accordion JavaScript classes.',
      },
    },
  },
}

export const Default = {
  render: () => optionalSection({ id: 'optional-default' }),
  play: ({ canvasElement }: { canvasElement: HTMLElement }) =>
    verifySection(canvasElement, 'Add a reference note', false),
}

export const Expanded = {
  render: () => optionalSection({ id: 'optional-expanded', expanded: true }),
  play: ({ canvasElement }: { canvasElement: HTMLElement }) =>
    verifySection(canvasElement, 'Add a reference note', true),
}

export const NestedFormGroup = {
  render: () =>
    optionalSection({
      id: 'optional-form-group',
      expanded: true,
      heading: 'Add referral details',
      headingLevel: 3,
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)

    await verifySection(canvasElement, 'Add referral details', true)
    await expect(canvas.getByLabelText('Reference note')).toHaveClass(
      'pathable-input',
    )
  },
}

export const NestedFieldset = {
  render: () =>
    optionalSection({
      id: 'optional-fieldset',
      expanded: true,
      heading: 'Add contact preferences',
      headingLevel: 3,
      content: `
        <fieldset class="pathable-fieldset">
          <legend class="pathable-legend">Preferred contact method</legend>
          <div class="pathable-radio">
            <input class="pathable-radio__input" id="fieldset-email" name="fieldsetContact" type="radio" value="email" />
            <label class="pathable-radio__label" for="fieldset-email">Email</label>
          </div>
          <div class="pathable-radio">
            <input class="pathable-radio__input" id="fieldset-phone" name="fieldsetContact" type="radio" value="phone" />
            <label class="pathable-radio__label" for="fieldset-phone">Phone</label>
          </div>
        </fieldset>
      `,
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)

    await verifySection(canvasElement, 'Add contact preferences', true)
    await expect(
      canvas.getByRole('group', { name: 'Preferred contact method' }),
    ).toHaveClass('pathable-fieldset')
  },
}

export const FormComposition = {
  render: () => `
    <form class="pathable-stack pathable-form-stack pathable-stack--gap-lg pathable-maxw-tablet" aria-label="Participant intake">
      <div class="pathable-form-group">
        <label class="pathable-label" for="participant-name">Participant name</label>
        <input class="pathable-input" id="participant-name" name="participantName" />
      </div>
      ${optionalSection({
        id: 'optional-composition',
        expanded: true,
        heading: 'Add communication preferences',
        headingLevel: 3,
        content: `
          <fieldset class="pathable-fieldset">
            <legend class="pathable-legend">Preferred contact method</legend>
            <div class="pathable-radio">
              <input class="pathable-radio__input" id="contact-email" name="contactMethod" type="radio" value="email" />
              <label class="pathable-radio__label" for="contact-email">Email</label>
            </div>
            <div class="pathable-radio">
              <input class="pathable-radio__input" id="contact-phone" name="contactMethod" type="radio" value="phone" />
              <label class="pathable-radio__label" for="contact-phone">Phone</label>
            </div>
          </fieldset>
          <div class="pathable-form-group">
            <label class="pathable-label" for="contact-details">Contact details</label>
            <input class="pathable-input" id="contact-details" name="contactDetails" />
          </div>
        `,
      })}
      <button class="pathable-button pathable-button--primary" type="submit">Save intake</button>
    </form>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)

    await verifySection(canvasElement, 'Add communication preferences', true)
    await expect(
      canvas.getByRole('group', { name: 'Preferred contact method' }),
    ).toBeVisible()
    await expect(canvas.getByLabelText('Contact details')).toBeVisible()
  },
}

export const LongContent = {
  render: () =>
    optionalSection({
      id: 'optional-long',
      expanded: true,
      heading:
        'Add optional accommodations, scheduling considerations, and communication details for future planning sessions',
      content: `
        <p>
          Include any non-required context that may help the planning team prepare for a future meeting, coordinate available support, or understand communication preferences across different settings.
        </p>
        ${fieldContent('optional-long-details')}
      `,
    }),
  play: ({ canvasElement }: { canvasElement: HTMLElement }) =>
    verifySection(
      canvasElement,
      'Add optional accommodations, scheduling considerations, and communication details for future planning sessions',
      true,
    ),
}

export const Narrow = {
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  render: () =>
    optionalSection({
      id: 'optional-narrow',
      expanded: true,
      heading:
        'Add optional details that remain readable in a narrow form column',
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await verifySection(
      canvasElement,
      'Add optional details that remain readable in a narrow form column',
      true,
    )
  },
}

export const IncreasedText = {
  render: () => `
    <div style="font-size: 200%; max-width: 30rem;">
      ${optionalSection({
        id: 'optional-increased-text',
        expanded: true,
        heading: 'Add optional planning details at increased text size',
      })}
    </div>
  `,
  play: ({ canvasElement }: { canvasElement: HTMLElement }) =>
    verifySection(
      canvasElement,
      'Add optional planning details at increased text size',
      true,
    ),
}

export const ForcedColors = {
  parameters: {
    docs: {
      description: {
        story:
          'Use this stable fixture with forced-colors emulation. Borders, the currentColor indicator, and the system Highlight focus outline remain distinguishable.',
      },
    },
  },
  render: () =>
    optionalSection({
      id: 'optional-forced-colors',
      expanded: true,
      heading: 'Add optional details in forced-colors mode',
    }),
  play: ({ canvasElement }: { canvasElement: HTMLElement }) =>
    verifySection(
      canvasElement,
      'Add optional details in forced-colors mode',
      true,
    ),
}
