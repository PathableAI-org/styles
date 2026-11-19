// Ported from pathableai-org/pre-ets scripts/note-sync.ts @ f2ee390 (types stripped only).
/**
 * Moves note entries between clones through pull request comments. Each session keeps its own clone, so a
 * verification report or code review recorded in one clone reaches the others only through GitHub: recording also
 * posts the entry as a marked comment on the pull request, and sync imports marked comments back into the local notes
 * the gate reads. See docs/engineering/code-review.md#storage.
 *
 * Trust: sync imports only comments by the account `gh` is authenticated as, because every session posts as the
 * person who runs it. That is as strong as notes anyone with the clone can write, not stronger: any session or tool
 * holding that login, and a repository maintainer editing the comment, can change what is imported.
 */

/** @typedef {import('./schema-checks.mjs').Validated} Validated */

import {
  branchesAt,
  currentBranch,
  fetchCommit,
  isCommit,
} from './git-access.mjs'
import {
  authenticatedLogin,
  issueComments,
  openPullForBranch,
  postIssueComment,
  pullRequest,
} from './github-access.mjs'
/** @typedef {import('./github-access.mjs').PullRequest} PullRequest */
/** @typedef {import('./github-access.mjs').RestAccess} RestAccess */
import { formatComment, parseComment } from './note-sync/comment.mjs'
/** @typedef {import('./note-sync/comment.mjs').ChannelName} ChannelName */
import {
  renderReport,
  renderReview,
  renderVisualReview,
} from './note-sync/render.mjs'
/** @typedef {import('./note-sync/render.mjs').Earlier} Earlier */
/** @typedef {import('./note-sync/render.mjs').RenderContext} RenderContext */
import {
  defaultNotesRef,
  importReview,
  latestReview,
  validateReview,
} from './review-findings.mjs'
/** @typedef {import('./review-findings.mjs').Review} Review */
import { importReport, reportAt, validateReport } from './verification.mjs'
/** @typedef {import('./verification.mjs').VerificationReport} VerificationReport */
import {
  defaultVisualNotesRef,
  importVisualReview,
  latestVisualReview,
  validateVisualReview,
} from './visual-review.mjs'
/** @typedef {import('./visual-review.mjs').VisualReview} VisualReview */

export { channelNames } from './note-sync/comment.mjs'
/** @typedef {import('./note-sync/comment.mjs').ChannelName} ChannelName */

/**
 * The review and visual review notes refs, which trials may change; the visual ref defaults to refs/notes/visual.
 * Verification reports always use refs/notes/verification.
 * @typedef {object} NoteRefs
 * @property {string} review
 * @property {string | undefined} [visual]
 */

/**
 * @template T
 * @typedef {object} Channel
 * @property {(entry: T) => string} id
 * @property {(cwd: string, refs: NoteRefs, json: string) => Validated<{ readonly written: boolean }>} import
 * @property {(cwd: string, refs: NoteRefs, revision: string) => Validated<T>} latest
 * @property {ChannelName} name
 * @property {(entry: T, context: RenderContext<T>) => string} render The entry as markdown for people, given the repository's web URL and the entries already on the pull request.
 * @property {(entry: T) => string} sha
 * @property {(value: unknown) => Validated<T>} validate
 */

const fail = (...problems) => ({
  ok: false,
  problems,
})

/** A `--pr` option: absent, or a pull request number. */
const pullRequestOption = (value) => {
  if (value === undefined) return { ok: true, value: undefined }
  return /^\d+$/.test(value)
    ? { ok: true, value: Number(value) }
    : fail(`${value} is not a pull request number`)
}

const verification = {
  id: (report) => report.runId,
  import: (cwd, _refs, json) => importReport(cwd, json),
  latest: (cwd, _refs, revision) => {
    const report = reportAt(cwd, revision)
    if (!report.ok) return report
    return report.value === undefined
      ? fail(`no verification report on ${revision}`)
      : { ok: true, value: report.value }
  },
  name: 'verification',
  render: renderReport,
  sha: (report) => report.verifiedSha,
  validate: validateReport,
}

const review = {
  id: (entry) => entry.reviewId,
  import: (cwd, refs, json) => importReview(cwd, refs.review, json),
  latest: (cwd, refs, revision) => latestReview(cwd, refs.review, revision),
  name: 'review',
  render: renderReview,
  sha: (entry) => entry.reviewedSha,
  validate: validateReview,
}

/** The visual review notes ref of `refs`, refs/notes/visual unless a trial names another. */
const visualRef = (refs) => refs?.visual ?? defaultVisualNotesRef

