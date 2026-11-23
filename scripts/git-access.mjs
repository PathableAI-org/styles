// Ported from pathableai-org/pre-ets scripts/git-access.ts @ f2ee390 (types stripped only).
/**
 * Git access for the agent workflow tooling. Every call runs in `cwd` and reads committed content or notes only.
 * Nothing here fetches or pushes a notes ref: notes travel between clones as pull request comments (note-sync.mjs).
 * The one fetch, `fetchCommit`, brings in a single commit by SHA so a note comment on it can be imported.
 */
import { execFileSync } from 'node:child_process'

/** @typedef {import('./schema-checks.mjs').Validated} Validated */

const git = (cwd, args, input, timeout) =>
  execFileSync('git', args, {
    cwd,
    encoding: 'utf8',
    input,
    maxBuffer: 64 * 1024 * 1024,
    stdio: 'pipe',
    timeout,
  })

const gitOrUndefined = (cwd, args, timeout) => {
  try {
    return git(cwd, args, undefined, timeout)
  } catch {
    return undefined
  }
}

const lines = (output) => output.split('\n').filter((line) => line.length > 0)

export const resolveSha = (cwd, revision) =>
  git(cwd, ['rev-parse', '--verify', `${revision}^{commit}`]).trim()

/** Whether `sha` is the full SHA of a commit in the repository. */
export const isCommit = (cwd, sha) =>
  gitOrUndefined(cwd, [
    'rev-parse',
    '--verify',
    '--quiet',
    `${sha}^{commit}`,
  ])?.trim() === sha

export const repositoryRoot = (cwd) =>
  git(cwd, ['rev-parse', '--show-toplevel']).trim()

export const currentBranch = (cwd) =>
  gitOrUndefined(cwd, ['symbolic-ref', '--quiet', '--short', 'HEAD'])?.trim()

/** Local and remote-tracking branch names whose tip is `sha`, without the remote prefix and without duplicates. */
export const branchesAt = (cwd, sha) => [
  ...new Set(
    lines(
      git(cwd, [
        'for-each-ref',
        `--points-at=${sha}`,
        '--format=%(refname)',
        'refs/heads',
        'refs/remotes',
      ]),
    )
      .map((ref) =>
        ref
          .replace(/^refs\/heads\//, '')
          .replace(/^refs\/remotes\/[^/]+\//, ''),
      )
      .filter((name) => name !== 'HEAD'),
  ),
]

/** A file's content at a revision, or undefined when it does not exist there. */
export const readAtSha = (cwd, sha, path) =>
  gitOrUndefined(cwd, ['show', `${sha}:${path}`])

/** How long one fetch of a single commit may take before it counts as failed. */
const fetchTimeoutMs = 60_000

/**
 * Fetches one commit by SHA from `origin`, for a commit no branch holds any
 * more, such as a reviewed revision after a branch is rewritten. GitHub serves
 * such commits by SHA until it garbage-collects them. Returns whether the
 * commit is now here.
 */
export const fetchCommit = (cwd, sha) => {
  gitOrUndefined(
    cwd,
    ['fetch', '--quiet', '--no-tags', '--no-write-fetch-head', 'origin', sha],
    fetchTimeoutMs,
  )
  return isCommit(cwd, sha)
}

/**
 * The behavior-bearing tree ID recorded with review evidence. The retired
 * `specs/` directory remains excluded so notes created before its removal can
 * still be imported and compared.
 */
export const codeTree = (cwd, sha) =>
  git(
    cwd,
    ['mktree'],
    lines(git(cwd, ['ls-tree', sha]))
      .filter((entry) => !entry.endsWith('\tspecs'))
      .map((entry) => `${entry}\n`)
      .join(''),
  ).trim()

/** Each blob under `path` at a revision, as its path and blob ID, sorted by path. */
export const blobsAt = (cwd, sha, path) =>
  lines(git(cwd, ['ls-tree', '-r', sha, '--', path])).flatMap((entry) => {
    const match = /^\d+ blob ([0-9a-f]+)\t(.+)$/.exec(entry)
    return match?.[1] === undefined || match[2] === undefined
      ? []
      : [{ id: match[1], path: match[2] }]
  })

/** Whether `path` is a directory at a revision. */
export const isDirectoryAt = (cwd, sha, path) =>
  gitOrUndefined(cwd, ['cat-file', '-t', `${sha}:${path}`])?.trim() === 'tree'

/** Paths that differ between two revisions. */
export const changedPaths = (cwd, from, to) =>
  lines(git(cwd, ['diff', '--name-only', from, to]))

/** A notes ref under refs/notes/, so a mistyped option cannot write a branch or tag. */
export const checkNotesRef = (ref) =>
  /^refs\/notes\/[\w./-]+$/.test(ref) && !ref.includes('..')
    ? { ok: true, value: ref }
    : { ok: false, problems: [`${ref} is not a ref under refs/notes/`] }

/** How far below HEAD the gate looks for a note. */
export const ancestorLimit = 200

/** The nearest commit at or below `head`, within `ancestorLimit` commits, that carries a note in `ref`. */
export const nearestAnnotated = (cwd, ref, head) => {
  const annotated = new Set(
    lines(gitOrUndefined(cwd, ['notes', `--ref=${ref}`, 'list']) ?? '').map(
      (line) => line.split(' ')[1],
    ),
  )
  return lines(
    git(cwd, ['rev-list', `--max-count=${String(ancestorLimit)}`, head]),
  ).find((sha) => annotated.has(sha))
}

/**
 * Commits with a note in `ref` that this clone has, the one whose note was written most recently first. The order
 * is the notes ref's own history, so it is the order entries were recorded or imported in this clone.
 */
export const annotatedByRecency = (cwd, ref) => {
  const annotated = new Set(
    lines(gitOrUndefined(cwd, ['notes', `--ref=${ref}`, 'list']) ?? '').map(
      (line) => line.split(' ')[1],
    ),
  )
  const written = [
    ...new Set(
      lines(
        gitOrUndefined(cwd, [
          'log',
          '--no-renames',
          '--format=',
          '--name-only',
          ref,
        ]) ?? '',
      ).map((path) => path.replaceAll('/', '')),
    ),
  ].filter((sha) => annotated.has(sha))
  if (written.length === 0) return []
  const kinds = lines(
    git(
      cwd,
      ['cat-file', '--batch-check=%(objecttype)'],
      `${written.join('\n')}\n`,
    ),
  )
  return written.filter((_, index) => kinds[index] === 'commit')
}

export const readNote = (cwd, ref, sha) =>
  gitOrUndefined(cwd, ['notes', `--ref=${ref}`, 'show', sha])

/** Replaces the note on `sha` in `ref`. Git keeps the previous note in the notes ref's own history. */
export const writeNote = (cwd, ref, sha, content) => {
  git(
    cwd,
    ['notes', `--ref=${ref}`, 'add', '--force', '--file=-', sha],
    content,
  )
}
