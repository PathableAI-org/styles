#!/usr/bin/env node

/**
 * Storybook Quality Gates
 *
 * Lightweight automated checks that prevent the most severe Storybook
 * regressions identified in tmp/storybook-brand-accessibility-review.md:
 *
 *   1. Missing expected story IDs in the built Storybook index.json.
 *   2. Horizontal overflow (scrollWidth > clientWidth) for canonical stories.
 *   3. Unnamed interactive controls (no accessible name) in canonical stories.
 *   4. Sub-44px visible action targets on mobile/touch canonical stories.
 *
 * Usage:
 *   node packages/styles/scripts/quality-gates.mjs
 *
 * Requires a built Storybook at apps/storybook/storybook-static/.
 * Serves it on a local port, runs Playwright checks, and exits with a
 * non-zero code on failure.
 *
 * Allowlists are embedded below with comments. Keep them explicit and small.
 */

import { createServer } from 'node:http'
import { readFile, access } from 'node:fs/promises'
import { resolve, extname, sep } from 'node:path'
import { constants } from 'node:fs'
import { chromium } from 'playwright'

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const STATIC_DIR = resolve('apps/storybook/storybook-static')
const PORT = parseInt(process.env.QUALITY_GATES_PORT || '6012', 10)
const BASE_URL = `http://127.0.0.1:${PORT}`

/**
 * Canonical stories to audit at the specified viewport(s).
 *
 * mode: 'desktop' | 'mobile' | 'both'
 *   - desktop: check at 1280px (no touch-target enforcement)
 *   - mobile:  check at 375px (touch-target enforcement applies)
 *   - both:    check at both viewports
 */
const CANONICAL_STORIES = [
  // App shell
  { id: 'application-shell-desktop-shell--default', mode: 'desktop' },
  { id: 'application-shell-mobile-shell--default', mode: 'mobile' },
  // Dashboard
  { id: 'dashboard-dashboard-overview--populated', mode: 'desktop' },
  { id: 'dashboard-dashboard-header--with-many-actions', mode: 'both' },
  { id: 'dashboard-table-modifiers--with-actions', mode: 'desktop' },
  // Discovery
  { id: 'discovery-resource-card--grid', mode: 'desktop' },
  { id: 'discovery-wayfinder--default', mode: 'both' },
  // Structured workflow
  { id: 'structured-workflow-wizard--wizard-long-form', mode: 'both' },
  { id: 'structured-workflow-wizard--mobile', mode: 'mobile' },
  // Components – Feedback
  { id: 'components-feedback-toast--stacked', mode: 'desktop' },
  { id: 'components-feedback-pageerror--full-page', mode: 'desktop' },
  // Marketing patterns
  { id: 'marketing-patterns-combined--hero-section', mode: 'desktop' },
  { id: 'marketing-patterns-combined--feature-showcase', mode: 'desktop' },
  // Page-composition archetypes (wave 003)
  { id: 'marketing-patterns-marketing-landing-page--desktop', mode: 'desktop' },
  { id: 'marketing-patterns-operational-dashboard--populated', mode: 'both' },
  { id: 'marketing-patterns-resource-directory--populated', mode: 'both' },
  // Founder recipes (wave 005)
  { id: 'recipes-tool-landing-page--default', mode: 'desktop' },
  { id: 'recipes-tool-landing-page--desktop', mode: 'desktop' },
  { id: 'recipes-tool-landing-page--mobile', mode: 'mobile' },
  { id: 'recipes-questionnaire-results-flow--default', mode: 'desktop' },
  { id: 'recipes-questionnaire-results-flow--mobile', mode: 'mobile' },
  { id: 'recipes-questionnaire-results-flow--questionnaire', mode: 'desktop' },
  { id: 'recipes-questionnaire-results-flow--results', mode: 'desktop' },
  { id: 'recipes-resource-finder--default', mode: 'desktop' },
  { id: 'recipes-resource-finder--empty', mode: 'desktop' },
  { id: 'recipes-resource-finder--mobile', mode: 'mobile' },
  { id: 'recipes-resource-finder--populated', mode: 'desktop' },
  { id: 'recipes-accommodations-intake-wizard--completed', mode: 'desktop' },
  { id: 'recipes-accommodations-intake-wizard--default', mode: 'desktop' },
  { id: 'recipes-accommodations-intake-wizard--in-progress', mode: 'desktop' },
  { id: 'recipes-accommodations-intake-wizard--mobile', mode: 'mobile' },
  { id: 'recipes-operational-dashboard--default', mode: 'desktop' },
  { id: 'recipes-operational-dashboard--empty', mode: 'desktop' },
  { id: 'recipes-operational-dashboard--loading', mode: 'desktop' },
  { id: 'recipes-operational-dashboard--mobile', mode: 'mobile' },
  { id: 'recipes-operational-dashboard--populated', mode: 'desktop' },
]

