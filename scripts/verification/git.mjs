// Ported from pathableai-org/pre-ets scripts/verification/git.ts @ f2ee390 (types stripped only).
/** The feature artifacts a verification request is built from, read at a SHA. */

/** @typedef {import('./request.mjs').FeatureArtifacts} FeatureArtifacts */

import { readAtSha } from '../git-access.mjs'

/** The artifacts the request is built from, read at `sha` rather than from the working tree. */
export const featureArtifactsAt = (cwd, sha, featureDir) => {
  const read = (name) => readAtSha(cwd, sha, `${featureDir}/${name}`)
  const plan = read('plan.md')
  const verification = read('verification.md')
  const quickstart = read('quickstart.md')
  if (
    plan === undefined ||
    verification === undefined ||
    quickstart === undefined
  ) {
    return `${featureDir} at ${sha.slice(0, 12)} lacks plan.md, verification.md, or quickstart.md`
  }
  return { plan, quickstart, research: read('research.md'), verification }
}
