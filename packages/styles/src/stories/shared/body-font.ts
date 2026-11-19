import { expect } from 'storybook/test'

/**
 * Asserts that every element matching each selector inside `canvasElement`
 * renders in the brand body typeface, `--pathable-font-body`. The expected
 * value is resolved by the browser from the token, so the assertion follows
 * the token rather than a hard-coded font stack.
 *
 * Neither `@pathableai/styles` nor the Storybook preview sets a font on
 * `body`, so text a component leaves to inherit computes to the browser's
 * default font, and a `<button>` that sets no font computes to the user
 * agent's button font. Each selector must match at least one element, so a
 * renamed class fails the story instead of passing it vacuously.
 */
export const expectBodyFont = async (
  canvasElement: HTMLElement,
  selectors: string[],
) => {
  const probe = canvasElement.ownerDocument.createElement('span')
  probe.hidden = true
  probe.style.fontFamily = 'var(--pathable-font-body)'
  canvasElement.append(probe)
  const bodyFont = getComputedStyle(probe).fontFamily
  probe.remove()

  await expect(bodyFont).toMatch(/^Nunito\b/)

  for (const selector of selectors) {
    const elements = [...canvasElement.querySelectorAll<HTMLElement>(selector)]
    await expect(elements.length, selector).toBeGreaterThan(0)
    for (const element of elements) {
      await expect(getComputedStyle(element).fontFamily, selector).toBe(
        bodyFont,
      )
    }
  }
}
