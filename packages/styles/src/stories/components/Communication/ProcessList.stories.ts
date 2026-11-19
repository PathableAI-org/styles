import { expect } from 'storybook/test'

export default {
  title: 'Components/Communication/Process List',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript required.\n\n**CSS markup**: Requires `.pathable-process-list`, `.pathable-process-list__item`, `.pathable-process-list__heading`. Note: `pathable-process-list__body` is NOT implemented — body content is semantic HTML without the absent class.',
      },
    },
  },
}

export const Default = {
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const list = canvasElement.querySelector('.pathable-process-list')
    const item = canvasElement.querySelector('.pathable-process-list__item')

    await expect(list).not.toBeNull()
    await expect(item).not.toBeNull()
    if (!list || !item) return

    const rem = parseFloat(getComputedStyle(document.documentElement).fontSize)
    const marker = getComputedStyle(item, '::before')
    const itemStyle = getComputedStyle(item)

    // Computed `width` is the declared width whatever the box-sizing, so add
    // the border back when the box is content-box to get the rendered width.
    const borders =
      parseFloat(marker.borderLeftWidth) + parseFloat(marker.borderRightWidth)
    const renderedWidth =
      parseFloat(marker.width) +
      (marker.boxSizing === 'border-box' ? 0 : borders)

    // The marker is 2.5rem across including its border.
    await expect(marker.boxSizing).toBe('border-box')
    await expect(renderedWidth).toBeCloseTo(2.5 * rem, 1)

    // The marker is absolutely positioned against the list, so its centre is
    // measured from the list's edge; the connector line is the item's left
    // border, measured from the item's edge. Both centres must coincide.
    const markerCentre =
      list.getBoundingClientRect().left +
      parseFloat(marker.left) +
      renderedWidth / 2
    const lineCentre =
      item.getBoundingClientRect().left +
      parseFloat(itemStyle.borderLeftWidth) / 2
    await expect(lineCentre).toBeCloseTo(markerCentre, 1)
  },
  render: () => `
    <ol class="pathable-process-list">
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Research</h4>
        <p>Conduct initial research to understand user needs and project requirements.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Design</h4>
        <p>Create wireframes and prototypes based on research findings.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Develop</h4>
        <p>Build the solution following design specifications and accessibility guidelines.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Test</h4>
        <p>Validate the implementation through user testing and quality assurance.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Launch</h4>
        <p>Deploy the solution and monitor for any issues.</p>
      </li>
    </ol>
  `,
}

const processList = `
    <ol class="pathable-process-list" data-testid="process-list">
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Research</h4>
        <p>Conduct initial research.</p>
      </li>
      <li class="pathable-process-list__item">
        <h4 class="pathable-process-list__heading">Design</h4>
        <p>Create wireframes and prototypes.</p>
      </li>
    </ol>
  `

export const InsideProse = {
  render: () => `
    <p style="margin: 0 0 0.5rem; font-weight: 700;">Inside pathable-prose</p>
    <div class="pathable-prose" data-testid="in-prose">${processList}</div>
    <p style="margin: 2rem 0 0.5rem; font-weight: 700;">Outside pathable-prose</p>
    <div data-testid="outside-prose">${processList}</div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const view = canvasElement.ownerDocument.defaultView as Window
    const measure = (scope: string) => {
      const root = canvasElement.querySelector(`[data-testid="${scope}"]`)
      const list = root?.querySelector('.pathable-process-list') as HTMLElement
      const item = root?.querySelector(
        '.pathable-process-list__item',
      ) as HTMLElement
      return {
        listPaddingLeft: view.getComputedStyle(list).paddingLeft,
        itemPaddingLeft: view.getComputedStyle(item).paddingLeft,
        itemMarginBottom: view.getComputedStyle(item).marginBottom,
      }
    }
    await expect(measure('in-prose')).toEqual(measure('outside-prose'))
  },
}
