import assert from 'node:assert/strict'
import { afterEach, beforeEach, describe, it } from 'node:test'

import {
  hookOutput,
  mergeAttempt,
  mergeDecision,
  runMergeHook,
} from '../merge-hook.mjs'
import { gateGitHub, gateState, recordFixReview } from './merge-support.mjs'
import { fakeGitHub, sampleRepo } from './support.mjs'

const branch = 'fix/button-ring'

let repo
let base
let head
let state

beforeEach(() => {
  repo = sampleRepo()
  base = repo.git('rev-parse', 'main')
  repo.git('checkout', '--quiet', '-b', branch, 'main')
  head = repo.commit('fix: ring', { 'src/app.ts': 'export const app = 2\n' })
  state = gateState(branch, head, ['src/app.ts'])
})

afterEach(() => {
  repo.remove()
})

const bash = (command) => ({
  cwd: repo.dir,
  tool_input: { command },
  tool_name: 'Bash',
})

const mcpMerge = (input = {}) => ({
  cwd: repo.dir,
  tool_input: {
    merge_method: 'squash',
    owner: 'acme',
    pullNumber: 7,
    repo: 'app',
    ...input,
  },
  tool_name: 'mcp__github__merge_pull_request',
})

void describe('recognizing a merge attempt', () => {
  const target = (command) => {
    const attempt = mergeAttempt('Bash', { command })
    return attempt?.kind === 'gate' ? attempt.target : attempt
  }

  void it('reads gh pr merge targets and the REST merge route', () => {
    assert.deepEqual(target('gh pr merge'), { kind: 'checked-out' })
    assert.deepEqual(target('gh pr merge 7 --squash'), {
      kind: 'pull',
      number: 7,
    })
    assert.deepEqual(
      target(
        'gh pr merge -R acme/app --subject "fix: x y" https://github.com/acme/app/pull/7',
      ),
      { kind: 'pull', number: 7 },
    )
    assert.deepEqual(target('git fetch && gh pr merge fix/button-ring -s'), {
      kind: 'branch',
      name: 'fix/button-ring',
    })
    assert.deepEqual(
      target(
        'gh api -X PUT repos/acme/app/pulls/7/merge -f merge_method=squash',
      ),
      { kind: 'pull', number: 7 },
    )
    assert.deepEqual(
      target('curl -X PUT https://api.github.com/repos/acme/app/pulls/7/merge'),
      { kind: 'pull', number: 7 },
    )
    assert.equal(target('gh pr view 7 && git merge main'), undefined)
    assert.equal(target('gh api repos/acme/app/pulls/7/files'), undefined)
    assert.equal(target('gh pr merge 7 --disable-auto'), undefined)
  })

  void it('refuses auto-merge, a non-squash MCP merge, and an MCP merge with no number', () => {
    const refused = (name, input) =>
      mergeAttempt(name, input)?.kind === 'refuse'
    assert.ok(refused('Bash', { command: 'gh pr merge 7 --auto --squash' }))
    assert.ok(refused('mcp__github__enable_pr_auto_merge', { pullNumber: 7 }))
    assert.ok(
      refused('mcp__github__merge_pull_request', {
        merge_method: 'merge',
        pullNumber: 7,
      }),
    )
    assert.ok(
      refused('mcp__github__merge_pull_request', { merge_method: 'squash' }),
    )
    assert.deepEqual(
      mergeAttempt('mcp__github__merge_pull_request', { pullNumber: 7 }),
      {
        kind: 'gate',
        target: { kind: 'pull', number: 7, repository: undefined },
        via: 'mcp',
      },
    )
  })

  void it('ignores every other tool', () => {
    assert.equal(mergeAttempt('Read', { file_path: '/x' }), undefined)
    assert.equal(
      mergeAttempt('mcp__github__update_pull_request', {
        draft: false,
        pullNumber: 7,
      }),
      undefined,
    )
  })
})

