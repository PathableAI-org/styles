import assert from 'node:assert/strict'
import { Given, Then, When } from '@cucumber/cucumber'

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
  await this.page.keyboard.press('Enter')
})

When('the user presses Space', async function () {
  await this.page.keyboard.press('Space')
})

Then(
  'the {word} disclosure is {word}',
  async function (position, expectedState) {
    const expectedExpanded = expectedState === 'expanded'

    assert.ok(
      expectedExpanded || expectedState === 'collapsed',
      `Unsupported disclosure state "${expectedState}"`,
    )

    assert.equal(
      await this.disclosure(position).getAttribute('aria-expanded'),
      String(expectedExpanded),
      `Target "${this.target.name}" ${position} disclosure should be ${expectedState}`,
    )
  },
)

Then(
  'the {word} disclosure panel is {word}',
  async function (position, expectedAvailability) {
    const panel = await this.panelFor(position)
    const hidden = await panel.getAttribute('hidden')

    if (expectedAvailability === 'available') {
      assert.equal(
        hidden,
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
    assert.notEqual(
      hidden,
      null,
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
  assert.equal(
    await this.disclosure(position).evaluate(
      (element) => element === document.activeElement,
    ),
    true,
    `Target "${this.target.name}" focus should remain on the ${position} disclosure`,
  )
})
