#!/usr/bin/env node

/**
 * Visual capture: the mechanical half of a visual review.
 *
 * Builds the base and head revisions in detached worktrees, chooses the
 * stories "What it captures" in docs/engineering/visual-review.md names,
 * captures them at both revisions, compares each pair, measures contrast at
 * the head, and writes a manifest of files and numbers.
 * It judges nothing; the visual reviewer does. Output stays quiet so whoever
 * runs it spends few tokens: build logs go to files, and stdout is a short
 * summary.
 *
 * Usage:
 *   node scripts/visual-capture.mjs --base <sha> --head <sha> --out <dir>
 *     [--story <id>]...       add a story (react:<id> for the React Storybook)
 *     [--only]                capture only the --story stories (a re-capture);
 *                             reuses the built worktrees, writes a new manifest
 *   node scripts/visual-capture.mjs --out <dir> --clean
 *                             stop nothing, remove the worktrees under <dir>
 *
 * The manifest is <dir>/manifest.json (or <dir>/recapture-<n>.json with
 * --only). Exit status: 0 when every capture ran, 1 when a build or a capture
 * failed (the manifest says which), 2 on bad arguments.
 */

import { spawn } from 'node:child_process'
import {
  createWriteStream,
  existsSync,
  mkdirSync,
  readFileSync,
  readdirSync,
  writeFileSync,
} from 'node:fs'
import { dirname, join, relative, resolve } from 'node:path'
import { pathToFileURL } from 'node:url'
import { parseArgs } from 'node:util'
import { chromium } from 'playwright'

import {
  DIFF_THRESHOLD,
  collectContrast,
  diffRgba,
} from './visual-capture/measure.mjs'
import {
  chooseStories,
  conditionsForDiff,
  conditionsForStory,
  touchesReact,
  viewportsForMode,
} from './visual-capture/select.mjs'

const ROOT = resolve(import.meta.dirname, '..')
const SCHEMA_VERSION = 1
const VIEWPORTS = {
  mobile: { width: 375, height: 812 },
  tablet: { width: 768, height: 1024 },
  desktop: { width: 1280, height: 900 },
}
/** Ports the visual capture serves on; the verifier uses 6006-6007. */
const PORTS = {
  styles: { base: 6020, head: 6021 },
  react: { base: 6022, head: 6023 },
}
const STATIC = {
  styles: 'apps/storybook/storybook-static',
  react: 'apps/storybook-react/storybook-static',
}
const CONCURRENCY = 4

function usage(message) {
  console.error(
    `${message}\nSee the usage notes at the top of ${relative(process.cwd(), import.meta.filename)}.`,
  )
  process.exit(2)
}

const { values: args } = parseArgs({
  options: {
    base: { type: 'string' },
    head: { type: 'string' },
    out: { type: 'string' },
    story: { type: 'string', multiple: true, default: [] },
    only: { type: 'boolean', default: false },
    clean: { type: 'boolean', default: false },
  },
})

if (!args.out) usage('--out <dir> is required.')
const OUT = resolve(args.out)
const WORKTREES = {
  base: join(OUT, 'worktrees/base'),
  head: join(OUT, 'worktrees/head'),
}

/** Run a command; resolve with its exit code, sending output to `log` when given. */
function run(command, commandArgs, { cwd = ROOT, log } = {}) {
  return new Promise((resolvePromise) => {
    const child = spawn(command, commandArgs, {
      cwd,
      stdio: log ? ['ignore', 'pipe', 'pipe'] : ['ignore', 'pipe', 'inherit'],
      env: { ...process.env, CI: '1' },
    })
    let stdout = ''
    // Both pipes share one log stream, so neither may end it: the stream ends
    // when the child closes, and the promise resolves once it has flushed.
    const stream = log ? createWriteStream(log) : null
    if (stream) {
      child.stdout.pipe(stream, { end: false })
      child.stderr.pipe(stream, { end: false })
    } else {
      child.stdout.on('data', (chunk) => (stdout += chunk))
    }
    const finish = (code) => {
      if (!stream) return resolvePromise({ code, stdout })
      stream.end(() => resolvePromise({ code, stdout }))
    }
    child.on('close', (code) => finish(code ?? 1))
    child.on('error', () => finish(1))
  })
}

