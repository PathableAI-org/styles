/**
 * Story selection for the visual capture, as "What it captures" in
 * docs/engineering/visual-review.md sets it. Pure functions only, so the rules
 * are tested without building a Storybook.
 */

import { classifyPath } from './classify.mjs'

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
const REACT_THEME = 'packages/react/src/theme/'

/**
 * The Storybooks a shared path affects as a whole, `[]` for a path that is
 * not shared or cannot change rendering: shared tokens and base partials, the
 * stylesheet entry points, the shared wrapper partials, the React theming
 * source, each Storybook's configuration, and dependencies. A manifest or the
 * lockfile names the workspaces `classifyPath` gives it, unless the caller
 * passes the narrower ones its content resolved to as `inspected`.
 */
export function sharedWorkspaces(path, inspected) {
  const { kind, workspaces } = classifyPath(path)
  if (kind === 'none') return []
  if (kind === 'inspect') return inspected ?? workspaces
  if (path.startsWith('apps/storybook/.storybook/')) return ['styles']
  if (path.startsWith('apps/storybook-react/.storybook/')) return ['react']
  if (path.startsWith(REACT_THEME)) return ['react']
  if (path.startsWith(WRAPPERS)) {
    return /\/_[^/]+\.scss$/.test(path) || path.endsWith('/pathable-all.scss')
      ? ['styles']
      : []
  }
  if (path.startsWith(STYLES_SRC)) {
    const rest = path.slice(STYLES_SRC.length)
    return !rest.includes('/') && rest.endsWith('.scss') ? ['styles'] : []
  }
  return []
}

/** Whether a path affects every component of a Storybook. */
export function isSharedPath(path) {
  return sharedWorkspaces(path).length > 0
}

/**
 * The component slug a changed path belongs to, or `null`: a component page,
 * a fixture folder, a styles wrapper partial or a React component folder.
 */
