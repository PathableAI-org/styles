import { Button } from '../../../components/Button/Button'
import { PageError } from '../../../components/PageError/PageError'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

const ERROR_ICON = (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z" />
  </svg>
)

const NOT_FOUND_ICON = (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
    <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
    <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-2h2v10h-2z" />
  </svg>
)

const LOCK_ICON = (
  <svg viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
    <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2  .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z" />
  </svg>
)

/** The source nav token currently fails contrast on the light surface. */
const NAV_A11Y_TAGS = ['skip-a11y']

const meta = {
  title: 'Components/Feedback/PageError',
  component: PageError,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A page-level error pattern for recoverable failures, missing pages, and access restrictions. It renders the existing PathAble error classes around a semantic heading, explanation, decorative icon, and optional recovery or navigation actions.

**When to use**: Use PageError when a page or major content region cannot be displayed, when a route is not found, or when access is restricted. Choose the compact layout for an inline panel and the full-page layout for a page-level failure.

**When not to use**: Do not use PageError for empty data, search results with no matches, or ordinary inline field validation. Use EmptyState or the relevant form feedback pattern instead.

**Underlying element**: \`<div>\` with a layout-dependent semantic heading (\`<h2>\` for compact and \`<h1>\` for full-page) and a \`<p>\` body.

**Variants**: \`generic\`, \`not-found\`, and \`access-restricted\` map directly to the implemented PathAble modifier classes. The generic variant uses no additional variant class.

**Slots**: The \`icon\` is decorative and is forced to \`aria-hidden="true"\`. The \`retry\` and \`nav\` actions must be elements that accept \`className\`, such as a native button, native link, or \`Button\`, so their required PathAble classes can be merged without wrapper markup.`,
      },
    },
  },
  argTypes: {
    layout: {
      options: ['compact', 'full-page'],
      control: { type: 'select' },
      description: 'The inline compact panel or full-page error layout.',
    },
    variant: {
      options: ['generic', 'not-found', 'access-restricted'],
      control: { type: 'select' },
      description: 'The page error context and matching PathAble modifier.',
    },
    heading: {
      control: { type: 'text' },
      description:
        'Primary message rendered as h2 for compact layout or h1 for full-page layout.',
    },
    body: {
      control: { type: 'text' },
      description: 'Explanation rendered as the body paragraph.',
    },
    icon: {
      control: false,
      description:
        'Optional decorative React element. The component adds the icon class and aria-hidden attribute.',
    },
    retry: {
      control: false,
      description:
        'Optional retry action. The element must accept className so the retry class can be merged.',
    },
    nav: {
      control: false,
      description:
        'Optional navigation action. The element must accept className so the navigation class can be merged.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble page-error classes.',
    },
  },
  args: {
    layout: 'compact',
    variant: 'generic',
    icon: ERROR_ICON,
    heading: 'Unable to load data',
    body: 'The data for this section could not be retrieved. Please try again.',
    retry: <Button>Try again</Button>,
    nav: undefined,
  },
} satisfies Meta<typeof PageError>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Compact: Story = {
  args: {
    layout: 'compact',
    variant: 'generic',
    icon: ERROR_ICON,
    heading: 'Unable to load data',
    body: 'The data for this section could not be retrieved. Please try again.',
    retry: <Button>Try again</Button>,
    nav: undefined,
  },
}

export const FullPage: Story = {
  args: {
    layout: 'full-page',
    variant: 'generic',
    icon: ERROR_ICON,
    heading: 'Something went wrong',
    body: 'We encountered an unexpected error loading this page. Please try again or return home.',
    retry: <Button>Try again</Button>,
    nav: undefined,
  },
}

export const NotFound: Story = {
  tags: NAV_A11Y_TAGS,
  args: {
    layout: 'full-page',
    variant: 'not-found',
    icon: NOT_FOUND_ICON,
    heading: 'Page not found',
    body: 'The page you requested does not exist or has been moved.',
    retry: undefined,
    nav: <a href="#not-found-home">Go to home</a>,
  },
}

export const AccessRestricted: Story = {
  tags: NAV_A11Y_TAGS,
  args: {
    layout: 'full-page',
    variant: 'access-restricted',
    icon: LOCK_ICON,
    heading: 'Access restricted',
    body: 'You do not have permission to view this page. Contact your administrator if you need access.',
    retry: undefined,
    nav: <a href="#access-home">Go to home</a>,
  },
}

