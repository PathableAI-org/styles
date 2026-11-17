// Ported from pathableai-org/pre-ets scripts/verification/inputs.ts @ f2ee390 (types stripped only).
/**
 * The inputs a verification report records: what the verified SHA's behavior and its verification depend on, so a
 * later commit with the same inputs can be recognized without the verified commit. See
 * docs/engineering/verification-harness.md#report.
 */
import { createHash } from 'node:crypto'

/** @typedef {import('./report.mjs').ReportInputs} ReportInputs */

import { blobsAt, codeTree, readAtSha } from '../git-access.mjs'
import { executionResults } from './gate.mjs'
import { withoutSection } from './markdown.mjs'

/**
 * A digest of every file in the feature directory at `sha`, with `quickstart.md` read without its execution
 * results, so recording results, which is an evidence-only change, leaves it unchanged.
 */
const featureInputs = (cwd, sha, featureDir) => {
  const quickstart = `${featureDir}/quickstart.md`
  const hash = createHash('sha256')
  for (const blob of blobsAt(cwd, sha, featureDir)) {
    const content =
      blob.path === quickstart
        ? withoutSection(
            readAtSha(cwd, sha, quickstart) ?? '',
            executionResults,
          )
        : blob.id
    hash.update(`${blob.path}\0${content}\0`)
  }
  return hash.digest('hex')
}

/** The inputs of the commit `sha`, for a report on the feature in `featureDir`, or a High fix without one. */
export const reportInputs = (cwd, sha, featureDir) => ({
  codeTree: codeTree(cwd, sha),
  featureInputs:
    featureDir === undefined ? undefined : featureInputs(cwd, sha, featureDir),
})
