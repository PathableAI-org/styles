/**
 * Ties each component page to the code it describes. It does not generate
 * the page: the page is written by hand and is the specification; this check
 * fails when the page and the code disagree.
 *
 * For every component that has a page under packages/styles/components/:
 *   - the front matter has the required fields and the body the required
 *     sections, and the page does not mention the underlying framework classes;
 *   - the styles class and the React export exist;
 *   - every variant value exists in both: a React prop union member (with the
 *     stated default) and, unless it is the default, a modifier class;
 *   - every variant value appears in the component's story files, and every
 *     state names a story that exists;
 *   - the canonical story exists in each Storybook and is a canonical story of
 *     the quality gates, and the baseline key is a committed pixel baseline of
 *     that story;
 *   - the React example compiles against the package source, and the markup
 *     example uses only classes that exist;
 *   - every guarantee cites evidence that exists: a pixel baseline, or a story
 *     play function, optionally a named `step` in it;
 *   - the derived index is current.
 *
 * Components without a page are counted, not failed: pages are opt-in while
 * the format is trialled.
 *
 *   node scripts/check-component-pages.mjs
 */

import { existsSync, readdirSync } from 'node:fs'
import { readFile } from 'node:fs/promises'
import { dirname, join, relative, resolve } from 'node:path'
import { fileURLToPath, pathToFileURL } from 'node:url'

import ts from 'typescript'

import {
  indexFile,
  pagesDir,
  readPages,
  renderIndex,
} from './component-pages.mjs'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')

export const REQUIRED_FIELDS = [
  'name',
  'slug',
  'kind',
  'summary',
  'styles-class',
  'react-export',
  'canonical-story',
  'variants',
  'states',
  'guarantees',
]

export const REQUIRED_SECTIONS = [
  'When to use',
  'Example',
  'Variants',
  'States',
  'Composition',
  'Guarantees',
  'The consumer owns',
  'Known defects',
]

const KINDS = ['static', 'behavioural']

// ---------------------------------------------------------------------------
// Pure checks: a page against facts gathered from the repository
// ---------------------------------------------------------------------------

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/gu, '\\$&')

/** Whether stylesheet source defines a rule for the class. */
export const hasClass = (scss, className) =>
  new RegExp(`\\.${escapeRegExp(className)}(?![\\w-])`, 'u').test(scss)

const fencedBlocks = (body, language) =>
  [
    ...body.matchAll(
      new RegExp(`^\`\`\`${language}\\n([\\s\\S]*?)^\`\`\`$`, 'gmu'),
    ),
  ].map((match) => match[1])

function checkFrontMatter(page, errors) {
  const { data, slug } = page
  for (const field of REQUIRED_FIELDS) {
    if (data[field] === undefined)
      errors.push(`missing front matter field "${field}"`)
  }
  if (data.slug !== undefined && data.slug !== slug) {
    errors.push(`slug "${data.slug}" does not match the file name "${slug}.md"`)
  }
  if (data.kind !== undefined && !KINDS.includes(data.kind)) {
    errors.push(
      `kind must be one of ${KINDS.join(', ')}; received "${data.kind}"`,
    )
  }
  if (data.kind === 'static' && !data.baseline) {
    errors.push(
      'a static component needs a "baseline": its pixel baseline is its main evidence',
    )
  }
  for (const field of ['variants', 'states', 'guarantees']) {
    if (data[field] !== undefined && !Array.isArray(data[field])) {
      errors.push(`"${field}" must be a list`)
    }
  }
  if (Array.isArray(data.guarantees) && data.guarantees.length === 0) {
    errors.push('a page must state at least one guarantee')
  }
}

