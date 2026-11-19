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
      `python3 -c "import json; print(json.load(open('package.json'))['version'])"`,
      'cat AGENTS.md | python3 -c "import sys; print(sys.stdin.read().replace(chr(10), chr(32)))"',
      'pnpm build 2>&1 >&2',
      'cp -r scripts /tmp/backup',
      'git checkout main',
      'rm -rf node_modules/.cache',
      'find .github -name "*.yml"',
      "awk 'NR>=10 && NR<=20' AGENTS.md",
      `python3 -c "print(open('AGENTS.md').read())"`,
    ])
      assert.equal(asks(command), false, command)
  })

  void it('asks for commands that delete or overwrite a tree holding guardrail files', () => {
    for (const command of [
      'rm -rf scripts',
      'git checkout origin/main -- .',
      'git checkout .',
      'git checkout origin/main -- scripts',
      'cp -r /tmp/x/. .',
      'find .github -name "*.yml" -delete',
    ])
      assert.equal(asks(command), true, command)
  })

  void it('reads commands after shell keywords and inside groups', () => {
    for (const command of [
      'if [ -f package.json ]; then rm package.json; fi',
      'for f in ci release; do cp /tmp/$f.yml .github/workflows/; done',
      'test -d .husky && { chmod -x .husky/pre-commit; }',
      "while read -r f; do sed -i 's/a/b/' AGENTS.md; done < /tmp/list",
      'if false; then :; else rm -f eslint.config.js; fi',
      'git clean -dfX .husky .claude',
    ])
      assert.equal(asks(command), true, command)
    assert.equal(asks('if [ -f AGENTS.md ]; then cat AGENTS.md; fi'), false)
  })

  void it('asks for chmod, curl -o, >& to a file and write calls inside other words', () => {
    for (const command of [
      'chmod -x .husky/pre-commit',
      'echo x >& AGENTS.md',
      'curl -o .github/workflows/x.yml https://example.test/x.yml',
      `node -e "require('fs').createWriteStream('AGENTS.md').end('x')"`,
      `php -r "file_put_contents('.github/x', 'y');"`,
    ])
      assert.equal(asks(command), true, command)
  })
})

