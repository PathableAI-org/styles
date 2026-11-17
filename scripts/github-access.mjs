// Ported from pathableai-org/pre-ets scripts/github-access.ts @ f2ee390 (types stripped only).
/**
 * GitHub REST access for the agent workflow tooling, through `gh api` so it uses the session's own GitHub login.
 * Paths may use gh's `{owner}` and `{repo}` placeholders, which gh fills from the clone's remote. Only REST is used:
 * cloud sessions cannot reach GraphQL. Tests inject a `RestAccess` instead of calling the network.
 */
import { execFileSync } from 'node:child_process'

import { isRecord } from './schema-checks.mjs'
/** @typedef {import('./schema-checks.mjs').Validated} Validated */

/**
 * @typedef {object} RestAccess
 * @property {(path: string) => unknown} get
 * @property {(path: string, body: Readonly<Record<string, unknown>>) => unknown} post
 */

/** How long one `gh api` call may take before the network counts as unreachable. */
const timeoutMs = 30_000

const firstLine = (error) => {
  const stderr = isRecord(error) ? error.stderr : undefined
  const text =
    typeof stderr === 'string' && stderr.trim().length > 0
      ? stderr
      : String(error)
  return text.trim().split('\n')[0] ?? 'unknown error'
}

/** REST access through the `gh` CLI, run in `cwd` so placeholders resolve against that clone's remote. */
export const ghRest = (cwd) => {
  const run = (args, input) =>
    JSON.parse(
      execFileSync('gh', args, {
        cwd,
        encoding: 'utf8',
        input,
        stdio: 'pipe',
        timeout: timeoutMs,
      }),
    )
  return {
    get: (path) => run(['api', path]),
    post: (path, body) =>
      run(
        ['api', '--method', 'POST', path, '--input', '-'],
        JSON.stringify(body),
      ),
  }
}

const fail = (...problems) => ({
  ok: false,
  problems,
})

/** Runs one REST call and reads its result, turning a thrown error or an unexpected shape into a problem. */
const call = (path, request, read) => {
  let value
  try {
    value = request()
  } catch (error) {
    return fail(`GitHub ${path}: ${firstLine(error)}`)
  }
  const result = read(value)
  return result === undefined
    ? fail(`GitHub ${path}: unexpected response`)
    : { ok: true, value: result }
}

/** Reads a JSON list whose every item `read` accepts. */
const readList = (read) => (value) => {
  if (!Array.isArray(value)) return undefined
  const items = value.map(read)
  return items.every((item) => item !== undefined) ? items : undefined
}

/**
 * @typedef {object} PullRequest
 * @property {boolean} draft
 * @property {string} headRef
 * @property {string} headSha
 * @property {readonly string[]} labels
 * @property {number} number
 * @property {string} repositoryUrl The web URL of the pull request's repository, such as https://github.com/owner/name, for links into it.
 */

/** The repository's web URL from a pull request's `html_url`, which is that URL followed by `/pull/<number>`. */
const repositoryOf = (htmlUrl) =>
  typeof htmlUrl === 'string'
    ? /^(.+)\/pull\/\d+$/.exec(htmlUrl)?.[1]
    : undefined

const labelNames = (labels) =>
  Array.isArray(labels)
    ? labels.flatMap((label) =>
        isRecord(label) && typeof label.name === 'string' ? [label.name] : [],
      )
    : []

const readPull = (value) => {
  if (
    !isRecord(value) ||
    !isRecord(value.head) ||
    typeof value.number !== 'number'
  )
    return undefined
  const { ref, sha } = value.head
  const repositoryUrl = repositoryOf(value.html_url)
  if (
    typeof ref !== 'string' ||
    typeof sha !== 'string' ||
    repositoryUrl === undefined
  )
    return undefined
  return {
    draft: value.draft === true,
    headRef: ref,
    headSha: sha,
    labels: labelNames(value.labels),
    number: value.number,
    repositoryUrl,
  }
}

/** This clone's repository in a gh path. An explicit `owner/name` may take its place. */
const thisRepository = '{owner}/{repo}'

export const pullRequest = (rest, number, repository = thisRepository) => {
  const path = `repos/${repository}/pulls/${String(number)}`
  return call(path, () => rest.get(path), readPull)
}

/** The open pull request whose head is `branch` in this repository, or undefined when there is none. */
export const openPullForBranch = (rest, branch) => {
  const path = `repos/${thisRepository}/pulls?state=open&head={owner}:${encodeURIComponent(branch)}`
  const found = call(path, () => rest.get(path), readList(readPull))
  return found.ok ? { ok: true, value: found.value[0] } : found
}

/** The login of the account `gh` is authenticated as. */
export const authenticatedLogin = (rest) =>
  call(
    'user',
    () => rest.get('user'),
    (value) =>
      isRecord(value) && typeof value.login === 'string'
        ? value.login
        : undefined,
  )

/**
 * @typedef {object} IssueComment
 * @property {string} author
 * @property {string} body
 * @property {number} id
 * @property {string} url The comment's web URL.
 */

const readComment = (value) =>
  isRecord(value) &&
  typeof value.id === 'number' &&
  typeof value.body === 'string' &&
  isRecord(value.user) &&
  typeof value.user.login === 'string' &&
  typeof value.html_url === 'string'
    ? {
        author: value.user.login,
        body: value.body,
        id: value.id,
        url: value.html_url,
      }
    : undefined

const pageSize = 100

/** Every issue comment on a pull request, oldest first, read a page at a time. */
export const issueComments = (rest, number) => {
  const comments = []
  for (let page = 1; ; page += 1) {
    const path = `repos/${thisRepository}/issues/${String(number)}/comments?per_page=${String(pageSize)}&page=${String(
      page,
    )}`
    const batch = call(path, () => rest.get(path), readList(readComment))
    if (!batch.ok) return batch
    comments.push(...batch.value)
    if (batch.value.length < pageSize) return { ok: true, value: comments }
  }
}

/** Posts an issue comment on a pull request and returns its URL. */
export const postIssueComment = (rest, number, body) => {
  const path = `repos/${thisRepository}/issues/${String(number)}/comments`
  return call(
    path,
    () => rest.post(path, { body }),
    (value) =>
      isRecord(value) && typeof value.html_url === 'string'
        ? value.html_url
        : undefined,
  )
}
