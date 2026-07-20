import {
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
  useId,
  KeyboardEvent,
} from 'react'
import { createPortal } from 'react-dom'

interface ModalProps extends Omit<HTMLAttributes<HTMLDivElement>, 'title'> {
  open: boolean
  onClose: () => void
  title: ReactNode
  description?: ReactNode
  children?: ReactNode
  footer?: ReactNode
  closeLabel?: string
  initialFocusRef?: React.RefObject<HTMLElement | null>
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
  const contentRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const previousOverflow = useRef<string>('')
  const mounted = useRef(false)

  // Capture and restore focus
  useEffect(() => {
    if (open) {
      mounted.current = true
      previousActiveElement.current = document.activeElement as HTMLElement
      previousOverflow.current = document.body.style.overflow
      document.body.style.overflow = 'hidden'
    } else if (mounted.current) {
      document.body.style.overflow = previousOverflow.current
      previousActiveElement.current?.focus()
    }
    return () => {
      document.body.style.overflow = previousOverflow.current
    }
  }, [open])

  // Set initial focus
  useEffect(() => {
    if (open) {
      if (initialFocusRef?.current) {
        initialFocusRef.current.focus()
      } else if (closeRef.current) {
        closeRef.current.focus()
      }
    }
  }, [open, initialFocusRef])

  // Tab containment — compose with consumer onKeyDown so internal
  // Escape close and Tab logic can't be accidentally disabled
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll<HTMLElement>(
          'button:not(:disabled):not([hidden]), [href]:not(:disabled):not([hidden]), input:not(:disabled):not([hidden]), select:not(:disabled):not([hidden]), textarea:not(:disabled):not([hidden]), [tabindex]:not([tabindex="-1"]):not(:disabled):not([hidden])',
        )
        const first = focusable[0]
        const last = focusable[focusable.length - 1]
        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault()
            last?.focus()
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault()
            first?.focus()
          }
        }
      }
    },
    [onClose],
  )

  if (!open || typeof document === 'undefined') return null

  const classes = ['pathable-modal', className].filter(Boolean).join(' ')

  const dialog = (
    // The dialog role element needs onKeyDown for Escape close and Tab containment,
    // which are required for accessible dialog behavior.
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      {...rest}
      ref={contentRef}
      className={classes}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      aria-describedby={descriptionId}
      onKeyDown={(e) => {
        handleKeyDown(e)
        consumerOnKeyDown?.(e)
      }}
    >
      <div className="pathable-modal__content">
        <div className="pathable-modal__heading">
          <h2 id={titleId}>{title}</h2>
          <button
            ref={closeRef}
            className="pathable-modal__close"
            aria-label={closeLabel}
            onClick={onClose}
            type="button"
          >
            &times;
          </button>
        </div>
        {description && <p id={descriptionId}>{description}</p>}
        {children && <div>{children}</div>}
        {footer && <div className="pathable-modal__footer">{footer}</div>}
      </div>
    </div>
  )

  return createPortal(dialog, document.body)
}