/**
 * Expected story IDs in the built Storybook index.json.
 */
const EXPECTED_STORIES = [
  // Canonical stories (checked via Playwright)
  ...CANONICAL_STORIES.map((s) => ({ id: s.id })),
]

const VIEWPORTS = {
  desktop: { width: 1280, height: 900 },
  mobile: { width: 375, height: 812 },
}

// ---------------------------------------------------------------------------
// Allowlists
//
// Every entry MUST have a comment explaining why the item is allowed.
// Keep these lists small. Remove entries when the underlying issue is fixed.
// ---------------------------------------------------------------------------

/**
 * Horizontal overflow: stories where scrollWidth > clientWidth is a known,
 * pre-existing issue tracked for a future fix wave.
 *
 * Format: { [storyId]: { [viewport]: 'explanation' } }
 */
const HORIZONTAL_OVERFLOW_ALLOWLIST = {}

/**
 * Unnamed controls: visible interactive elements without an accessible name
 * that are known and accepted (e.g. decorative icon buttons that have an
 * accessible name provided by an adjacent element in a real application).
 *
 * Format: { [storyId]: [{ selector: 'css', reason: 'explanation' }] }
 *
 * Keep this empty by default. Only add entries after careful review.
 */
const UNNAMED_CONTROLS_ALLOWLIST = {
  // Add entries only after manual review:
  // { selector: 'button.close-dialog', reason: '...' }
}

/**
 * Sub-44 px touch targets: mobile-viewport stories where controls smaller
 * than 44 px in either dimension are acceptable.
 *
 * Native radio buttons, checkboxes, and file inputs at their natural size
 * are browser-rendered and have well-understood interaction models;
 * WCAG 2.2 Target Size (2.5.8) exempts these.
 *
 * Format: { [storyId]: [{ selector: 'css', reason: 'explanation' }] }
 */
const SMALL_TOUCH_TARGETS_ALLOWLIST = {
  'structured-workflow-wizard--mobile': [
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Minimum) per G206.',
    },
  ],
  'structured-workflow-wizard--wizard-long-form': [
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Minimum).',
    },
  ],
  'discovery-wayfinder--default': [
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Minimum).',
    },
  ],
  'marketing-patterns-operational-dashboard--populated': [
    {
      selector: '.pathable-dashboard-header__breadcrumb a',
      reason:
        'Breadcrumb nav links render at text line-height on mobile. These are secondary navigation cues, not primary action targets. Tracked for future refinement.',
    },
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Minimum).',
    },
    {
      selector: '.pathable-resource-card__link',
      reason:
        'Resource card title links render at text line-height on mobile. Same pattern as breadcrumb links.',
    },
  ],
  'marketing-patterns-resource-directory--populated': [
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Minimum).',
    },
    {
      selector: '.pathable-resource-card__link',
      reason:
        'Resource card title links render at text line-height on mobile. Same pattern as breadcrumb links.',
    },
  ],
  'dashboard-dashboard-header--with-many-actions': [
    {
      selector: '.pathable-dashboard-header__breadcrumb a',
      reason:
        'Breadcrumb nav links render at text line-height on mobile. These are secondary navigation cues, not primary action targets. Tracked for future refinement.',
    },
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Minimum).',
    },
  ],
  'recipes-questionnaire-results-flow--mobile': [
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Minimum).',
    },
  ],
  'recipes-resource-finder--mobile': [
    {
      selector: 'input[type="radio"], input[type="checkbox"]',
      reason:
        'Native radio/checkbox inputs at natural size are exempt from WCAG 2.2 2.5.8 Target Size (Minimum).',
    },
    {
      selector: '.pathable-logo a',
      reason:
        'Brand logo is a conventional text link in the global header, not a primary touch action in the recipe content.',
    },
  ],
  'recipes-tool-landing-page--mobile': [
    {
      selector: '.pathable-logo a, .pathable-footer a',
      reason:
        'Brand and footer links are conventional text links. Primary CTA buttons remain subject to the 44 px target check.',
    },
  ],
  'recipes-operational-dashboard--mobile': [
    {
      selector:
        '.pathable-dashboard-header__breadcrumb a, .pathable-surface > div > a',
      reason:
        'Breadcrumb and section utility links are conventional inline text links. Primary action controls remain subject to the 44 px target check.',
    },
  ],
}

