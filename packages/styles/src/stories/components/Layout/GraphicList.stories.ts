import { expect, within } from 'storybook/test'

const renderBlock = (title: string, description: string) => `
  <div class="pathable-media-block" data-testid="graphic-list-block">
    <svg class="pathable-media-block__img" aria-hidden="true" focusable="false" width="64" height="64" viewBox="0 0 64 64" fill="none" stroke="currentColor" stroke-width="2" xmlns="http://www.w3.org/2000/svg">
      <circle cx="32" cy="32" r="24" />
    </svg>
    <div class="pathable-media-block__body">
      <h3>${title}</h3>
      <p>${description}</p>
    </div>
  </div>
`

export default {
  title: 'Components/Layout/Graphic List',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only and noninteractive.\n\n**Semantics verified**: Heading and paragraph semantics are native. The spacing between `pathable-media-block` children is applied without any `usa-*` class.\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <section class="pathable-graphic-list">
      <h2 class="pathable-graphic-list__heading">What we offer</h2>
      ${renderBlock('One-to-one coaching', 'Sessions with a coordinator who knows your workplace.')}
      ${renderBlock('Workplace adjustments', 'Help agreeing changes with your employer.')}
    </section>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const blocks = canvas.getAllByTestId('graphic-list-block')
    const rootFontSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    )
    const spaced = parseFloat(window.getComputedStyle(blocks[0]).marginBottom)

    // 2rem below the 40em tablet breakpoint, 4rem from it.
    const fromTablet = window.matchMedia('(min-width: 40em)').matches
    await expect(spaced).toBe((fromTablet ? 4 : 2) * rootFontSize)
    await expect(window.getComputedStyle(blocks[1]).marginBottom).toBe('0px')

    const image = blocks[0].querySelector('.pathable-media-block__img')
    await expect(window.getComputedStyle(image as Element).marginRight).toBe(
      `${1.5 * rootFontSize}px`,
    )

    const firstChild = blocks[0].querySelector(
      '.pathable-media-block__body > :first-child',
    )
    await expect(window.getComputedStyle(firstChild as Element).marginTop).toBe(
      '0px',
    )
  },
}

export const BlocksInGrid = {
  render: () => `
    <section class="pathable-graphic-list">
      <h2 class="pathable-graphic-list__heading">What we offer</h2>
      <div class="pathable-grid pathable-grid--cols-2">
        ${renderBlock('One-to-one coaching', 'Sessions with a coordinator who knows your workplace.')}
        ${renderBlock('Workplace adjustments', 'Help agreeing changes with your employer.')}
        ${renderBlock('Job search support', 'Practical help with applications and interviews.')}
        ${renderBlock('Ongoing check-ins', 'Regular contact once you start work.')}
      </div>
    </section>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const blocks = canvas.getAllByTestId('graphic-list-block')
    const rootFontSize = parseFloat(
      window.getComputedStyle(document.documentElement).fontSize,
    )

    // Blocks in a grid are spaced by the grid gap alone.
    for (const block of blocks) {
      await expect(window.getComputedStyle(block).marginBottom).toBe('0px')
    }
    const image = blocks[0].querySelector('.pathable-media-block__img')
    await expect(window.getComputedStyle(image as Element).marginRight).toBe(
      `${1.5 * rootFontSize}px`,
    )
  },
}
