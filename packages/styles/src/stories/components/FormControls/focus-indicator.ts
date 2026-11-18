import { expect, userEvent } from 'storybook/test'

/**
 * Resolves a CSS colour value (a custom property reference or a system colour)
 * to the computed `rgb()` string the browser uses, so focus assertions compare
 * against the token rather than a hard-coded value.
 */
const resolveColor = (canvasElement: HTMLElement, value: string) => {
  const probe = canvasElement.ownerDocument.createElement('span')
  probe.hidden = true
  probe.style.color = value
  canvasElement.append(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  return resolved
}

/**
 * Moves keyboard focus from the document start to `field` with Tab and asserts
 * it shows a solid outline at least 2px wide: in `--pathable-color-focus-ring`
 * normally, and in the system `Highlight` colour when forced colors are active.
 *
 * The expected colour follows the current forced-colors state, so the story
 * passes in any browser. The Storybook test-runner turns forced colors on for
 * stories named `--forced-colors` (`apps/storybook/.storybook/test-runner.js`).
 * Under forced colors Chromium replaces a non-system outline colour with
 * `Highlight` itself, so that run proves the outline stays visible, not which
 * rule picked its colour.
 */
export const expectKeyboardFocusIndicator = async (
  canvasElement: HTMLElement,
  field: HTMLElement,
) => {
  const forcedColors = matchMedia('(forced-colors: active)').matches

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