void describe('the PostToolUse check', () => {
  let repo

  beforeEach(() => {
    repo = sampleRepo()
    repo.commit('chore: guardrails', {
      '.github/workflows/ci.yml': 'name: ci\n',
      '.gitignore': '.claude/settings.local.json\n',
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
  const run = (command, act = () => undefined, event = 'PostToolUse') => {
    calls += 1
    const pre = preToolUse(bash(command, 'PreToolUse'))
    act()
    return { post: postToolUse(bash(command, event)), pre }
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

  void it('runs after a command that failed', () => {
    const { post } = run(
      'node codemod.mjs && pnpm lint',
      () => {
        write('.github/workflows/ci.yml', 'name: rewritten\n')
      },
      'PostToolUseFailure',
    )
    assert.equal(post.kind, 'block')
  })

  void it('reports a guardrail file the command changed and committed', () => {
    write('AGENTS.md', '# Agents, edited with approval\n')
    const { post } = run('node build.mjs && git commit -am build', () => {
      write('AGENTS.md', '# Agents, rewritten by a script\n')
      write('.github/workflows/ci.yml', 'name: rewritten\n')
      repo.git('commit', '--quiet', '--all', '--message', 'build')
    })
    assert.equal(post.kind, 'block')
    assert.match(
      post.kind === 'block' ? post.reason : '',
      /: \.github\/workflows\/ci\.yml, AGENTS\.md\./,
    )
  })

  void it('reports a guardrail file changed and committed on a new branch', () => {
    const { post } = run(
      'git switch -c tmp && node x.mjs && git commit -am x',
      () => {
        repo.git('switch', '--quiet', '-c', 'tmp')
        write('.github/workflows/ci.yml', 'name: rewritten\n')
        repo.git('commit', '--quiet', '--all', '--message', 'x')
      },
    )
    assert.equal(post.kind, 'block')
  })

  void it('does not report guardrail files an amend left unchanged', () => {
    const { post } = run('git commit --amend -m better', () => {
      repo.git('commit', '--quiet', '--amend', '--message', 'better')
    })
    assert.deepEqual(post, { kind: 'allow' })
  })

  void it('does not report guardrail content a conflicted merge brought in', () => {
    repo.git('checkout', '--quiet', '-b', 'other')
    repo.commit('docs: process', {
      'docs/engineering/x.md': '# Process\n',
      'src/app.ts': 'export const app = 10\n',
    })
    repo.git('checkout', '--quiet', '-')
    repo.commit('fix: app', { 'src/app.ts': 'export const app = 20\n' })
    const { post } = run('git merge other', () => {
      try {
        repo.git('merge', '--quiet', 'other')
      } catch {
        // The merge stops on the conflict in src/app.ts, as intended.
      }
    })
    assert.deepEqual(post, { kind: 'allow' })
  })

  void it('reports deleted untracked and ignored guardrail files', () => {
    write('.claude/settings.local.json', '{}')
    write('.github/workflows/new.yml', 'name: new\n')
    const { post } = run('node clean.mjs', () => {
      rmSync(join(repo.dir, '.claude/settings.local.json'))
      rmSync(join(repo.dir, '.github/workflows/new.yml'))
    })
    assert.equal(post.kind, 'block')
    assert.match(
      post.kind === 'block' ? post.reason : '',
      /\.claude\/settings\.local\.json, \.github\/workflows\/new\.yml/,
    )
  })

  void it('explains a change to local settings Claude Code may have made', () => {
    const { post } = run('pnpm test', () => {
      write(
        '.claude/settings.local.json',
        '{"permissions":{"allow":["Bash(pnpm test)"]}}',
      )
    })
    assert.match(
      post.kind === 'block' ? post.reason : '',
      /chooses not to be asked again/,
    )
  })

  void it('accepts every path and glob an approved command named', () => {
    write('docs/engineering/a.md', '# A\n')
    write('docs/engineering/b.md', '# B\n')
    repo.git('add', '--all')
    repo.git('commit', '--quiet', '--message', 'docs')
    const moved = run(
      'git mv docs/engineering/a.md docs/engineering/c.md',
      () => {
        repo.git('mv', 'docs/engineering/a.md', 'docs/engineering/c.md')
      },
    )
    assert.equal(moved.pre.kind, 'ask')
    assert.deepEqual(moved.post, { kind: 'allow' })
    const globbed = run("sed -i 's/B/D/' docs/engineering/*.md", () => {
      write('docs/engineering/b.md', '# D\n')
    })
    assert.equal(globbed.pre.kind, 'ask')
    assert.deepEqual(globbed.post, { kind: 'allow' })
  })

  void it('lists every guardrail path a command may write in its ask', () => {
    const reason = guardrailWrite(
      'cp /tmp/a .github/a.yml && rm -f AGENTS.md',
      root,
      root,
    )
    assert.match(reason ?? '', /\.github\/a\.yml \(cp\), AGENTS\.md \(rm\)/)
  })

  void it('reports a guardrail file an asked command changed beyond what it named', () => {
    const { post, pre } = run('echo x >> AGENTS.md && node build.mjs', () => {
      write('AGENTS.md', '# Agents\nx\n')
      write('.github/workflows/ci.yml', 'name: rewritten\n')
    })
    assert.equal(pre.kind, 'ask')
    assert.match(
      post.kind === 'block' ? post.reason : '',
      /: \.github\/workflows\/ci\.yml\./,
    )
  })

  void it('does not report Husky shims an install creates', () => {
    const { post } = run('pnpm install', () => {
      write('.gitignore', '.claude/settings.local.json\n.husky/_/\n')
      write('.husky/_/pre-commit', '. "$(dirname "$0")/h"\n')
    })
    assert.deepEqual(post, { kind: 'allow' })
  })

  void it('reports a change to an existing Husky shim', () => {
    write('.gitignore', '.claude/settings.local.json\n.husky/_/\n')
    write('.husky/_/pre-commit', '. "$(dirname "$0")/h"\n')
    const { post } = run('node x.mjs', () => {
      write('.husky/_/pre-commit', 'exit 0\n')
    })
    assert.equal(post.kind, 'block')
  })

  void it('does not report whitespace-only reformatting of Markdown, committed or not', () => {
    write('AGENTS.md', '# Agents\n\n| a | b |\n|---|---|\n')
    assert.deepEqual(
      run('pnpm exec prettier --write AGENTS.md', () => {
        write('AGENTS.md', '# Agents\n\n| a   | b   |\n| --- | --- |\n')
      }).post,
      { kind: 'allow' },
    )
    write('AGENTS.md', '# Agents,  edited\n')
    assert.deepEqual(
      run('git commit -am docs', () => {
        write('AGENTS.md', '# Agents, edited\n')
        repo.git('commit', '--quiet', '--all', '--message', 'docs')
      }).post,
      { kind: 'allow' },
    )
  })

  void it('reports a Markdown change beyond whitespace', () => {
    const { post } = run('pnpm format', () => {
      write('AGENTS.md', '# Agents who merge\n')
    })
    assert.equal(post.kind, 'block')
  })

  void it('does not report an untracked guardrail file git stash -u put away', () => {
    write('.github/workflows/new.yml', 'name: new\n')
    const { post } = run('git stash -u', () => {
      repo.git('stash', '--quiet', '--include-untracked')
    })
    assert.deepEqual(post, { kind: 'allow' })
  })

  void it('does not report a guardrail file both sides of a conflicted merge changed', () => {
    repo.git('checkout', '--quiet', '-b', 'other')
    repo.commit('docs: other', {
      'AGENTS.md': '# Agents\n\nother\n',
      'src/app.ts': 'export const app = 10\n',
    })
    repo.git('checkout', '--quiet', '-')
    repo.commit('docs: ours', {
      'AGENTS.md': 'ours\n\n# Agents\n',
      'src/app.ts': 'export const app = 20\n',
    })
    const { post } = run('git merge other', () => {
      try {
        repo.git('merge', '--quiet', 'other')
      } catch {
        // The merge stops on the conflict in src/app.ts, as intended.
      }
    })
    assert.deepEqual(post, { kind: 'allow' })
  })

  /** Makes a branch `other` whose merge auto-merges AGENTS.md and stops on a conflict in src/app.ts. */
  const prepareConflict = () => {
    repo.git('checkout', '--quiet', '-b', 'other')
    repo.commit('docs: other', {
      'AGENTS.md': '# Agents\n\nother\n',
      'src/app.ts': 'export const app = 10\n',
    })
    repo.git('checkout', '--quiet', '-')
    repo.commit('fix: app', { 'src/app.ts': 'export const app = 20\n' })
  }

  const mergeOther = () => {
    try {
      repo.git('merge', '--quiet', 'other')
    } catch {
      // The merge stops on the conflict in src/app.ts, as intended.
    }
  }

  void it('does not report a guardrail file git merge --abort removes', () => {
    repo.git('checkout', '--quiet', '-b', 'added')
    repo.commit('docs: process', {
      'docs/engineering/x.md': '# Process\n',
      'src/app.ts': 'export const app = 10\n',
    })
    repo.git('checkout', '--quiet', '-')
    repo.commit('fix: app', { 'src/app.ts': 'export const app = 20\n' })
    const merged = run('git merge added', () => {
      try {
        repo.git('merge', '--quiet', 'added')
      } catch {
        // The merge stops on the conflict in src/app.ts, as intended.
      }
    })
    assert.deepEqual(merged.post, { kind: 'allow' })
    const aborted = run('git merge --abort', () => {
      repo.git('merge', '--abort')
    })
    assert.deepEqual(aborted.post, { kind: 'allow' })
  })

  void it('reports a later write to a file a pending merge changed', () => {
    prepareConflict()
    assert.deepEqual(run('git merge other', mergeOther).post, { kind: 'allow' })
    const { post } = run('node fix.mjs', () => {
      write('AGENTS.md', '# Agents\n\nother\n\nexit 0\n')
    })
    assert.equal(post.kind, 'block')
  })

  void it('reports a write after the merge in the same command', () => {
    prepareConflict()
    const { post } = run('git merge other || node fix.mjs', () => {
      mergeOther()
      write('AGENTS.md', '# Agents\n\nother\n\nexit 0\n')
    })
    assert.equal(post.kind, 'block')
  })

  void it('reports a guardrail change committed on a branch the command left', () => {
    const { post } = run(
      'git switch -c tmp && node x.mjs && git commit -am x && git switch -',
      () => {
        repo.git('switch', '--quiet', '-c', 'tmp')
        write('.github/workflows/ci.yml', 'name: rewritten\n')
        repo.git('commit', '--quiet', '--all', '--message', 'x')
        repo.git('switch', '--quiet', '-')
      },
    )
    assert.equal(post.kind, 'block')
  })

  void it('records a nested worktree as one entry and ignores changes inside it', () => {
    repo.git('worktree', 'add', '--quiet', '--detach', '.claude/worktrees/a')
    const { post } = run('pnpm lint', () => {
      write('.claude/worktrees/a/src/app.ts', 'export const app = 30\n')
    })
    assert.deepEqual(post, { kind: 'allow' })
  })

  void it('reports ignored guardrail files git stash --all put away', () => {
    write('.claude/settings.local.json', '{}')
    const { post } = run('git stash --all', () => {
      repo.git('stash', '--quiet', '--all')
    })
    assert.equal(post.kind, 'block')
  })

  void it('reports every deletion of the same file', () => {
    for (let round = 0; round < 2; round += 1) {
      write('.claude/settings.local.json', '{}')
      const { post } = run('node clean.mjs', () => {
        rmSync(join(repo.dir, '.claude/settings.local.json'))
      })
      assert.equal(post.kind, 'block', `deletion ${round + 1}`)
    }
  })

  void it('reports a change to an ignored guardrail file', () => {
    const { post } = run('node setup.mjs', () => {
      write('.claude/settings.local.json', '{"permissions":{"allow":["Bash"]}}')
    })
    assert.equal(post.kind, 'block')
  })

  void it('does not report content it saw earlier in the session', () => {
    write('AGENTS.md', '# Agents, edited with approval\n')
    assert.deepEqual(
      run('git stash', () => {
        repo.git('stash', '--quiet')
      }).post,
      { kind: 'allow' },
    )
    assert.deepEqual(
      run('git stash pop', () => {
        repo.git('stash', 'pop', '--quiet')
      }).post,
      { kind: 'allow' },
    )
  })

  void it('reports a change once, not again on the next command', () => {
    assert.equal(
      run('node build.mjs', () => {
        write('AGENTS.md', '# Agents, rewritten by a script\n')
      }).post.kind,
      'block',
    )
    assert.deepEqual(run('pnpm lint').post, { kind: 'allow' })
  })

  void it('reports reported content again when a later command writes it back', () => {
    const rewrite = () => {
      write('AGENTS.md', '# Agents, rewritten by a script\n')
    }
    assert.equal(run('node codemod.mjs', rewrite).post.kind, 'block')
    write('AGENTS.md', '# Agents\n')
    assert.equal(run('node codemod.mjs', rewrite).post.kind, 'block')
  })

  void it('does not report a git reset that leaves the old HEAD content', () => {
    repo.commit('docs: agents', { 'AGENTS.md': '# Agents, committed\n' })
    const { post } = run('git reset --soft HEAD~1', () => {
      repo.git('reset', '--quiet', '--soft', 'HEAD~1')
    })
    assert.deepEqual(post, { kind: 'allow' })
  })

  void it('reports a guardrail write committed inside a merge commit', () => {
    repo.git('checkout', '--quiet', '-b', 'side')
    repo.commit('fix: side', { 'src/side.ts': 'export const side = 1\n' })
    repo.git('checkout', '--quiet', '-')
    repo.git('merge', '--quiet', '--no-ff', '--no-edit', 'side')
    const { post } = run(
      'node x.mjs && git commit -a --amend --no-edit',
      () => {
        write('.github/workflows/ci.yml', 'name: rewritten\n')
        repo.git('commit', '--quiet', '--all', '--amend', '--no-edit')
      },
    )
    assert.equal(post.kind, 'block')
  })

  void it('does not report a clean merge commit', () => {
    repo.git('checkout', '--quiet', '-b', 'side')
    repo.commit('docs: side', { 'AGENTS.md': '# Agents\n\nside\n' })
    repo.git('checkout', '--quiet', '-')
    repo.commit('fix: app', { 'src/app.ts': 'export const app = 2\n' })
    const { post } = run('git merge side', () => {
      repo.git('merge', '--quiet', '--no-ff', '--no-edit', 'side')
    })
    assert.deepEqual(post, { kind: 'allow' })
  })

  void it('reports a Markdown change committed on a branch the command left', () => {
    const { post } = run(
      'git switch -c tmp && node x.mjs && git commit -am x && git switch -',
      () => {
        repo.git('switch', '--quiet', '-c', 'tmp')
        write('AGENTS.md', '# Agents who merge anything\n')
        repo.git('commit', '--quiet', '--all', '--message', 'x')
        repo.git('switch', '--quiet', '-')
      },
    )
    assert.equal(post.kind, 'block')
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
      const hook = (event) =>
        spawnSync(process.execPath, [script], {
          encoding: 'utf8',
          input: JSON.stringify({
            cwd: repo.dir,
            hook_event_name: event,
            session_id: 'session-script',
            tool_input: { command: 'echo x > AGENTS.md' },
            tool_name: 'Bash',
            tool_use_id: 'toolu_script',
          }),
        })
      const pre = hook('PreToolUse')
      assert.equal(pre.status, 0)
      assert.equal(
        JSON.parse(pre.stdout).hookSpecificOutput.permissionDecision,
        'ask',
      )
      const post = hook('PostToolUse')
      assert.deepEqual([post.status, post.stdout, post.stderr], [0, '', ''])
    } finally {
      repo.remove()
    }
  })

  void it('blocks through the script after a failed command', () => {
    const repo = sampleRepo()
    try {
      const script = fileURLToPath(
        new URL('../claude/guardrail-write-hook.mjs', import.meta.url),
      )
      const hook = (event) =>
        spawnSync(process.execPath, [script], {
          encoding: 'utf8',
          input: JSON.stringify({
            cwd: repo.dir,
            hook_event_name: event,
            session_id: 'session-failure',
            tool_input: { command: 'node codemod.mjs && false' },
            tool_name: 'Bash',
            tool_use_id: 'toolu_failure',
          }),
        })
      assert.deepEqual(hook('PreToolUse').stdout, '')
      writeFileSync(join(repo.dir, 'AGENTS.md'), '# Rewritten\n')
      const post = hook('PostToolUseFailure')
      assert.equal(post.status, 2)
      assert.match(post.stderr, /^Stop: .*AGENTS\.md/)
    } finally {
      repo.remove()
    }
  })

  void it('still asks when the record cannot be written', () => {
    const repo = sampleRepo()
    const blocked = join(repo.dir, '..', `blocked-${Date.now()}`)
    try {
      mkdirSync(blocked)
      writeFileSync(
        join(blocked, 'pathable-guardrail-writes'),
        'not a directory',
      )
      const script = fileURLToPath(
        new URL('../claude/guardrail-write-hook.mjs', import.meta.url),
      )
      const result = spawnSync(process.execPath, [script], {
        encoding: 'utf8',
        env: { ...process.env, TMPDIR: blocked },
        input: JSON.stringify({
          cwd: repo.dir,
          hook_event_name: 'PreToolUse',
          session_id: 'session-blocked',
          tool_input: { command: 'echo x > AGENTS.md' },
          tool_name: 'Bash',
          tool_use_id: 'toolu_blocked',
        }),
      })
      assert.equal(result.status, 0)
      assert.equal(
        JSON.parse(result.stdout).hookSpecificOutput.permissionDecision,
        'ask',
      )
      assert.match(result.stderr, /could not record guardrail files/)
    } finally {
      repo.remove()
      rmSync(blocked, { force: true, recursive: true })
    }
  })

  void it('compares records by path', () => {
    assert.deepEqual(
      changedSince({ a: '1', b: '2' }, { a: '1', b: '3', c: '4' }),
      ['b', 'c'],
    )
  })
})