const visual = {
  id: (entry) => entry.visualReviewId,
  import: (cwd, refs, json) => importVisualReview(cwd, visualRef(refs), json),
  latest: (cwd, refs, revision) =>
    latestVisualReview(cwd, visualRef(refs), revision),
  name: 'visual',
  render: renderVisualReview,
  sha: (entry) => entry.reviewedSha,
  validate: validateVisualReview,
}

/** Every channel by its comment marker kind. */
const channels = { review, verification, visual }

/** The open pull request whose head branch has `sha` at its tip, or pull request `pr` when the caller names one. */
const pullForSha = (cwd, rest, sha, pr) => {
  if (pr !== undefined) return pullRequest(rest, pr)
  const branches = branchesAt(cwd, sha)
  if (branches.length === 0)
    return fail(
      `no local or fetched branch has ${sha} at its tip; pass --pr <number>`,
    )
  const pulls = new Map()
  for (const branch of branches) {
    const pull = openPullForBranch(rest, branch)
    if (!pull.ok) return pull
    if (pull.value !== undefined) pulls.set(pull.value.number, pull.value)
  }
  const found = [...pulls.values()]
  if (found.length === 1 && found[0] !== undefined)
    return { ok: true, value: found[0] }
  return found.length === 0
    ? fail(
        `no open pull request has ${branches.join(', ')} as its head; pass --pr <number>`,
      )
    : fail(
        `open pull requests ${found.map((pull) => `#${String(pull.number)}`).join(', ')} all have ${sha}; pass --pr`,
      )
}

/**
 * @template T
 * @typedef {object} PostedEntries
 * @property {readonly Earlier<T>[]} entries Valid entries whose marker matches them, oldest first, with the comments that carry them.
 * @property {ReadonlySet<string>} ids The marker ID of every comment of this kind, valid or not.
 */

/** The entries of `channel`'s kind already posted on the pull request by `login`. */
const postedEntries = (channel, rest, pr, login) => {
  const comments = issueComments(rest, pr)
  if (!comments.ok) return comments
  const marked = comments.value.flatMap((comment) => {
    const parsed =
      comment.author === login ? parseComment(comment.body) : undefined
    return parsed?.ok === true && parsed.value.kind === channel.name
      ? [{ ...parsed.value, url: comment.url }]
      : []
  })
  const entries = marked.flatMap((comment) => {
    const entry = channel.validate(comment.entry)
    return entry.ok && channel.id(entry.value) === comment.id
      ? [{ entry: entry.value, url: comment.url }]
      : []
  })
  return {
    ok: true,
    value: { entries, ids: new Set(marked.map((comment) => comment.id)) },
  }
}

/**
 * @typedef {object} Published
 * @property {boolean} posted False when the pull request already had a comment for this entry, so nothing was posted.
 * @property {number} pr
 * @property {string | undefined} url
 */

const publish = (channel, target, entry) => {
  const { cwd, rest } = target
  const pull = pullForSha(cwd, rest, channel.sha(entry), target.pr)
  if (!pull.ok) return pull
  const pr = pull.value.number
  const login = authenticatedLogin(rest)
  if (!login.ok) return login
  const posted = postedEntries(channel, rest, pr, login.value)
  if (!posted.ok) return posted
  if (posted.value.ids.has(channel.id(entry)))
    return { ok: true, value: { posted: false, pr, url: undefined } }
  const marker = {
    id: channel.id(entry),
    kind: channel.name,
    sha: channel.sha(entry),
  }
  const rendered = channel.render(entry, {
    earlier: posted.value.entries,
    repository: pull.value.repositoryUrl,
  })
  const url = postIssueComment(rest, pr, formatComment(marker, rendered, entry))
  return url.ok
    ? { ok: true, value: { posted: true, pr, url: url.value } }
    : url
}

/** Posts a recorded report on the pull request for its verified SHA, unless that pull request already has it. */
export const publishReport = (target, report) =>
  publish(verification, target, report)

/** Posts a recorded review on the pull request for its reviewed SHA, unless that pull request already has it. */
export const publishReview = (target, entry) => publish(review, target, entry)

/** Posts a recorded visual review on the pull request for its reviewed SHA, unless that pull request already has it. */
export const publishVisualReview = (target, entry) =>
  publish(visual, target, entry)

/** Posts the latest local entry of `kind` on `revision`, for a record whose posting failed. */
export const publishLatest = (target, kind, revision) => {
  const pr = pullRequestOption(target.pr)
  if (!pr.ok) return pr
  const options = { ...target, pr: pr.value }
  const channel = channels[kind]
  const latest = channel.latest(target.cwd, target.refs, revision)
  return latest.ok ? publish(channel, options, latest.value) : latest
}

