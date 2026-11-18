import { userEvent, within, expect } from 'storybook/test'
import {
  verifyDialogName,
  type StoryHarness,
} from '@pathable/storybook-contracts'

export default {
  title: 'Components/Communication/Modal',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Status**: CSS-only in this package. The React wrapper at `@pathableai/react` provides JS behavior (open/close, focus trapping, keyboard Escape, scroll locking).\n\n**Open shell markup** (PathAble-only; CSS-driven): `.pathable-modal-wrapper.is-visible` → `.pathable-modal-overlay` → `.pathable-modal.usa-modal` dialog with `.pathable-modal__content`, `__heading`, `__footer`, and `__close`. Open presentation uses static `.is-visible` on the wrapper — no USWDS modal JS is required to inject or show the shell.\n\n**Shared semantics verified**: the dialog has a heading-derived accessible name and a labelled close button. Plays also assert `.pathable-modal-wrapper.is-visible` and `.pathable-modal-overlay` are present.\n\n**Note**: The `pathable-modal__heading` replaces the title element. No `__overlay`, `__dialog`, `__header`, or `__title` selectors exist on the dialog content tree.\n\n**Consumers must**: Import `@pathableai/styles` CSS. For JS behavior, use `@pathableai/react` Modal component or import `@pathableai/styles/js`. When using USWDS JS, keep `.usa-modal` on the DOM alongside `.pathable-modal`. React open portals dual-class wrapper/overlay; this styles Storybook fixture proves the PathAble-only open path.',
      },
    },
  },
}

function harnessFor(root: HTMLElement): StoryHarness {
  return {
    root,
    within,
    userEvent,
    expect,
  }
}

const DIALOG_NAME = /Add Support Activity/i

function openShellMarkup(options?: {
  headingId?: string
  bodyHtml?: string
}): string {
  const headingId = options?.headingId ?? 'modal-heading'
  const bodyHtml =
    options?.bodyHtml ??
    `<p>Select the type of support activity to add to this participant's coaching plan. Activities are tied to employment goals and require supervisor approval.</p>`

  return `
<div class="pathable-modal-wrapper is-visible">
  <div class="pathable-modal-overlay">
    <div class="pathable-modal usa-modal" role="dialog" aria-modal="true" aria-labelledby="${headingId}">
      <div class="pathable-modal__content">
        <div class="pathable-modal__heading">
          <h2 id="${headingId}">Add Support Activity</h2>
          <button class="pathable-modal__close" aria-label="Close modal">&times;</button>
        </div>
        ${bodyHtml}
        <div class="pathable-modal__footer">
          <button class="pathable-button">Add Activity</button>
          <button class="pathable-button pathable-button--outline">Cancel</button>
        </div>
      </div>
    </div>
  </div>
</div>
  `
}

/** Close control must sit within this distance of the dialog's top and right edges. */
const CLOSE_CORNER_TOLERANCE_PX = 16

/** Resolves a colour custom property to the computed `rgb()` string. */
function resolveColorToken(token: string, doc: Document): string {
  if (!getComputedStyle(doc.documentElement).getPropertyValue(token).trim()) {
    throw new Error(`Modal story token ${token} is undefined`)
  }
  const probe = doc.createElement('span')
  probe.style.color = `var(${token})`
  doc.body.append(probe)
  const value = getComputedStyle(probe).color
  probe.remove()
  return value
}

async function assertCloseButtonPlacement(canvasElement: HTMLElement) {
  const dialog = within(canvasElement).getByRole('dialog', {
    name: DIALOG_NAME,
  })
  const close = within(dialog).getByRole('button', { name: /Close modal/i })
  const heading = within(dialog).getByRole('heading', { name: DIALOG_NAME })
  const dialogBox = dialog.getBoundingClientRect()
  const closeBox = close.getBoundingClientRect()
  const headingBox = heading.getBoundingClientRect()

  // Top-right corner of the dialog, above the heading (not beside or under it).
  await expect(dialogBox.right - closeBox.right).toBeGreaterThanOrEqual(0)
  await expect(dialogBox.right - closeBox.right).toBeLessThanOrEqual(
    CLOSE_CORNER_TOLERANCE_PX,
  )
  await expect(closeBox.top - dialogBox.top).toBeGreaterThanOrEqual(0)
  await expect(closeBox.top - dialogBox.top).toBeLessThanOrEqual(
    CLOSE_CORNER_TOLERANCE_PX,
  )
  await expect(closeBox.bottom).toBeLessThanOrEqual(headingBox.top)

  // The × glyph uses the text colour, not the USWDS light-grey base colour.
  await expect(getComputedStyle(close).color).toBe(
    resolveColorToken('--pathable-color-text', close.ownerDocument),
  )
}

