#!/usr/bin/env node

import { appendFile, mkdir, readFile, writeFile } from 'node:fs/promises'
import { dirname, extname, relative, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import ts from 'typescript'

const repoRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const storiesRoot = resolve(repoRoot, 'packages/react/src/stories')
const reactIndexPath = resolve(repoRoot, 'packages/react/src/index.ts')
const resultsRoot = resolve(repoRoot, 'apps/storybook-react/test-results')
const strict = process.argv.includes('--strict')
const renderingTags = new Set(['client-ssr', 'client-only'])
const browserGlobals = new Set([
  'document',
  'window',
  'navigator',
  'localStorage',
  'sessionStorage',
  'matchMedia',
  'ResizeObserver',
  'MutationObserver',
  'IntersectionObserver',
])
const sourceExtensions = ['.tsx', '.ts', '.jsx', '.js']

function toRepoPath(path) {
  return relative(repoRoot, path).split('\\').join('/')
}

function propertyName(node) {
  if (!node) return undefined
  if (ts.isIdentifier(node) || ts.isStringLiteral(node)) return node.text
  return undefined
}

function objectProperty(object, name) {
  return object?.properties.find(
    (property) =>
      ts.isPropertyAssignment(property) && propertyName(property.name) === name,
  )
}

function objectValue(object, name) {
  return objectProperty(object, name)?.initializer
}

function stringValue(node) {
  return node &&
    (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node))
    ? node.text.trim()
    : undefined
}

function nodeLine(sourceFile, node) {
  return (
    sourceFile.getLineAndCharacterOfPosition(node.getStart(sourceFile)).line + 1
  )
}

function sourceFileFor(path, source) {
  return ts.createSourceFile(
    path,
    source,
    ts.ScriptTarget.Latest,
    true,
    path.endsWith('x') ? ts.ScriptKind.TSX : ts.ScriptKind.TS,
  )
}

async function resolveSourceImport(fromPath, specifier) {
  if (!specifier.startsWith('.')) return undefined

  const unresolved = resolve(dirname(fromPath), specifier)
  const extension = extname(unresolved)
  const bases = extension
    ? [unresolved.slice(0, -extension.length)]
    : [unresolved]
  const candidates = [unresolved]

  for (const base of bases) {
    for (const sourceExtension of sourceExtensions) {
      candidates.push(`${base}${sourceExtension}`)
      candidates.push(resolve(base, `index${sourceExtension}`))
    }
  }

  for (const candidate of candidates) {
    try {
      await readFile(candidate, 'utf8')
      return candidate
    } catch (error) {
      if (error?.code !== 'ENOENT' && error?.code !== 'EISDIR') throw error
    }
  }

  return undefined
}

function findMetaObject(sourceFile) {
  const variables = new Map()
  let defaultExport

  for (const statement of sourceFile.statements) {
    if (ts.isVariableStatement(statement)) {
      for (const declaration of statement.declarationList.declarations) {
        if (
          ts.isIdentifier(declaration.name) &&
          declaration.initializer &&
          ts.isObjectLiteralExpression(declaration.initializer)
        ) {
          variables.set(declaration.name.text, declaration.initializer)
        } else if (
          ts.isIdentifier(declaration.name) &&
          declaration.initializer &&
          ts.isSatisfiesExpression(declaration.initializer) &&
          ts.isObjectLiteralExpression(declaration.initializer.expression)
        ) {
          variables.set(
            declaration.name.text,
            declaration.initializer.expression,
          )
        }
      }
    }

    if (ts.isExportAssignment(statement) && !statement.isExportEquals) {
      defaultExport = statement.expression
    }
  }

  if (defaultExport && ts.isIdentifier(defaultExport)) {
    return variables.get(defaultExport.text)
  }
  if (defaultExport && ts.isObjectLiteralExpression(defaultExport)) {
    return defaultExport
  }
  return undefined
}

async function walkFiles(root, suffix) {
  const { readdir } = await import('node:fs/promises')
  const entries = await readdir(root, { withFileTypes: true })
  const files = []

  for (const entry of entries) {
    const path = resolve(root, entry.name)
    if (entry.isDirectory()) files.push(...(await walkFiles(path, suffix)))
    else if (entry.isFile() && entry.name.endsWith(suffix)) files.push(path)
  }

  return files.sort()
}

