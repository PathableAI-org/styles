import { expect } from 'storybook/test'

export default {
  title: 'Components/Communication/Collection',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.\n\n**CSS markup**: Requires `.pathable-collection` and `.pathable-collection__item`.',
      },
    },
  },
}

const collection = `
    <ul class="pathable-collection" data-testid="collection">
      <li class="pathable-collection__item">
        <div class="pathable-collection__body">
          <h4 class="pathable-collection__heading">First item</h4>
        </div>
      </li>
      <li class="pathable-collection__item">
        <div class="pathable-collection__body">
          <h4 class="pathable-collection__heading">Second item</h4>
        </div>
      </li>
    </ul>
  `

export const InsideProse = {
  render: () => `
    <p style="margin: 0 0 0.5rem; font-weight: 700;">Inside pathable-prose</p>
    <div class="pathable-prose" data-testid="in-prose">${collection}</div>
    <p style="margin: 2rem 0 0.5rem; font-weight: 700;">Outside pathable-prose</p>
    <div data-testid="outside-prose">${collection}</div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const view = canvasElement.ownerDocument.defaultView as Window
    const measure = (scope: string) => {
      const root = canvasElement.querySelector(`[data-testid="${scope}"]`)
      const list = root?.querySelector('.pathable-collection') as HTMLElement
      const items = root?.querySelectorAll(
        '.pathable-collection__item',
      ) as NodeListOf<HTMLElement>
      const [first, last] = [items[0], items[items.length - 1]]
      return {
        listPaddingLeft: view.getComputedStyle(list).paddingLeft,
        firstMarginTop: view.getComputedStyle(first).marginTop,
        firstMarginBottom: view.getComputedStyle(first).marginBottom,
        lastMarginTop: view.getComputedStyle(last).marginTop,
        lastMarginBottom: view.getComputedStyle(last).marginBottom,
      }
    }
    await expect(measure('in-prose')).toEqual(measure('outside-prose'))
  },
}
