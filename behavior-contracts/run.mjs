import { spawn } from 'node:child_process'
import { access } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import { getTarget, targets } from './targets.mjs'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const requestedTargets = process.argv.slice(2)
const targetNames =
  requestedTargets.length > 0 ? requestedTargets : Object.keys(targets)
const isWindows = process.platform === 'win32'
const pnpmCommand = isWindows ? 'pnpm.cmd' : 'pnpm'
let activeServer

function commandLabel(command, args) {
  return [command, ...args].join(' ')
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

      const outcome = signal ? `signal ${signal}` : `exit code ${code}`
      rejectCommand(
        new Error(`${commandLabel(command, args)} failed with ${outcome}`),
      )
    })
  })
}

function startServer(target) {
  const child = spawn(
    pnpmCommand,
    [
      'exec',
      'serve',
      '-n',
      '-l',
      `tcp://127.0.0.1:${target.port}`,
      target.staticDirectory,
    ],
    {
      cwd: repositoryRoot,
      env: process.env,
      stdio: 'inherit',
      detached: !isWindows,
    },
  )

  child.once('error', (error) => {
    console.error(
      `[contracts:${target.name}] Static server failed to start: ${error.message}`,
    )
  })

  return child
}

async function waitForServer(target, server) {
  const serverUrl = `http://127.0.0.1:${target.port}`
  const deadline = Date.now() + 30_000

  while (Date.now() < deadline) {
    if (server.exitCode !== null) {
      throw new Error(
        `Target "${target.name}" static server exited before becoming ready`,
      )
    }

    try {
      const response = await fetch(serverUrl)
      if (response.ok) return serverUrl
    } catch {
      // The server is still starting.
    }

    await delay(250)
  }

  throw new Error(
    `Target "${target.name}" catalog was not ready within 30 seconds at ${serverUrl}`,
  )
}

async function waitForExit(child, timeoutMs) {
  if (child.exitCode !== null || child.signalCode !== null) return

  await Promise.race([
    new Promise((resolveExit) => child.once('close', resolveExit)),
    delay(timeoutMs),
  ])
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
    throw new Error(`Static server process group ${server.pid} did not stop`)
  }
}

async function runTarget(targetName) {
  const target = getTarget(targetName)

  console.log(`\n=== Accordion behavior contracts: ${target.name} ===`)

  for (const [command, ...args] of target.buildCommands) {
    await runCommand(
      isWindows && command === 'pnpm' ? pnpmCommand : command,
      args,
    )
  }

  await access(resolve(repositoryRoot, target.staticDirectory))
  const server = startServer(target)
  activeServer = server

  try {
    const storybookUrl = await waitForServer(target, server)

    await runCommand(
      pnpmCommand,
      [
        'exec',
        'cucumber-js',
        '--config',
        'behavior-contracts/cucumber.mjs',
        '--format',
        'summary',
        '--strict',
      ],
      {
        env: {
          ...process.env,
          CONTRACT_TARGET: target.name,
          CONTRACT_STORYBOOK_URL: storybookUrl,
        },
      },
    )
  } finally {
    await stopServer(server)
    activeServer = undefined
  }
}

async function handleSignal(signal) {
  console.error(`\nReceived ${signal}; stopping behavior-contract processes.`)
  try {
    await stopServer(activeServer)
  } finally {
    process.exit(signal === 'SIGINT' ? 130 : 143)
  }
}

process.once('SIGINT', () => void handleSignal('SIGINT'))
process.once('SIGTERM', () => void handleSignal('SIGTERM'))

try {
  for (const targetName of targetNames) {
    await runTarget(targetName)
  }
} catch (error) {
  console.error(`\nAccordion behavior contracts failed: ${error.message}`)
  process.exitCode = 1
}
