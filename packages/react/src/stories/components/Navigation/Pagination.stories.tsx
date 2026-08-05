import { Pagination } from '../../../components/Pagination/Pagination'
import type {
  PaginationItem,
  PaginationLink,
} from '../../../components/Pagination/Pagination'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

const consecutiveItems = [
  { key: 'page-1', type: 'page', page: 1, href: '#page-1' },
  { key: 'page-2', type: 'page', page: 2, href: '#page-2' },
  { key: 'page-3', type: 'page', page: 3, href: '#page-3' },
  { key: 'page-4', type: 'page', page: 4, href: '#page-4' },
  { key: 'page-5', type: 'page', page: 5, href: '#page-5' },
] satisfies readonly PaginationItem[]

const overflowItems = [
  { key: 'page-1', type: 'page', page: 1, href: '#page-1' },
  { key: 'page-2', type: 'page', page: 2, href: '#page-2' },
  { key: 'page-3', type: 'page', page: 3, href: '#page-3' },
  { key: 'page-4', type: 'page', page: 4, href: '#page-4' },
  { key: 'overflow', type: 'overflow' },
  { key: 'page-10', type: 'page', page: 10, href: '#page-10' },
] satisfies readonly PaginationItem[]

const previous = { href: '#previous' } satisfies PaginationLink
const next = { href: '#next' } satisfies PaginationLink

const meta = {
  title: 'Components/Navigation/Pagination',
  component: Pagination,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A navigation landmark for moving between pages in a result set. Pagination renders native links with the PathAble pagination classes while the consumer owns the current page and supplies the exact page window.

**When to use**: For a long result set split across multiple pages where users need direct page, previous, and next navigation.

**When not to use**: Do not use Pagination for step-by-step workflows, in-page tabs, infinite scrolling, or when all results fit comfortably on one page.

**Underlying elements**: A semantic \`<nav>\` containing a \`<ul>\`, \`<li>\` items, and native \`<a>\` links. Overflow records render as non-interactive presentation.

**Known constraints**: Pagination does not calculate page windows, mutate \`currentPage\`, intercept navigation, or integrate with a router. When \`currentPage\` does not match a supplied page record, no link receives false current-page semantics.`,
      },
    },
  },
  argTypes: {
    items: {
      control: 'none',
      description:
        'Discriminated page and overflow records in the exact order they should render. The consumer calculates the visible page window.',
    },
    currentPage: {
      control: { type: 'number', min: 1 },
      description:
        'Consumer-owned current page. Exactly one matching page link receives current-page semantics.',
    },
    previous: {
      control: 'none',
      description:
        'Optional native previous-page link record. Omit it on the first page.',
    },
    next: {
      control: 'none',
      description:
        'Optional native next-page link record. Omit it on the last page.',
    },
    className: {
      control: { type: 'text' },
      description:
        'Additional CSS class names appended after the PathAble pagination class.',
    },
    'aria-label': {
      control: { type: 'text' },
      description: 'Accessible name for the pagination navigation landmark.',
    },
  },
  args: {
    'aria-label': 'Pagination',
    items: overflowItems,
    currentPage: 3,
    previous,
    next,
  },
} satisfies Meta<typeof Pagination>

export default meta
type Story = StoryObj<typeof meta>

export const Playground: Story = {}

export const Default: Story = {
  args: { items: consecutiveItems, currentPage: 3, previous, next },
}

export const FirstPage: Story = {
  args: { items: consecutiveItems, currentPage: 1, previous: undefined, next },
}

export const LastPage: Story = {
  args: { items: consecutiveItems, currentPage: 5, previous, next: undefined },
}

export const Overflow: Story = {
  args: { items: overflowItems, currentPage: 3, previous, next },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('overflow is descriptive and not interactive', async () => {
      const ellipsis = canvas.getByText('…')
      await expect(ellipsis).toHaveAttribute('aria-hidden', 'true')
      await expect(canvas.getByText('Additional pages')).toBeInTheDocument()
      await expect(
        canvas.queryByRole('link', { name: 'Additional pages' }),
      ).not.toBeInTheDocument()
      await expect(
        ellipsis.parentElement?.querySelector('a, button'),
      ).not.toBeInTheDocument()
    })
  },
}

