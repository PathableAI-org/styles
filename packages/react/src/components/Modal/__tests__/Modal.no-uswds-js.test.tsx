import React from 'react'
import { cleanup, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import '@pathableai/styles'
import { Modal } from '../Modal'

afterEach(cleanup)

describe('Modal without @pathableai/styles/js (T009)', () => {
  it('mounts open shell with styles CSS only (no styles/js)', () => {
    const onClose = vi.fn()

    render(
      <Modal open onClose={onClose} title="Session ended">
        <p>Body content</p>
      </Modal>,
    )

    const dialog = screen.getByRole('dialog', { name: 'Session ended' })
    const wrapper = document.querySelector(
      '.pathable-modal-wrapper.usa-modal-wrapper.is-visible',
    )
    const overlay = document.querySelector(
      '.pathable-modal-overlay.usa-modal-overlay',
    )

    expect(wrapper).not.toBeNull()
    expect(overlay).not.toBeNull()
    expect(dialog.className).toContain('pathable-modal')
    expect(dialog.className).toContain('usa-modal')
    expect(wrapper?.contains(overlay)).toBe(true)
    expect(overlay?.contains(dialog)).toBe(true)
  })
})