/** Publishes an entry a record command just recorded and writes the outcome. Returns the command's exit code. */
const publishAndWrite = (channel, target, entry) => {
  const pr = pullRequestOption(target.pr)
  const published = pr.ok
    ? publish(channel, { ...target, pr: pr.value }, entry)
    : pr
  const outcome = describePublish(channel.name, channel.sha(entry), published)
  ;(outcome.ok ? process.stdout : process.stderr).write(outcome.message)
  return outcome.ok ? 0 : 1
}

/**
 * Publishes a report `verify:record` just recorded, on the pull request `--pr` names or else the one for its SHA, and
 * writes the outcome. Returns the command's exit code: 1 when the report stays local only.
 */
export const publishRecordedReport = (target, report) =>
  publishAndWrite(verification, target, report)

/**
 * Publishes a review `review:record` just recorded, like `publishRecordedReport`. A review recorded in a trial ref is
 * not posted, because sync would import it into every other clone's real review ref.
 */
export const publishRecordedReview = (target, entry) => {
  if (target.ref === defaultNotesRef)
    return publishAndWrite(review, target, entry)
  process.stdout.write(
    `Not published: ${target.ref} is a trial ref, and only ${defaultNotesRef} entries are posted.\n`,
  )
  return 0
}

/**
 * Publishes a visual review `visual:record` just recorded, like `publishRecordedReview`: one recorded in a trial ref
 * is not posted.
 */
export const publishRecordedVisualReview = (target, entry) => {
  if (target.ref === defaultVisualNotesRef)
    return publishAndWrite(visual, target, entry)
  process.stdout.write(
    `Not published: ${target.ref} is a trial ref, and only ${defaultVisualNotesRef} entries are posted.\n`,
  )
  return 0
}

/**
 * What a record command prints about publishing its entry. A failure keeps the local record and says how to post it
 * once the cause is fixed, so a missing pull request or network is never silent.
 */
export const describePublish = (kind, sha, published) => {
  if (!published.ok) {
    return {
      message: `Recorded locally, but NOT published to a pull request, so other clones cannot see it:\n${published.problems
        .map((problem) => `  - ${problem}`)
        .join(
          '\n',
        )}\nOnce fixed, post it with: pnpm notes:publish ${kind} ${sha} [--pr <number>]\n`,
      ok: false,
    }
  }
  const { posted, pr, url } = published.value
  return {
    message: posted
      ? `Published on pull request #${String(pr)}: ${url ?? ''}\n`
      : `Pull request #${String(pr)} already has this ${kind} entry; nothing posted.\n`,
    ok: true,
  }
}

/**
 * @typedef {object} SyncResult
 * @property {number} imported
 * @property {number} present
 * @property {readonly string[]} rejected One reason per marked comment that was not imported because it is damaged, foreign, or inconsistent.
 * @property {readonly string[]} unavailable One line per valid comment whose commit this clone lacks and could not fetch, such as a slice tip a restack replaced that GitHub no longer serves. Not imported, and not an error: later entries carry the evidence.
 */

/**
 * @typedef {"imported" | "present" | { readonly rejected: string } | { readonly unavailable: string }} CommentOutcome
 */

const importComment = (channel, target, comment) => {
  const entry = channel.validate(comment.entry)
  if (!entry.ok) return entry
  if (
    channel.sha(entry.value) !== comment.sha ||
    channel.id(entry.value) !== comment.id
  ) {
    return fail("its marker does not match the entry's SHA and ID")
  }
  // A restack leaves the annotated commit off every branch; GitHub still serves it by SHA until it is collected.
  if (
    !isCommit(target.cwd, comment.sha) &&
    !fetchCommit(target.cwd, comment.sha)
  ) {
    return { ok: true, value: 'unavailable' }
  }
  const imported = channel.import(
    target.cwd,
    target.refs,
    JSON.stringify(entry.value),
  )
  if (!imported.ok) return imported
  return { ok: true, value: imported.value.written ? 'imported' : 'present' }
}

const syncComment = (target, comment) => {
  const parsed = parseComment(comment.body)
  if (parsed === undefined) return undefined
  const label = `comment ${String(comment.id)} by ${comment.author}`
  if (comment.author !== target.login) {
    return {
      rejected: `${label}: only comments by ${target.login}, the authenticated account, are imported`,
    }
  }
  if (!parsed.ok) return { rejected: `${label}: ${parsed.problems.join('; ')}` }
  const outcome = importComment(
    channels[parsed.value.kind],
    target,
    parsed.value,
  )
  if (!outcome.ok)
    return { rejected: `${label}: ${outcome.problems.join('; ')}` }
  return outcome.value === 'unavailable'
    ? {
        unavailable: `${label}: ${parsed.value.sha} is not in this clone and could not be fetched from origin`,
      }
    : outcome.value
}

