import assert from 'node:assert/strict'
import { Given, Then, When } from '@cucumber/cucumber'

/** Bounded polling helper for an asynchronous observable state. */
async function pollUntil(
  read,
  expected,
  failureMessage,
  { timeoutMs = 5_000, intervalMs = 100 } = {},
) {
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    if ((await read()) === expected) return
    await new Promise((resolveWaiting) =>
      setTimeout(resolveWaiting, intervalMs),
    )
  }

  assert.fail(failureMessage)
}

Given('an Accordion with all disclosures collapsed', async function () {
  await this.openFixture('accordion.default')
})

Given('an Accordion with the first disclosure expanded', async function () {
  await this.openFixture('accordion.first-expanded')
})

When('the user focuses the {word} disclosure', async function (position) {
  this.activeDisclosure = position
  await this.disclosure(position).focus()
})

When('the user presses Enter', async function () {
  await this.disclosure(this.activeDisclosure).press('Enter')
})

When('the user presses Space', async function () {
  await this.disclosure(this.activeDisclosure).press('Space')
})

Then(
  'the {word} disclosure is {word}',
  async function (position, expectedState) {
    const expectedExpanded = expectedState === 'expanded'

    assert.ok(
      expectedExpanded || expectedState === 'collapsed',
      `Unsupported disclosure state "${expectedState}"`,
    )

    const disclosure = this.disclosure(position)
    const message = `Target "${this.target.name}" ${position} disclosure should be ${expectedState}`

    await pollUntil(
      async () => {
        const value = await disclosure.getAttribute('aria-expanded')
        return value ?? null
      },
      String(expectedExpanded),
      message,
    )
  },
)

Then(
  'the {word} disclosure panel is {word}',
  async function (position, expectedAvailability) {
    const panel = await this.panelFor(position)

    if (expectedAvailability === 'available') {
      await pollUntil(
        async () => await panel.getAttribute('hidden'),
        null,
        `Target "${this.target.name}" ${position} panel should not have hidden`,
      )
      assert.equal(
        await panel.isVisible(),
        true,
        `Target "${this.target.name}" ${position} panel should be visible`,
      )
      return
    }

    assert.equal(
      expectedAvailability,
      'unavailable',
      `Unsupported panel availability "${expectedAvailability}"`,
    )
    await pollUntil(
      async () => await panel.getAttribute('hidden'),
      '',
      `Target "${this.target.name}" ${position} panel should have hidden`,
    )
    assert.equal(
      await panel.isHidden(),
      true,
      `Target "${this.target.name}" ${position} panel should not be visible`,
    )
  },
)

Then('focus remains on the {word} disclosure', async function (position) {
  const disclosure = this.disclosure(position)

  await pollUntil(
    async () =>
      await disclosure.evaluate(
        (element) => element === document.activeElement,
      ),
    true,
    `Target "${this.target.name}" focus should remain on the ${position} disclosure`,
  )
})
