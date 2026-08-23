import { expect, within } from 'storybook/test'

export default {
  title: 'Components/Tag',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only and noninteractive.\n\n**Semantics verified**: Tag text remains visible in a native inline text container under content pressure.\n\n**Consumers must**: Import `@pathableai/styles` CSS. No JavaScript or ARIA role is required.',
      },
    },
  },
}

export const Default = {
  render: () => '<span class="pathable-tag">Default Tag</span>',
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const tag = within(canvasElement).getByText('Default Tag')

    await expect(tag.tagName).toBe('SPAN')
    await expect(tag).toHaveClass('pathable-tag')
    await expect(tag).not.toHaveAttribute('role')
  },
}

export const Big = {
  render: () => '<span class="pathable-tag pathable-tag--big">Big Tag</span>',
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const tag = within(canvasElement).getByText('Big Tag')

    await expect(tag.tagName).toBe('SPAN')
    await expect(tag).toHaveClass('pathable-tag', 'pathable-tag--big')
    await expect(tag).not.toHaveAttribute('role')
  },
}

export const ContentPressure = {
  render: () => `
    <div data-testid="tag-content-pressure" style="width: 12rem; max-width: 100%;">
      <span class="pathable-tag">Eligibility verification pending for regional employment support services</span>
    </div>
  `,
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    const canvas = within(canvasElement)
    const container = canvas.getByTestId('tag-content-pressure')
    const tag = canvas.getByText(
      'Eligibility verification pending for regional employment support services',
    )

    await expect(tag.tagName).toBe('SPAN')
    await expect(tag).toHaveClass('pathable-tag')
    await expect(tag).toBeVisible()
    await expect(tag).not.toHaveAttribute('role')
    await expect(container.scrollWidth).toBeLessThanOrEqual(
      container.clientWidth,
    )
  },
}