/**
 * Imports every valid note comment on pull request `pr` by the authenticated account into the local notes, oldest
 * first, so entries keep the order they were recorded in. An entry whose ID is already on its SHA is left alone, so
 * syncing again changes nothing. A marked comment that fails validation is rejected with its reason and never written.
 */
export const syncPullNotes = (target, pr) => {
  const login = authenticatedLogin(target.rest)
  if (!login.ok) return login
  const comments = issueComments(target.rest, pr)
  if (!comments.ok) return comments
  const outcomes = comments.value.flatMap((comment) => {
    const outcome = syncComment({ ...target, login: login.value }, comment)
    return outcome === undefined ? [] : [outcome]
  })
  return {
    ok: true,
    value: {
      imported: outcomes.filter((outcome) => outcome === 'imported').length,
      present: outcomes.filter((outcome) => outcome === 'present').length,
      rejected: outcomes.flatMap((outcome) =>
        typeof outcome !== 'string' && 'rejected' in outcome
          ? [outcome.rejected]
          : [],
      ),
      unavailable: outcomes.flatMap((outcome) =>
        typeof outcome !== 'string' && 'unavailable' in outcome
          ? [outcome.unavailable]
          : [],
      ),
    },
  }
}

/** One line on a sync's result, then one line per rejected or unavailable comment. */
export const describeSync = (pr, result) =>
  [
    `Notes: synced pull request #${String(pr)}: ${String(result.imported)} imported, ${String(
      result.present,
    )} already present, ${String(result.rejected.length)} rejected${
      result.unavailable.length > 0
        ? `, ${String(result.unavailable.length)} unavailable`
        : ''
    }.`,
    ...result.rejected.map((reason) => `  - rejected ${reason}`),
    ...result.unavailable.map((reason) => `  - unavailable ${reason}`),
  ].join('\n') + '\n'

const localOnly = (reason) => `Notes: ${reason}; reading local notes only.\n`

/**
 * @typedef {object} ReadingContext
 * @property {string} notice What happened, for stderr: the sync result, or why the local notes are read as they are.
 * @property {PullRequest | undefined} pull The checked-out branch's open pull request, when GitHub could be reached and one exists.
 */

/**
 * Syncs the checked-out branch's pull request into the local notes before they are read. Without a branch, a pull
 * request, or GitHub, the local notes are read as they are and the notice says why.
 */
export const syncCheckedOutBranch = (target) => {
  const found = checkedOutPull(target)
  if (!found.ok)
    return { notice: localOnly(found.problems.join('; ')), pull: undefined }
  const { branch, pull } = found.value
  return pull === undefined
    ? {
        notice: localOnly(`${branch} has no open pull request`),
        pull: undefined,
      }
    : { notice: syncNotice(target, pull.number), pull }
}

/** The checked-out branch and its open pull request, if any. A detached HEAD or an unreachable GitHub is a problem. */
const checkedOutPull = (target) => {
  const branch = currentBranch(target.cwd)
  if (branch === undefined)
    return fail('HEAD is detached, so there is no pull request')
  const pull = openPullForBranch(target.rest, branch)
  return pull.ok
    ? { ok: true, value: { branch, pull: pull.value } }
    : fail(`GitHub is unreachable (${pull.problems.join('; ')})`)
}

/** The pull request `notes:sync` reads: the one named, or else the checked-out branch's open one. */
export const pullRequestToSync = (target, given) => {
  const named = pullRequestOption(given)
  if (!named.ok || named.value !== undefined)
    return named.ok ? { ok: true, value: named.value ?? 0 } : named
  const found = checkedOutPull(target)
  if (!found.ok) return found
  const { branch, pull } = found.value
  return pull === undefined
    ? fail(`${branch} has no open pull request; name one`)
    : { ok: true, value: pull.number }
}

/** Syncs pull request `pr` and describes the result, or why the local notes are read as they are. */
export const syncNotice = (target, pr) => {
  const synced = syncPullNotes(target, pr)
  return synced.ok
    ? describeSync(pr, synced.value)
    : localOnly(
        `pull request #${String(pr)} could not be synced (${synced.problems.join('; ')})`,
      )
}
