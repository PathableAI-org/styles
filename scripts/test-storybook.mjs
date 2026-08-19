#!/usr/bin/env node
/**
 * Target-aware Storybook test runner.
 *
 * Owns, per registered target, the build → serve → ready → test → report →
 * cleanup lifecycle. `styles` is registered first as the Styles-first owner of
 * shared component-behavior contracts (`@pathable/storybook-contracts`).
 *
 * This consolidates the duplicate lifecycle logic that previously lived in
 * `scripts/test-storybook.sh` and CI YAML. Unknown targets, occupied ports,
 * missing build output, missing stories, and test failures are hard failures
 * (never silently skipped).
 *
 * NOTE: the top-level `behavior-contracts/` Cucumber pilot was retired once the
 * Styles-first helpers proved equivalent coverage; `test:storybook-styles` is
 * now the mandatory Styles proof.
 *
 * Usage:
 *   node scripts/test-storybook.mjs              # run all targets sequentially
 *   node scripts/test-storybook.mjs styles       # run only the styles target
 *   node scripts/test-storybook.mjs react        # run only the React target
 *   node scripts/test-storybook.mjs styles --filter <pattern>   # narrow to matching stories
 */
import { spawn } from 'node:child_process'
import { access, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import serveHandler from 'serve-handler'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const isWindows = process.platform === 'win32'
const pnpmCommand = 'pnpm'

/**
 * Registered targets. The `styles` target is first (Styles-first ownership).
 * Each target drives its own Storybook workspace and static output. Capabilities
 * and fixtures mirror the shared Accordion contract in `behavior-contracts`; they
 * are declared here so target selection and contract ownership are explicit.
 */
export const targets = {
  styles: {
    name: 'styles',
    storybookWorkspace: '@pathable/storybook',
    buildCommands: [
      [pnpmCommand, '--filter', '@pathable/storybook-contracts', 'build'],
      [pnpmCommand, '--filter', '@pathableai/styles', 'build'],
      [pnpmCommand, '--filter', '@pathable/storybook', 'build-storybook'],
    ],
    staticDirectory: 'apps/storybook/storybook-static',
    port: 6006,
    capabilities: [
      'accordion.keyboard-enter',
      'accordion.keyboard-space',
      'accordion.single-open',
      'accordion.panel-association',
      'accordion.panel-availability',
      'accordion.focus-retention',
    ],
    fixtures: {
      'accordion.default': 'components-communication-accordion--default',
      'accordion.first-expanded':
        'components-communication-accordion--initially-expanded',
    },
    sharedContracts: true,
  },
  react: {
    name: 'react',
    storybookWorkspace: '@pathable/storybook-react',
    buildCommands: [
      [pnpmCommand, '--filter', '@pathable/storybook-contracts', 'build'],
      [pnpmCommand, '--filter', '@pathableai/react', 'build'],
      [pnpmCommand, '--filter', '@pathableai/styles', 'build'],
      [pnpmCommand, '--filter', '@pathable/storybook-react', 'build-storybook'],
    ],
    staticDirectory: 'apps/storybook-react/storybook-static',
    port: 6007,
    capabilities: [
      'accordion.keyboard-enter',
      'accordion.keyboard-space',
      'accordion.single-open',
      'accordion.panel-association',
      'accordion.panel-availability',
      'accordion.focus-retention',
    ],
    fixtures: {
      'accordion.default':
        'components-communication-accordion--contract-default',
      'accordion.first-expanded':
        'components-communication-accordion--contract-initially-expanded',
    },
  },
}

function getTarget(name) {
  const target = targets[name]

  if (!target) {
    const known = Object.keys(targets).join(', ')
    throw new Error(
      `Unknown Storybook target "${name ?? ''}". Expected one of: ${known}`,
    )
  }

  return target
}

/** Validate a target has complete, explicit metadata. Missing data is fatal. */
export function validateTarget(target) {
  const missing = ['storybookWorkspace', 'staticDirectory', 'port'].filter(
    (key) => !target[key],
  )

  if (missing.length > 0) {
    throw new Error(
      `Target "${target.name}" is missing required metadata: ${missing.join(', ')}`,
    )
  }

  const capabilityCount = Object.keys(target.capabilities ?? {}).length

  if (target.sharedContracts && capabilityCount === 0) {
    throw new Error(`Target "${target.name}" declares no shared capabilities.`)
  }
}

function commandLabel(command, args) {
  return `${command} ${args.join(' ')}`
}

function runCommand(command, args, { env = process.env } = {}) {
  return new Promise((resolveCommand, rejectCommand) => {
    const child = spawn(command, args, {
      cwd: repositoryRoot,
      env,
      shell: isWindows,
      stdio: 'inherit',
    })

    child.once('error', (error) => {
      rejectCommand(
        new Error(
          `Unable to start ${commandLabel(command, args)}: ${error.message}`,
        ),
      )
    })

    child.once('close', (code, signal) => {
      if (code === 0) {
        resolveCommand()
        return
      }
      rejectCommand(
        new Error(
          `${commandLabel(command, args)} failed with ${
            signal ? `signal ${signal}` : `exit code ${code}`
          }`,
        ),
      )
    })
  })
}

function startServer(target) {
  const publicDirectory = resolve(repositoryRoot, target.staticDirectory)
  const server = createServer((request, response) => {
    void serveHandler(request, response, { public: publicDirectory }).catch(
      (error) => {
        console.error(
          `Target "${target.name}" static server request failed: ${error.message}`,
        )
        if (!response.headersSent) response.writeHead(500)
        response.end('Internal Server Error')
      },
    )
  })

  return new Promise((resolveServer, rejectServer) => {
    server.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        rejectServer(
          new Error(
            `Target "${target.name}" port ${target.port} is already in use. Stop the existing process or choose another port.`,
          ),
        )
        return
      }

      rejectServer(
        new Error(
          `Target "${target.name}" static server failed to start: ${error.message}`,
        ),
      )
    })

    server.listen(target.port, '127.0.0.1', () => resolveServer(server))
  })
}