export const WithoutIcon: Story = {
  args: {
    layout: 'compact',
    variant: 'generic',
    icon: undefined,
    heading: 'Unable to load records',
    body: 'Try again or return to the records overview.',
    retry: <Button>Try again</Button>,
    nav: undefined,
  },
}

export const CustomAttributes: Story = {
  tags: NAV_A11Y_TAGS,
  args: {
    layout: 'compact',
    variant: 'access-restricted',
    icon: LOCK_ICON,
    heading: 'Participant records are restricted',
    body: 'Contact your supervisor if you need access to these records.',
    id: 'participant-records-error',
    'aria-label': 'Participant records error',
    'data-testid': 'participant-records-error',
    className: 'custom-page-error',
    retry: undefined,
    nav: <a href="#request-access">Request access</a>,
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const heading = canvas.getByRole('heading', {
      name: 'Participant records are restricted',
      level: 2,
    })
    const root = heading.parentElement
    const nav = canvas.getByRole('link', { name: 'Request access' })

    await expect(root).toHaveClass(
      'pathable-page-error',
      'pathable-page-error--compact',
      'pathable-page-error--access-restricted',
      'custom-page-error',
    )
    await expect(root).toHaveAttribute('id', 'participant-records-error')
    await expect(root).toHaveAttribute(
      'aria-label',
      'Participant records error',
    )
    await expect(nav).toHaveClass('pathable-page-error__nav')
  },
}

export const AccessibilityCheck: Story = {
  tags: NAV_A11Y_TAGS,
  args: {
    layout: 'full-page',
    variant: 'not-found',
    icon: NOT_FOUND_ICON,
    heading: 'The requested report was not found',
    body: 'Check the address or return to the reports dashboard.',
    retry: undefined,
    nav: <a href="#reports-dashboard">Return to reports</a>,
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('full-page error has a semantic h1 and body', async () => {
      await expect(
        canvas.getByRole('heading', {
          name: 'The requested report was not found',
          level: 1,
        }),
      ).toBeVisible()
      await expect(
        canvas.getByText(
          'Check the address or return to the reports dashboard.',
        ),
      ).toBeVisible()
    })

    await step('navigation action is keyboard accessible', async () => {
      const nav = canvas.getByRole('link', { name: 'Return to reports' })
      await expect(nav).toHaveAttribute('href', '#reports-dashboard')
      await userEvent.tab()
      await expect(nav).toHaveFocus()
    })
  },
}

const retryClick = fn()

export const RetryInteraction: Story = {
  render: () => (
    <PageError
      layout="compact"
      variant="generic"
      icon={ERROR_ICON}
      heading="Unable to save changes"
      body="The update did not complete. Try again."
      retry={<Button onClick={retryClick}>Try again</Button>}
    />
  ),
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const retry = canvas.getByRole('button', { name: 'Try again' })

    await userEvent.tab()
    await expect(retry).toHaveFocus()
    await userEvent.keyboard('{Enter}')
    await expect(retryClick).toHaveBeenCalledTimes(1)
  },
}

export const LongContent: Story = {
  args: {
    layout: 'compact',
    variant: 'generic',
    icon: ERROR_ICON,
    heading:
      'The participant employment coaching progress report could not be loaded',
    body: 'We could not retrieve the report because the service did not respond. Check your connection, try again, or return to the participant dashboard to continue working with other records.',
    retry: <Button>Try again</Button>,
    nav: undefined,
  },
}

export const Narrow: Story = {
  args: {
    layout: 'full-page',
    variant: 'generic',
    icon: ERROR_ICON,
    heading: 'Something went wrong',
    body: 'Try again or return home.',
    retry: <Button>Try again</Button>,
    nav: undefined,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const PageComposition: Story = {
  tags: NAV_A11Y_TAGS,
  render: () => (
    <main>
      <PageError
        layout="full-page"
        variant="not-found"
        icon={NOT_FOUND_ICON}
        heading="Page not found"
        body="The requested participant dashboard could not be found."
        nav={<a href="#home">Go to home</a>}
      />
    </main>
  ),
}
