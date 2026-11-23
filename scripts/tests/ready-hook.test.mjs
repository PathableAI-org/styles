// Ported from pathableai-org/pre-ets tests/tooling/ready-hook.test.ts @ f2ee390 (adapted: tests the runReadyHook entry in place of spawning scripts/pr-ready-hook.ts; fixtures name a design-system fix branch).
import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'

import { publishReport, publishReview } from '../note-sync.mjs'
import {
  hookOutput,
  readyAttempt,
  readyDecision,
  runReadyHook,
} from '../ready-hook.mjs'
/** @typedef {import('../ready-hook.mjs').Decision} Decision */
import { defaultNotesRef, recordReview } from '../review-findings.mjs'
import { recordReport } from '../verification.mjs'
import {
  fakeGitHub,
  restPull,
  sampleRepo,
  sampleReport,
  sampleReview,
} from './support.mjs'
/** @typedef {import('./support.mjs').SampleRepo} SampleRepo */

const branch = 'work/button-focus'

let repo
let verified

beforeEach(() => {
  repo = sampleRepo()
  verified = repo.commit('feat: A1', { 'src/app.ts': 'export const app = 2\n' })
})

afterEach(() => {
  repo.remove()
})

/** Records a passing report and review in `dir`, which defaults to the repository under test. */
const recordPassing = (dir = repo.dir) => {
  assert.ok(recordReport(dir, sampleReport(verified)).ok)
  assert.ok(
    recordReview(
      dir,
      defaultNotesRef,
      sampleReview(repo.git('rev-parse', 'main'), verified),
    ).ok,
  )
}

const bash = (command) => ({
  cwd: repo.dir,
  tool_input: { command },
  tool_name: 'Bash',
})
const mcpUpdate = (input) => ({
  cwd: repo.dir,
  tool_input: { owner: 'acme', pullNumber: 7, repo: 'app', ...input },
  tool_name: 'mcp__github__update_pull_request',
})

const highPull = (labels = ['risk:high']) =>
  restPull(7, { ref: branch, sha: verified }, labels)

const kind = (decision) => decision.kind

void describe('recognizing an attempt to mark a pull request ready', () => {
  void it('reads gh pr ready with no target, a number, a URL, or a branch, and ignores --undo', () => {
    const target = (command) => {
      const attempt = readyAttempt('Bash', { command })
      return attempt?.kind === 'gate' ? attempt.target : attempt
    }
    assert.deepEqual(target('pnpm check:changes && gh pr ready'), {
      kind: 'checked-out',
    })
    assert.deepEqual(target('gh pr ready 7'), { kind: 'pull', number: 7 })
    assert.deepEqual(
      target('gh pr ready -R acme/app https://github.com/acme/app/pull/7'),
      { kind: 'pull', number: 7 },
    )
    assert.deepEqual(target('gh pr ready 900-sample-impl-a2'), {
      kind: 'branch',
      name: '900-sample-impl-a2',
    })
    assert.equal(target('gh pr ready --undo'), undefined)
    assert.equal(target('gh pr view 7 && git status'), undefined)
  })

  void it('reads gh api clearing draft or posting to the ready route, and the MCP update with draft false', () => {
    const shellGate = {
      approveHere: false,
      kind: 'gate',
      target: { kind: 'pull', number: 7 },
    }
    assert.deepEqual(
      readyAttempt('Bash', {
        command: 'gh api -X PATCH repos/acme/app/pulls/7 -F draft=false',
      }),
      shellGate,
    )
    assert.deepEqual(
      readyAttempt('Bash', {
        command: `gh api -X PATCH repos/acme/app/pulls/7 --input - <<< '{"draft": false}'`,
      }),
      shellGate,
    )
    assert.deepEqual(
      readyAttempt('Bash', {
        command: 'gh api -X POST repos/acme/app/pulls/7/ccr/ready_for_review',
      }),
      shellGate,
    )
    assert.deepEqual(
      readyAttempt('Bash', {
        command:
          'curl -X POST https://api.github.com/repos/acme/app/pulls/7/ccr/ready_for_review',
      }),
      shellGate,
    )
    assert.equal(
      readyAttempt('Bash', {
        command: 'gh api -X POST repos/acme/app/pulls/7/ccr/convert_to_draft',
      }),
      undefined,
    )
    assert.equal(
      readyAttempt('Bash', {
        command: "git commit -m 'docs: name pulls/7/ccr/ready_for_review'",
      }),
      undefined,
    )
    assert.deepEqual(
      readyAttempt('mcp__github__update_pull_request', {
        draft: false,
        owner: 'acme',
        pullNumber: 7,
        repo: 'app',
      }),
      {
        approveHere: true,
        kind: 'gate',
        target: { kind: 'pull', number: 7, repository: 'acme/app' },
      },
    )
    assert.equal(
      readyAttempt('mcp__github__update_pull_request', {
        draft: true,
        pullNumber: 7,
      }),
      undefined,
    )
    assert.equal(
      readyAttempt('mcp__github__update_pull_request', {
        body: 'text',
        pullNumber: 7,
      }),
      undefined,
    )
  })

  void it('refuses ways the gate cannot judge: stack submit --open and the GraphQL mutation', () => {
    const refused = (name, input) =>
      readyAttempt(name, input)?.kind === 'refuse'
    assert.ok(refused('Bash', { command: 'gh stack submit --auto --open' }))
    assert.ok(
      refused('Bash', {
        command:
          "gh api graphql -f query='mutation { markPullRequestReadyForReview(input: {}) { clientMutationId } }'",
      }),
    )
    assert.equal(
      readyAttempt('mcp__github__create_pull_request', {
        base: 'main',
        head: branch,
        title: 'A1',
      }),
      undefined,
    )
    assert.equal(
      readyAttempt('mcp__github__create_pull_request', {
        draft: true,
        head: branch,
      }),
      undefined,
    )
    assert.equal(
      readyAttempt('mcp__github__create_pull_request', { head: 'claude/docs' }),
      undefined,
    )
    assert.equal(
      readyAttempt('Bash', { command: 'gh stack submit --auto' }),
      undefined,
    )
  })
})