export function componentSlug(path) {
  if (classifyPath(path).kind !== 'render') return null
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
  // A component in the theming source, such as ThemeProvider.tsx, has its
  // own stories; the rest of the folder is covered as a shared path.
  match = /^([A-Z][A-Za-z0-9]*)\.tsx$/.exec(path.slice(REACT_THEME.length))
  if (path.startsWith(REACT_THEME) && match) return kebab(match[1])
  return null
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

/** The first story of each stories file, in index order. */
function firstOfEachFile(stories) {
  return stories.filter(
    (entry, index) =>
      stories.findIndex((other) => other.importPath === entry.importPath) ===
      index,
  )
}

/**
 * The verdict of a finished capture: `no-difference` only when nothing failed,
 * at least one pair was captured, every pair matched, no story is one the
 * diff changed and the run was not forced; otherwise `review`.
 */
export function captureVerdict({ errors, pairs, stories, force = false }) {
  const clean =
    !force &&
    errors.length === 0 &&
    pairs.length > 0 &&
    pairs.every((pair) => pair.status === 'same') &&
    !stories.some((story) => story.changed)
  return clean ? 'no-difference' : 'review'
}

/** Whether a Storybook index entry comes from a stories file the diff changed. */
function entryFromChangedFile(entry, renderPaths) {
  const importPath = (entry.importPath ?? '').replace(/^(\.\.\/)+|^\.\//, '')
  return renderPaths.some((path) => path.endsWith(importPath))
}

/**
 * Choose the stories to capture.
 *
 * - `changedPaths`: repository paths the diff changes
 * - `indexes`: `{ styles, react }`, each the head Storybook's `index.json`
 *   entries as an array (`react` may be absent when not built)
 * - `canonical`: the canonical story list, `{ id, mode }`
 * - `extra`: story IDs asked for explicitly, `react:<id>` for the React
 *   Storybook
 * - `classification`: `classifyChanges(...).paths`, so a manifest or the
 *   lockfile counts only for the workspaces its content changed; without it
 *   every path is classified by name alone
 * - `force`: when nothing else chose a story and none was asked for, sample
 *   the first story of each stories file of every Storybook in `indexes`
 *
 * Returns `[{ workspace, id, title, importPath, reasons, changed, mode }]`.
 * `changed` marks a story the pull request changes, which also gets the
 * `focus` and `text-200` conditions.
 */
export function chooseStories({
  changedPaths: allPaths,
  indexes,
  canonical = [],
  extra = [],
  classification = null,
  force = false,
}) {
  const resolved = new Map(
    (classification ?? []).map((item) => [item.path, item]),
  )
  // A path that cannot change rendering never matches a component or counts
  // as shared.
  const renderPaths = allPaths.filter((path) =>
    resolved.has(path)
      ? resolved.get(path).render
      : classifyPath(path).kind !== 'none',
  )
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
    ...new Set(renderPaths.map(componentSlug).filter((slug) => slug !== null)),
  ]
  const inspectedFor = (path) => resolved.get(path)?.workspaces
  // A render path that names no component, is not shared above and matched no
  // stories file still counts as shared for its classified workspaces, so it
  // is never left without a sample.
  const sharedFor = (path) => {
    const named = sharedWorkspaces(path, inspectedFor(path))
    if (named.length > 0 || componentSlug(path) !== null) return named
    // A changed stories file already chose its own stories.
    const ownStories = Object.values(indexes).some((entries) =>
      (entries ?? []).some(
        (entry) =>
          entry.type === 'story' && entryFromChangedFile(entry, [path]),
      ),
    )
    if (ownStories) return named
    return inspectedFor(path) ?? classifyPath(path).workspaces
  }
  const shared = renderPaths.filter((path) => sharedFor(path).length > 0)
  const workspaces = Object.entries(indexes).filter(([, entries]) => entries)

  for (const [workspace, entries] of workspaces) {
    const stories = entries.filter((entry) => entry.type === 'story')
    for (const entry of stories) {
      if (entryFromChangedFile(entry, renderPaths)) {
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
  for (const [workspace, entries] of workspaces) {
    const paths = shared.filter((path) => sharedFor(path).includes(workspace))
    if (paths.length === 0) continue
    const reason = `Shared path changed (${paths[0]}${paths.length > 1 ? ', …' : ''}).`
    const stories = entries.filter((entry) => entry.type === 'story')
    const listed =
      workspace === 'styles'
        ? canonical.map(({ id }) => byId.get(id)).filter(Boolean)
        : []
    // With no canonical story in this Storybook (the React one has none, and
    // the styles list is empty while it is rebuilt), fall back to the first
    // story of each stories file.
    const sample = listed.length > 0 ? listed : firstOfEachFile(stories)
    const sampleReason =
      listed.length > 0 ? reason : `${reason} First story of its file.`
    for (const entry of sample) add(workspace, entry, sampleReason, false)
  }

  for (const request of extra) {
    const [workspace, id] = request.startsWith('react:')
      ? ['react', request.slice('react:'.length)]
      : ['styles', request]
    const entry = (indexes[workspace] ?? []).find(
      (item) => item.id === id && item.type === 'story',
    )
    add(workspace, entry ?? { id }, 'Asked for explicitly.', true)
    if (!entry) chosen.get(`${workspace}:${id}`).inIndex = false
  }

  if (force && chosen.size === 0) {
    for (const [workspace, entries] of workspaces) {
      const stories = entries.filter((entry) => entry.type === 'story')
      for (const entry of firstOfEachFile(stories)) {
        add(
          workspace,
          entry,
          'A review was forced. First story of its file.',
          false,
        )
      }
    }
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

/** The viewport names for a story's mode. */
export function viewportsForMode(mode) {
  return mode === 'desktop' || mode === 'mobile'
    ? [mode]
    : ['mobile', 'tablet', 'desktop']
}

/**
 * The conditions to capture a story under. Every chosen story is affected by
 * the change, so each gets the diff's media conditions; a story the pull
 * request changes also gets `focus` and `text-200`.
 */
export function conditionsForStory(story, diffConditions) {
  return story.changed
    ? ['default', 'focus', 'text-200', ...diffConditions]
    : ['default', ...diffConditions]
}
