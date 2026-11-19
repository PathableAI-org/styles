/**
 * Agent merge commands. Run through the `merge:*` package scripts:
 *
 *   pnpm merge:gate <pr>   sync the pull request's note comments and check it against the merge gate; prints
 *                          `merge gate: pass`, or each problem and whether the pull request is eligible for agent
 *                          merge at all. Exits 0 on pass, 1 otherwise
 *
 * See docs/engineering/git-workflow.md#the-merge-gate.
 */
import { failed, runCommand } from './cli.mjs'
import { ghRest } from './github-access.mjs'
import { runMergeGate } from './merge-gate.mjs'

const cwd = process.cwd()
const [command, argument] = process.argv.slice(2)
const usage = 'Usage: merge.mjs gate <pr> (see the header of scripts/merge.mjs)'

const gate = () => {
  if (argument === undefined || !/^\d+$/.test(argument)) {
    process.stderr.write(`${usage}\n`)
    return 2
  }
  const result = runMergeGate(cwd, ghRest(cwd), Number(argument))
  const notice = result.ok ? result.value.notice : result.notice
  if (notice !== undefined) process.stderr.write(notice)
  if (result.ok) {
    process.stdout.write('merge gate: pass\n')
    return 0
  }
  return failed(
    result.eligible
      ? `merge gate: fail. Pull request #${argument} is eligible for agent merge but not ready:`
      : `merge gate: fail. Pull request #${argument} is not eligible for agent merge; a person must decide:`,
    result.problems,
  )
}

runCommand({ gate }, command, usage)