async function waitForReady(target) {
  const url = `http://127.0.0.1:${target.port}`
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    try {
      const response = await fetch(`${url}/index.html`, {
        signal: AbortSignal.timeout(1_000),
      })
      if (response.ok || response.status === 301) return url
    } catch {
      // Still starting.
    }

    await delay(250)
  }

  throw new Error(
    `Target "${target.name}" catalog was not ready within 30 seconds at ${url}.`,
  )
}

async function stopServer(server) {
  if (!server?.listening) return

  await new Promise((resolveClose, rejectClose) => {
    server.close((error) => {
      if (error) {
        rejectClose(error)
        return
      }
      resolveClose()
    })
    server.closeAllConnections()
  })
}

async function runTest(target, url, filterPrefix) {
  const args = [
    '--filter',
    target.storybookWorkspace,
    'exec',
    'test-storybook',
    '--url',
    url,
    '--index-json',
  ]
  if (filterPrefix) {
    args.push('--testNamePattern', filterPrefix)
  }
  await runCommand(pnpmCommand, args, {
    env: {
      ...process.env,
      STORYBOOK_TARGET: target.name,
      STORYBOOK_URL: url,
    },
  })
}

/**
 * Preflight: ensure every registered fixture story ID exists in the built
 * Storybook index. A registered-but-missing story must be a hard failure,
 * never silently skipped.
 */
async function validateFixturesExist(target) {
  const indexPath = resolve(
    repositoryRoot,
    target.staticDirectory,
    'index.json',
  )

  let index
  try {
    index = JSON.parse(await readFile(indexPath, 'utf8'))
  } catch (error) {
    throw new Error(
      `Target "${target.name}" has no readable built Storybook index at ${indexPath}: ${error.message}`,
      { cause: error },
    )
  }

  const entries = index.entries ?? index.stories ?? {}
  const missing = Object.values(target.fixtures ?? {}).filter(
    (storyId) => !entries[storyId],
  )

  if (missing.length > 0) {
    throw new Error(
      `Target "${target.name}" registers fixtures whose story IDs are missing from the built catalog: ${missing.join(', ')}`,
    )
  }
}