async function git(...gitArgs) {
  const { code, stdout } = await run('git', gitArgs)
  if (code !== 0) throw new Error(`git ${gitArgs.join(' ')} failed`)
  return stdout.trim()
}

function tail(file, lines = 30) {
  if (!existsSync(file)) return ''
  return readFileSync(file, 'utf8')
    .trimEnd()
    .split('\n')
    .slice(-lines)
    .join('\n')
}

if (args.clean) {
  for (const dir of Object.values(WORKTREES)) {
    if (existsSync(dir))
      await run('git', ['worktree', 'remove', '--force', dir])
  }
  await run('git', ['worktree', 'prune'])
  console.log(`Removed the capture worktrees under ${OUT}.`)
  process.exit(0)
}

if (!args.base || !args.head)
  usage('--base <sha> and --head <sha> are required.')
if (args.only && args.story.length === 0)
  usage('--only needs at least one --story.')

const sha = {}
for (const side of ['base', 'head']) {
  try {
    sha[side] = await git('rev-parse', '--verify', `${args[side]}^{commit}`)
  } catch {
    usage(`${side} ${args[side]} is not a commit in this repository.`)
  }
}

mkdirSync(join(OUT, 'logs'), { recursive: true })

const changed = (await git('diff', '--name-status', `${sha.base}..${sha.head}`))
  .split('\n')
  .filter(Boolean)
  .map((line) => {
    const [status, ...paths] = line.split('\t')
    return { status, path: paths.at(-1) }
  })
const changedPaths = changed.map((entry) => entry.path)
const withReact =
  changedPaths.some(touchesReact) ||
  args.story.some((story) => story.startsWith('react:'))

// ---------------------------------------------------------------------------
// Worktrees and builds
// ---------------------------------------------------------------------------

const errors = []

async function prepare(side) {
  const dir = WORKTREES[side]
  const current = existsSync(dir)
    ? (await run('git', ['-C', dir, 'rev-parse', 'HEAD'])).stdout.trim()
    : null
  if (current !== sha[side]) {
    if (existsSync(dir))
      await run('git', ['worktree', 'remove', '--force', dir])
    mkdirSync(dirname(dir), { recursive: true })
    const added = await run(
      'git',
      ['worktree', 'add', '--detach', dir, sha[side]],
      {
        log: join(OUT, 'logs', `${side}-worktree.log`),
      },
    )
    if (added.code !== 0) return `worktree (see logs/${side}-worktree.log)`
  }
  const steps = [
    ['install', ['install', '--frozen-lockfile']],
    ['build', ['build']],
    ['build-docs', ['build:docs']],
    ...(withReact ? [['build-docs-react', ['build:docs-react']]] : []),
  ]
  const done = join(dir, '.visual-capture-built')
  const built = existsSync(done) ? readFileSync(done, 'utf8').split('\n') : []
  for (const [name, pnpmArgs] of steps) {
    if (built.includes(name)) continue
    const log = join(OUT, 'logs', `${side}-${name}.log`)
    console.log(`${side}: ${name}`)
    const { code } = await run('pnpm', pnpmArgs, { cwd: dir, log })
    if (code !== 0) {
      errors.push({
        step: `${side} ${name}`,
        log: relative(OUT, log),
        tail: tail(log),
      })
      return `${name} (see logs/${side}-${name}.log)`
    }
    built.push(name)
    writeFileSync(done, built.join('\n'))
  }
  return null
}

const failures = {}
for (const side of ['base', 'head']) failures[side] = await prepare(side)

// ---------------------------------------------------------------------------
// Story choice
// ---------------------------------------------------------------------------