async function readStory(storyPath) {
  const source = await readFile(storyPath, 'utf8')
  const sourceFile = sourceFileFor(storyPath, source)
  const meta = findMetaObject(sourceFile)

  if (!meta) {
    return {
      storyPath,
      sourceFile,
      error: 'The story has no statically analyzable default meta object.',
    }
  }

  const imports = new Map()
  for (const statement of sourceFile.statements) {
    if (!ts.isImportDeclaration(statement)) continue
    const specifier = stringValue(statement.moduleSpecifier)
    if (!specifier || !statement.importClause) continue

    if (statement.importClause.name) {
      imports.set(statement.importClause.name.text, specifier)
    }
    const bindings = statement.importClause.namedBindings
    if (bindings && ts.isNamedImports(bindings)) {
      for (const element of bindings.elements) {
        imports.set(element.name.text, specifier)
      }
    }
  }

  const componentNode = objectValue(meta, 'component')
  const componentName =
    componentNode && ts.isIdentifier(componentNode)
      ? componentNode.text
      : undefined
  const componentSpecifier = componentName
    ? imports.get(componentName)
    : undefined
  const componentPath = componentSpecifier
    ? await resolveSourceImport(storyPath, componentSpecifier)
    : undefined
  const tagsNode = objectValue(meta, 'tags')
  const tags =
    tagsNode && ts.isArrayLiteralExpression(tagsNode)
      ? tagsNode.elements.map(stringValue).filter(Boolean)
      : []
  const parameters = objectValue(meta, 'parameters')
  const rendering =
    parameters && ts.isObjectLiteralExpression(parameters)
      ? objectValue(parameters, 'rendering')
      : undefined
  const reason =
    rendering && ts.isObjectLiteralExpression(rendering)
      ? stringValue(objectValue(rendering, 'reason'))
      : undefined

  return {
    storyPath,
    sourceFile,
    meta,
    componentName,
    componentPath,
    tags,
    reason,
    line: nodeLine(sourceFile, meta),
  }
}

function hasUseClientDirective(sourceFile) {
  return sourceFile.statements.some(
    (statement) =>
      ts.isExpressionStatement(statement) &&
      stringValue(statement.expression) === 'use client',
  )
}

function isIdentifierReference(node) {
  const parent = node.parent
  if (!parent) return true
  if (ts.isPropertyAccessExpression(parent) && parent.name === node)
    return false
  if (ts.isPropertyAssignment(parent) && parent.name === node) return false
  if (ts.isImportSpecifier(parent) || ts.isImportClause(parent)) return false
  if (ts.isBindingElement(parent) && parent.name === node) return false
  return true
}

