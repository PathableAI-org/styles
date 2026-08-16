import { World, setWorldConstructor } from '@cucumber/cucumber'
import { getTarget } from '../targets.mjs'

const DISCLOSURE_NAMES = {
  first: 'First Amendment',
  second: 'Second Amendment',
}

function escapeAttributeValue(value) {
  return value.replaceAll('\\', '\\\\').replaceAll('"', '\\"')
}

class ContractWorld extends World {
  constructor(options) {
    super(options)
    this.target = getTarget(process.env.CONTRACT_TARGET)
    this.storybookUrl = process.env.CONTRACT_STORYBOOK_URL
    this.browser = undefined
    this.context = undefined
    this.page = undefined
    this.activeDisclosure = undefined
  }

  async startScenario(browser) {
    if (!this.storybookUrl) {
      throw new Error(
        `Target "${this.target.name}" has no CONTRACT_STORYBOOK_URL`,
      )
    }

    this.browser = browser
    this.context = await browser.newContext()
    this.page = await this.context.newPage()
  }

  async closeScenario() {
    await this.context?.close()
    this.context = undefined
    this.page = undefined
    this.activeDisclosure = undefined
  }

  async openFixture(fixtureName) {
    const storyId = this.target.fixtures[fixtureName]

    if (!storyId) {
      throw new Error(
        `Target "${this.target.name}" does not provide fixture "${fixtureName}"`,
      )
    }

    const url = new URL('/iframe', this.storybookUrl)
    url.searchParams.set('id', storyId)
    url.searchParams.set('viewMode', 'story')

    await this.page.goto(url.toString(), { waitUntil: 'domcontentloaded' })
    await this.disclosure('first').waitFor({ state: 'visible' })
    await this.waitForBinding()
  }

  /**
   * Wait (bounded) until the Styles JS enhancement is demonstrably bound to
   * the disclosure. The USWDS accordion toggles on activation; the pilot keys
   * in immediately after the story mounts, and browser keyboard activation of a
   * native button must be reliably synthesized. Probing a reversible click then
   * keyboard toggle guarantees both paths are live before any scenario runs so
   * the shared keyboard scenarios are deterministic instead of racing init.
   */
  async waitForBinding() {
    const first = this.disclosure('first')
    const deadline = Date.now() + 10_000

    while (Date.now() < deadline) {
      const before = await first.getAttribute('aria-expanded')

      if (before === null) {
        throw new Error(
          `Target "${this.target.name}" disclosure has no aria-expanded; the Styles JS enhancement did not initialize.`,
        )
      }

      // Click activation must toggle, then restore.
      await first.click()
      if ((await first.getAttribute('aria-expanded')) === before) {
        await new Promise((resolveWaiting) => setTimeout(resolveWaiting, 150))
        continue
      }
      await first.click()

      // Keyboard activation (Enter on the focused button) must toggle, then
      // restore so scenarios observe a deterministic start.
      await first.focus()
      await this.page.keyboard.press('Enter')
      if ((await first.getAttribute('aria-expanded')) === before) {
        await new Promise((resolveWaiting) => setTimeout(resolveWaiting, 150))
        continue
      }
      await first.focus()
      await this.page.keyboard.press('Enter')

      return
    }

    throw new Error(
      `Target "${this.target.name}" Styles JS enhancement did not become keyboard-activatable within 10s; keyboard scenarios cannot run deterministically.`,
    )
  }

  disclosure(position) {
    const name = DISCLOSURE_NAMES[position]

    if (!name) {
      throw new Error(`Unknown disclosure position "${position}"`)
    }

    return this.page.getByRole('button', { name, exact: true })
  }

  async panelFor(position) {
    const disclosure = this.disclosure(position)
    const panelId = await disclosure.getAttribute('aria-controls')

    if (!panelId) {
      throw new Error(
        `Target "${this.target.name}" ${position} disclosure has no aria-controls`,
      )
    }

    const escapedId = escapeAttributeValue(panelId)
    const panel = this.page.locator(`[id="${escapedId}"]`)

    if ((await panel.count()) !== 1) {
      throw new Error(
        `Target "${this.target.name}" expected one panel with id "${panelId}"`,
      )
    }

    return panel
  }
}

setWorldConstructor(ContractWorld)
