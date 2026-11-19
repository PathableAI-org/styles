import { expect, within } from 'storybook/test'

import {
  expectKeyboardFocusIndicator,
  resolveColor,
} from '../../shared/focus-indicator'

export default {
  title: 'Components/Card',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only. Cards remain static unless consumers provide native interactive descendants.\n\n**Semantics verified**: Published container, header, heading, body, media, status, and action classes preserve native content semantics under content pressure.\n\n**Consumers must**: Import `@pathableai/styles` CSS and use native links or buttons for actions. In a workflow card, put `.pathable-card__action` on the action link, or on a container around the actions. Inside the container, a plain link gets the action colour and underline, a `.pathable-link` keeps its own, both get the action focus indicator, and other anchors such as a `.pathable-button` keep their own styling. No JavaScript is required.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-card" data-testid="default-card">
      <div class="pathable-card__container" data-testid="default-card-container">
        <div class="pathable-card__header">
          <h3 class="pathable-card__heading">Card Title</h3>
        </div>
        <div class="pathable-card__body" data-testid="default-card-body">
          <p>This is the default card body content. Cards can contain text, links, and other elements.</p>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByTestId('default-card')
    const container = canvas.getByTestId('default-card-container')
    const body = canvas.getByTestId('default-card-body')
    const heading = canvas.getByRole('heading', {
      level: 3,
      name: 'Card Title',
    })
    const description = canvas.getByText(
      'This is the default card body content. Cards can contain text, links, and other elements.',
    )

    await expect(card).toHaveClass('pathable-card')
    await expect(container).toHaveClass('pathable-card__container')
    await expect(heading).toHaveClass('pathable-card__heading')
    await expect(heading.parentElement).toHaveClass('pathable-card__header')
    await expect(body).toHaveClass('pathable-card__body')
    await expect(description.parentElement).toBe(body)
  },
}

export const MediaCard = {
  render: () => `
    <div class="pathable-card pathable-card--media" data-testid="media-card">
      <div class="pathable-card__container">
        <div class="pathable-card__media" data-testid="media-card-media">
          <svg role="img" aria-label="Employment support planning session" focusable="false" viewBox="0 0 600 400" width="600" height="400" xmlns="http://www.w3.org/2000/svg">
            <rect width="600" height="400" fill="currentColor" opacity="0.08" />
            <circle cx="210" cy="170" r="54" fill="currentColor" opacity="0.35" />
            <path d="M110 340c20-80 60-120 120-120s100 40 120 120" fill="currentColor" opacity="0.35" />
            <rect x="380" y="120" width="130" height="24" rx="12" fill="currentColor" opacity="0.35" />
            <rect x="380" y="170" width="100" height="24" rx="12" fill="currentColor" opacity="0.2" />
            <rect x="380" y="220" width="150" height="24" rx="12" fill="currentColor" opacity="0.2" />
          </svg>
        </div>
        <div class="pathable-card__header">
          <h3 class="pathable-card__heading">Media Card Title</h3>
        </div>
        <div class="pathable-card__body">
          <p>This card includes deterministic meaningful media alongside the body content.</p>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByTestId('media-card')
    const mediaContainer = canvas.getByTestId('media-card-media')
    const media = canvas.getByRole('img', {
      name: 'Employment support planning session',
    })

    await expect(card).toHaveClass('pathable-card', 'pathable-card--media')
    await expect(mediaContainer).toHaveClass('pathable-card__media')
    await expect(media.parentElement).toBe(mediaContainer)
    await expect(media).toHaveAttribute('focusable', 'false')
    await expect(
      canvas.getByRole('heading', { level: 3, name: 'Media Card Title' }),
    ).toHaveClass('pathable-card__heading')
  },
}

export const CardWithVariants = {
  render: () => `
    <div class="pathable-card pathable-card--header-first" data-testid="header-first-card">
      <div class="pathable-card__container">
        <div class="pathable-card__header">
          <h3 class="pathable-card__heading">Header-first Card</h3>
        </div>
        <div class="pathable-card__body">
          <p>This card uses the published header-first modifier.</p>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)

    await expect(canvas.getByTestId('header-first-card')).toHaveClass(
      'pathable-card',
      'pathable-card--header-first',
    )
    await expect(
      canvas.getByRole('heading', { level: 3, name: 'Header-first Card' }),
    ).toHaveClass('pathable-card__heading')
  },
}