async function runTarget(targetName, filterPrefix) {
  const target = getTarget(targetName)
  validateTarget(target)

  console.log(`\n=== Storybook target: ${target.name} ===`)

  for (const command of target.buildCommands) {
    const [cmd, ...args] = command
    await runCommand(cmd, args)
  }

  await access(resolve(repositoryRoot, target.staticDirectory)).catch(
    (error) => {
      throw new Error(
        `Target "${target.name}" static directory "${target.staticDirectory}" is unavailable: ${error.message}`,
        { cause: error },
      )
    },
  )

  await validateFixturesExist(target)

  let server
  try {
    server = await startServer(target)
    activeServer = server

    const url = await waitForReady(target)
    await runTest(target, url, filterPrefix)

    console.log(`✓ Target "${target.name}" passed.`)
  } finally {
    if (activeServer === server) {
      await cleanupActiveServer()
    } else {
      await stopServer(server)
    }
  }
}

let activeServer
let cleanupPromise

function cleanupActiveServer() {
  if (!activeServer) return Promise.resolve()
  if (cleanupPromise) return cleanupPromise

  const server = activeServer
  cleanupPromise = stopServer(server).finally(() => {
    if (activeServer === server) activeServer = undefined
    cleanupPromise = undefined
  })
  return cleanupPromise
}

async function handleSignal(signal) {
  console.error(`\nReceived ${signal}; stopping Storybook processes.`)
  try {
    await cleanupActiveServer()
  } finally {
    process.exit(signal === 'SIGINT' ? 130 : 143)
  }
}

process.once('SIGINT', () => void handleSignal('SIGINT'))
process.once('SIGTERM', () => void handleSignal('SIGTERM'))

const rawArgs = process.argv.slice(2)
let filterPattern
const requestedTargets = []

for (let i = 0; i < rawArgs.length; i += 1) {
  const arg = rawArgs[i]
  if (arg === '--filter') {
    const next = rawArgs[i + 1]
    if (!next || next.startsWith('-')) {
      console.error(
        'Error: --filter requires a non-empty value (a story-id prefix).',
      )
      process.exit(1)
    }
    filterPattern = next
    i += 1
  } else if (arg.startsWith('--filter=')) {
    const value = arg.slice('--filter='.length)
    if (!value) {
      console.error(
        'Error: --filter requires a non-empty value (a story-id prefix).',
      )
      process.exit(1)
    }
    filterPattern = value
  } else {
    requestedTargets.push(arg)
  }
}

const targetNames =
  requestedTargets.length > 0 ? requestedTargets : Object.keys(targets)

const results = {}

async function writeEvidence() {
  const payload = {
    targets: results,
    filter: filterPattern || null,
  }
  await writeFile(
    resolve(repositoryRoot, 'scripts/.storybook-evidence.json'),
    JSON.stringify(payload, null, 2),
  )
}

try {
  for (const targetName of targetNames) {
    try {
      await runTarget(targetName, filterPattern)
      results[targetName] = { passed: true }
    } catch (error) {
      results[targetName] = { passed: false, error: error.message }
      console.error(`\nStorybook target failed: ${error.message}`)
      process.exitCode = 1
      break
    }
  }

  await writeEvidence()

  const passedCount = Object.values(results).filter((r) => r.passed).length
  if (targetNames.length > 1) {
    console.log(
      `\n✓ ${passedCount}/${targetNames.length} Storybook targets passed.`,
    )
  }
} catch (error) {
  console.error(`\nStorybook target run failed: ${error.message}`)
  process.exitCode = 1
}
