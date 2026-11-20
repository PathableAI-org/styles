import assert from 'node:assert/strict'
import { execFileSync } from 'node:child_process'
import {
  mkdirSync,
  mkdtempSync,
  renameSync,
  rmSync,
  writeFileSync,
} from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { after, describe, it } from 'node:test'

import {
  changedPathsSince,
  compileStyles,
  dependencyReasons,
  diffStyles,
  selectFixtures,
} from './affected.mjs'

// A small stylesheet with the same shape as the real one: tokens on :root,
// a reset, and one file per component. Each test changes one file.
const BASE = {
  '_semantic.scss': `:root {
  --pathable-color-text: #111;
  --pathable-color-accent: #06c;
  --pathable-row-accent: var(--pathable-color-accent);
  --pathable-unused: 1px;
}
`,
  '_reset.scss': 'body { margin: 0; }\n',
  'pathable-activity-list.scss': `.pathable-activity-list { display: grid; }
.pathable-activity-row { border-color: var(--pathable-row-accent); }
`,
  'pathable-dashboard.scss': `.pathable-dashboard { padding: 1rem; }
.pathable-dashboard .pathable-activity-row { gap: 1rem; }
`,
  'pathable-button.scss':
    '.pathable-button { color: var(--pathable-color-text); }\n',
  'pathable-tag.scss': '.pathable-tag { color: var(--pathable-color-text); }\n',
  'pathable-card.scss': '.pathable-card { padding: 2rem; }\n',
}

const indexOf = (files) =>
  Object.keys(files)
    .map((file) => `@use '${file.replace(/^_/u, '').replace(/\.scss$/u, '')}';`)
    .join('\n')

const FIXTURES = [
  {
    folder: 'activity-list',
    files: [
      {
        path: 'fixtures/activity-list/flat.html',
        html: `<ul class="pathable-activity-list">
  <li class="pathable-activity-row"><button class="usa-button pathable-button" type="button">Open</button></li>
</ul>`,
      },
      {
        path: 'fixtures/activity-list/empty.html',
        html: '<ul class="pathable-activity-list"></ul>',
      },
    ],
  },
  {
    folder: 'card',
    files: [
      {
        path: 'fixtures/card/basic.html',
        html: '<div class="pathable-card">Card</div>',
      },
    ],
  },
  {
    folder: 'tag',
    files: [
      {
        path: 'fixtures/tag/basic.html',
        html: '<span class="pathable-tag">Tag</span>',
      },
    ],
  },
]

const dirs = []
after(() => {
  for (const dir of dirs) rmSync(dir, { recursive: true, force: true })
})

function compile(files) {
  const dir = mkdtempSync(join(tmpdir(), 'affected-test-'))
  dirs.push(dir)
  for (const [file, content] of Object.entries(files))
    writeFileSync(join(dir, file), content)
  writeFileSync(join(dir, 'index.scss'), indexOf(files))
  return { ...compileStyles(dir, 'index.scss', []), root: dir }
}

const base = compile(BASE)

/** Selects fixtures for BASE with one file replaced. */
function select(file, content) {
  const head = compile({ ...BASE, [file]: content })
  return selectFixtures(diffStyles(base, head), FIXTURES)
}

const folders = (selection) => Object.keys(selection.folders).sort()

