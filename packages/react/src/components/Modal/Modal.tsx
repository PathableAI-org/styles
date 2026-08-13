import {
  useCallback,
  useEffect,
  useId,
  useRef,
  type HTMLAttributes,
  type KeyboardEvent,
  type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

export interface ModalProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  'title'
> {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  closeLabel?: string
  initialFocusRef?: React.RefObject<HTMLElement | null>
}

interface BackgroundElementState {
  ariaHidden: string | null
  inert: string | null
}

interface InlineStyleState {
  value: string
  priority: string
}

interface ModalLayer {
  wrapper: HTMLElement
  dialog: HTMLElement
  returnFocus: HTMLElement | null
}

const FOCUSABLE_SELECTOR = [
  'button:not(:disabled):not([hidden])',
  '[href]:not([hidden])',
  'input:not(:disabled):not([hidden])',
  'select:not(:disabled):not([hidden])',
  'textarea:not(:disabled):not([hidden])',
  '[tabindex]:not([tabindex="-1"]):not(:disabled):not([hidden])',
].join(', ')

const modalLayers: ModalLayer[] = []
const backgroundStates = new Map<Element, BackgroundElementState>()
let bodyOverflow: InlineStyleState | null = null
let bodyObserver: MutationObserver | null = null
let pageReturnFocus: HTMLElement | null = null

function restoreBackgroundElement(element: Element) {
  const state = backgroundStates.get(element)
  if (!state) return

  if (state.ariaHidden === null) element.removeAttribute('aria-hidden')
  else element.setAttribute('aria-hidden', state.ariaHidden)

  if (state.inert === null) element.removeAttribute('inert')
  else element.setAttribute('inert', state.inert)
}

function syncBackgroundIsolation() {
  const activeWrapper = modalLayers.at(-1)?.wrapper

  for (const element of Array.from(document.body.children)) {
    if (!backgroundStates.has(element)) {
      backgroundStates.set(element, {
        ariaHidden: element.getAttribute('aria-hidden'),
        inert: element.getAttribute('inert'),
      })
    }

    if (element === activeWrapper) {
      restoreBackgroundElement(element)
    } else {
      element.setAttribute('aria-hidden', 'true')
      element.setAttribute('inert', '')
    }
  }
}

function registerModalLayer(layer: ModalLayer) {
  if (modalLayers.length === 0) {
    pageReturnFocus = layer.returnFocus
    bodyOverflow = {
      value: document.body.style.getPropertyValue('overflow'),
      priority: document.body.style.getPropertyPriority('overflow'),
    }
    document.body.style.setProperty('overflow', 'hidden')
    bodyObserver = new MutationObserver(syncBackgroundIsolation)
    bodyObserver.observe(document.body, { childList: true })
  }

  modalLayers.push(layer)
  syncBackgroundIsolation()

  return () => {
    const layerIndex = modalLayers.indexOf(layer)
    const wasActiveLayer = layerIndex === modalLayers.length - 1
    if (layerIndex !== -1) modalLayers.splice(layerIndex, 1)

    if (modalLayers.length > 0) {
      syncBackgroundIsolation()
    } else {
      bodyObserver?.disconnect()
      bodyObserver = null
      for (const element of backgroundStates.keys()) {
        restoreBackgroundElement(element)
      }
      backgroundStates.clear()

      if (bodyOverflow?.value) {
        document.body.style.setProperty(
          'overflow',
          bodyOverflow.value,
          bodyOverflow.priority,
        )
      } else {
        document.body.style.removeProperty('overflow')
      }
      bodyOverflow = null
    }

    if (!wasActiveLayer) return

    const nextLayer = modalLayers.at(-1)
    if (
      layer.returnFocus?.isConnected &&
      (!nextLayer || nextLayer.wrapper.contains(layer.returnFocus))
    ) {
      layer.returnFocus.focus()
    } else if (!nextLayer && pageReturnFocus?.isConnected) {
      pageReturnFocus.focus()
    } else {
      nextLayer?.dialog.querySelector<HTMLElement>(FOCUSABLE_SELECTOR)?.focus()
    }

    if (!nextLayer) pageReturnFocus = null
  }
}

export function Modal({
  open,
  onClose,
  title,
  description,
  children,
  footer,
  closeLabel = 'Close modal',
  initialFocusRef,
  className = '',
  onKeyDown: consumerOnKeyDown,
  ...rest
}: ModalProps) {
  const autoId = useId()
  const titleId = `modal-title-${autoId}`
  const descriptionId = description ? `modal-desc-${autoId}` : undefined
  const wrapperRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    if (!open) return

    const wrapper = wrapperRef.current
    const dialog = dialogRef.current
    if (!wrapper || !dialog) return

    let unregister: (() => void) | undefined
    let nativeObserver: MutationObserver | undefined

    const activate = () => {
      if (unregister) return

      wrapper.classList.replace('is-hidden', 'is-visible')
      unregister = registerModalLayer({
        wrapper,
        dialog,
        returnFocus: document.activeElement as HTMLElement | null,
      })

      const requestedFocus = initialFocusRef?.current
      const initialFocus =
        requestedFocus && dialog.contains(requestedFocus)
          ? requestedFocus
          : closeRef.current
      initialFocus?.focus()
    }

    const nativeWrapper = document.querySelector<HTMLElement>(
      '.pathable-modal-wrapper.is-visible:not([data-react-owned])',
    )
    if (!nativeWrapper) {
      activate()
    } else {
      if (!nativeWrapper.hasAttribute('data-force-action')) {
        nativeWrapper
          .querySelector<HTMLElement>(':scope > .pathable-modal-overlay')
          ?.click()
      }

      if (!nativeWrapper.classList.contains('is-visible')) {
        activate()
      } else {
        nativeObserver = new MutationObserver(() => {
          if (
            !nativeWrapper.isConnected ||
            !nativeWrapper.classList.contains('is-visible')
          ) {
            nativeObserver?.disconnect()
            activate()
          }
        })
        nativeObserver.observe(document.body, {
          childList: true,
          subtree: true,
          attributes: true,
          attributeFilter: ['class'],
        })
      }
    }

    return () => {
      nativeObserver?.disconnect()
      unregister?.()
    }
  }, [initialFocusRef, open])

  const handleKeyDown = useCallback(
    (event: KeyboardEvent<HTMLDivElement>) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
        return
      }

      if (event.key !== 'Tab' || !dialogRef.current) return

      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR),
      ).filter((element) => element.getClientRects().length > 0)
      const first = focusable[0]
      const last = focusable[focusable.length - 1]

      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      }
    },
    [onClose],
  )

  if (!open || typeof document === 'undefined') return null

  const classes = ['pathable-modal', 'usa-modal', className]
    .filter(Boolean)
    .join(' ')

  return createPortal(
    <div
      ref={wrapperRef}
      className="pathable-modal-wrapper usa-modal-wrapper is-hidden"
      data-react-owned="true"
    >
      {/* Escape provides the keyboard equivalent for backdrop dismissal. */}
      {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
      <div
        className="pathable-modal-overlay usa-modal-overlay"
        onClick={(event) => {
          if (event.target === event.currentTarget) onClose()
        }}
      >
        {/* The dialog owns Escape and Tab containment for accessible behavior. */}
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions */}
        <div
          {...rest}
          ref={dialogRef}
          className={classes}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          aria-describedby={descriptionId}
          data-react-owned="true"
          onKeyDown={(event) => {
            handleKeyDown(event)
            consumerOnKeyDown?.(event)
          }}
        >
          <div className="pathable-modal__content usa-modal__content">
            <div className="pathable-modal__main usa-modal__main">
              <h2
                id={titleId}
                className="pathable-modal__heading usa-modal__heading"
              >
                {title}
              </h2>
              {description && <p id={descriptionId}>{description}</p>}
              {children && <div>{children}</div>}
              {footer && (
                <div className="pathable-modal__footer usa-modal__footer">
                  {footer}
                </div>
              )}
            </div>
            <button
              ref={closeRef}
              className="pathable-button usa-button pathable-modal__close usa-modal__close"
              aria-label={closeLabel}
              onClick={onClose}
              type="button"
            >
              &times;
            </button>
          </div>
        </div>
      </div>
    </div>,
    document.body,
  )
}
