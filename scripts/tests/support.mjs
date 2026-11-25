// Ported from pathableai-org/pre-ets tests/tooling/support.ts @ f2ee390 (types stripped only).
/** A throwaway Git repository for workflow-tooling tests. */
import { execFileSync } from 'node:child_process'
import {
  mkdirSync,
  mkdtempSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { dirname, join } from 'node:path'

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
