/**
 * Story selection for the visual capture, as "What it captures" in
 * docs/engineering/visual-review.md sets it. Pure functions only, so the rules
 * are tested without building a Storybook.
 */

/** Turn `IconButton` or `icon_button` into `icon-button`. */
export function kebab(name) {
  return name
    .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase()
}

/** A slug with its hyphens removed, so `icon-button` matches `iconbutton`. */
const loose = (slug) => slug.replace(/-/g, '')

const STYLES_SRC = 'packages/styles/src/'
const WRAPPERS = `${STYLES_SRC}pathable-component-wrappers/`
const REACT_COMPONENTS = 'packages/react/src/components/'

/**
 * Paths whose change affects every component: shared tokens and base
 * partials, the stylesheet entry points, the shared wrapper partials, the
 * Storybook configuration, and dependencies.
 */
export function isSharedPath(path) {
  if (path === 'pnpm-lock.yaml') return true
  if (/^packages\/(styles|react)\/package\.json$/.test(path)) return true
  if (/^apps\/storybook(-react)?\/\.storybook\//.test(path)) return true
  if (path.startsWith(WRAPPERS)) {
    return /\/_[^/]+\.scss$/.test(path) || path.endsWith('/pathable-all.scss')
  }
  if (path.startsWith(STYLES_SRC)) {
    const rest = path.slice(STYLES_SRC.length)
    return !rest.includes('/') && rest.endsWith('.scss')
  }
  return false
}

/**
 * The component slug a changed path belongs to, or `null`: a component page,
 * a fixture folder, a styles wrapper partial or a React component folder.
 */
export function componentSlug(path) {
  let match = /^components\/([^/]+)\.md$/.exec(path)
  if (match && match[1] !== 'README') return match[1]
  match = /^fixtures\/([^/]+)\//.exec(path)
  if (match && !['harness', 'scripts', 'node_modules'].includes(match[1])) {
    return match[1]
  }
  if (path.startsWith(WRAPPERS)) {
    match = /^pathable-([^/]+)\.scss$/.exec(path.slice(WRAPPERS.length))
    if (match && match[1] !== 'all') return match[1]
  }
  if (path.startsWith(REACT_COMPONENTS)) {
    const folder = path.slice(REACT_COMPONENTS.length).split('/')[0]
    if (folder && !folder.includes('.')) return kebab(folder)
  }
  return null
}

/** Whether a changed path can change what the React Storybook renders. */
export function touchesReact(path) {
  return (
    path.startsWith('packages/react/') ||
    path.startsWith('apps/storybook-react/') ||
    path === 'pnpm-lock.yaml'
  )
}

/** The last segment of a story title as a slug: `Basic/Icon Button` → `icon-button`. */
function titleSlug(title) {
  const last = title.split('/').pop() ?? ''
  return kebab(last.trim())
}

/** Whether a Storybook index entry is the component a slug names. */
function entryMatchesSlug(entry, slug) {
  if (entry.importPath?.endsWith(`/generated/${slug}.stories.ts`)) return true
  return loose(titleSlug(entry.title ?? '')) === loose(slug)
}

/** Whether a Storybook index entry comes from a stories file the diff changed. */
function entryFromChangedFile(entry, changedPaths) {
  const importPath = (entry.importPath ?? '').replace(/^(\.\.\/)+|^\.\//, '')
  return changedPaths.some((path) => path.endsWith(importPath))
}

/**
 * Choose the stories to capture.
 *
 * - `changedPaths`: repository paths the diff changes
 * - `indexes`: `{ styles, react }`, each the head Storybook's `index.json`
 *   entries as an array (`react` may be absent when not built)
 * - `canonical`: the canonical story list, `{ id, mode }`
 * - `pixelStories` and `rollout`: the pixel suite's story entries and rollout
 *   component keys
 * - `extra`: story IDs asked for explicitly, `react:<id>` for the React
 *   Storybook
 *
 * Returns `[{ workspace, id, title, importPath, reasons, changed, mode }]`.
 * `changed` marks a story the pull request changes, which also gets the
 * `focus` and `text-200` conditions.
 */
export function chooseStories({
  changedPaths,
  indexes,
  canonical = [],
  pixelStories = [],
  rollout = [],
  extra = [],
}) {
  const chosen = new Map()
  const modes = new Map(canonical.map((story) => [story.id, story.mode]))
  const add = (workspace, entry, reason, changed) => {
    const key = `${workspace}:${entry.id}`
    const story = chosen.get(key) ?? {
      workspace,
      id: entry.id,
      title: entry.title ?? '',
      importPath: entry.importPath ?? '',
      reasons: [],
      changed: false,
      mode: modes.get(entry.id) ?? 'both',
    }
    if (!story.reasons.includes(reason)) story.reasons.push(reason)
    story.changed ||= changed
    chosen.set(key, story)
  }

  const slugs = [
    ...new Set(changedPaths.map(componentSlug).filter((slug) => slug !== null)),
  ]
  const shared = changedPaths.filter(isSharedPath)
  const workspaces = Object.entries(indexes).filter(([, entries]) => entries)

  for (const [workspace, entries] of workspaces) {
    const stories = entries.filter((entry) => entry.type === 'story')
    for (const entry of stories) {
      if (entryFromChangedFile(entry, changedPaths)) {
        add(workspace, entry, 'Its stories file changed.', true)
      }
      for (const slug of slugs) {
        if (entryMatchesSlug(entry, slug)) {
          add(workspace, entry, `Component "${slug}" changed.`, true)
        }
      }
    }
  }

  const styles = (indexes.styles ?? []).filter(
    (entry) => entry.type === 'story',
  )
  const byId = new Map(styles.map((entry) => [entry.id, entry]))
  const rolloutIds = pixelStories
    .filter((story) => rollout.includes(story.key.split('/')[0]))
    .map((story) => ({ id: story.id, component: story.key.split('/')[0] }))

  for (const { id, component } of rolloutIds) {
    const entry = byId.get(id)
    if (!entry) continue
    if (slugs.some((slug) => loose(slug) === loose(component))) {
      add('styles', entry, `Pixel rollout story of "${component}".`, false)
    }
  }

  if (shared.length > 0) {
    const reason = `Shared path changed (${shared[0]}${shared.length > 1 ? ', …' : ''}).`
    const listed = [...canonical, ...rolloutIds]
      .map(({ id }) => byId.get(id))
      .filter(Boolean)
    // With no canonical or rollout story in this Storybook (as while the
    // lists are rebuilt), fall back to the first story of each stories file.
    const firstOfEachFile = styles.filter(
      (entry, index) =>
        styles.findIndex((other) => other.importPath === entry.importPath) ===
        index,
    )
    const sample = listed.length > 0 ? listed : firstOfEachFile
    const sampleReason =
      listed.length > 0 ? reason : `${reason} First story of its file.`
    for (const entry of sample) add('styles', entry, sampleReason, false)
  }

  for (const request of extra) {
    const [workspace, id] = request.startsWith('react:')
      ? ['react', request.slice('react:'.length)]
      : ['styles', request]
    const entry = (indexes[workspace] ?? []).find((item) => item.id === id)
    add(workspace, entry ?? { id }, 'Asked for explicitly.', true)
  }

  return [...chosen.values()].sort((a, b) =>
    `${a.workspace}:${a.id}`.localeCompare(`${b.workspace}:${b.id}`),
  )
}

/**
 * Extra conditions the diff calls for, from the text of the changed style and
 * component source: `forced-colors` when it touches colour, `reduced-motion`
 * when it touches motion.
 */
export function conditionsForDiff(diffText) {
  const conditions = []
  if (
    /forced-colors|colou?r|background|border-color|outline|fill|stroke/i.test(
      diffText,
    )
  ) {
    conditions.push('forced-colors')
  }
  if (
    /transition|animation|@keyframes|prefers-reduced-motion/i.test(diffText)
  ) {
    conditions.push('reduced-motion')
  }
  return conditions
}

/** The viewport names for a story's mode, as the pixel suite uses them. */
export function viewportsForMode(mode) {
  return mode === 'desktop' || mode === 'mobile'
    ? [mode]
    : ['mobile', 'tablet', 'desktop']
}

/** The conditions to capture a story under. */
export function conditionsForStory(story, diffConditions) {
  return story.changed
    ? ['default', 'focus', 'text-200', ...diffConditions]
    : ['default']
}
