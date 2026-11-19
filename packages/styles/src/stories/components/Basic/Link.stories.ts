import { expect, userEvent, within } from 'storybook/test'

export default {
  title: 'Components/Link',
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

export const Default = {
  render: () => '<a href="#" class="pathable-link">Default Link</a>',
}

export const External = {
  render: () =>
    '<a href="#" class="pathable-link pathable-link--external">External Link</a>',
}

export const NavLink = {
  render: () =>
    '<a href="#" class="pathable-link pathable-link--nav">Nav Link</a>',
}

// A theme override of link or focusRing, as ThemeProvider sets it on an
// ancestor, reaches the link's colour and its focus outline.
export const ThemeOverride = {
  render: () =>
    '<div style="--pathable-color-link: rgb(122, 31, 92); --pathable-color-focus-ring: rgb(200, 0, 0)"><a href="#" class="pathable-link">Themed Link</a></div>',
  play: async ({
    canvasElement,
  }: {
    canvasElement: HTMLElement
  }): Promise<void> => {
    const link = within(canvasElement).getByRole('link', {
      name: 'Themed Link',
    })
    await expect(getComputedStyle(link).color).toBe('rgb(122, 31, 92)')
    await userEvent.tab()
    await expect(link).toHaveFocus()
    await expect(getComputedStyle(link).outlineColor).toBe('rgb(200, 0, 0)')
  },
}
