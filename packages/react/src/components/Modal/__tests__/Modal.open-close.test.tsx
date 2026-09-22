import React, { useState } from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it } from 'vitest'
import { Modal } from '../Modal'

afterEach(() => {
  cleanup()
  document.body.style.overflow = ''
})

function ControlledModalHarness({
  initiallyOpen = false,
}: {
  initiallyOpen?: boolean
}) {
  const [open, setOpen] = useState(initiallyOpen)

  return (
    <>
      <button type="button" onClick={() => setOpen(true)}>
        Open modal
      </button>
      <Modal open={open} onClose={() => setOpen(false)} title="Confirm action">
        <p>Modal body</p>
      </Modal>
    </>
  )
}

function getOpenShell() {
  return document.querySelector(
    '.pathable-modal-wrapper.usa-modal-wrapper.is-visible',
  )
}

describe('Modal controlled open/close (T012)', () => {
  it('toggles shell presence and restores body scroll and focus', () => {
    document.body.style.overflow = 'scroll'

    // Start open so the first effect captures body overflow before any
    // closed→open cleanup can clear the inline style under test.
    render(<ControlledModalHarness initiallyOpen />)

    const trigger = screen.getByRole('button', { name: 'Open modal' })
    const dialog = screen.getByRole('dialog', { name: 'Confirm action' })

    expect(getOpenShell()).not.toBeNull()
    expect(
      document.querySelector('.pathable-modal-overlay.usa-modal-overlay'),
    ).not.toBeNull()
    expect(dialog.className).toContain('pathable-modal')
    expect(dialog.className).toContain('usa-modal')
    expect(document.body.style.overflow).toBe('hidden')

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }))

    expect(getOpenShell()).toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).toBe('scroll')

    trigger.focus()
    expect(document.activeElement).toBe(trigger)

    fireEvent.click(trigger)

    expect(getOpenShell()).not.toBeNull()
    expect(screen.getByRole('dialog', { name: 'Confirm action' })).toBeTruthy()
    expect(document.body.style.overflow).toBe('hidden')

    fireEvent.click(screen.getByRole('button', { name: 'Close modal' }))

    expect(getOpenShell()).toBeNull()
    expect(screen.queryByRole('dialog')).toBeNull()
    expect(document.body.style.overflow).toBe('scroll')
    expect(document.activeElement).toBe(trigger)
  })
})
