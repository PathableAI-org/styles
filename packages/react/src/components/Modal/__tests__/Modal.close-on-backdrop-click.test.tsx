import React from 'react'
import { cleanup, fireEvent, render, screen } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { Modal } from '../Modal'

afterEach(cleanup)

function getOverlay(): HTMLElement {
  const overlay = document.querySelector(
    '.pathable-modal-overlay.usa-modal-overlay',
  )
  expect(overlay).not.toBeNull()
  return overlay as HTMLElement
}

describe('Modal closeOnBackdropClick (T013, T014)', () => {
  it('does not call onClose when overlay is clicked (default false)', () => {
    const onClose = vi.fn()

    render(
      <Modal open onClose={onClose} title="Default backdrop">
        <p>Body</p>
      </Modal>,
    )

    fireEvent.click(getOverlay())

    expect(onClose).not.toHaveBeenCalled()
    expect(
      screen.getByRole('dialog', { name: 'Default backdrop' }),
    ).toBeTruthy()
  })

  it('does not call onClose when closeOnBackdropClick={false}', () => {
    const onClose = vi.fn()

    render(
      <Modal
        open
        onClose={onClose}
        closeOnBackdropClick={false}
        title="Explicit false"
      >
        <p>Body</p>
      </Modal>,
    )

    fireEvent.click(getOverlay())

    expect(onClose).not.toHaveBeenCalled()
  })

  it('calls onClose when overlay is clicked and closeOnBackdropClick={true}', () => {
    const onClose = vi.fn()

    render(
      <Modal
        open
        onClose={onClose}
        closeOnBackdropClick
        title="Dismissible backdrop"
      >
        <p>Body</p>
      </Modal>,
    )

    fireEvent.click(getOverlay())

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not call onClose when dialog content is clicked', () => {
    const onClose = vi.fn()

    render(
      <Modal open onClose={onClose} closeOnBackdropClick title="Content click">
        <p>Body content</p>
      </Modal>,
    )

    fireEvent.click(screen.getByText('Body content'))

    expect(onClose).not.toHaveBeenCalled()
  })

  it('still runs composed consumer onClick on the dialog', () => {
    const onClose = vi.fn()
    const onClick = vi.fn()

    render(
      <Modal
        open
        onClose={onClose}
        closeOnBackdropClick
        title="Composed click"
        onClick={onClick}
      >
        <p>Body content</p>
      </Modal>,
    )

    fireEvent.click(screen.getByRole('dialog', { name: 'Composed click' }))

    expect(onClick).toHaveBeenCalledTimes(1)
    expect(onClose).not.toHaveBeenCalled()
  })
})
