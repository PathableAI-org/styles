/**
 * Decisions for the Claude Code PreToolUse hook that gates merging a pull request, however a session attempts it:
 * the GitHub MCP tool `merge_pull_request`, `gh pr merge`, or a `gh api` or `curl` call to a pull request's `merge`
 * route. The MCP merge is approved when the merge gate passes, blocked with every failing reason when the pull request
 * is eligible for agent merge but not ready, and left to the person when it is not eligible. Shell merges are left to
 * the person when the pull request is not eligible, and otherwise blocked in favour of the MCP tool, so the gate
 * approves exactly one action. Auto-merge is always blocked. Every other tool call passes through without touching
 * git or GitHub. See docs/engineering/git-workflow.md#the-merge-gate.
 */
import { currentBranch } from './git-access.mjs'
import { ghRest, openPullForBranch } from './github-access.mjs'
import { runMergeGate } from './merge-gate.mjs'
import { hookOutput as readyHookOutput } from './ready-hook.mjs'

/**
 * @typedef {{ readonly kind: "allow" } | { readonly kind: "approve"; readonly reason: string } | { readonly kind: "ask"; readonly reason: string } | { readonly kind: "block"; readonly reason: string }} Decision
 */

/**
 * @typedef {{ readonly kind: "branch"; readonly name: string } | { readonly kind: "checked-out" } | { readonly kind: "pull"; readonly number: number; readonly repository?: string | undefined } | { readonly kind: "unknown"; readonly what: string }} MergeTarget
 */

/**
 * @typedef {{ readonly kind: "gate"; readonly target: MergeTarget; readonly via: "mcp" | "shell" } | { readonly kind: "refuse"; readonly reason: string }} MergeAttempt
 */

const field = (value, key) =>
  typeof value === 'object' && value !== null
    ? Reflect.get(value, key)
    : undefined

/** Where a command segment starts: the start of the line or after a shell separator. */
const segmentStart = String.raw`(?:^|[\s;&|(])`

const autoMergeReason =
  "GitHub's auto-merge would merge the pull request later without the merge gate. Run `pnpm merge:gate <pr>` " +
  'and, once it passes, merge with the GitHub MCP tool merge_pull_request and merge_method squash.'

const mcpToolReason =
  'Merge with the GitHub MCP tool merge_pull_request and merge_method squash, so the merge gate approves exactly ' +
  'one action.'

/** `gh pr merge` options that take a value, so their value is not mistaken for the target. */
const valueOptions = [
  '--repo',
  '-R',
  '--subject',
  '-t',
  '--body',
  '-b',
  '--body-file',
  '-F',
  '--match-head-commit',
  '--author-email',
  '-A',
]

/** Shell words of a command fragment, with simple single and double quotes removed. */
const words = (fragment) =>
  [...fragment.matchAll(/"([^"]*)"|'([^']*)'|(\S+)/g)].map(
    (match) => match[1] ?? match[2] ?? match[3] ?? '',
  )

/** The target named by `gh pr merge`'s arguments: a number, a pull request URL, a branch, or the checked-out branch. */
const prMergeTarget = (args) => {
  const positional = args.find(
    (arg, index) =>
      !arg.startsWith('-') && !valueOptions.includes(args[index - 1] ?? ''),
  )
  if (positional === undefined) return { kind: 'checked-out' }
  const number = /^(?:\d+|.*\/pull\/(\d+)\/?)$/.exec(positional)
  if (number !== null)
    return { kind: 'pull', number: Number(number[1] ?? positional) }
  return { kind: 'branch', name: positional }
}

/** A REST call to a pull request's merge route, through `gh api` or another HTTP client. */
const restMergeRoute = new RegExp(
  `${segmentStart}(?:gh\\s+api|curl)\\b.*\\bpulls/(\\d+)/merge\\b`,
)

const bashAttempt = (command) => {
  const merge = new RegExp(
    `${segmentStart}gh\\s+pr\\s+merge\\b([^;&|)]*)`,
  ).exec(command)
  if (merge !== null) {
    const args = words(merge[1] ?? '')
    if (args.includes('--auto'))
      return {
        kind: 'refuse',
        reason: `\`gh pr merge --auto\`: ${autoMergeReason}`,
      }
    if (args.includes('--disable-auto')) return undefined
    return { kind: 'gate', target: prMergeTarget(args), via: 'shell' }
  }
  if (
    new RegExp(`${segmentStart}gh\\s+api\\b`).test(command) &&
    command.includes('enablePullRequestAutoMerge')
  )
    return {
      kind: 'refuse',
      reason: `The GraphQL auto-merge mutation: ${autoMergeReason}`,
    }
  if (
    new RegExp(`${segmentStart}gh\\s+api\\b`).test(command) &&
    command.includes('mergePullRequest')
  ) {
    return {
      kind: 'gate',
      target: {
        kind: 'unknown',
        what: 'a GraphQL merge mutation names no pull request number the gate can read',
      },
      via: 'shell',
    }
  }
  const rest = restMergeRoute.exec(command)
  return rest === null
    ? undefined
    : {
        kind: 'gate',
        target: { kind: 'pull', number: Number(rest[1]) },
        via: 'shell',
      }
}

