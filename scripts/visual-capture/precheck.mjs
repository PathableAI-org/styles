/**
 * The post-build output pre-check of the visual capture: when every render
 * path of a diff shows up in the built styles outputs, identical outputs mean
 * the Storybook renders identically, and no capture is needed. Pure helpers.
 */

/** Render paths whose whole effect shows in the compared output trees. */
export const COVERED = [
  /^packages\/styles\/src\//,
  /^packages\/styles\/scripts\/copy-(?:icons|fonts)\.mjs$/,
  /^packages\/styles\/package\.json$/,
  /^components\/(?!README\.md$)[^/]+\.md$/,
  /^fixtures\/[^/]+\/./,
  /^scripts\/component-docs\//,
  /^packages\/react\/src\/test\/fixture-manifest\.ts$/,
  /^pnpm-lock\.yaml$/,
]

/** Output directories, relative to a worktree, the pre-check hashes. */
export const COMPARED_DIRS = [
  'packages/styles/dist',
  'packages/styles/fonts',
  'apps/storybook/generated',
]

const SAMPLE_LIMIT = 10

/**
 * The styles manifest. The styles Storybook resolves
 * `@pathableai/styles/src/index.scss` through its `exports`, so an `exports` or
 * `peerDependencies` change can redirect the iframe stylesheet without
 * changing the compared outputs.
 */
const STYLES_MANIFEST = 'packages/styles/package.json'

/** Whether the compared outputs show every render path's effect. */
export function precheckCovers(renderPaths) {
  return renderPaths.every((path) => COVERED.some((rule) => rule.test(path)))
}

/**
 * Whether the pre-check applies to a classification: the styles Storybook
 * only, covered paths only, and a lockfile that changed no dependency the
 * built outputs cannot show: only `styles-package` changes do. A lockfile
 * entry without `parts` (it did not parse) blocks the pre-check.
 */
export function precheckApplies(classification) {
  const render = classification.paths.filter((entry) => entry.render)
  const lockfile = render.find((entry) => entry.path === 'pnpm-lock.yaml')
  return (
    render.every((entry) => !entry.workspaces.includes('react')) &&
    precheckCovers(render.map((entry) => entry.path)) &&
    render.every(
      (entry) =>
        entry.path !== STYLES_MANIFEST ||
        (Array.isArray(entry.fields) &&
          entry.fields.every(
            (field) =>
              field === 'dependencies' ||
              field.startsWith('devDependencies:') ||
              field.startsWith('scripts:'),
          )),
    ) &&
    (!lockfile ||
      (Array.isArray(lockfile.parts) &&
        !lockfile.parts.some(
          (part) => part === 'styles-storybook' || part === 'react',
        )))
  )
}

/**
 * Compare two `Map<relativePath, sha256>` trees. The path arrays are capped
 * to a short sample; `total` holds the full counts.
 */
export function compareTrees(baseMap, headMap) {
  const added = [...headMap.keys()].filter((path) => !baseMap.has(path)).sort()
  const removed = [...baseMap.keys()]
    .filter((path) => !headMap.has(path))
    .sort()
  const changed = [...baseMap.keys()]
    .filter(
      (path) => headMap.has(path) && headMap.get(path) !== baseMap.get(path),
    )
    .sort()
  return {
    same: added.length + removed.length + changed.length === 0,
    added: added.slice(0, SAMPLE_LIMIT),
    removed: removed.slice(0, SAMPLE_LIMIT),
    changed: changed.slice(0, SAMPLE_LIMIT),
    total: {
      added: added.length,
      removed: removed.length,
      changed: changed.length,
    },
  }
}
