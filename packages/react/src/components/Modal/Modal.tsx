import {
  HTMLAttributes,
  ReactNode,
  useEffect,
  useRef,
  useCallback,
  useId,
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
  ...rest
}: ModalProps) {
  const autoId = useId()
  const titleId = `modal-title-${autoId}`
  const contentRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const previousActiveElement = useRef<HTMLElement | null>(null)
  const mounted = useRef(false)

  // Capture and restore focus
  useEffect(() => {
    if (open) {
      mounted.current = true
      previousActiveElement.current = document.activeElement as HTMLElement
      // Lock scroll
      document.body.style.overflow = 'hidden'
    } else if (mounted.current) {
      // Restore scroll
      document.body.style.overflow = ''
      // Restore focus
      previousActiveElement.current?.focus()
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [open])

  // Set initial focus
  useEffect(() => {
    if (open) {
      requestAnimationFrame(() => {
        if (initialFocusRef?.current) {
          initialFocusRef.current.focus()
        } else if (closeRef.current) {
          closeRef.current.focus()
        }
      })
    }
  }, [open, initialFocusRef])

  // Tab containment
  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
        return
      }
      if (e.key === 'Tab' && contentRef.current) {
        const focusable = contentRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
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

  if (!open) return null

  const classes = ['pathable-modal', className].filter(Boolean).join(' ')

  return createPortal(
    // eslint-disable-next-line jsx-a11y/no-noninteractive-element-interactions
    <div
      className={classes}
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onKeyDown={handleKeyDown}
      ref={contentRef}
      {...rest}
    >
      <div className="pathable-modal__content">
        <h2 id={titleId} className="pathable-modal__heading">
          {title}
        </h2>
        {description && <p>{description}</p>}
        <button
          ref={closeRef}
          className="pathable-modal__close"
          aria-label={closeLabel}
          onClick={onClose}
          type="button"
        >
          &times;
        </button>
        {children && <div>{children}</div>}
        {footer && <div className="pathable-modal__footer">{footer}</div>}
      </div>
    </div>,
    document.body,
  )
}
