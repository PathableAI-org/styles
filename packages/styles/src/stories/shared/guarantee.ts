type Step = (label: string, play: () => Promise<void>) => Promise<void>

/**
 * Runs assertions as a named play-function step that cites the component page
 * guarantee they prove. The id is `<page>/<guarantee-id>`, where the page is a
 * file under packages/styles/components/ and the guarantee id is in its front
 * matter; the step shows as `guarantee <id>` in the test output.
 *
 * `pnpm check:component-pages` reads these calls from the story source: every
 * guarantee on a page must be cited by a test, and every cited id must exist.
 * So call it directly in a story's play function and pass the id as a string
 * literal.
 */
export const guarantee = (
  step: Step,
  id: `${string}/${string}`,
  play: () => Promise<void>,
) => step(`guarantee ${id}`, play)
