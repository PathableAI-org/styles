import { expect } from 'storybook/test'

export default {
  title: 'Utilities/Screen Reader Only',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.',
      },
    },
  },
}

const markup = `
  <p>
    Edit
    <span class="pathable-sr-only" data-testid="sr-only-text"> Jordan Lee's profile</span>
  </p>
`

const root = document.documentElement

// Sets the page's writing direction for one check and puts it back, so the
// stories after it run in the direction the Storybook preview set.
const inDirection = async (
  direction: 'ltr' | 'rtl',
  check: () => Promise<void>,
) => {
  const previous = root.getAttribute('dir')
  root.setAttribute('dir', direction)
  try {
    await check()
  } finally {
    if (previous === null) root.removeAttribute('dir')
    else root.setAttribute('dir', previous)
  }
}

const expectNoHorizontalScroll = async () => {
  await expect(root.scrollWidth).toBeLessThanOrEqual(root.clientWidth)
}

export const NoScrollLeftToRight = {
  render: () => markup,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const hidden = canvasElement.querySelector('.pathable-sr-only')
    await expect(hidden).not.toBeNull()
    await inDirection('ltr', expectNoHorizontalScroll)
  },
}

export const NoScrollRightToLeft = {
  render: () => markup,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const hidden = canvasElement.querySelector('.pathable-sr-only')
    await expect(hidden).not.toBeNull()
    await inDirection('rtl', expectNoHorizontalScroll)
  },
}

export const Default = NoScrollLeftToRight