export const WorkflowCard = {
  render: () => `
    <div class="pathable-card pathable-card--workflow" data-testid="workflow-card">
      <div class="pathable-card__container">
        <div class="pathable-card__header">
          <h3 class="pathable-card__heading">Today's Coaching Session: J. Doe</h3>
        </div>
        <div class="pathable-card__body">
          <p>Session 12 of 24 — Focus: Workplace communication skills and job readiness practice.</p>
          <p class="pathable-card__meta">Last updated: Today, 2:30 PM | Duration: 45 min</p>
          <a href="#" class="pathable-card__action">View session notes →</a>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByTestId('workflow-card')
    const action = canvas.getByRole('link', { name: 'View session notes →' })

    await expect(card).toHaveClass('pathable-card', 'pathable-card--workflow')
    await expect(card).not.toHaveAttribute('tabindex')
    await expect(action).toHaveClass('pathable-card__action')
    await expect(
      canvas.getByRole('heading', {
        level: 3,
        name: "Today's Coaching Session: J. Doe",
      }),
    ).toHaveClass('pathable-card__heading')
  },
}

export const WorkflowCardWithStatus = {
  render: () => `
    <div class="pathable-card pathable-card--workflow" data-testid="workflow-status-card">
      <div class="pathable-card__container">
        <div class="pathable-card__header">
          <h3 class="pathable-card__heading">Employment Progress Report: K. Smith</h3>
          <span class="pathable-card__status"><span aria-hidden="true">●</span> Completed</span>
        </div>
        <div class="pathable-card__body">
          <p>All 6 employment goal milestones have been met this period. Next review scheduled for next month.</p>
          <p class="pathable-card__meta">Generated: Jul 8, 2026 | Period: Q2 2026</p>
          <a href="#" class="pathable-card__action">Download full report →</a>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const card = canvas.getByTestId('workflow-status-card')
    const status = canvas.getByText('Completed', { exact: false })

    const action = canvas.getByRole('link', { name: 'Download full report →' })

    await expect(card).not.toHaveAttribute('tabindex')
    await expect(status).toHaveClass('pathable-card__status')
    await expect(status).toBeVisible()
    await expect(action).toHaveClass('pathable-card__action')
    await expectKeyboardFocusIndicator(canvasElement, action)
  },
}

// `.pathable-card__action` on a container around the actions, as the React
// Card renders it, instead of on the link itself. The plain link gets the
// action link styling, the `.pathable-link` keeps its own link colour and
// underline, and both get the action focus ring. The anchor styled as a
// button keeps its own styling, and the container itself is not drawn as a
// link. `.pathable-cluster` spaces the actions so their focus rings do not
// overlap; the container has no spacing of its own (#368).
export const WorkflowCardActionContainer = {
  render: () => `
    <div class="pathable-card pathable-card--workflow" data-testid="workflow-action-container-card">
      <div class="pathable-card__container">
        <div class="pathable-card__header">
          <h3 class="pathable-card__heading">Today's Coaching Session: J. Doe</h3>
        </div>
        <div class="pathable-card__body">
          <p>Session 12 of 24 — Focus: Workplace communication skills and job readiness practice.</p>
          <p class="pathable-card__meta">Last updated: Today, 2:30 PM | Duration: 45 min</p>
          <div class="pathable-card__action pathable-cluster pathable-cluster--gap-lg" data-testid="workflow-action-container">
            <a href="#session-notes">View session notes →</a>
            <a href="#message-coach" class="pathable-link">Message coach</a>
            <a href="#start-session" class="pathable-button">Start session</a>
          </div>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const container = canvas.getByTestId('workflow-action-container')
    const action = canvas.getByRole('link', { name: 'View session notes →' })
    const linkAction = canvas.getByRole('link', { name: 'Message coach' })
    const buttonLink = canvas.getByRole('link', { name: 'Start session' })
    const linkColor = resolveColor(canvasElement, 'var(--pathable-color-link)')

    await expect(container).toContainElement(action)
    await expect(getComputedStyle(container).color).toBe(
      resolveColor(canvasElement, 'var(--pathable-color-text)'),
    )
    await expect(getComputedStyle(container).textDecorationLine).toBe('none')
    for (const link of [action, linkAction]) {
      await expect(getComputedStyle(link).color).toBe(linkColor)
      await expect(getComputedStyle(link).textDecorationLine).toBe('underline')
    }
    await expect(getComputedStyle(buttonLink).color).not.toBe(linkColor)
    await expect(getComputedStyle(buttonLink).textDecorationLine).toBe('none')

    await expectKeyboardFocusIndicator(canvasElement, action, { width: 2 })
    await expect(getComputedStyle(action).outlineOffset).toBe('2px')
    await expectKeyboardFocusIndicator(canvasElement, linkAction, {
      width: 2,
      fromCurrentFocus: true,
    })
    await expect(getComputedStyle(linkAction).outlineOffset).toBe('2px')
  },
}

export const ContentPressure = {
  render: () => `
    <div data-testid="card-content-pressure" style="width: 18rem; max-width: 100%;">
      <div class="pathable-card">
        <div class="pathable-card__container">
          <div class="pathable-card__header">
            <h3 class="pathable-card__heading">Regional employment eligibility review and coordinated support plan</h3>
          </div>
          <div class="pathable-card__body">
            <p>Review transportation access, workplace accommodations, documentation deadlines, and follow-up responsibilities with the participant and regional support team.</p>
          </div>
          <div class="pathable-card__footer">
            <a href="#review-plan" class="pathable-card__action">Review coordinated support plan</a>
          </div>
        </div>
      </div>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const fixture = canvas.getByTestId('card-content-pressure')
    const heading = canvas.getByRole('heading', {
      level: 3,
      name: 'Regional employment eligibility review and coordinated support plan',
    })
    const action = canvas.getByRole('link', {
      name: 'Review coordinated support plan',
    })

    await expect(heading).toBeVisible()
    await expect(heading).toHaveClass('pathable-card__heading')
    await expect(action).toBeVisible()
    await expect(action.parentElement).toHaveClass('pathable-card__footer')
    await expect(fixture.scrollWidth).toBeLessThanOrEqual(fixture.clientWidth)
  },
}