describe('affected fixture selection', () => {
  it('selects nothing when nothing changed', () => {
    const selection = selectFixtures(diffStyles(base, compile(BASE)), FIXTURES)
    assert.equal(selection.all, false)
    assert.deepEqual(folders(selection), [])
  })

  it('selects activity-list for a rule in pathable-activity-list.scss', () => {
    const selection = select(
      'pathable-activity-list.scss',
      BASE['pathable-activity-list.scss'].replace(
        'display: grid',
        'display: flex',
      ),
    )
    assert.deepEqual(folders(selection), ['activity-list'])
    const [reason] = selection.folders['activity-list'].reasons
    assert.equal(reason.class, 'pathable-activity-list')
    assert.match(reason.source, /^pathable-activity-list\.scss:1$/u)
    assert.deepEqual(selection.folders['activity-list'].files, [
      'fixtures/activity-list/flat.html',
      'fixtures/activity-list/empty.html',
    ])
  })

  it('selects activity-list for a .pathable-activity-row rule in pathable-dashboard.scss', () => {
    const selection = select(
      'pathable-dashboard.scss',
      BASE['pathable-dashboard.scss'].replace('gap: 1rem', 'gap: 2rem'),
    )
    assert.deepEqual(folders(selection), ['activity-list'])
    const reasons = selection.folders['activity-list'].reasons
    assert.ok(
      reasons.some(
        (reason) =>
          reason.class === 'pathable-activity-row' &&
          reason.source.startsWith('pathable-dashboard.scss:'),
      ),
      JSON.stringify(reasons),
    )
    assert.deepEqual(selection.folders['activity-list'].files, [
      'fixtures/activity-list/flat.html',
    ])
  })

  it('follows a token change in _semantic.scss through var(), transitively', () => {
    const selection = select(
      '_semantic.scss',
      BASE['_semantic.scss'].replace(
        '--pathable-color-accent: #06c',
        '--pathable-color-accent: #0a5',
      ),
    )
    // --pathable-color-accent → --pathable-row-accent → .pathable-activity-row
    assert.equal(selection.all, false)
    assert.deepEqual(folders(selection), ['activity-list'])
    const [reason] = selection.folders['activity-list'].reasons
    assert.equal(reason.class, 'pathable-activity-row')
    assert.equal(reason.token, '--pathable-color-accent')
    assert.match(reason.via, /--pathable-color-accent → --pathable-row-accent/u)
    assert.match(reason.source, /^_semantic\.scss:3$/u)
  })

  it('selects every fixture that reads a token, and only those', () => {
    const selection = select(
      '_semantic.scss',
      BASE['_semantic.scss'].replace(
        '--pathable-color-text: #111',
        '--pathable-color-text: #222',
      ),
    )
    // Read by the button (inside activity-list) and the tag, not the card.
    assert.deepEqual(folders(selection), ['activity-list', 'tag'])
  })

  it('selects activity-list for pathable-button.scss, through the button in its fixture', () => {
    const selection = select(
      'pathable-button.scss',
      '.pathable-button { color: var(--pathable-color-text); font-weight: 700; }\n',
    )
    assert.deepEqual(folders(selection), ['activity-list'])
    assert.equal(
      selection.folders['activity-list'].reasons[0].class,
      'pathable-button',
    )
  })

  it('does not select activity-list for a tag-only change', () => {
    const selection = select(
      'pathable-tag.scss',
      '.pathable-tag { color: var(--pathable-color-accent); }\n',
    )
    assert.equal(selection.all, false)
    assert.deepEqual(folders(selection), ['tag'])
  })

  it('selects every fixture for a change to the body reset', () => {
    const selection = select(
      '_reset.scss',
      'body { margin: 0; line-height: 1.5; }\n',
    )
    assert.equal(selection.all, true)
    assert.deepEqual(folders(selection), ['activity-list', 'card', 'tag'])
    assert.equal(selection.allReasons[0].selector, 'body')
    assert.match(selection.allReasons[0].source, /^_reset\.scss:1$/u)
  })

  it('selects every fixture for a changed :root property that no rule reads', () => {
    const selection = select(
      '_semantic.scss',
      BASE['_semantic.scss'].replace(
        '--pathable-unused: 1px',
        '--pathable-unused: 2px',
      ),
    )
    assert.equal(selection.all, true)
    assert.equal(selection.allReasons[0].token, '--pathable-unused')
  })

  it('selects every fixture for @font-face', () => {
    const selection = select(
      'pathable-card.scss',
      `${BASE['pathable-card.scss']}@font-face { font-family: Brand; src: url(brand.woff2); }\n`,
    )
    assert.equal(selection.all, true)
    assert.match(selection.allReasons[0].selector, /^@font-face/u)
  })

  it('selects the classes of an added or removed rule', () => {
    const selection = select('pathable-card.scss', '')
    assert.deepEqual(folders(selection), ['card'])
    assert.equal(selection.folders.card.reasons[0].via, 'rule removed')
  })

  it('keys rules by their media query', () => {
    const selection = select(
      'pathable-card.scss',
      `${BASE['pathable-card.scss']}@media (min-width: 40em) { .pathable-card { padding: 3rem; } }\n`,
    )
    assert.deepEqual(folders(selection), ['card'])
    assert.equal(selection.folders.card.reasons[0].via, 'rule added')
  })
})

describe('dependency changes', () => {
  it('selects every fixture when the lockfile changed', () => {
    const extraAll = dependencyReasons(
      ['pnpm-lock.yaml', 'packages/styles/src/pathable-tag.scss'],
      {
        base: '^3.0.0',
        head: '^3.0.0',
      },
    )
    const selection = selectFixtures(
      { classes: new Map(), tokens: new Map(), all: [] },
      FIXTURES,
      extraAll,
    )
    assert.equal(selection.all, true)
    assert.deepEqual(folders(selection), ['activity-list', 'card', 'tag'])
    assert.equal(selection.allReasons[0].source, 'pnpm-lock.yaml')
  })

  it('selects every fixture when the USWDS version changed', () => {
    const reasons = dependencyReasons(['packages/styles/package.json'], {
      base: '^3.0.0',
      head: '^3.14.0',
    })
    assert.equal(reasons.length, 1)
    assert.match(reasons[0].via, /\^3\.0\.0 to \^3\.14\.0/u)
  })

  it('selects nothing extra for other paths', () => {
    assert.deepEqual(
      dependencyReasons(['packages/styles/src/pathable-tag.scss'], {
        base: '^3',
        head: '^3',
      }),
      [],
    )
  })
})

