/** A fake GitHub for merge gate and merge hook tests: the routes the gate reads, on top of `fakeGitHub`. */
import { recordReview, defaultNotesRef } from '../review-findings.mjs'
import { defaultVisualNotesRef, recordVisualReview } from '../visual-review.mjs'
import { fakeGitHub, sampleReview } from './support.mjs'

/**
 * @typedef {object} GateState
 * @property {number} behindBy
 * @property {string[]} files
 * @property {boolean} [offline]
 * @property {Record<string, unknown>} pull The pull request in the REST shape.
 * @property {Record<string, unknown>[]} reviews GitHub reviews in the REST shape.
 * @property {Record<string, unknown>[]} runs Check runs in the REST shape.
 * @property {Record<string, unknown>[]} statuses Commit statuses in the REST shape.
 */

/** A ready, eligible pull request 7 from `ref` at `sha`, labelled risk:standard, with one passing check. */
export const gateState = (ref, sha, files) => ({
  behindBy: 0,
  files,
  pull: {
    base: { ref: 'main' },
    draft: false,
    head: { ref, sha },
    html_url: 'https://github.test/owner/repo/pull/7',
    labels: [{ name: 'risk:standard' }],
    number: 7,
    state: 'open',
    title: 'fix(styles): restore the button focus ring',
  },
  reviews: [],
  runs: [{ conclusion: 'success', name: 'ci', status: 'completed' }],
  statuses: [],
})

/** One page of `items`: everything on page 1, nothing after. */
const pageOf = (path, items) => {
  const page = /[?&]page=(\d+)/.exec(path)?.[1] ?? '1'
  return page === '1' ? items : []
}

/** GitHub REST in memory, serving `state` as pull request 7 and its head. `state` is read on every call. */
export const gateGitHub = (state) => {
  const base = fakeGitHub({ offline: state.offline, pulls: [state.pull] })
  const get = (path) => {
    if (/^repos\/[^/]+\/[^/]+\/pulls\/\d+$/.test(path)) {
      base.requests.push(path)
      if (state.offline === true)
        throw Object.assign(new Error('gh failed'), {
          stderr: 'error connecting to api.github.com\n',
        })
      if (path.endsWith(`/pulls/${String(state.pull.number)}`))
        return state.pull
      throw Object.assign(new Error('gh failed'), {
        stderr: 'HTTP 404: Not Found\n',
      })
    }
    const routes = [
      [
        /\/pulls\/\d+\/files\?/,
        () =>
          pageOf(
            path,
            state.files.map((filename) => ({ filename })),
          ),
      ],
      [/\/pulls\/\d+\/reviews\?/, () => pageOf(path, state.reviews)],
      [
        /\/commits\/[0-9a-f]+\/check-runs\?/,
        () => ({
          check_runs: pageOf(path, state.runs),
          total_count: state.runs.length,
        }),
      ],
      [
        /\/commits\/[0-9a-f]+\/status\?/,
        () => ({ state: 'success', statuses: pageOf(path, state.statuses) }),
      ],
      [
        /\/compare\/main\.\.\.[0-9a-f]+$/,
        () => ({ behind_by: state.behindBy }),
      ],
    ]
    const route = routes.find(([pattern]) => pattern.test(path))
    if (route === undefined) return base.get(path)
    base.requests.push(path)
    if (state.offline === true)
      throw Object.assign(new Error('gh failed'), {
        stderr: 'error connecting to api.github.com\n',
      })
    return route[1]()
  }
  return { ...base, get }
}

/** A GitHub review in the REST shape. */
export const restReview = (login, state, type = 'User') => ({
  state,
  user: { login, type },
})

/** Records a clean single-pull-request code review (slice fix) from `base` to `sha`. */
export const recordFixReview = (dir, base, sha, edit = () => undefined) => {
  const recorded = recordReview(
    dir,
    defaultNotesRef,
    sampleReview(base, sha, (review) => {
      Reflect.deleteProperty(review, 'featureDir')
      review.sliceId = 'fix'
      edit(review)
    }),
  )
  if (!recorded.ok) throw new Error(recorded.problems.join('\n'))
  return recorded.value
}

/** Records a clean visual review of pull request 7 from `base` to `sha`. */
export const recordCleanVisual = (dir, base, sha, edit = () => undefined) => {
  const review = {
    baseSha: base,
    captures: [
      {
        conditions: ['default'],
        reason: 'The pull request changes the button styles.',
        story: 'components-button--primary',
        viewports: ['desktop'],
      },
    ],
    closed: [],
    escalations: [],
    findings: [],
    page: 'https://claude.ai/artifact/screens',
    pullRequest: 7,
    reviewedSha: sha,
    round: 1,
    schemaVersion: 1,
    visualReviewId: '9a8b7c6d-5e4f-4a3b-8c2d-1e0f9a8b7c6d',
  }
  edit(review)
  const recorded = recordVisualReview(
    dir,
    defaultVisualNotesRef,
    JSON.stringify(review),
  )
  if (!recorded.ok) throw new Error(recorded.problems.join('\n'))
  return recorded.value
}
