type Step = (label: string, play: () => Promise<void>) => Promise<void>
type GuaranteeId = `${string}/${string}`
type Executed = { id: string; mode: 'met' | 'unmet' }

/**
 * Records that a guarantee's assertions ran in this story. The Storybook
 * test-runner's postVisit hook (apps/storybook/.storybook/test-runner.js)
 * reads and clears the list after each story and writes it to disk, where
 * `check:component-pages:executed` compares it with the component pages.
 */
const record = (entry: Executed) => {
  const scope = globalThis as { __componentPageGuarantees?: Executed[] }
  scope.__componentPageGuarantees ??= []
  scope.__componentPageGuarantees.push(entry)
}

const messageOf = (error: unknown) =>
  error instanceof Error ? error.message : String(error)

/**
 * Runs assertions that prove a component page guarantee the component meets.
 * The id is `<page>/<guarantee-id>`: a page under components/ (the source pages)
 * and a guarantee in its front matter. The assertions run as a play-function
 * step named `guarantee <id>`, and a failure is rethrown with the id in its
 * message, so the test output names the guarantee that broke.
 */
const met = (step: Step, id: GuaranteeId, play: () => Promise<void>) =>
  step(`guarantee ${id}`, async () => {
    try {
      await play()
    } catch (error) {
      throw new Error(`guarantee ${id} failed: ${messageOf(error)}`, {
        cause: error,
      })
    }
    record({ id, mode: 'met' })
  })

/**
 * Runs assertions for a guarantee the page marks `status: unmet`: expected
 * behaviour the component does not have yet. It passes while the assertions
 * fail and fails once they pass, so fixing the component turns this red until
 * the page's status is changed to met and the call to `guarantee()`.
 */
const unmet = async (
  step: Step,
  id: GuaranteeId,
  play: () => Promise<void>,
) => {
  let failed = false
  try {
    await play()
  } catch {
    failed = true
  }
  if (!failed) {
    throw new Error(
      `guarantee ${id} is marked unmet, but its assertions now pass. Set its status to met on the component page and cite it with guarantee() instead of guarantee.unmet().`,
    )
  }
  record({ id, mode: 'unmet' })
  await step(`guarantee ${id} (unmet: expected to fail)`, async () => {})
}

export const guarantee = Object.assign(met, { unmet })
