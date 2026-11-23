// Ported from pathableai-org/pre-ets tests/tooling/support.ts @ f2ee390 (types stripped only).
/** A throwaway Git repository for workflow-tooling tests. */
import { execFileSync } from 'node:child_process'
import {
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'

/** @typedef {import('../github-access.mjs').RestAccess} RestAccess */

const fixtures = join(dirname(fileURLToPath(import.meta.url)), 'fixtures')

export const fixture = (name) => readFileSync(join(fixtures, name), 'utf8')

/**
 * @typedef {object} SampleRepo
 * @property {(message: string, files: Readonly<Record<string, string>>) => string} commit
 * @property {string} dir
 * @property {(...args: readonly string[]) => string} git
 * @property {() => void} remove
 */

export const sampleRepo = (branch = 'work/button-focus') => {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), 'verification-test-')))
  const git = (...args) =>
    execFileSync('git', args, {
      cwd: dir,
      encoding: 'utf8',
      stdio: ['ignore', 'pipe', 'pipe'],
    }).trim()
  const commit = (message, files) => {
    for (const [path, content] of Object.entries(files)) {
      mkdirSync(dirname(join(dir, path)), { recursive: true })
      writeFileSync(join(dir, path), content)
    }
    git('add', '--all')
    git('commit', '--quiet', '--message', message)
    return git('rev-parse', 'HEAD')
  }
  git('init', '--quiet', '--initial-branch', 'main')
  git('config', 'user.email', 'verifier@example.test')
  git('config', 'user.name', 'Verifier')
  git('config', 'commit.gpgsign', 'false')
  git('config', 'core.hooksPath', '/dev/null')
  commit('chore: start', { 'src/app.ts': 'export const app = 1\n' })
  git('checkout', '--quiet', '-b', branch)
  return {
    commit,
    dir,
    git,
    remove: () => {
      rmSync(dir, { force: true, recursive: true })
    },
  }
}

/** The sample pull-request report for `sha`, optionally changed by `edit`. */
export const sampleReport = (sha, edit = () => undefined) => {
  const report = JSON.parse(fixture('report-a1.json'))
  report.verifiedSha = sha
  edit(report)
  return JSON.stringify(report)
}

/** A passing round-one review from `base` to `sha`, optionally changed by `edit`. */
export const sampleReview = (base, sha, edit = () => undefined) => {
  const review = JSON.parse(fixture('review-a1.json'))
  Object.assign(review, { baseSha: base, findings: [], reviewedSha: sha })
  edit(review)
  return JSON.stringify(review)
}

/** A pull request as the REST API returns it, reduced to the fields the tooling reads. */
export const restPull = (number, head, labels = []) => ({
  draft: true,
  head,
  html_url: `https://github.test/owner/repo/pull/${String(number)}`,
  labels: labels.map((name) => ({ name })),
  number,
})

/**
 * @typedef {RestAccess & object} FakeGitHub
 * @property {Map<number, Record<string, unknown>[]>} comments Comments by pull request number, in the REST shape, oldest first. Posting appends here.
 * @property {string[]} requests Every path requested, in order.
 */

/**
 * GitHub REST in memory, for tests that must not call the network. It serves the routes the tooling uses, and fails
 * every call like an unreachable network when `offline` is set.
 */
export const fakeGitHub = (options = {}) => {
  const login = options.login ?? 'person'
  const pulls = options.pulls ?? []
  const comments = new Map(
    Object.entries(options.comments ?? {}).map(([pr, list]) => [
      Number(pr),
      [...list],
    ]),
  )
  const requests = []
  const reach = (path) => {
    requests.push(path)
    if (options.offline === true) {
      throw Object.assign(new Error('gh failed'), {
        stderr: 'error connecting to api.github.com\n',
      })
    }
  }
  const headOf = (pull) => pull.head
  const get = (path) => {
    reach(path)
    if (path === 'user') return { login }
    const byHead =
      /^repos\/\{owner\}\/\{repo\}\/pulls\?state=open&head=\{owner\}:(.+)$/.exec(
        path,
      )
    if (byHead !== null)
      return pulls.filter(
        (pull) => headOf(pull).ref === decodeURIComponent(byHead[1] ?? ''),
      )
    const one = /^repos\/[^/]+\/[^/]+\/pulls\/(\d+)$/.exec(path)
    if (one !== null) {
      const pull = pulls.find(
        (candidate) => candidate.number === Number(one[1]),
      )
      if (pull === undefined)
        throw Object.assign(new Error('gh failed'), {
          stderr: 'HTTP 404: Not Found\n',
        })
      return pull
    }
    const page =
      /^repos\/\{owner\}\/\{repo\}\/issues\/(\d+)\/comments\?per_page=(\d+)&page=(\d+)$/.exec(
        path,
      )
    if (page !== null) {
      const size = Number(page[2])
      const start = (Number(page[3]) - 1) * size
      return (comments.get(Number(page[1])) ?? []).slice(start, start + size)
    }
    throw new Error(`unexpected GET ${path}`)
  }
  const post = (path, body) => {
    reach(path)
    const target = /^repos\/\{owner\}\/\{repo\}\/issues\/(\d+)\/comments$/.exec(
      path,
    )
    if (target === null) throw new Error(`unexpected POST ${path}`)
    const list = comments.get(Number(target[1])) ?? []
    const id = list.length + 1
    const url = `https://github.test/pull/${target[1] ?? ''}#issuecomment-${String(id)}`
    list.push({ body: body.body, html_url: url, id, user: { login } })
    comments.set(Number(target[1]), list)
    return { html_url: url }
  }
  return { comments, get, post, requests }
}

/** An issue comment in the REST shape. */
export const restComment = (id, author, body) => ({
  body,
  html_url: `https://github.test/pull/comment-${String(id)}`,
  id,
  user: { login: author },
})
