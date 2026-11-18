import { expect, userEvent } from 'storybook/test'

/**
 * Resolves a CSS colour value (a custom property reference or a system colour)
 * to the computed `rgb()` string the browser uses, so focus assertions compare
 * against the token rather than a hard-coded value.
 */
const resolveColor = (canvasElement: HTMLElement, value: string) => {
  const probe = canvasElement.ownerDocument.createElement('span')
  probe.style.color = value
  canvasElement.append(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  return resolved
}

/**
 * Moves keyboard focus from the document start to `field` with Tab and asserts
 * it shows the brand focus outline: `--pathable-color-focus-ring` normally, and
 * the system `Highlight` colour when forced colors are active.
 */
export const expectKeyboardFocusIndicator = async (
  canvasElement: HTMLElement,
  field: HTMLElement,
  { forcedColors = false }: { forcedColors?: boolean } = {},
) => {
  await expect(matchMedia('(forced-colors: active)').matches).toBe(forcedColors)

  const active = field.ownerDocument.activeElement
  if (active instanceof HTMLElement) active.blur()
  await userEvent.tab()
  await expect(field).toHaveFocus()

  const style = getComputedStyle(field)
  await expect(style.outlineStyle).toBe('solid')
  await expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThanOrEqual(2)
  await expect(style.outlineColor).toBe(
    resolveColor(
      canvasElement,
      forcedColors ? 'Highlight' : 'var(--pathable-color-focus-ring)',
    ),
  )
}