describe('cases that cannot be narrowed to classes', () => {
  /** Diffs two small stylesheets of one file each. */
  const diffOne = (before, after, fixtures = FIXTURES) =>
    selectFixtures(
      diffStyles(
        compile({ 'one.scss': before }),
        compile({ 'one.scss': after }),
      ),
      fixtures,
    )

  it('selects every fixture for a rule whose list has a selector with no class', () => {
    const selection = select(
      'pathable-card.scss',
      `${BASE['pathable-card.scss']}button, .pathable-card { margin: 0; }\n`,
    )
    assert.equal(selection.all, true)
    assert.equal(selection.allReasons[0].selector, 'button, .pathable-card')
  })

  it('selects every fixture for a token read by a rule with no class', () => {
    const rules = 'p { margin: var(--space); }\n'
    const selection = diffOne(
      `:root { --space: 1px; }\n${rules}`,
      `:root { --space: 2px; }\n${rules}`,
    )
    assert.equal(selection.all, true)
    assert.equal(selection.allReasons[0].token, '--space')
    assert.equal(selection.allReasons[0].selector, 'p')
  })

  it('selects every fixture for a token whose only reader is an unread custom property', () => {
    const selection = diffOne(
      ':root { --a: #06c; --b: var(--a); }\n',
      ':root { --a: #0a5; --b: var(--a); }\n',
    )
    assert.equal(selection.all, true)
    assert.equal(selection.allReasons[0].token, '--a')
  })

  it('selects a fixture that names a changed custom property', () => {
    const fixtures = [
      ...FIXTURES,
      {
        folder: 'inline',
        files: [
          {
            path: 'fixtures/inline/basic.html',
            html: '<div class="inline-demo" data-token="--gap"></div>',
          },
        ],
      },
    ]
    const rules = '.pathable-card { gap: var(--gap); }\n'
    const selection = diffOne(
      `:root { --gap: 1px; }\n${rules}`,
      `:root { --gap: 2px; }\n${rules}`,
      fixtures,
    )
    assert.equal(selection.all, false)
    assert.deepEqual(folders(selection), ['card', 'inline'])
    assert.match(
      selection.folders.inline.reasons[0].via,
      /named in the fixture/u,
    )
  })

  it('selects a rule whose declarations only changed order', () => {
    const selection = diffOne(
      '.pathable-card { padding: 1rem; padding-inline: 2rem; }\n',
      '.pathable-card { padding-inline: 2rem; padding: 1rem; }\n',
    )
    assert.deepEqual(folders(selection), ['card'])
  })

  it('selects every fixture for a changed statement at-rule', () => {
    const selection = diffOne(
      '@layer base, components;\n.pathable-card { padding: 1rem; }\n',
      '@layer components, base;\n.pathable-card { padding: 1rem; }\n',
    )
    assert.equal(selection.all, true)
    assert.match(selection.allReasons[0].selector, /^@layer/u)
  })
})

describe('changedPathsSince', () => {
  it('lists both paths of a renamed component page', () => {
    const dir = mkdtempSync(join(tmpdir(), 'affected-git-'))
    dirs.push(dir)
    const git = (...args) =>
      execFileSync('git', args, { cwd: dir, encoding: 'utf8' }).trim()
    git('init', '--quiet')
    git('config', 'user.email', 'test@example.com')
    git('config', 'user.name', 'Test')
    git('config', 'commit.gpgsign', 'false')
    mkdirSync(join(dir, 'packages/styles/components'), { recursive: true })
    const page = join(dir, 'packages/styles/components/activity-list.md')
    writeFileSync(
      page,
      `---\nslug: activity-list\n---\n${'Body.\n'.repeat(20)}`,
    )
    git('add', '.')
    git('commit', '--quiet', '-m', 'base')
    const base = git('rev-parse', 'HEAD')
    renameSync(page, join(dir, 'packages/styles/components/activity.md'))
    git('add', '-A')
    git('commit', '--quiet', '-m', 'rename')

    assert.deepEqual(changedPathsSince(base, 'HEAD', dir).sort(), [
      'packages/styles/components/activity-list.md',
      'packages/styles/components/activity.md',
    ])
  })
})