void describe("the merge hook's decision", () => {
  void it('approves the MCP squash merge when the gate passes', () => {
    recordFixReview(repo.dir, base, head)
    assert.deepEqual(mergeDecision(mcpMerge(), gateGitHub(state)), {
      kind: 'approve',
      reason: 'The merge gate passes for pull request #7.',
    })
  })

  void it('blocks the MCP merge with every problem when the pull request is eligible but not ready', () => {
    state.pull.draft = true
    const decision = mergeDecision(mcpMerge(), gateGitHub(state))
    assert.equal(decision.kind, 'block')
    assert.match(
      decision.kind === 'block' ? decision.reason : '',
      /merge gate fails for pull request #7\.\n {2}- the pull request is a draft\n {2}- code review: no review/,
    )
  })

  void it('asks the person when the pull request is not eligible, for MCP and shell merges alike', () => {
    state.pull.labels = [{ name: 'risk:high' }]
    for (const input of [mcpMerge(), bash('gh pr merge 7 --squash')]) {
      const decision = mergeDecision(input, gateGitHub(state))
      assert.equal(decision.kind, 'ask')
      assert.match(
        decision.kind === 'ask' ? decision.reason : '',
        /not eligible for agent merge[\s\S]*risk:high/,
      )
    }
  })

  void it('blocks an eligible shell merge in favour of the MCP tool, with the problems when the gate fails', () => {
    const failing = mergeDecision(
      bash('gh pr merge 7 --squash'),
      gateGitHub(state),
    )
    assert.equal(failing.kind, 'block')
    assert.match(
      failing.kind === 'block' ? failing.reason : '',
      /merge_pull_request and merge_method squash[\s\S]*also fails for #7[\s\S]*code review/,
    )
    recordFixReview(repo.dir, base, head)
    const passing = mergeDecision(
      bash('gh api -X PUT repos/{owner}/{repo}/pulls/7/merge'),
      gateGitHub(state),
    )
    assert.equal(passing.kind, 'block')
    assert.doesNotMatch(
      passing.kind === 'block' ? passing.reason : '',
      /also fails/,
    )
  })

  void it("finds the checked-out branch's pull request, and asks when there is none", () => {
    recordFixReview(repo.dir, base, head)
    const found = mergeDecision(bash('gh pr merge --squash'), gateGitHub(state))
    assert.equal(found.kind, 'block')
    const none = mergeDecision(bash('gh pr merge --squash'), fakeGitHub())
    assert.deepEqual(none, {
      kind: 'ask',
      reason: `The merge gate cannot tell which pull request this merges (${branch} has no open pull request), so a person must decide.`,
    })
  })

  void it('blocks auto-merge and non-squash merges without reading GitHub', () => {
    const github = fakeGitHub()
    for (const input of [
      bash('gh pr merge 7 --auto'),
      mcpMerge({ merge_method: 'rebase' }),
      {
        cwd: repo.dir,
        tool_input: { owner: 'acme', pullNumber: 7, repo: 'app' },
        tool_name: 'mcp__github__enable_pr_auto_merge',
      },
    ]) {
      assert.equal(mergeDecision(input, github).kind, 'block')
    }
    assert.deepEqual(github.requests, [])
  })

  void it('fails closed when GitHub cannot be read', () => {
    state.offline = true
    const decision = mergeDecision(mcpMerge(), gateGitHub(state))
    assert.equal(decision.kind, 'block')
    assert.match(
      decision.kind === 'block' ? decision.reason : '',
      /cannot read the pull request/,
    )
    const branchLookup = mergeDecision(
      bash('gh pr merge fix/button-ring'),
      fakeGitHub({ offline: true }),
    )
    assert.equal(branchLookup.kind, 'block')
  })

  void it('maps ask to a PreToolUse ask decision, and other decisions as the ready hook does', () => {
    assert.deepEqual(
      JSON.parse(hookOutput({ kind: 'ask', reason: 'Why.' }).stdout),
      {
        hookSpecificOutput: {
          hookEventName: 'PreToolUse',
          permissionDecision: 'ask',
          permissionDecisionReason: 'Why.',
        },
      },
    )
    assert.equal(hookOutput({ kind: 'ask', reason: 'Why.' }).exitCode, 0)
    assert.deepEqual(hookOutput({ kind: 'block', reason: 'No.\n' }), {
      exitCode: 2,
      stderr: 'No.\n',
      stdout: '',
    })
    assert.equal(
      JSON.parse(hookOutput({ kind: 'approve', reason: 'Yes.' }).stdout)
        .hookSpecificOutput.permissionDecision,
      'allow',
    )
  })

  void it('passes other tool calls through the hook entry without calling GitHub', () => {
    const github = fakeGitHub()
    for (const input of [
      bash('git status'),
      { cwd: repo.dir, tool_input: { file_path: '/x' }, tool_name: 'Read' },
    ]) {
      assert.deepEqual(runMergeHook(input, github), {
        exitCode: 0,
        stderr: '',
        stdout: '',
      })
    }
    assert.deepEqual(github.requests, [])
    process.exitCode = 0
  })
})