async function inspectModule(rootPath) {
  const visited = new Set()
  const signals = []
  let rootUsesClient = false

  async function visit(path, isRoot) {
    if (visited.has(path)) return
    visited.add(path)

    const source = await readFile(path, 'utf8')
    const sourceFile = sourceFileFor(path, source)
    const usesClient = hasUseClientDirective(sourceFile)
    if (isRoot) rootUsesClient = usesClient
    const localSignals = []
    const localImports = []
    const reactNamespaces = new Set()

    for (const statement of sourceFile.statements) {
      if (!ts.isImportDeclaration(statement)) continue
      const specifier = stringValue(statement.moduleSpecifier)
      if (!specifier) continue

      if (specifier.startsWith('.')) localImports.push(specifier)

      if (specifier === 'react' && statement.importClause?.namedBindings) {
        const bindings = statement.importClause.namedBindings
        if (ts.isNamespaceImport(bindings))
          reactNamespaces.add(bindings.name.text)
        if (ts.isNamedImports(bindings)) {
          for (const element of bindings.elements) {
            const importedName = element.propertyName?.text ?? element.name.text
            if (/^use[A-Z]/.test(importedName) && importedName !== 'useId') {
              localSignals.push({
                kind: 'client-hook',
                detail: importedName,
                line: nodeLine(sourceFile, element),
              })
            }
          }
        }
      }

      if (specifier === 'react-dom' || specifier === 'react-dom/client') {
        localSignals.push({
          kind: 'client-runtime',
          detail: specifier,
          line: nodeLine(sourceFile, statement),
        })
      }
    }

    function scan(node) {
      if (
        ts.isIdentifier(node) &&
        browserGlobals.has(node.text) &&
        isIdentifierReference(node)
      ) {
        localSignals.push({
          kind: 'browser-global',
          detail: node.text,
          line: nodeLine(sourceFile, node),
        })
      }

      if (
        ts.isPropertyAccessExpression(node) &&
        ts.isIdentifier(node.expression) &&
        reactNamespaces.has(node.expression.text) &&
        /^use[A-Z]/.test(node.name.text) &&
        node.name.text !== 'useId'
      ) {
        localSignals.push({
          kind: 'client-hook',
          detail: `React.${node.name.text}`,
          line: nodeLine(sourceFile, node),
        })
      }

      ts.forEachChild(node, scan)
    }
    scan(sourceFile)

    const uniqueSignals = new Map()
    for (const signal of localSignals) {
      uniqueSignals.set(
        `${signal.kind}:${signal.detail}:${signal.line}`,
        signal,
      )
    }
    for (const signal of uniqueSignals.values()) {
      signals.push({
        ...signal,
        path: toRepoPath(path),
        protectedByClientBoundary: usesClient,
      })
    }

    if (!usesClient) {
      for (const specifier of localImports) {
        const dependency = await resolveSourceImport(path, specifier)
        if (dependency) await visit(dependency, false)
      }
    }
  }

  await visit(rootPath, true)
  return { rootUsesClient, signals }
}

async function publicComponentModules() {
  const source = await readFile(reactIndexPath, 'utf8')
  const sourceFile = sourceFileFor(reactIndexPath, source)
  const modules = new Set()

  for (const statement of sourceFile.statements) {
    if (!ts.isExportDeclaration(statement) || !statement.moduleSpecifier)
      continue
    const specifier = stringValue(statement.moduleSpecifier)
    if (!specifier?.startsWith('./components/')) continue
    const path = await resolveSourceImport(reactIndexPath, specifier)
    if (path) modules.add(path)
  }

  return modules
}

function finding(code, story, message, sourcePath, line) {
  return {
    code,
    component: story.componentName ?? 'Unknown component',
    storyPath: toRepoPath(story.storyPath),
    sourcePath: sourcePath
      ? toRepoPath(sourcePath)
      : toRepoPath(story.storyPath),
    line: line ?? story.line ?? 1,
    message,
  }
}