function readIndex(side, workspace) {
  const file = join(WORKTREES[side], STATIC[workspace], 'index.json')
  if (!existsSync(file)) return null
  return Object.values(JSON.parse(readFileSync(file, 'utf8')).entries ?? {})
}

async function headLists() {
  const scripts = join(WORKTREES.head, 'packages/styles/scripts')
  const load = async (file) =>
    existsSync(join(scripts, file))
      ? import(pathToFileURL(join(scripts, file)).href)
      : {}
  const gates = await load('quality-gates.mjs')
  return {
    canonical: gates.CANONICAL_STORIES ?? [],
  }
}

const indexes = {
  head: {
    styles: readIndex('head', 'styles'),
    react: withReact ? readIndex('head', 'react') : null,
  },
  base: {
    styles: readIndex('base', 'styles'),
    react: withReact ? readIndex('base', 'react') : null,
  },
}

const lists = failures.head ? { canonical: [] } : await headLists()
let stories = failures.head
  ? []
  : chooseStories({
      changedPaths,
      indexes: indexes.head,
      extra: args.story,
      ...lists,
    })
if (args.only) {
  const wanted = new Set(
    args.story.map((story) =>
      story.includes(':') ? story : `styles:${story}`,
    ),
  )
  stories = stories.filter((story) =>
    wanted.has(`${story.workspace}:${story.id}`),
  )
}

const styleDiff = failures.head
  ? ''
  : (
      await run('git', [
        'diff',
        `${sha.base}..${sha.head}`,
        '--',
        'packages/styles/src',
        'packages/react/src',
        'components',
        'fixtures',
      ])
    ).stdout
const diffConditions = conditionsForDiff(styleDiff)

// ---------------------------------------------------------------------------
// Serving and capturing
// ---------------------------------------------------------------------------

const { startServer } = await import(
  pathToFileURL(join(ROOT, 'packages/styles/scripts/quality-gates.mjs')).href
)

const servers = []
const urls = { base: {}, head: {} }
for (const side of ['base', 'head']) {
  if (failures[side]) continue
  for (const workspace of withReact ? ['styles', 'react'] : ['styles']) {
    const staticDir = join(WORKTREES[side], STATIC[workspace])
    if (!existsSync(staticDir)) continue
    const port = PORTS[workspace][side]
    servers.push(await startServer({ staticDir, port }))
    urls[side][workspace] = `http://127.0.0.1:${port}`
  }
}

const runName = args.only
  ? `recapture-${readdirSync(OUT).filter((name) => name.startsWith('recapture-') && name.endsWith('.json')).length + 1}`
  : 'captures'
const CAPTURES = join(OUT, runName)
mkdirSync(CAPTURES, { recursive: true })

const STILL = `*, *::before, *::after {
  animation-duration: 0s !important; animation-delay: 0s !important;
  transition-duration: 0s !important; transition-delay: 0s !important;
  caret-color: transparent !important; }`

async function mapLimit(items, worker) {
  const results = new Array(items.length)
  let next = 0
  const lane = async () => {
    while (next < items.length) {
      const index = next++
      results[index] = await worker(items[index])
    }
  }
  await Promise.all(
    Array.from({ length: Math.min(CONCURRENCY, items.length) }, lane),
  )
  return results
}

const browser = await chromium.launch()

