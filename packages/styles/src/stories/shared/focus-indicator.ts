import { expect, userEvent } from 'storybook/test'

/**
 * Resolves a CSS colour value (a custom property reference or a system colour)
 * to the computed `rgb()` string the browser uses, so focus assertions compare
 * against the token rather than a hard-coded value.
 */
export const resolveColor = (canvasElement: HTMLElement, value: string) => {
  const probe = canvasElement.ownerDocument.createElement('span')
  probe.hidden = true
  probe.style.color = value
  canvasElement.append(probe)
  const resolved = getComputedStyle(probe).color
  probe.remove()
  return resolved
}

type FocusIndicatorOptions = {
  /** Exact outline width in px. Without it, the outline must be at least 2px. */
  width?: number
  /** Outline colour outside forced colors. Defaults to the focus-ring token. */
  color?: string
  /**
   * Press Tab from the element that has focus now, instead of from the
   * document start, to check controls one after another in tab order.
   */
  fromCurrentFocus?: boolean
}

/**
 * Moves keyboard focus to `element` with Tab and asserts it shows a solid
 * outline: by default at least 2px wide, in `--pathable-color-focus-ring`
 * normally, and in the system `Highlight` colour when forced colors are active.
 * Tab starts from the document start unless `fromCurrentFocus` is set.
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
  element: HTMLElement,
  {
    width,
    color = 'var(--pathable-color-focus-ring)',
    fromCurrentFocus = false,
  }: FocusIndicatorOptions = {},
) => {
  const forcedColors = matchMedia('(forced-colors: active)').matches

  if (!fromCurrentFocus) {
    const active = element.ownerDocument.activeElement
    if (active instanceof HTMLElement) active.blur()
  }
  await userEvent.tab()
  await expect(element).toHaveFocus()

  const style = getComputedStyle(element)
  const outlineWidth = Number.parseFloat(style.outlineWidth)
  await expect(style.outlineStyle).toBe('solid')
  if (width === undefined) {
    await expect(outlineWidth).toBeGreaterThanOrEqual(2)
  } else {
    await expect(outlineWidth).toBe(width)
  }
  await expect(style.outlineColor).toBe(
    resolveColor(canvasElement, forcedColors ? 'Highlight' : color),
  )
}