async function main() {
  const storyPaths = await walkFiles(storiesRoot, '.stories.tsx')
  const stories = await Promise.all(storyPaths.map(readStory))
  const findings = []
  const records = []
  const coveredModules = new Set()

  for (const story of stories) {
    if (story.error) {
      findings.push(finding('invalid-meta', story, story.error))
      continue
    }

    if (!story.componentName || !story.componentPath) {
      records.push({
        story: toRepoPath(story.storyPath),
        classification: 'composition',
        findings: 0,
      })
      continue
    }

    coveredModules.add(story.componentPath)
    const declaredTags = story.tags.filter((tag) => renderingTags.has(tag))
    const classification = declaredTags[0] ?? 'server'
    const inspection = await inspectModule(story.componentPath)
    const unprotectedSignals = inspection.signals.filter(
      (signal) => !signal.protectedByClientBoundary,
    )
    const recordFindings = []

    if (declaredTags.length > 1) {
      recordFindings.push(
        finding(
          'conflicting-tags',
          story,
          'Declare only one rendering exception: client-ssr or client-only.',
        ),
      )
    }

    if (declaredTags.length && !story.reason) {
      recordFindings.push(
        finding(
          'missing-reason',
          story,
          'Rendering exceptions require parameters.rendering.reason.',
        ),
      )
    }

    if (!declaredTags.length && inspection.rootUsesClient) {
      recordFindings.push(
        finding(
          'unacknowledged-client-boundary',
          story,
          'The component declares use client but its Storybook meta does not declare client-ssr or client-only.',
          story.componentPath,
          1,
        ),
      )
    }

    if (!declaredTags.length && unprotectedSignals.length) {
      const firstSignal = unprotectedSignals[0]
      const summary = [
        ...new Set(
          unprotectedSignals.map(
            (signal) => `${signal.kind}: ${signal.detail}`,
          ),
        ),
      ].join(', ')
      recordFindings.push(
        finding(
          'unacknowledged-client-feature',
          story,
          `Potential client-boundary features found (${summary}). Refactor for Server Components or acknowledge the boundary with client-ssr/client-only and a reason.`,
          resolve(repoRoot, firstSignal.path),
          firstSignal.line,
        ),
      )
    }

    if (declaredTags.length && !inspection.rootUsesClient) {
      recordFindings.push(
        finding(
          'missing-client-directive',
          story,
          `${classification} components must preserve a use client directive at their public module boundary.`,
          story.componentPath,
          1,
        ),
      )
    }

    findings.push(...recordFindings)
    records.push({
      component: story.componentName,
      story: toRepoPath(story.storyPath),
      source: toRepoPath(story.componentPath),
      classification,
      reason: story.reason ?? null,
      usesClientDirective: inspection.rootUsesClient,
      signals: inspection.signals,
      findings: recordFindings.map((item) => item.code),
    })
  }

  const publicModules = await publicComponentModules()
  for (const modulePath of publicModules) {
    if (coveredModules.has(modulePath)) continue
    findings.push({
      code: 'missing-component-story',
      component: 'Uncatalogued public module',
      storyPath: null,
      sourcePath: toRepoPath(modulePath),
      line: 1,
      message:
        'Every public component module needs a component-level Storybook meta before its server contract can be audited.',
    })
  }

  const classifiedRecords = records.filter(
    (record) => record.classification !== 'composition',
  )
  const summary = {
    mode: strict ? 'strict' : 'advisory',
    componentStories: classifiedRecords.length,
    compositions: records.length - classifiedRecords.length,
    serverDefault: classifiedRecords.filter(
      (record) => record.classification === 'server',
    ).length,
    clientSsr: classifiedRecords.filter(
      (record) => record.classification === 'client-ssr',
    ).length,
    clientOnly: classifiedRecords.filter(
      (record) => record.classification === 'client-only',
    ).length,
    findings: findings.length,
  }
  const report = {
    generatedAt: new Date().toISOString(),
    summary,
    findings,
    components: records,
  }

  const markdown = [
    '# React server compatibility audit',
    '',
    `Mode: **${summary.mode}**`,
    '',
    '| Component stories | Server default | Client SSR | Client only | Findings |',
    '| ---: | ---: | ---: | ---: | ---: |',
    `| ${summary.componentStories} | ${summary.serverDefault} | ${summary.clientSsr} | ${summary.clientOnly} | ${summary.findings} |`,
    '',
    strict
      ? 'Strict mode fails when findings remain.'
      : 'Advisory mode reports findings without failing the check.',
    '',
    '## Findings',
    '',
    ...(findings.length
      ? findings.map(
          (item) =>
            `- **${item.component}** \`${item.code}\` — ${item.message} (${item.sourcePath}:${item.line})`,
        )
      : ['No server compatibility findings.']),
    '',
  ].join('\n')

  await mkdir(resultsRoot, { recursive: true })
  await writeFile(
    resolve(resultsRoot, 'server-compatibility.json'),
    `${JSON.stringify(report, null, 2)}\n`,
  )
  await writeFile(resolve(resultsRoot, 'server-compatibility.md'), markdown)

  if (process.env.GITHUB_STEP_SUMMARY) {
    await appendFile(process.env.GITHUB_STEP_SUMMARY, markdown)
  }

  for (const item of findings) {
    if (process.env.GITHUB_ACTIONS === 'true') {
      console.log(
        `::warning file=${item.sourcePath},line=${item.line},title=React server compatibility::${item.component}: ${item.message}`,
      )
    } else {
      console.warn(
        `[server-compat] ${item.sourcePath}:${item.line} ${item.component}: ${item.message}`,
      )
    }
  }

  console.log(
    `[server-compat] ${summary.componentStories} component stories audited; ${summary.findings} finding(s); mode=${summary.mode}`,
  )

  if (strict && findings.length) process.exitCode = 1
}

main().catch((error) => {
  console.error('[server-compat] Audit infrastructure failed')
  console.error(error)
  process.exitCode = 1
})