async function capture({ side, story, viewport, condition, file }) {
  const context = await browser.newContext({
    viewport: VIEWPORTS[viewport],
    deviceScaleFactor: 1,
    reducedMotion: condition === 'reduced-motion' ? 'reduce' : 'no-preference',
    forcedColors: condition === 'forced-colors' ? 'active' : 'none',
  })
  const page = await context.newPage()
  try {
    const url = `${urls[side][story.workspace]}/iframe.html?id=${encodeURIComponent(story.id)}&viewMode=story`
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60_000 })
    // A loaded iframe does not mean the story rendered: check the root for
    // content and for Storybook's failure messages, as the quality gates do.
    const rendered = await page.evaluate(() => {
      const root = globalThis.document.getElementById('storybook-root')
      const html = root?.innerHTML.trim() ?? ''
      return (
        html !== '' &&
        !html.includes('The component failed to render properly') &&
        !html.includes('Sorry, but you either have no stories')
      )
    })
    if (!rendered) throw new Error('the story did not render')
    await page.addStyleTag({ content: STILL })
    if (condition === 'text-200') {
      await page.evaluate(() => {
        globalThis.document.documentElement.style.fontSize = '200%'
      })
    }
    await page.evaluate(() => globalThis.document.fonts.ready)
    if (condition === 'focus') await page.keyboard.press('Tab')
    await page.evaluate(
      () =>
        new Promise((done) =>
          globalThis.requestAnimationFrame(() =>
            globalThis.requestAnimationFrame(done),
          ),
        ),
    )
    await page.screenshot({
      path: file,
      fullPage: true,
      animations: 'disabled',
    })
    let contrast = []
    if (side === 'head' && (condition === 'default' || condition === 'focus')) {
      await page.addScriptTag({
        content: `globalThis.__collectContrast = ${collectContrast.toString()}`,
      })
      const rows = await page.evaluate(() => globalThis.__collectContrast())
      contrast = rows.filter(
        (row) => (condition === 'focus') === (row.kind === 'focus'),
      )
    }
    return { ok: true, contrast }
  } catch (error) {
    return { ok: false, error: error.message.split('\n')[0] }
  } finally {
    await context.close()
  }
}

/** Compare two PNG files in the browser; write the difference image. */
async function compare(baseFile, headFile, diffFile) {
  const page = await browser.newPage()
  try {
    await page.addScriptTag({
      content: `globalThis.__diffRgba = ${diffRgba.toString()}`,
    })
    const result = await page.evaluate(
      async ({ a, b, threshold }) => {
        const load = async (data) => {
          const blob = await (
            await globalThis.fetch(`data:image/png;base64,${data}`)
          ).blob()
          return globalThis.createImageBitmap(blob)
        }
        const [imageA, imageB] = await Promise.all([load(a), load(b)])
        const sizeMismatch =
          imageA.width !== imageB.width || imageA.height !== imageB.height
        const width = Math.max(imageA.width, imageB.width)
        const height = Math.max(imageA.height, imageB.height)
        const pixels = (image) => {
          const canvas = new globalThis.OffscreenCanvas(width, height)
          const context = canvas.getContext('2d')
          context.drawImage(image, 0, 0)
          return context.getImageData(0, 0, width, height)
        }
        const dataA = pixels(imageA)
        const dataB = pixels(imageB)
        const canvas = new globalThis.OffscreenCanvas(width, height)
        const context = canvas.getContext('2d')
        const out = context.createImageData(width, height)
        const count = globalThis.__diffRgba(
          dataA.data,
          dataB.data,
          out.data,
          width,
          height,
          threshold,
        )
        context.putImageData(out, 0, 0)
        const blob = await canvas.convertToBlob({ type: 'image/png' })
        const bytes = new Uint8Array(await blob.arrayBuffer())
        let binary = ''
        for (let i = 0; i < bytes.length; i += 0x8000) {
          binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000))
        }
        return {
          differingPixels: count,
          sizeMismatch,
          base: [imageA.width, imageA.height],
          head: [imageB.width, imageB.height],
          diff: count > 0 || sizeMismatch ? globalThis.btoa(binary) : null,
        }
      },
      {
        a: readFileSync(baseFile).toString('base64'),
        b: readFileSync(headFile).toString('base64'),
        threshold: DIFF_THRESHOLD,
      },
    )
    if (result.diff) writeFileSync(diffFile, Buffer.from(result.diff, 'base64'))
    return {
      differingPixels: result.differingPixels,
      sizeMismatch: result.sizeMismatch,
      sizes: { base: result.base, head: result.head },
      diff: result.diff ? relative(OUT, diffFile) : null,
    }
  } finally {
    await page.close()
  }
}

