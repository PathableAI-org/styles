import { expect } from 'storybook/test'
import { guarantee } from '../shared/guarantee'

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

type Play = {
  canvasElement: HTMLElement
  step: Parameters<typeof guarantee>[0]
}

// Reading scrollWidth is not enough: in a right-to-left page the area to the
// left of the viewport is scrollable but is not counted in scrollWidth, so
// try to scroll both ways instead.
const cannotScroll = async (scroller: HTMLElement) => {
  for (const target of [-100000, 100000]) {
    scroller.scrollLeft = target
    await expect(scroller.scrollLeft).toBe(0)
  }
}

const expectHiddenWithoutScroll = async ({ canvasElement, step }: Play) => {
  const hidden = canvasElement.querySelector('.pathable-sr-only')
  await expect(hidden).not.toBeNull()
  await guarantee(step, 'sr-only/visually-hidden', async () => {
    const box = (hidden as Element).getBoundingClientRect()
    await expect(box.width).toBeLessThanOrEqual(1)
    await expect(box.height).toBeLessThanOrEqual(1)
    await expect(getComputedStyle(hidden as Element).clipPath).not.toBe('none')
  })
  await guarantee(step, 'sr-only/no-scroll', async () => {
    await cannotScroll(root)
    for (const scroller of canvasElement.querySelectorAll<HTMLElement>(
      '[data-scroller]',
    )) {
      await cannotScroll(scroller)
      await expect(scroller.scrollHeight).toBeLessThanOrEqual(
        scroller.clientHeight,
      )
    }
  })
}

export const NoScrollLeftToRight = {
  render: () => markup(),
  play: async (context: Play) =>
    inPageDirection('ltr', () => expectHiddenWithoutScroll(context)),
}

export const NoScrollRightToLeft = {
  render: () => markup(),
  play: async (context: Play) =>
    inPageDirection('rtl', () => expectHiddenWithoutScroll(context)),
}

export const NoScrollRightToLeftInLeftToRight = {
  render: () => markup('rtl'),
  play: async (context: Play) =>
    inPageDirection('ltr', () => expectHiddenWithoutScroll(context)),
}

export const NoScrollLeftToRightInRightToLeft = {
  render: () => markup('ltr'),
  play: async (context: Play) =>
    inPageDirection('rtl', () => expectHiddenWithoutScroll(context)),
}

export const NoScrollLeftToRightScrollerInRightToLeft = {
  render: () => `
    <div dir="ltr" data-scroller style="position: relative; overflow: auto; width: 300px; height: 4rem;">
      Code sample <span class="pathable-sr-only">hidden</span>
    </div>
  `,
  play: async (context: Play) =>
    inPageDirection('rtl', () => expectHiddenWithoutScroll(context)),
}

export const NoScrollReversedColumn = {
  render: () => `
    <div data-scroller style="display: flex; flex-direction: column-reverse; overflow: auto; height: 6rem;">
      <div style="position: relative;">
        Message <span class="pathable-sr-only">sent by Jordan</span>
      </div>
    </div>
  `,
  play: async (context: Play) =>
    inPageDirection('ltr', () => expectHiddenWithoutScroll(context)),
}

export const Default = NoScrollLeftToRight