export const CustomClassAndAttributes: Story = {
  args: {
    className: 'participant-pagination',
    'data-pagination-id': 'participant-results',
    items: [
      {
        key: 'page-1',
        type: 'page',
        page: 1,
        href: '#custom-page-1',
        attributes: {
          className: 'participant-page-link',
          rel: 'next',
          'data-page-id': 'one',
        },
      },
      { key: 'page-2', type: 'page', page: 2, href: '#custom-page-2' },
    ],
    currentPage: 1,
    previous: undefined,
    next: { href: '#custom-next', attributes: { 'data-direction': 'next' } },
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    const navigation = canvas.getByRole('navigation', { name: 'Pagination' })
    const pageOne = canvas.getByRole('link', { name: 'Page 1' })
    const nextLink = canvasElement.querySelector<HTMLAnchorElement>(
      'a[data-direction="next"]',
    )

    await expect(navigation).toHaveClass(
      'pathable-pagination',
      'participant-pagination',
    )
    await expect(navigation).toHaveAttribute(
      'data-pagination-id',
      'participant-results',
    )
    await expect(pageOne).toHaveClass(
      'pathable-pagination__link',
      'participant-page-link',
    )
    await expect(pageOne).toHaveAttribute('data-page-id', 'one')
    await expect(nextLink).toHaveAttribute('data-direction', 'next')
  },
}

export const LongLabels: Story = {
  args: {
    items: consecutiveItems,
    currentPage: 3,
    previous: {
      href: '#previous-results',
      label: 'Previous page of participant employment coaching results',
    },
    next: {
      href: '#next-results',
      label: 'Next page of participant employment coaching results',
    },
  },
}

export const Narrow: Story = {
  args: { items: overflowItems, currentPage: 3, previous, next },
  parameters: { viewport: { defaultViewport: 'mobile1' } },
}

export const KeyboardAndLinkSemantics: Story = {
  args: {
    items: consecutiveItems,
    currentPage: 3,
    previous: { href: '#keyboard-previous', attributes: { onClick: fn() } },
    next: { href: '#keyboard-next' },
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step(
      'current page and controls expose native link semantics',
      async () => {
        const current = canvas.getByRole('link', {
          name: 'Page 3',
          current: 'page',
        })
        const previousLink = canvasElement.querySelector<HTMLAnchorElement>(
          'a[href="#keyboard-previous"]',
        )
        const nextLink = canvasElement.querySelector<HTMLAnchorElement>(
          'a[href="#keyboard-next"]',
        )
        await expect(current).toHaveClass(
          'pathable-pagination__link',
          'usa-current',
        )
        await expect(previousLink).toHaveAttribute('href', '#keyboard-previous')
        await expect(nextLink).toHaveAttribute('href', '#keyboard-next')
      },
    )

    await step(
      'keyboard focus and Enter use the native previous link',
      async () => {
        const previousLink = canvas.queryByRole('link', {
          name: 'Previous page',
        })
        if (previousLink === null) {
          return
        }
        await userEvent.tab()
        await expect(previousLink).toHaveFocus()
        await userEvent.keyboard('{Enter}')
        await expect(args.previous?.attributes?.onClick).toHaveBeenCalledTimes(
          1,
        )
      },
    )
  },
}

export const AbsentCurrentPage: Story = {
  args: { items: overflowItems, currentPage: 99, previous, next },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)
    await expect(
      canvas.queryByRole('link', { current: 'page' }),
    ).not.toBeInTheDocument()
  },
}

export const ResultsListComposition: Story = {
  render: () => (
    <section aria-labelledby="participant-results-heading">
      <h2 id="participant-results-heading">Participant results</h2>
      <p>Showing participants 21 through 30 of 96.</p>
      <ul>
        <li>Jordan Lee — Employment coaching</li>
        <li>Sam Rivera — Workplace readiness</li>
        <li>Taylor Morgan — Benefits counseling</li>
      </ul>
      <Pagination
        aria-label="Participant result pages"
        items={overflowItems}
        currentPage={3}
        previous={{ href: '#results-page-2' }}
        next={{ href: '#results-page-4' }}
      />
    </section>
  ),
}
