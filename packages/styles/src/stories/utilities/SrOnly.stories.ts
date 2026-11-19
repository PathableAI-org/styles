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

const markup = (islandDirection?: 'ltr' | 'rtl') => `
  <p${islandDirection ? ` dir="${islandDirection}"` : ''}>
    Edit
    <span class="pathable-sr-only"> Jordan Lee's profile</span>
  </p>
`

const root = document.documentElement

// Sets the page's writing direction for one check and puts it back, so the
// stories after it run in the direction the Storybook preview set.
const inPageDirection = async (
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

// The text is hidden (off screen to the side) and the page cannot scroll
// horizontally in either direction. Reading scrollWidth is not enough: in a
// right-to-left page the area to the left of the viewport is scrollable but
// is not counted in scrollWidth, so try to scroll both ways instead.
const expectHiddenWithoutScroll = async (canvasElement: HTMLElement) => {
  const hidden = canvasElement.querySelector('.pathable-sr-only')
  await expect(hidden).not.toBeNull()
  await expect(getComputedStyle(hidden as Element).position).toBe('absolute')
  const box = (hidden as Element).getBoundingClientRect()
  await expect(box.right <= 0 || box.left >= root.clientWidth).toBe(true)
  for (const target of [-100000, 100000]) {
    root.scrollLeft = target
    await expect(root.scrollLeft).toBe(0)
  }
}

type Play = { canvasElement: HTMLElement }

export const NoScrollLeftToRight = {
  render: () => markup(),
  play: async ({ canvasElement }: Play) =>
    inPageDirection('ltr', () => expectHiddenWithoutScroll(canvasElement)),
}

export const NoScrollRightToLeft = {
  render: () => markup(),
  play: async ({ canvasElement }: Play) =>
    inPageDirection('rtl', () => expectHiddenWithoutScroll(canvasElement)),
}

export const NoScrollRightToLeftInLeftToRight = {
  render: () => markup('rtl'),
  play: async ({ canvasElement }: Play) =>
    inPageDirection('ltr', () => expectHiddenWithoutScroll(canvasElement)),
}

export const NoScrollLeftToRightInRightToLeft = {
  render: () => markup('ltr'),
  play: async ({ canvasElement }: Play) =>
    inPageDirection('rtl', () => expectHiddenWithoutScroll(canvasElement)),
}

export const Default = NoScrollLeftToRight
