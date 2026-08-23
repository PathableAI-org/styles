import { expect, within } from 'storybook/test'

const renderMediaBlock = ({
  title,
  description,
  testId,
}: {
  title: string
  description: string
  testId: string
}) => `
  <div class="pathable-media-block" data-testid="${testId}">
    <svg class="pathable-media-block__img" role="img" aria-label="Profile placeholder for Jordan Lee" focusable="false" width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="21" r="10" />
      <path d="M12 56c2-13 10-20 20-20s18 7 20 20" />
    </svg>
    <div class="pathable-media-block__body">
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
  </div>
`

export default {
  title: 'Components/Layout/Media Block',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only and noninteractive.\n\n**Semantics verified**: Meaningful media exposes an image role and accessible name. Body content retains native heading and paragraph semantics under content pressure.\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.',
      },
    },
  },
}

export const Default = {
  render: () =>
    renderMediaBlock({
      title: 'Jordan Lee',
      description: 'Employment support coordinator for the central region.',
      testId: 'default-media-block',
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const mediaBlock = canvas.getByTestId('default-media-block')
    const media = canvas.getByRole('img', {
      name: 'Profile placeholder for Jordan Lee',
    })
    const heading = canvas.getByRole('heading', {
      level: 3,
      name: 'Jordan Lee',
    })

    await expect(mediaBlock).toHaveClass('pathable-media-block')
    await expect(media).toHaveClass('pathable-media-block__img')
    await expect(media).toHaveAttribute('focusable', 'false')
    await expect(heading.parentElement).toHaveClass(
      'pathable-media-block__body',
    )
  },
}

export const ContentPressure = {
  render: () => `
    <div data-testid="media-block-constraint" style="max-width: 18rem;">
      ${renderMediaBlock({
        title:
          'Cross-organizational accommodation planning and employment support',
        description:
          'Jordan coordinates detailed workplace accessibility recommendations with participants, employers, support teams, and regional service providers.',
        testId: 'constrained-media-block',
      })}
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const constraint = canvas.getByTestId('media-block-constraint')
    const mediaBlock = canvas.getByTestId('constrained-media-block')
    const media = canvas.getByRole('img', {
      name: 'Profile placeholder for Jordan Lee',
    })
    const heading = canvas.getByRole('heading', {
      level: 3,
      name: 'Cross-organizational accommodation planning and employment support',
    })
    const description = canvas.getByText(
      'Jordan coordinates detailed workplace accessibility recommendations with participants, employers, support teams, and regional service providers.',
    )
    const body = heading.parentElement as HTMLElement
    const mediaBlockStyles = window.getComputedStyle(mediaBlock)

    await expect(mediaBlock).toHaveClass('pathable-media-block')
    await expect(mediaBlockStyles.display).toBe('flex')
    await expect(mediaBlockStyles.alignItems).toBe('flex-start')
    await expect(window.getComputedStyle(media).flexShrink).toBe('0')
    await expect(window.getComputedStyle(body).flexGrow).toBe('1')
    await expect(heading).toBeVisible()
    await expect(description).toBeVisible()
    await expect(description.tagName).toBe('P')
    await expect(constraint.scrollWidth).toBeLessThanOrEqual(
      constraint.clientWidth,
    )
  },
}