// ---------------------------------------------------------------------------
// Static file server
// ---------------------------------------------------------------------------

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.mjs': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.png': 'image/png',
  '.svg': 'image/svg+xml',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ico': 'image/x-icon',
  '.txt': 'text/plain; charset=utf-8',
}

function startServer() {
  return new Promise((resolvePromise, reject) => {
    const server = createServer(async (req, res) => {
      // req.url is optional in Node's IncomingMessage — guard against
      // malformed requests that would cause URL parsing to throw.
      if (!req.url) {
        res.writeHead(400)
        res.end('Bad request')
        return
      }
      const url = new URL(req.url, BASE_URL)
      const pathname = url.pathname.slice(1) || 'index.html'
      const filePath = resolve(STATIC_DIR, pathname)

      // Prevent directory traversal.  Resolve the absolute path and then
      // enforce that it stays inside STATIC_DIR by checking for a trailing
      // path separator (platform-aware), not just a string prefix.
      const dir = STATIC_DIR + sep
      if (!filePath.startsWith(dir) && filePath !== STATIC_DIR) {
        res.writeHead(403)
        res.end('Forbidden')
        return
      }

      try {
        await access(filePath, constants.R_OK)
        const data = await readFile(filePath)
        const ext = extname(filePath).toLowerCase()
        res.writeHead(200, {
          'Content-Type': MIME_TYPES[ext] || 'application/octet-stream',
        })
        res.end(data)
      } catch {
        // Only apply SPA fallback for routes without a recognised file
        // extension.  Missing JS/CSS/font assets return 404 so broken
        // builds are not masked by accidentally serving index.html with
        // the wrong Content-Type.
        const ext = extname(filePath).toLowerCase()
        if (ext && MIME_TYPES[ext]) {
          res.writeHead(404)
          res.end('Not found')
          return
        }
        try {
          const fallback = resolve(STATIC_DIR, 'index.html')
          const data = await readFile(fallback)
          res.writeHead(200, {
            'Content-Type': 'text/html; charset=utf-8',
          })
          res.end(data)
        } catch {
          res.writeHead(404)
          res.end('Not found')
        }
      }
    })

    server.listen(PORT, '127.0.0.1', () => resolvePromise(server))
    server.on('error', reject)
  })
}

// ---------------------------------------------------------------------------
// Story index check
// ---------------------------------------------------------------------------

async function checkStoryIndex() {
  const indexPath = resolve(STATIC_DIR, 'index.json')

  let index
  try {
    index = JSON.parse(await readFile(indexPath, 'utf-8'))
  } catch {
    return [
      {
        type: 'missing-index',
        message: `Storybook index.json not found at ${indexPath}. Build the Storybook first: pnpm --filter @pathable/storybook build-storybook`,
      },
    ]
  }

  const entries = index.entries || {}
  const failures = []

  for (const story of EXPECTED_STORIES) {
    if (!entries[story.id]) {
      failures.push({
        type: 'missing-story',
        storyId: story.id,
        message: `Expected story "${story.id}" not found in Storybook index. The story file may be missing, incorrectly named, or excluded from the build.`,
      })
    }
  }

  return failures
}

// ---------------------------------------------------------------------------
// Story-level DOM audits (runs inside Playwright page context)
// ---------------------------------------------------------------------------

/**
 * DOM audit function.  Executed inside the browser via page.evaluate so
 * that CSS selector matching (el.matches()) works on live DOM nodes.
 *
 * All inputs are passed as separate arguments to page.evaluate():
 *   unnamedSelectors – CSS selector strings for the unnamed-controls allowlist
 *   touchSelectors   – CSS selector strings for the touch-target allowlist
 */
