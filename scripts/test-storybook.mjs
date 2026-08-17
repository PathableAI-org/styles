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
 */
import { spawn } from 'node:child_process'
import { access, readFile, writeFile } from 'node:fs/promises'
import { createServer } from 'node:net'
import { dirname, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const isWindows = process.platform === 'win32'
const pnpmCommand = isWindows ? 'pnpm.cmd' : 'pnpm'

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
  },
  react: {
    name: 'react',
    storybookWorkspace: '@pathable/storybook-react',
    buildCommands: [
      [pnpmCommand, '--filter', '@pathable/storybook-contracts', 'build'],
      [pnpmCommand, '--filter', '@pathableai/react', 'build'],
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

  if (!target.capabilities?.length) {
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

/**
 * Deterministic port-availability check. Only a listener that actually binds
 * (`EADDRINUSE`) is treated as occupied; transient probe errors surface as a
 * clear reason rather than being misclassified as "in use".
 */
async function assertPortFree(port) {
  return new Promise((resolveProbe) => {
    const probe = createServer()

    probe.once('error', (error) => {
      if (error.code === 'EADDRINUSE') {
        resolveProbe(false)
        return
      }
      resolveProbe({ error: `Port probe failed: ${error.message}` })
    })

    probe.listen(port, '127.0.0.1', () => {
      probe.close(() => resolveProbe(true))
    })
  })
}

function startServer(port, staticDirectory) {
  return spawn(
    pnpmCommand,
    ['exec', 'serve', '-n', '-l', `tcp://127.0.0.1:${port}`, staticDirectory],
    {
      cwd: repositoryRoot,
      env: process.env,
      stdio: 'inherit',
      detached: !isWindows,
    },
  )
}

async function waitForReady(target, server) {
  const url = `http://127.0.0.1:${target.port}`
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    if (server.exitCode !== null || server.signalCode !== null) {
      throw new Error(
        `Target "${target.name}" static server exited before becoming ready.`,
      )
    }

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
  if (!server || server.exitCode !== null || server.signalCode !== null) return

  if (isWindows) {
    await runCommand('taskkill.exe', ['/PID', String(server.pid), '/T', '/F'])
    return
  }

  try {
    process.kill(-server.pid, 'SIGTERM')
  } catch (error) {
    if (error.code !== 'ESRCH') throw error
    return
  }

  await waitForExit(server, 5_000)

  if (server.exitCode === null && server.signalCode === null) {
    try {
      process.kill(-server.pid, 'SIGKILL')
    } catch (error) {
      if (error.code !== 'ESRCH') throw error
    }
    await waitForExit(server, 1_000)
  }

  if (server.exitCode === null && server.signalCode === null) {
    throw new Error(
      `Static server process group ${server.pid} did not stop after teardown.`,
    )
  }
}

function waitForExit(child, timeoutMs) {
  if (child.exitCode !== null || child.signalCode !== null)
    return Promise.resolve()

  return Promise.race([
    new Promise((resolveExit) => child.once('close', resolveExit)),
    delay(timeoutMs),
  ])
}

async function runTest(target, url) {
  await runCommand(
    pnpmCommand,
    [
      '--filter',
      target.storybookWorkspace,
      'exec',
      'test-storybook',
      '--url',
      url,
      '--index-json',
    ],
    {
      env: {
        ...process.env,
        STORYBOOK_TARGET: target.name,
        STORYBOOK_URL: url,
      },
    },
  )
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

async function runTarget(targetName) {
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
    const portResult = await assertPortFree(target.port)

    if (typeof portResult === 'object') {
      throw new Error(
        `Target "${target.name}" port probe failed on ${target.port}: ${portResult.error}`,
      )
    }

    if (!portResult) {
      throw new Error(
        `Target "${target.name}" port ${target.port} is already in use. Stop the existing process or choose another port.`,
      )
    }

    server = startServer(target.port, target.staticDirectory)
    activeServer = server

    const url = await waitForReady(target, server)
    await runTest(target, url)

    console.log(`✓ Target "${target.name}" passed.`)
  } finally {
    await stopServer(server)
    activeServer = undefined
  }
}

let activeServer

async function handleSignal(signal) {
  console.error(`\nReceived ${signal}; stopping Storybook processes.`)
  try {
    await stopServer(activeServer)
  } finally {
    process.exit(signal === 'SIGINT' ? 130 : 143)
  }
}

process.once('SIGINT', () => void handleSignal('SIGINT'))
process.once('SIGTERM', () => void handleSignal('SIGTERM'))

const requestedTargets = process.argv.slice(2)
const targetNames =
  requestedTargets.length > 0 ? requestedTargets : Object.keys(targets)

const results = {}

async function writeEvidence() {
  await writeFile(
    resolve(repositoryRoot, 'scripts/.storybook-evidence.json'),
    JSON.stringify({ targets: results }, null, 2),
  )
}

try {
  for (const targetName of targetNames) {
    try {
      await runTarget(targetName)
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