function checkBody(page, errors) {
  const headings = new Set(
    [...page.body.matchAll(/^#{1,6} (.+)$/gmu)].map((match) => match[1].trim()),
  )
  if (!page.body.trimStart().startsWith(`# ${page.data.name}\n`)) {
    errors.push(`the body must start with "# ${page.data.name}"`)
  }
  for (const section of REQUIRED_SECTIONS) {
    if (!headings.has(section)) errors.push(`missing section "## ${section}"`)
  }
  if (/\busa-/u.test(page.markdown)) {
    errors.push('consumer-facing pages must not mention usa-* classes')
  }
}

function checkStory(storybook, id, facts, errors, context) {
  const story = facts.stories[storybook]?.get(id)
  if (!story) errors.push(`${context}: no ${storybook} story "${id}"`)
  return story
}

function checkVariants(page, facts, errors) {
  const { data } = page
  const cls = data['styles-class']
  const component = facts.reactExports.get(data['react-export'])
  const storyFiles = ['styles', 'react'].map((storybook) => ({
    storybook,
    source:
      facts.stories[storybook]?.get(data['canonical-story'])?.fileSource ?? '',
  }))

  for (const variant of Array.isArray(data.variants) ? data.variants : []) {
    const { axis, values } = variant
    if (!axis || !Array.isArray(values) || variant.default === undefined) {
      errors.push('each variant needs "axis", "default" and a "values" list')
      continue
    }
    if (!values.includes(variant.default)) {
      errors.push(
        `variant "${axis}": default "${variant.default}" is not one of its values`,
      )
    }

    for (const value of values) {
      const modifier = `${cls}--${value}`
      if (value !== variant.default && !hasClass(facts.scss, modifier)) {
        errors.push(
          `variant "${axis}=${value}": no .${modifier} rule in the styles source`,
        )
      }
      if (
        value !== variant.default &&
        !storyFiles[0].source.includes(modifier)
      ) {
        errors.push(
          `variant "${axis}=${value}": the styles story file never renders .${modifier}`,
        )
      }
      if (component && !storyFiles[1].source.includes(`'${value}'`)) {
        errors.push(
          `variant "${axis}=${value}": the React story file never uses '${value}'`,
        )
      }
    }

    if (!component) continue
    const prop = component.props.get(axis)
    if (!prop) {
      errors.push(
        `variant "${axis}": ${data['react-export']} has no "${axis}" prop`,
      )
      continue
    }
    const missing = values.filter((value) => !prop.values.includes(value))
    const extra = prop.values.filter((value) => !values.includes(value))
    if (missing.length)
      errors.push(
        `variant "${axis}": React does not accept ${missing.join(', ')}`,
      )
    if (extra.length)
      errors.push(
        `variant "${axis}": React also accepts ${extra.join(', ')}, which the page omits`,
      )
    if (prop.default !== variant.default) {
      errors.push(
        `variant "${axis}": React defaults to "${prop.default}", the page says "${variant.default}"`,
      )
    }
  }
}

function checkStates(page, facts, errors) {
  const { data } = page
  for (const state of Array.isArray(data.states) ? data.states : []) {
    if (!state?.name || !state?.story) {
      errors.push('each state needs "name" and "story" (storybook/story-id)')
      continue
    }
    const [storybook, id] = state.story.split('/')
    checkStory(storybook, id, facts, errors, `state "${state.name}"`)
  }
  if (
    data.kind === 'static' &&
    Array.isArray(data.states) &&
    data.states.length > 0
  ) {
    errors.push('a static component has no states; mark it behavioural instead')
  }
}

function checkStoriesAndBaseline(page, facts, errors) {
  const { data } = page
  const id = data['canonical-story']
  checkStory('styles', id, facts, errors, 'canonical-story')
  if (facts.reactExports.has(data['react-export'])) {
    checkStory('react', id, facts, errors, 'canonical-story')
  }
  if (id && !facts.canonicalStories.has(id)) {
    errors.push(
      `canonical-story "${id}" is not in the quality gates' CANONICAL_STORIES`,
    )
  }
  if (data.baseline) {
    const baselineStory = facts.baselines.get(data.baseline)
    if (!baselineStory) {
      errors.push(
        `baseline "${data.baseline}" is not a committed pixel baseline`,
      )
    } else if (baselineStory !== id) {
      errors.push(
        `baseline "${data.baseline}" captures "${baselineStory}", not the canonical story`,
      )
    }
  }
}

function checkExamples(page, facts, errors) {
  const tsx = fencedBlocks(page.body, 'tsx')
  const html = fencedBlocks(page.body, 'html')
  if (tsx.length !== 1)
    errors.push(`expected one tsx example; found ${tsx.length}`)
  if (html.length !== 1)
    errors.push(`expected one html example; found ${html.length}`)

  for (const diagnostic of tsx.length === 1
    ? facts.compileExample(page.slug, tsx[0])
    : []) {
    errors.push(`the tsx example does not compile: ${diagnostic}`)
  }
  for (const markup of html) {
    for (const [, classes] of markup.matchAll(/class="([^"]*)"/gu)) {
      for (const className of classes.split(/\s+/u).filter(Boolean)) {
        if (!hasClass(facts.scss, className)) {
          errors.push(
            `the html example uses .${className}, which the styles source does not define`,
          )
        }
      }
    }
  }
}

const EVIDENCE =
  /^(?:pixel (?<baseline>\S+)|play (?<storybook>styles|react)\/(?<story>\S+?)(?: > (?<step>.+))?)$/u

function checkGuarantees(page, facts, errors) {
  const ids = new Set()
  for (const guarantee of Array.isArray(page.data.guarantees)
    ? page.data.guarantees
    : []) {
    const { id, claim, evidence } = guarantee ?? {}
    if (!id || !claim || !Array.isArray(evidence) || evidence.length === 0) {
      errors.push(
        'each guarantee needs "id", "claim" and a non-empty "evidence" list',
      )
      continue
    }
    if (ids.has(id)) errors.push(`duplicate guarantee id "${id}"`)
    ids.add(id)

    for (const item of evidence) {
      const match = String(item).match(EVIDENCE)
      if (!match) {
        errors.push(
          `guarantee "${id}": evidence "${item}" is neither "pixel <key>" nor "play <storybook>/<story-id>[ > <step>]"`,
        )
        continue
      }
      const { baseline, storybook, story, step } = match.groups
      if (baseline && !facts.baselines.has(baseline)) {
        errors.push(
          `guarantee "${id}": no committed pixel baseline "${baseline}"`,
        )
      }
      if (story) {
        const found = checkStory(
          storybook,
          story,
          facts,
          errors,
          `guarantee "${id}"`,
        )
        if (found && !found.play) {
          errors.push(
            `guarantee "${id}": ${storybook}/${story} has no play function`,
          )
        }
        if (found && step && !found.steps.includes(step)) {
          errors.push(
            `guarantee "${id}": ${storybook}/${story} has no step "${step}"`,
          )
        }
      }
    }
  }
}

/** Every disagreement between one page and the repository, as messages. */
export function checkPage(page, facts) {
  const errors = []
  checkFrontMatter(page, errors)
  if (errors.length) return errors

  const { data } = page
  if (!hasClass(facts.scss, data['styles-class'])) {
    errors.push(
      `styles-class "${data['styles-class']}" has no rule in the styles source`,
    )
  }
  if (!facts.reactExports.has(data['react-export'])) {
    errors.push(
      `react-export "${data['react-export']}" is not exported by @pathableai/react`,
    )
  }
  checkBody(page, errors)
  checkVariants(page, facts, errors)
  checkStates(page, facts, errors)
  checkStoriesAndBaseline(page, facts, errors)
  checkExamples(page, facts, errors)
  checkGuarantees(page, facts, errors)
  return errors
}

// ---------------------------------------------------------------------------
// Facts: what the repository contains
// ---------------------------------------------------------------------------

function listFiles(dir, pattern) {
  return readdirSync(dir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile() && pattern.test(entry.name))
    .map((entry) => join(entry.parentPath, entry.name))
}

/** Storybook's id rules: sanitized title, `--`, sanitized start-cased export name. */
export const sanitize = (value) =>
  value
    .toLowerCase()
    .replace(/[^a-z0-9]+/gu, '-')
    .replace(/^-+|-+$/gu, '')

export const storyId = (title, exportName) =>
  `${sanitize(title)}--${sanitize(exportName.replace(/([a-z0-9])([A-Z])/gu, '$1 $2'))}`

/** Parses a CSF file's stories: id, play function and named steps per export. */
export function readStories(source) {
  const title = source.match(/\btitle:\s*['"]([^'"]+)['"]/u)?.[1]
  if (!title) return []
  const exports = [...source.matchAll(/^export const (\w+)/gmu)]
  return exports.map((match, index) => {
    const block = source.slice(
      match.index,
      exports[index + 1]?.index ?? source.length,
    )
    const alias = block.match(
      /^export const \w+(?::\s*\w+)?\s*=\s*(\w+)\s*$/mu,
    )?.[1]
    const target = alias
      ? exports.find((other) => other[1] === alias)
      : undefined
    const own = target
      ? source.slice(
          target.index,
          exports[exports.indexOf(target) + 1]?.index ?? source.length,
        )
      : block
    return {
      id: storyId(title, match[1]),
      play: /\bplay:/u.test(own),
      steps: [...own.matchAll(/\bstep\(\s*['"]([^'"]+)['"]/gu)].map(
        (step) => step[1],
      ),
      fileSource: source,
    }
  })
}

async function readStorybook(dir, pattern) {
  const stories = new Map()
  for (const file of listFiles(dir, pattern)) {
    for (const story of readStories(await readFile(file, 'utf8'))) {
      stories.set(story.id, story)
    }
  }
  return stories
}

async function readBaselines() {
  const source = await readFile(
    join(repoRoot, 'packages/styles/scripts/test-pixels.mjs'),
    'utf8',
  )
  const baselines = new Map()
  for (const [, id, key] of source.matchAll(
    /id:\s*'([^']+)',\s*key:\s*'([^']+)'/gu,
  )) {
    const dir = join(repoRoot, 'visual-baselines/styles', key)
    if (
      existsSync(dir) &&
      readdirSync(dir).some((file) => file.endsWith('.png'))
    ) {
      baselines.set(key, id)
    }
  }
  return baselines
}

const exampleFile = (slug) =>
  join(repoRoot, `packages/react/src/__component-page-${slug}__.tsx`)

/**
 * Builds one TypeScript program over the React entry point, so the component
 * pages' examples compile against the package source the way a consumer's code
 * compiles against `@pathableai/react`.
 */
function reactProgram(examples) {
  const packageDir = join(repoRoot, 'packages/react')
  const configFile = ts.readConfigFile(
    join(packageDir, 'tsconfig.json'),
    ts.sys.readFile,
  )
  const { options } = ts.parseJsonConfigFileContent(
    configFile.config,
    ts.sys,
    packageDir,
  )
  Object.assign(options, {
    noEmit: true,
    baseUrl: packageDir,
    paths: { '@pathableai/react': ['./src/index.ts'] },
  })

  const entry = join(packageDir, 'src/index.ts')
  const host = ts.createCompilerHost(options)
  const virtual = new Map(
    [...examples].map(([slug, source]) => [exampleFile(slug), source]),
  )
  const { getSourceFile, fileExists, readFile: hostReadFile } = host
  host.fileExists = (file) => virtual.has(file) || fileExists.call(host, file)
  host.readFile = (file) => virtual.get(file) ?? hostReadFile.call(host, file)
  host.getSourceFile = (file, language, ...rest) =>
    virtual.has(file)
      ? ts.createSourceFile(
          file,
          virtual.get(file),
          language,
          true,
          ts.ScriptKind.TSX,
        )
      : getSourceFile.call(host, file, language, ...rest)

  return ts.createProgram([entry, ...virtual.keys()], options, host)
}

/** The React package's component exports, with each prop's literal values and default. */
function readReactExports(program) {
  const checker = program.getTypeChecker()
  const entry = program.getSourceFile(
    join(repoRoot, 'packages/react/src/index.ts'),
  )
  const components = new Map()

  for (const exported of checker.getExportsOfModule(
    checker.getSymbolAtLocation(entry),
  )) {
    const symbol =
      exported.flags & ts.SymbolFlags.Alias
        ? checker.getAliasedSymbol(exported)
        : exported
    if (
      !(symbol.flags & ts.SymbolFlags.Value) ||
      !/^[A-Z]/u.test(exported.name)
    )
      continue

    const declaration = symbol.valueDeclaration
    const parameter =
      declaration && ts.isFunctionDeclaration(declaration)
        ? declaration.parameters[0]
        : undefined
    const props = new Map()
    if (parameter) {
      const defaults = new Map()
      if (ts.isObjectBindingPattern(parameter.name)) {
        for (const element of parameter.name.elements) {
          const name = (element.propertyName ?? element.name).getText()
          if (element.initializer && ts.isStringLiteral(element.initializer)) {
            defaults.set(name, element.initializer.text)
          }
        }
      }
      for (const property of checker
        .getTypeAtLocation(parameter)
        .getProperties()) {
        const type = checker.getNonNullableType(
          checker.getTypeOfSymbolAtLocation(property, parameter),
        )
        const members = type.isUnion() ? type.types : [type]
        const values = members
          .filter((member) => member.isStringLiteral())
          .map((member) => member.value)
        if (values.length) {
          props.set(property.name, {
            values,
            default: defaults.get(property.name),
          })
        }
      }
    }
    components.set(exported.name, { props })
  }
  return components
}

/** Gathers everything the checks compare a page with. */
export async function gatherFacts(pages) {
  const wrappers = join(repoRoot, 'packages/styles/src')
  const scss = (
    await Promise.all(
      listFiles(wrappers, /\.scss$/u).map((file) => readFile(file, 'utf8')),
    )
  ).join('\n')

  const examples = new Map()
  for (const page of pages) {
    const [example] = fencedBlocks(page.body, 'tsx')
    if (example) examples.set(page.slug, example)
  }
  const program = reactProgram(examples)

  const { CANONICAL_STORIES } = await import(
    pathToFileURL(join(repoRoot, 'packages/styles/scripts/quality-gates.mjs'))
      .href
  )

  return {
    scss,
    stories: {
      styles: await readStorybook(
        join(repoRoot, 'packages/styles/src/stories'),
        /\.stories\.ts$/u,
      ),
      react: await readStorybook(
        join(repoRoot, 'packages/react/src/stories'),
        /\.stories\.tsx$/u,
      ),
    },
    canonicalStories: new Set(CANONICAL_STORIES.map((story) => story.id)),
    baselines: await readBaselines(),
    reactExports: readReactExports(program),
    compileExample: (slug) =>
      ts
        .getPreEmitDiagnostics(
          program,
          program.getSourceFile(exampleFile(slug)),
        )
        .map((diagnostic) =>
          ts.flattenDiagnosticMessageText(diagnostic.messageText, ' '),
        ),
  }
}

// ---------------------------------------------------------------------------
// CLI
// ---------------------------------------------------------------------------

async function main() {
  const pages = await readPages()
  const facts = await gatherFacts(pages)
  let failed = false

  for (const page of pages) {
    const errors = checkPage(page, facts)
    for (const error of errors)
      console.error(`[component-pages] ${page.file}: ${error}`)
    failed ||= errors.length > 0
  }

  const indexPath = join(pagesDir, indexFile)
  const committed = existsSync(indexPath)
    ? await readFile(indexPath, 'utf8')
    : ''
  if (committed !== renderIndex(pages)) {
    console.error(
      `[component-pages] ${relative(repoRoot, indexPath)} is stale; run pnpm build:component-index`,
    )
    failed = true
  }

  const withPage = new Set(pages.map((page) => page.data['react-export']))
  const components = [...facts.reactExports.keys()]
  const covered = components.filter((name) => withPage.has(name)).length
  console.log(
    `[component-pages] ${pages.length} page(s) checked; ${covered} of ${components.length} React component exports have a page`,
  )
  if (failed) process.exitCode = 1
}

if (
  process.argv[1] &&
  import.meta.url === pathToFileURL(process.argv[1]).href
) {
  main().catch((error) => {
    console.error(`[component-pages] ${error.message}`)
    process.exitCode = 1
  })
}