async function assertCloseButtonFocusRing(canvasElement: HTMLElement) {
  const close = within(canvasElement).getByRole('button', {
    name: /Close modal/i,
  })

  // The close control is the first tabbable element in the fixture.
  await userEvent.tab()
  await expect(close).toHaveFocus()
  await expect(close.matches(':focus-visible')).toBe(true)

  const style = getComputedStyle(close)
  await expect(style.outlineStyle).toBe('solid')
  await expect(Number.parseFloat(style.outlineWidth)).toBeGreaterThan(0)
  await expect(style.outlineColor).toBe(
    resolveColorToken('--pathable-color-focus-ring', close.ownerDocument),
  )
}

async function assertOpenShell(canvasElement: HTMLElement) {
  const harness = harnessFor(canvasElement)
  const root = harness.within(harness.root)

  await verifyDialogName(harness, DIALOG_NAME)
  await root.getByRole('button', { name: /Close modal/i })

  const wrapper = canvasElement.querySelector(
    '.pathable-modal-wrapper.is-visible',
  )
  const overlay = canvasElement.querySelector('.pathable-modal-overlay')

  await expect(wrapper).toBeTruthy()
  await expect(overlay).toBeTruthy()
}

/**
 * Canonical styles open fixture (FR-009 / US4): PathAble-only wrapper → overlay →
 * dialog with static `.is-visible`. Stable Storybook name for visual review and
 * geometry gates.
 */
export const Open = {
  parameters: {
    docs: {
      description: {
        story:
          "PathAble-only open Modal shell: `.pathable-modal-wrapper.is-visible` → `.pathable-modal-overlay` → `.pathable-modal.usa-modal`. Backdrop and centering come from styles CSS with static `.is-visible` — no USWDS modal JS. The play function also asserts the close button sits in the dialog's top-right corner with a text-coloured icon and shows the `--pathable-color-focus-ring` outline on keyboard focus.",
      },
    },
  },
  render: () => openShellMarkup({ headingId: 'modal-heading-open' }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await assertOpenShell(canvasElement)
    await assertCloseButtonPlacement(canvasElement)
    await assertCloseButtonFocusRing(canvasElement)
  },
}

/** Alias so Storybook autodocs still surfaces a Default entry pointing at Open. */
export const Default = Open

/**
 * Narrow-viewport open fixture (FR-013): same PathAble-only open shell at mobile width.
 */
export const Narrow = {
  globals: { viewport: { value: 'mobile320', isRotated: false } },
  parameters: {
    docs: {
      description: {
        story:
          'Open Modal on a narrow (320px) viewport. Same PathAble-only wrapper → overlay → dialog shell; confirms usable open presentation without consumer layout workarounds (FR-013).',
      },
    },
  },
  render: () => openShellMarkup({ headingId: 'modal-heading-narrow' }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await assertOpenShell(canvasElement)
  },
}

/**
 * Long-content open fixture (FR-013): open shell with scrollable body content.
 */
export const LongContent = {
  parameters: {
    docs: {
      description: {
        story:
          'Open Modal with long body content inside the PathAble-only shell. Confirms overlay scrolling / usable open presentation with tall content (FR-013).',
      },
    },
  },
  render: () =>
    openShellMarkup({
      headingId: 'modal-heading-long',
      bodyHtml: `
        <p>Select the type of support activity to add to this participant's coaching plan. Activities are tied to employment goals and require supervisor approval.</p>
        <p>Long-content fixture: the following paragraphs force overflow so the open overlay can scroll while the dialog remains centered within the PathAble shell.</p>
        <p>Employment goal alignment: each support activity should map to a documented goal, include a proposed start date, and note whether the supervisor must approve before the participant can begin.</p>
        <p>Documentation checklist: verify the participant record is current, confirm the coaching plan version, list required evidence attachments, and capture any accommodation notes that affect scheduling or delivery.</p>
        <p>Follow-up expectations: after approval, schedule the first session, send confirmation to the participant, and update the plan timeline so downstream reporting reflects the new activity.</p>
        <p>Edge review copy: keep scrolling through this body to confirm title remains above body and footer, and that the dimmed backdrop still covers the viewport behind the dialog.</p>
      `,
    }),
  play: async ({ canvasElement }: { canvasElement: HTMLElement }) => {
    await assertOpenShell(canvasElement)
  },
}