void describe("the ready hook's decision", () => {
  void it('blocks a High pull request whose gate fails, and allows it once the gate passes', () => {
    const github = fakeGitHub({ pulls: [highPull()] })
    const blocked = readyDecision(bash('gh pr ready'), github)
    assert.equal(kind(blocked), 'block')
    assert.match(
      JSON.stringify(blocked),
      /gate fails[\s\S]*no verification report/,
    )
    recordPassing()
    assert.deepEqual(readyDecision(bash('gh pr ready'), github), {
      kind: 'allow',
    })
  })

  void it('gates on notes another clone recorded, after importing them from the pull request', () => {
    const github = fakeGitHub({ pulls: [highPull()] })
    const other = sampleRepo()
    try {
      other.git(
        'fetch',
        '--quiet',
        repo.dir,
        `${branch}:refs/remotes/origin/${branch}`,
      )
      const report = recordReport(other.dir, sampleReport(verified))
      const review = recordReview(
        other.dir,
        defaultNotesRef,
        sampleReview(repo.git('rev-parse', 'main'), verified),
      )
      assert.ok(report.ok && review.ok)
      assert.ok(
        publishReport({ cwd: other.dir, rest: github }, report.value).ok,
      )
      assert.ok(
        publishReview({ cwd: other.dir, rest: github }, review.value).ok,
      )
    } finally {
      other.remove()
    }
    assert.equal(repo.git('notes', `--ref=${defaultNotesRef}`, 'list'), '')
    assert.deepEqual(readyDecision(bash('gh pr ready'), github), {
      kind: 'allow',
    })
    assert.notEqual(repo.git('notes', `--ref=${defaultNotesRef}`, 'list'), '')
  })

  void it('fails closed when GitHub cannot provide the checked-out pull request labels', () => {
    const offline = fakeGitHub({ offline: true })
    assert.equal(kind(readyDecision(bash('gh pr ready'), offline)), 'block')
    recordPassing()
    assert.equal(kind(readyDecision(bash('gh pr ready'), offline)), 'block')
  })

  void it('lets a branch that needs no gate through, but refuses when it cannot tell', () => {
    repo.git('checkout', '--quiet', '-b', 'claude/tooling')
    const light = fakeGitHub({
      pulls: [
        restPull(8, { ref: 'claude/tooling', sha: verified }, ['risk:light']),
      ],
    })
    assert.deepEqual(readyDecision(bash('gh pr ready'), light), {
      kind: 'allow',
    })
    const unknown = readyDecision(
      bash('gh pr ready'),
      fakeGitHub({ offline: true }),
    )
    assert.equal(kind(unknown), 'block')
    assert.match(
      JSON.stringify(unknown),
      /cannot tell whether claude\/tooling needs the gate/,
    )
  })

  void it("gates the REST ready route at the pull request's head, and leaves the prompt to the settings", () => {
    const github = fakeGitHub({ pulls: [highPull()] })
    const route = bash(
      'gh api -X POST repos/acme/app/pulls/7/ccr/ready_for_review',
    )
    assert.equal(kind(readyDecision(route, github)), 'block')
    recordPassing()
    assert.deepEqual(readyDecision(route, github), { kind: 'allow' })
  })

  void it("gates the MCP update with draft false at the pull request's head, and approves it when it passes", () => {
    const github = fakeGitHub({ pulls: [highPull()] })
    repo.git('checkout', '--quiet', 'main')
    assert.equal(
      kind(readyDecision(mcpUpdate({ draft: false }), github)),
      'block',
    )
    recordPassing()
    assert.deepEqual(readyDecision(mcpUpdate({ draft: false }), github), {
      kind: 'approve',
      reason: 'The verification and code review gate passes or does not apply.',
    })
    assert.deepEqual(readyDecision(mcpUpdate({ title: 'A1' }), github), {
      kind: 'allow',
    })
  })

  void it("gates a High fix's pull request by its risk:high label, and approves any other pull request", () => {
    const fix = fakeGitHub({
      pulls: [
        restPull(7, { ref: 'fix-button-focus', sha: verified }, ['risk:high']),
      ],
    })
    assert.match(
      JSON.stringify(readyDecision(mcpUpdate({ draft: false }), fix)),
      /no verification report/,
    )
    const light = fakeGitHub({
      pulls: [
        restPull(7, { ref: 'claude/docs', sha: verified }, ['risk:light']),
      ],
    })
    assert.equal(
      kind(readyDecision(mcpUpdate({ draft: false }), light)),
      'approve',
    )
  })

  void it('gates every High pull request regardless of branch name', () => {
    const decide = (ref, sha = verified) =>
      readyDecision(
        mcpUpdate({ draft: false }),
        fakeGitHub({ pulls: [restPull(7, { ref, sha }, ['risk:high'])] }),
      )
    for (const ref of [
      '900-sample',
      '900-sample-plan',
      'fix-button-focus',
      '901-button-focus',
      '902-later',
      branch,
    ]) {
      assert.match(JSON.stringify(decide(ref)), /no verification report/, ref)
    }
  })

  void it("blocks when the pull request's head is not in this clone or the pull request cannot be read", () => {
    const missing = 'f'.repeat(40)
    const ahead = fakeGitHub({
      pulls: [restPull(7, { ref: branch, sha: missing }, ['risk:high'])],
    })
    assert.match(
      JSON.stringify(readyDecision(mcpUpdate({ draft: false }), ahead)),
      /is not in this clone; fetch the branch first/,
    )
    assert.match(
      JSON.stringify(readyDecision(mcpUpdate({ draft: false }), fakeGitHub())),
      /cannot read the pull request/,
    )
  })

  void it('maps decisions to the exit code and output Claude Code reads', () => {
    assert.deepEqual(hookOutput({ kind: 'allow' }), {
      exitCode: 0,
      stderr: '',
      stdout: '',
    })
    assert.deepEqual(hookOutput({ kind: 'block', reason: 'No.\n' }), {
      exitCode: 2,
      stderr: 'No.\n',
      stdout: '',
    })
    const approved = hookOutput({ kind: 'approve', reason: 'Gate passes.' })
    assert.deepEqual(JSON.parse(approved.stdout), {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'allow',
        permissionDecisionReason: 'Gate passes.',
      },
    })
  })

  void it('passes other commands through the hook entry without calling GitHub', () => {
    const github = fakeGitHub()
    assert.deepEqual(runReadyHook(bash('git status'), github), {
      exitCode: 0,
      stderr: '',
      stdout: '',
    })
    assert.deepEqual(github.requests, [])
  })
})
