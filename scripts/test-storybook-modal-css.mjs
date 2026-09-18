#!/usr/bin/env node
/**
 * CSS-only Modal Storybook harness (FR-009).
 *
 * Builds `apps/storybook/.storybook-modal-css/` (preview: styles CSS/SCSS only —
 * no `@pathableai/styles/js`), serves the static output, and runs Modal story
 * plays via test-storybook. Default `.storybook/preview.js` is unchanged.
 *
 * Usage:
 *   node scripts/test-storybook-modal-css.mjs
 *   pnpm test:storybook-modal-css
 */
import { spawn } from 'node:child_process'
import { access, readFile } from 'node:fs/promises'
import { createServer } from 'node:http'
import { dirname, resolve } from 'node:path'
import { setTimeout as delay } from 'node:timers/promises'
import { fileURLToPath } from 'node:url'
import serveHandler from 'serve-handler'

const repositoryRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const isWindows = process.platform === 'win32'
const pnpmCommand = 'pnpm'

const STATIC_DIRECTORY = 'apps/storybook/storybook-static-modal-css'
const PORT = parseInt(process.env.STORYBOOK_MODAL_CSS_PORT || '6008', 10)
const WORKSPACE = '@pathable/storybook'
/** Story IDs that must exist and run plays in the CSS-only harness. */
const REQUIRED_STORY_IDS = [
  'components-communication-modal--open',
  'components-communication-modal--narrow',
  'components-communication-modal--long-content',
]

function commandLabel(command, args) {
  return `${command} ${args.join(' ')}`
}

function runCommand(
  command,
  args,
  { cwd = repositoryRoot, env = process.env } = {},
) {
  return new Promise((resolveCommand, rejectCommand) => {
    const child = spawn(command, args, {
      cwd,
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

function startServer(staticDirectory, port) {
  const publicDirectory = resolve(repositoryRoot, staticDirectory)
  const server = createServer((request, response) => {
    void serveHandler(request, response, { public: publicDirectory }).catch(
      (error) => {
        console.error(
          `Modal CSS static server request failed: ${error.message}`,
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
            `Port ${port} is already in use. Stop the existing process or set STORYBOOK_MODAL_CSS_PORT.`,
          ),
        )
        return
      }
      rejectServer(
        new Error(`Modal CSS static server failed to start: ${error.message}`),
      )
    })

    server.listen(port, '127.0.0.1', () => resolveServer(server))
  })
}

async function waitForReady(port) {
  const url = `http://127.0.0.1:${port}`
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
    `Modal CSS catalog was not ready within 30 seconds at ${url}.`,
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

async function validateRequiredStories() {
  const indexPath = resolve(repositoryRoot, STATIC_DIRECTORY, 'index.json')
  let index
  try {
    index = JSON.parse(await readFile(indexPath, 'utf8'))
  } catch (error) {
    throw new Error(
      `No readable Storybook index at ${indexPath}: ${error.message}`,
      { cause: error },
    )
  }

  const entries = index.entries ?? index.stories ?? {}
  const missing = REQUIRED_STORY_IDS.filter((storyId) => !entries[storyId])
  if (missing.length > 0) {
    throw new Error(
      `CSS-only Modal harness is missing required story IDs: ${missing.join(', ')}`,
    )
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
  console.error(`\nReceived ${signal}; stopping Modal CSS Storybook processes.`)
  try {
    await cleanupActiveServer()
  } finally {
    process.exit(signal === 'SIGINT' ? 130 : 143)
  }
}

process.once('SIGINT', () => void handleSignal('SIGINT'))
process.once('SIGTERM', () => void handleSignal('SIGTERM'))

async function main() {
  console.log(
    '\n=== Storybook target: modal-css (CSS-only, no styles/js) ===\n',
  )

  await runCommand(pnpmCommand, [
    '--filter',
    '@pathable/storybook-contracts',
    'build',
  ])
  await runCommand(pnpmCommand, ['--filter', '@pathableai/styles', 'build'])

  await runCommand(
    pnpmCommand,
    [
      '--filter',
      WORKSPACE,
      'exec',
      'storybook',
      'build',
      '-c',
      '.storybook-modal-css',
      '-o',
      'storybook-static-modal-css',
    ],
    {
      env: {
        ...process.env,
        // Avoid production base path used by the default styles build.
        STORYBOOK_BUILD: 'false',
      },
    },
  )

  // storybook build -o is relative to cwd (apps/storybook); ensure repo path exists
  await access(resolve(repositoryRoot, STATIC_DIRECTORY)).catch((error) => {
    throw new Error(
      `Static directory "${STATIC_DIRECTORY}" is unavailable after build: ${error.message}`,
      { cause: error },
    )
  })

  await validateRequiredStories()

  try {
    activeServer = await startServer(STATIC_DIRECTORY, PORT)
    const url = await waitForReady(PORT)

    await runCommand(
      pnpmCommand,
      [
        '--filter',
        WORKSPACE,
        'exec',
        'test-storybook',
        '--url',
        url,
        '--index-json',
        '--config-dir',
        '.storybook-modal-css',
      ],
      {
        env: {
          ...process.env,
          STORYBOOK_TARGET: 'modal-css',
          STORYBOOK_URL: url,
        },
      },
    )

    console.log('\n✓ Modal CSS-only Storybook target passed.')
  } finally {
    await cleanupActiveServer()
  }
}

try {
  await main()
} catch (error) {
  console.error(`\nModal CSS Storybook run failed: ${error.message}`)
  process.exitCode = 1
  await cleanupActiveServer()
}
