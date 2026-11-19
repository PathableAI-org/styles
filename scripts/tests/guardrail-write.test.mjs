import assert from 'node:assert/strict'
import { spawnSync } from 'node:child_process'
import { mkdirSync, rmSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { afterEach, beforeEach, describe, it } from 'node:test'
import { fileURLToPath } from 'node:url'

import {
  changedSince,
  guardrailWrite,
  hookOutput,
  isGuardrailPath,
  postToolUse,
  preToolUse,
  segments,
} from '../guardrail-write.mjs'
import { sampleRepo } from './support.mjs'

const root = '/work/styles'
const asks = (command, cwd = root) =>
  guardrailWrite(command, cwd, root) !== undefined

void describe('guardrail paths', () => {
  void it('matches guardrail files and the directories that hold them', () => {
    for (const path of [
      '.github',
      '.github/workflows/ci.yml',
      '.claude/settings.json',
      'scripts/claude/pr-merge-hook.mjs',
      'scripts/merge-gate.mjs',
      'packages/react/tsconfig.json',
      'packages/styles/AGENTS.md',
      'package.json',
    ])
      assert.equal(isGuardrailPath(path), true, path)
    for (const path of [
      'scripts',
      'docs',
      'packages/react/package.json',
      'packages/styles/src/_tokens.scss',
      'README.md',
    ])
      assert.equal(isGuardrailPath(path), false, path)
  })
})

void describe('reading shell commands', () => {
  void it('splits simple commands and takes redirections out of their words', () => {
    assert.deepEqual(
      segments('git log -- .github 2>/dev/null | tee out.txt && echo "a > b"'),
      [
        {
          heredocs: [],
          herestrings: [],
          redirects: ['/dev/null'],
          words: ['git', 'log', '--', '.github'],
        },
        {
          heredocs: [],
          herestrings: [],
          redirects: [],
          words: ['tee', 'out.txt'],
        },
        {
          heredocs: [],
          herestrings: [],
          redirects: [],
          words: ['echo', 'a > b'],
        },
      ],
    )
  })

  void it('attaches heredoc bodies without reading them as commands', () => {
    const [cat, next] = segments(
      "cat <<'EOF' > notes.txt\ndon't > .github/x\nEOF\necho done",
    )
    assert.deepEqual(cat?.heredocs, ["don't > .github/x"])
    assert.deepEqual(cat?.redirects, ['notes.txt'])
    assert.deepEqual(next?.words, ['echo', 'done'])
  })
})

void describe('the PreToolUse tripwire', () => {
  void it('asks for redirections into guardrail files', () => {
    assert.equal(asks('echo x > .github/workflows/new.yml'), true)
    assert.equal(asks('echo x >> AGENTS.md'), true)
    assert.equal(asks('printf x 1> package.json'), true)
    assert.equal(asks('cmd &> .claude/settings.json'), true)
    assert.equal(
      asks("cat <<'EOF' > .husky/pre-commit\nnpx lint-staged\nEOF"),
      true,
    )
    assert.equal(asks('echo x > /work/styles/scripts/claude/hook.mjs'), true)
  })

  void it('asks for write commands that name a guardrail path', () => {
    assert.equal(asks('echo x | tee -a .github/CODEOWNERS'), true)
    assert.equal(asks('sudo tee .claude/settings.json < /tmp/s'), true)
    assert.equal(asks('cp /tmp/hook.mjs scripts/claude/hook.mjs'), true)
    assert.equal(asks('mv /tmp/ci.yml .github/workflows/ci.yml'), true)
    assert.equal(asks('rm -f eslint.config.js'), true)
    assert.equal(asks('install -m 644 /tmp/x .github/x'), true)
    assert.equal(asks('dd if=/tmp/x of=.husky/pre-push'), true)
    assert.equal(
      asks('ls /tmp/*.yml | xargs -I {} cp {} .github/workflows/'),
      true,
    )
    assert.equal(asks('rm -rf .github'), true)
  })

  void it('asks for in-place edits of guardrail files', () => {
    assert.equal(asks("sed -i 's/a/b/' .markdownlint.json"), true)
    assert.equal(asks("sed -i.bak -e 's/a/b/' commitlint.config.cjs"), true)
    assert.equal(asks("perl -pi -e 's/a/b/' .husky/pre-commit"), true)
    assert.equal(asks("sed -n '1,10p' .markdownlint.json"), false)
  })

  void it('asks for git commands that rewrite guardrail files', () => {
    assert.equal(asks('git checkout main -- .github/workflows/ci.yml'), true)
    assert.equal(
      asks('git restore --source=HEAD~1 scripts/merge-gate.mjs'),
      true,
    )
    assert.equal(asks('git -C /work/styles rm --cached AGENTS.md'), true)
    assert.equal(
      asks(
        "git apply <<'EOF'\ndiff --git a/.github/x.yml b/.github/x.yml\n--- a/.github/x.yml\nEOF",
      ),
      true,
    )
    assert.equal(asks('git checkout -b fix/ring origin/main'), false)
    assert.equal(asks('git log --oneline -- .github/'), false)
  })

  void it('asks for inline interpreter code that names a guardrail path and writes', () => {
    assert.equal(
      asks(`python3 -c "open('.github/workflows/a.yml', 'w').write('x')"`),
      true,
    )
    assert.equal(
      asks(
        "python3 - <<'EOF'\nfrom pathlib import Path\nPath('.claude/settings.json').write_text('{}')\nEOF",
      ),
      true,
    )
    assert.equal(
      asks(`node -e "require('fs').writeFileSync('scripts/claude/x.mjs', '')"`),
      true,
    )
    assert.equal(
      asks(
        `node --input-type=module -e "import fs from 'node:fs'; fs.rmSync('.husky', {recursive: true})"`,
      ),
      true,
    )
    assert.equal(asks(`awk '{ print > ".github/x" }' /tmp/in`), true)
    assert.equal(asks(`bash -c 'echo x > .github/workflows/a.yml'`), true)
    assert.equal(asks("sh <<'EOF'\nsed -i 's/a/b/' AGENTS.md\nEOF"), true)
  })

  void it('asks when a command changes into a guardrail directory and then writes', () => {
    assert.equal(asks('cd .github && cat > workflows/new.yml < /tmp/x'), true)
    assert.equal(asks('cd .github/workflows; cp /tmp/x .'), true)
    assert.equal(asks('cd .github && ls'), false)
    assert.equal(asks('cd docs && ls > /tmp/list.txt'), false)
  })

  void it('resolves paths from the directory the command starts in', () => {
    assert.equal(asks('echo x > tsconfig.json', `${root}/packages/react`), true)
    assert.equal(asks('echo x > package.json', `${root}/packages/react`), false)
    assert.equal(
      asks('echo x > ../../AGENTS.md', `${root}/packages/react`),
      true,
    )
  })

  void it('lets reads and unrelated writes through', () => {
    for (const command of [
      'git status --porcelain',
      'git log -- .github/ 2>/dev/null',
      'cat .claude/settings.json',
      'grep -rn guardrail .github | head -5 > /tmp/out.txt',
      `node -e "console.log(require('./package.json').version)"`,
      'node scripts/claude/pr-merge-hook.mjs < /tmp/input.json',
      'echo x > packages/styles/src/a.scss',
      "git commit -F - <<'EOF'\nfix: don't touch .github > now\nEOF",
      'pnpm test:tooling',
      'echo "> AGENTS.md"',
      '# echo x > AGENTS.md',
    ])
      assert.equal(asks(command), false, command)
  })
})

void describe('the PostToolUse check', () => {
  let repo

  beforeEach(() => {
    repo = sampleRepo()
    repo.commit('chore: guardrails', {
      '.github/workflows/ci.yml': 'name: ci\n',
      'AGENTS.md': '# Agents\n',
    })
  })

  afterEach(() => {
    repo.remove()
  })

  let calls = 0
  const bash = (command, event) => ({
    cwd: repo.dir,
    hook_event_name: event,
    session_id: 'session-test',
    tool_input: { command },
    tool_name: 'Bash',
    tool_use_id: `toolu_${calls}`,
  })

  /** Runs one Bash tool call through both hooks, with `act` standing in for what the command does. */
  const run = (command, act = () => undefined) => {
    calls += 1
    const pre = preToolUse(bash(command, 'PreToolUse'))
    act()
    return { post: postToolUse(bash(command, 'PostToolUse')), pre }
  }

  const write = (path, content) => {
    mkdirSync(join(repo.dir, path, '..'), { recursive: true })
    writeFileSync(join(repo.dir, path), content)
  }

  void it('stops the agent when a command it was not asked about changed a guardrail file', () => {
    const { post, pre } = run('node build.mjs', () => {
      write('.github/workflows/ci.yml', 'name: changed\n')
      write('.github/workflows/new.yml', 'name: new\n')
    })
    assert.deepEqual(pre, { kind: 'allow' })
    assert.equal(post.kind, 'block')
    assert.match(
      post.kind === 'block' ? post.reason : '',
      /\.github\/workflows\/ci\.yml, \.github\/workflows\/new\.yml/,
    )
  })

  void it('reports a deleted guardrail file', () => {
    const { post } = run('node clean.mjs', () => {
      rmSync(join(repo.dir, 'AGENTS.md'))
    })
    assert.equal(post.kind, 'block')
  })

  void it('ignores changes that were there before the command', () => {
    write('AGENTS.md', '# Agents, edited with approval\n')
    assert.deepEqual(run('pnpm lint').post, { kind: 'allow' })
  })

  void it('reports a further change to a guardrail file that was already changed', () => {
    write('AGENTS.md', '# Agents, edited with approval\n')
    const { post } = run('node build.mjs', () => {
      write('AGENTS.md', '# Agents, rewritten by a script\n')
    })
    assert.equal(post.kind, 'block')
  })

  void it('accepts a change the PreToolUse check asked a person about', () => {
    const { post, pre } = run('echo x >> AGENTS.md', () => {
      write('AGENTS.md', '# Agents\nx\n')
    })
    assert.equal(pre.kind, 'ask')
    assert.deepEqual(post, { kind: 'allow' })
  })

  void it('does not report files that became clean or other files', () => {
    write('AGENTS.md', '# Agents, edited with approval\n')
    const { post } = run('git commit -am docs', () => {
      repo.git('commit', '--quiet', '--all', '--message', 'docs')
      write('src/app.ts', 'export const app = 3\n')
    })
    assert.deepEqual(post, { kind: 'allow' })
  })

  void it('passes other tools and directories outside a repository through', () => {
    assert.deepEqual(
      preToolUse({ hook_event_name: 'PreToolUse', tool_name: 'Edit' }),
      { kind: 'allow' },
    )
    assert.deepEqual(
      postToolUse({
        cwd: '/',
        hook_event_name: 'PostToolUse',
        tool_input: { command: 'ls' },
        tool_name: 'Bash',
      }),
      { kind: 'allow' },
    )
  })
})

void describe('hook output', () => {
  void it('asks through PreToolUse JSON and blocks through exit code 2', () => {
    assert.deepEqual(hookOutput({ kind: 'allow' }), {
      exitCode: 0,
      stderr: '',
      stdout: '',
    })
    assert.deepEqual(hookOutput({ kind: 'block', reason: 'stop' }), {
      exitCode: 2,
      stderr: 'stop',
      stdout: '',
    })
    const ask = JSON.parse(hookOutput({ kind: 'ask', reason: 'why' }).stdout)
    assert.deepEqual(ask, {
      hookSpecificOutput: {
        hookEventName: 'PreToolUse',
        permissionDecision: 'ask',
        permissionDecisionReason: 'why',
      },
    })
  })

  void it('runs as the script Claude Code calls', () => {
    const repo = sampleRepo()
    try {
      const script = fileURLToPath(
        new URL('../claude/guardrail-write-hook.mjs', import.meta.url),
      )
      const result = spawnSync(process.execPath, [script], {
        encoding: 'utf8',
        input: JSON.stringify({
          cwd: repo.dir,
          hook_event_name: 'PreToolUse',
          session_id: 'session-script',
          tool_input: { command: 'echo x > AGENTS.md' },
          tool_name: 'Bash',
          tool_use_id: 'toolu_script',
        }),
      })
      assert.equal(result.status, 0)
      assert.equal(
        JSON.parse(result.stdout).hookSpecificOutput.permissionDecision,
        'ask',
      )
    } finally {
      repo.remove()
    }
  })

  void it('compares records by path', () => {
    assert.deepEqual(
      changedSince({ a: '1', b: '2' }, { a: '1', b: '3', c: '4' }),
      ['b', 'c'],
    )
  })
})