const mcpMergeAttempt = (input) => {
  const method = field(input, 'merge_method')
  if (method !== undefined && method !== 'squash') {
    return {
      kind: 'refuse',
      reason: `merge_method ${String(method)}: this repository squash-merges. Use merge_method squash.`,
    }
  }
  const number = field(input, 'pullNumber')
  if (typeof number !== 'number')
    return {
      kind: 'refuse',
      reason:
        'merge_pull_request names no pullNumber the merge gate can check.',
    }
  const owner = field(input, 'owner')
  const repo = field(input, 'repo')
  const repository =
    typeof owner === 'string' && typeof repo === 'string'
      ? `${owner}/${repo}`
      : undefined
  return {
    kind: 'gate',
    target: { kind: 'pull', number, repository },
    via: 'mcp',
  }
}

/** The merge attempt a tool call makes, or undefined when it makes none. Reads nothing outside its arguments. */
export const mergeAttempt = (toolName, toolInput) => {
  if (toolName === 'Bash') {
    const command = field(toolInput, 'command')
    return typeof command === 'string' ? bashAttempt(command) : undefined
  }
  if (toolName === 'mcp__github__merge_pull_request')
    return mcpMergeAttempt(toolInput)
  return toolName === 'mcp__github__enable_pr_auto_merge'
    ? { kind: 'refuse', reason: `enable_pr_auto_merge: ${autoMergeReason}` }
    : undefined
}

const bullets = (problems) =>
  problems.map((problem) => `  - ${problem}`).join('\n')

/** The pull request number a target names: a number, or a branch's open pull request, or why it cannot be found. */
const resolveTarget = (cwd, rest, target) => {
  if (target.kind === 'pull')
    return {
      kind: 'pull',
      number: target.number,
      repository: target.repository,
    }
  if (target.kind === 'unknown')
    return { kind: 'unresolved', reason: target.what }
  const name = target.kind === 'branch' ? target.name : currentBranch(cwd)
  if (name === undefined)
    return {
      kind: 'unresolved',
      reason: 'HEAD is detached, so no pull request is checked out',
    }
  const pull = openPullForBranch(rest, name)
  if (!pull.ok)
    return {
      kind: 'unreadable',
      reason: `cannot find the pull request for ${name}: ${pull.problems.join('; ')}`,
    }
  return pull.value === undefined
    ? { kind: 'unresolved', reason: `${name} has no open pull request` }
    : { kind: 'pull', number: pull.value.number, repository: undefined }
}

/** What the hook does with a tool call. */
export const mergeDecision = (input, rest) => {
  const attempt = mergeAttempt(input.tool_name, input.tool_input)
  if (attempt === undefined) return { kind: 'allow' }
  if (attempt.kind === 'refuse')
    return { kind: 'block', reason: `Blocked: ${attempt.reason}\n` }
  const cwd = typeof input.cwd === 'string' ? input.cwd : process.cwd()
  const target = resolveTarget(cwd, rest, attempt.target)
  if (target.kind === 'unreadable')
    return {
      kind: 'block',
      reason: `Blocked: the merge gate cannot run: ${target.reason}.\n`,
    }
  if (target.kind === 'unresolved') {
    return {
      kind: 'ask',
      reason: `The merge gate cannot tell which pull request this merges (${target.reason}), so a person must decide.`,
    }
  }
  const pr = `#${String(target.number)}`
  const gate = runMergeGate(cwd, rest, target.number, target.repository)
  if (!gate.ok && !gate.eligible) {
    return {
      kind: 'ask',
      reason: `Pull request ${pr} is not eligible for agent merge, so only a person's explicit request can merge it:\n${bullets(
        gate.problems,
      )}`,
    }
  }
  if (attempt.via === 'shell') {
    return {
      kind: 'block',
      reason: `Blocked: ${mcpToolReason}${
        gate.ok
          ? ''
          : `\nThe merge gate also fails for ${pr}:\n${bullets(gate.problems)}`
      }\n`,
    }
  }
  if (gate.ok)
    return {
      kind: 'approve',
      reason: `The merge gate passes for pull request ${pr}.`,
    }
  return {
    kind: 'block',
    reason: `Blocked: the merge gate fails for pull request ${pr}.\n${bullets(
      gate.problems,
    )}\nFix each problem, or run \`pnpm merge:gate ${String(target.number)}\` for details.\n`,
  }
}

/** The hook's exit code, stdout, and stderr for a decision, as Claude Code reads them. */
export const hookOutput = (decision) => {
  if (decision.kind !== 'ask') return readyHookOutput(decision)
  const output = {
    hookSpecificOutput: {
      hookEventName: 'PreToolUse',
      permissionDecision: 'ask',
      permissionDecisionReason: decision.reason,
    },
  }
  return { exitCode: 0, stderr: '', stdout: `${JSON.stringify(output)}\n` }
}

/**
 * The hook's entry point, for the thin script Claude Code runs: it takes the parsed PreToolUse input, writes the
 * decision's stdout and stderr, sets the exit code, and returns the output. GitHub is reached through `gh api` in the
 * input's `cwd` unless a test passes `rest`. Every tool call that is not a merge attempt passes through without
 * touching git or GitHub.
 */
export const runMergeHook = (input, rest) => {
  const cwd = typeof input.cwd === 'string' ? input.cwd : process.cwd()
  const decision =
    mergeAttempt(input.tool_name, input.tool_input) === undefined
      ? { kind: 'allow' }
      : mergeDecision(input, rest ?? ghRest(cwd))
  const output = hookOutput(decision)
  process.stdout.write(output.stdout)
  process.stderr.write(output.stderr)
  process.exitCode = output.exitCode
  return output
}
