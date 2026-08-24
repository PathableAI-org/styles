import type { StoryHarness } from '../types.js'

/**
 * Shared capability: a labeled control references its visible hint and error.
 */
export async function verifyHintErrorAssociation(
  harness: StoryHarness,
  labelText: string | RegExp,
  hintText: string | RegExp,
  errorText: string | RegExp,
) {
  const canvas = harness.within(harness.root)
  const control = canvas.getByLabelText(labelText)
  const hint = canvas.getByText(hintText)
  const error = canvas.getByText(errorText)
  const describedBy = new Set(
    (control.getAttribute('aria-describedby') ?? '')
      .split(/\s+/)
      .filter(Boolean),
  )

  for (const [description, element] of [
    ['hint', hint],
    ['error', error],
  ] as const) {
    if (!element.id) {
      throw new Error(
        `Expected ${description} "${element.textContent?.trim() ?? ''}" to have an id.`,
      )
    }

    if (!describedBy.has(element.id)) {
      throw new Error(
        `Expected control "${String(labelText)}" to reference ${description} id "${element.id}" via aria-describedby.`,
      )
    }
  }
}