const plan = stories.flatMap((story) =>
  viewportsForMode(story.mode).flatMap((viewport) =>
    conditionsForStory(story, diffConditions).map((condition) => ({
      story,
      viewport,
      condition,
    })),
  ),
)

const fileFor = (side, { story, viewport, condition }) =>
  join(
    CAPTURES,
    story.workspace,
    story.id,
    `${viewport}-${condition}-${side}.png`,
  )

const inBase = (story) =>
  (indexes.base[story.workspace] ?? []).some((entry) => entry.id === story.id)

const pairs = await mapLimit(plan, async (item) => {
  const { story, viewport, condition } = item
  mkdirSync(join(CAPTURES, story.workspace, story.id), { recursive: true })
  const pair = {
    workspace: story.workspace,
    story: story.id,
    viewport,
    condition,
  }
  if (story.inIndex === false) {
    return { ...pair, status: 'error', error: 'not in the head story index' }
  }
  const headFile = fileFor('head', item)
  const head = await capture({ side: 'head', ...item, file: headFile })
  if (!head.ok)
    return { ...pair, status: 'error', error: `head: ${head.error}` }
  pair.head = relative(OUT, headFile)
  if (head.contrast.length > 0) pair.contrast = head.contrast
  if (failures.base || !inBase(story)) {
    return {
      ...pair,
      status: failures.base ? 'error' : 'new',
      ...(failures.base && { error: 'base did not build' }),
    }
  }
  const baseFile = fileFor('base', item)
  const base = await capture({ side: 'base', ...item, file: baseFile })
  if (!base.ok)
    return { ...pair, status: 'error', error: `base: ${base.error}` }
  pair.base = relative(OUT, baseFile)
  const result = await compare(baseFile, headFile, fileFor('diff', item))
  return {
    ...pair,
    status:
      result.differingPixels > 0 || result.sizeMismatch ? 'different' : 'same',
    ...result,
  }
})

await browser.close()
for (const server of servers) server.close()

// ---------------------------------------------------------------------------
// Manifest
// ---------------------------------------------------------------------------

for (const side of ['base', 'head']) {
  if (failures[side])
    errors.push({ step: `${side} build`, detail: failures[side] })
}
for (const pair of pairs.filter((item) => item.status === 'error')) {
  errors.push({
    step: `capture ${pair.workspace}:${pair.story} ${pair.viewport} ${pair.condition}`,
    detail: pair.error,
  })
}

const manifest = {
  schemaVersion: SCHEMA_VERSION,
  baseSha: sha.base,
  headSha: sha.head,
  run: runName,
  createdAt: new Date().toISOString(),
  rules: 'docs/engineering/visual-review.md#what-it-captures',
  threshold: DIFF_THRESHOLD,
  changedPaths: changed,
  diffConditions,
  stories: stories.map((story) => ({
    ...story,
    inBase: inBase(story),
    viewports: viewportsForMode(story.mode),
    conditions: conditionsForStory(story, diffConditions),
  })),
  pairs,
  errors,
}
const manifestFile = join(OUT, args.only ? `${runName}.json` : 'manifest.json')
writeFileSync(manifestFile, `${JSON.stringify(manifest, null, 2)}\n`)

const count = (status) => pairs.filter((pair) => pair.status === status).length
console.log(
  [
    `Manifest: ${manifestFile}`,
    `Stories: ${stories.length}; pairs: ${pairs.length} (${count('different')} different, ${count('same')} same, ${count('new')} new, ${count('error')} errors)`,
    ...errors.map(
      (error) => `Error: ${error.step}: ${error.detail ?? error.log}`,
    ),
  ].join('\n'),
)
process.exit(errors.length > 0 ? 1 : 0)