const auditScript = function auditStory(opts) {
  const unnamedSelectors = opts.unnamed || []
  const touchSelectors = opts.touch || []
  const viewportName = opts.viewport || 'desktop'
  const failures = []

  const interactiveSelector = [
    'button',
    'a[href]',
    'input:not([type="hidden"])',
    'select',
    'textarea',
    '[role="button"]',
    '[role="link"]',
    '[role="checkbox"]',
    '[role="radio"]',
    '[role="combobox"]',
    '[role="listbox"]',
    '[role="menuitem"]',
    '[role="option"]',
    '[role="switch"]',
    '[role="tab"]',
    '[role="treeitem"]',
    '[tabindex]:not([tabindex="-1"])',
  ].join(',')

  /** Returns true if el matches any of the given CSS selectors. */
  function matchesAnySelector(el, selectors) {
    if (!selectors || selectors.length === 0) return false
    return selectors.some((sel) => {
      try {
        return el.matches(sel)
      } catch {
        return false
      }
    })
  }

  const controls = Array.from(document.querySelectorAll(interactiveSelector))
    .map((el) => {
      const rect = el.getBoundingClientRect()
      if (rect.width <= 0 || rect.height <= 0) return null

      const tag = el.tagName.toLowerCase()
      const elClass =
        typeof el.className === 'string'
          ? el.className
          : el.getAttribute('class') || ''

      // Accessible name computation (simplified).
      // Placeholder is NOT an accessible name (per WCAG); it is
      // supplementary hint text only.  Rely on aria-label,
      // aria-labelledby, or associated <label> elements.
      let accessibleName =
        el.getAttribute('aria-label')?.trim() ||
        el.getAttribute('title')?.trim() ||
        ''

      // aria-labelledby references one or more element IDs whose
      // text content forms the accessible name.
      if (!accessibleName) {
        const labelledBy = el.getAttribute('aria-labelledby')
        if (labelledBy) {
          const texts = labelledBy
            .split(/\s+/)
            .map((id) => {
              const ref = document.getElementById(id)
              return ref ? (ref.textContent || '').trim() : ''
            })
            .filter(Boolean)
          if (texts.length > 0) accessibleName = texts.join(' ')
        }
      }

      const textContent = (el.textContent || '')
        .replace(/\s+/g, ' ')
        .trim()
        .slice(0, 80)

      // Check for associated <label>
      // Only labelable form elements get their accessible name from
      // a wrapping <label>; buttons, links, and other elements do not.
      const labelableTags = new Set([
        'input',
        'select',
        'textarea',
        'meter',
        'output',
        'progress',
      ])
      let hasLabel = false
      if (el.id && labelableTags.has(tag)) {
        hasLabel = !!document.querySelector(`label[for="${CSS.escape(el.id)}"]`)
      }
      if (!hasLabel && labelableTags.has(tag)) {
        hasLabel = el.closest('label') !== null
      }

      const hasName = Boolean(accessibleName || textContent || hasLabel)

      const w = Math.round(rect.width)
      const h = Math.round(rect.height)
      const isActionControl =
        tag === 'button' ||
        tag === 'a' ||
        tag === 'select' ||
        ['button', 'link', 'menuitem', 'option', 'tab'].includes(
          el.getAttribute('role') || '',
        )

      return {
        tag,
        className: elClass.slice(0, 120),
        accessibleName: accessibleName.slice(0, 80),
        textContent,
        hasName,
        width: w,
        height: h,
        isActionControl,
        // Allowlist checks (using real CSS selector matching)
        unnamedAllowed: hasName
          ? true
          : matchesAnySelector(el, unnamedSelectors),
        touchAllowed: matchesAnySelector(el, touchSelectors),
      }
    })
    .filter(Boolean)

  for (const ctrl of controls) {
    // --- unnamed controls ---
    if (!ctrl.hasName && !ctrl.unnamedAllowed) {
      failures.push({
        type: 'unnamed-control',
        tag: ctrl.tag,
        className: ctrl.className,
        width: ctrl.width,
        height: ctrl.height,
        message:
          `Unnamed interactive control: <${ctrl.tag}${ctrl.className ? ` class="${ctrl.className.slice(0, 60)}"` : ''}> ` +
          `(${ctrl.width}×${ctrl.height} px) has no accessible name. ` +
          'Add aria-label, title, or visible text content.',
      })
    }

    // --- small touch targets (mobile only) ---
    if (viewportName !== 'mobile') continue
    if (ctrl.touchAllowed) continue
    if (ctrl.width >= 44 && ctrl.height >= 44) continue

    // Only flag action controls or elements where BOTH dimensions are <44.
    const isSevere =
      ctrl.isActionControl || (ctrl.width < 44 && ctrl.height < 44)
    if (!isSevere) continue

    const label = ctrl.accessibleName || ctrl.textContent || '(no label)'

    failures.push({
      type: 'small-touch-target',
      tag: ctrl.tag,
      className: ctrl.className,
      width: ctrl.width,
      height: ctrl.height,
      label,
      message: `Small touch target: <${ctrl.tag}> (${ctrl.width}×${ctrl.height} px) is under 44 px minimum. Label: "${label}".`,
    })
  }

  return failures
}

