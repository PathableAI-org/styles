// Ported from pathableai-org/pre-ets scripts/verification/inputs.ts @ f2ee390 (types stripped only).
/**
 * The inputs a verification report records. The optional feature digest is
 * retained only to import reports published before the issue-and-PR workflow.
 */
import { createHash } from 'node:crypto'

/** @typedef {import('./report.mjs').ReportInputs} ReportInputs */

import { blobsAt, codeTree, readAtSha } from '../git-access.mjs'
import { withoutSection } from './markdown.mjs'

const executionResults = /^execution results$/i

/**
 * A digest of a retired feature directory, for historical-note compatibility.
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

/** The inputs of `sha`, plus legacy feature inputs when an old report names them. */
export const reportInputs = (cwd, sha, featureDir) => ({
  codeTree: codeTree(cwd, sha),
  featureInputs:
    featureDir === undefined ? undefined : featureInputs(cwd, sha, featureDir),
})