// ---------------------------------------------------------------------------
// Run checks for a single story at a single viewport
// ---------------------------------------------------------------------------

async function checkStory(page, storyId, viewportName) {
  const vp = VIEWPORTS[viewportName]
  await page.setViewportSize(vp)

  const url = `${BASE_URL}/iframe.html?id=${encodeURIComponent(storyId)}&viewMode=story`

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 })
    // Allow fonts and animations to settle
    await page.waitForTimeout(800)
  } catch (err) {
    return [
      {
        type: 'navigation-error',
        storyId,
        viewport: viewportName,
        message: `Failed to load story: ${err.message}`,
      },
    ]
  }

  // Detect broken stories: the Storybook-root element should contain
  // rendered story HTML, not just an error display.  The .sb-errordisplay
  // class exists in Storybook's shadow DOM even when stories render fine,
  // so we check for specific failure signals instead.
  const storyRendered = await page.evaluate(() => {
    const root = document.getElementById('storybook-root')
    if (!root) return false

    const html = root.innerHTML || ''
    if (!html.trim()) return false

    // The error display text when a story truly fails to render
    if (html.includes('The component failed to render properly')) return false
    if (html.includes('Sorry, but you either have no stories')) return false

    return true
  })

  if (!storyRendered) {
    const bodyText = await page
      .locator('body')
      .innerText({ timeout: 3000 })
      .catch(() => '')
    return [
      {
        type: 'story-not-found',
        storyId,
        viewport: viewportName,
        message: `Story failed to render: "${bodyText.slice(0, 200).replace(/\s+/g, ' ')}"`,
      },
    ]
  }

  // Run DOM audits with allowlists injected into the page context
  // so that CSS selector matching (el.matches()) works correctly.
  const unnamedSelectors = UNNAMED_CONTROLS_ALLOWLIST[storyId] || []
  const unnamedSelectorList = Array.isArray(unnamedSelectors)
    ? unnamedSelectors.map((e) => e.selector)
    : []

  const touchSelectors = SMALL_TOUCH_TARGETS_ALLOWLIST[storyId] || []
  const touchSelectorList = Array.isArray(touchSelectors)
    ? touchSelectors.map((e) => e.selector)
    : []

  const domFailures = await page.evaluate(auditScript, {
    unnamed: unnamedSelectorList,
    touch: touchSelectorList,
    viewport: viewportName,
  })

  // --- horizontal overflow (checked outside page.evaluate so we can
  //     use the HORIZONTAL_OVERFLOW_ALLOWLIST which is structured
  //     differently) ---
  const scrollInfo = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }))

  const failures = []

  if (scrollInfo.scrollWidth > scrollInfo.clientWidth + 2) {
    const overflowAllowed =
      HORIZONTAL_OVERFLOW_ALLOWLIST[storyId]?.[viewportName]
    if (!overflowAllowed) {
      failures.push({
        type: 'horizontal-overflow',
        storyId,
        viewport: viewportName,
        scrollWidth: scrollInfo.scrollWidth,
        clientWidth: scrollInfo.clientWidth,
        excess: scrollInfo.scrollWidth - scrollInfo.clientWidth,
        message: `Horizontal overflow: scrollWidth ${scrollInfo.scrollWidth} > clientWidth ${scrollInfo.clientWidth} (excess: ${scrollInfo.scrollWidth - scrollInfo.clientWidth} px).`,
      })
    }
  }

  // Annotate DOM-originated failures with story/viewport metadata
  for (const f of domFailures) {
    f.storyId = storyId
    f.viewport = viewportName
  }
  failures.push(...domFailures)

  return failures
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('=== Storybook Quality Gates ===\n')

  // Verify the static build exists
  try {
    await access(STATIC_DIR, constants.R_OK)
  } catch {
    console.error(`Error: Built Storybook not found at ${STATIC_DIR}`)
    console.error('Run: pnpm --filter @pathable/storybook build-storybook')
    process.exit(1)
  }

  // 1. Check story index
  console.log('1. Story index check')
  const indexFailures = await checkStoryIndex()
  if (indexFailures.length > 0) {
    for (const f of indexFailures) {
      console.log(`   ✗ ${f.message}`)
    }

    // If the index itself is missing (not just a missing story entry),
    // exit early — continuing would just produce a noisy cascade of
    // follow-on failures from the Playwright checks.
    const hasCriticalIndexFailure = indexFailures.some(
      (f) => f.type === 'missing-index',
    )
    if (hasCriticalIndexFailure) {
      console.error('\n✗ Critical index failure — aborting')
      process.exit(1)
    }
  } else {
    console.log('   ✓ All expected stories present in index')
  }

  // 2. Start local server
  console.log(`\n2. Starting local server on port ${PORT}…`)
  const server = await startServer()
  console.log(`   Server ready at ${BASE_URL}`)

  const allFailures = [...indexFailures]
  let browser
  let storiesChecked = 0
  let storiesPassed = 0
  const allowedOverflows = []

  try {
    // 3. Launch Playwright
    browser = await chromium.launch({ headless: true })

    // 4. Check each canonical story
    console.log('\n3. Canonical story checks')
    for (const story of CANONICAL_STORIES) {
      const viewports =
        story.mode === 'both' ? ['desktop', 'mobile'] : [story.mode]

      for (const vpName of viewports) {
        const vp = VIEWPORTS[vpName]
        const page = await browser.newPage()

        try {
          const failures = await checkStory(page, story.id, vpName)
          storiesChecked++

          // Log allowlisted overflows for visibility
          const overflowNote = HORIZONTAL_OVERFLOW_ALLOWLIST[story.id]?.[vpName]
          if (
            overflowNote &&
            !failures.some((f) => f.type === 'horizontal-overflow')
          ) {
            allowedOverflows.push(
              `   ~ ${story.id} @ ${vpName} (${vp.width} px): allowlisted overflow`,
            )
          }

          if (failures.length === 0) {
            storiesPassed++
          } else {
            console.log(
              `   ✗ ${story.id} @ ${vpName} (${vp.width} px): ${failures.length} failure(s)`,
            )
            for (const f of failures) {
              console.log(`      [${f.type}] ${f.message}`)
            }
            allFailures.push(...failures)
          }
        } finally {
          await page.close()
        }
      }
    }

    // Print allowlisted overflows (informational)
    if (allowedOverflows.length > 0) {
      console.log('\n   Allowlisted overflows (informational):')
      for (const msg of allowedOverflows) {
        console.log(msg)
      }
    }
  } finally {
    if (browser) await browser.close()
    server.close()
  }

  // 5. Report
  // Count all tracked failures (including missing-index).
  const actionFailures = allFailures.filter((f) => f.type !== 'missing-index')
  const criticalFailures = allFailures.filter((f) => f.type === 'missing-index')

  console.log('\n=== Results ===')
  console.log(`   Stories checked: ${storiesChecked}`)
  console.log(`   Passed:          ${storiesPassed}`)
  console.log(`   Failed:          ${storiesChecked - storiesPassed}`)

  if (actionFailures.length === 0 && criticalFailures.length === 0) {
    console.log('\n✓ All quality gates passed')
    process.exit(0)
  }

  const total = actionFailures.length + criticalFailures.length
  console.log(`\n✗ ${total} total failure(s)`)

  // Group by type for summary
  const byType = {}
  for (const f of actionFailures) {
    if (!byType[f.type]) byType[f.type] = []
    byType[f.type].push(f)
  }
  for (const f of criticalFailures) {
    if (!byType[f.type]) byType[f.type] = []
    byType[f.type].push(f)
  }

  console.log('\n   Failure breakdown:')
  for (const [type, items] of Object.entries(byType)) {
    console.log(`   ${type}: ${items.length}`)
  }

  process.exit(1)
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
