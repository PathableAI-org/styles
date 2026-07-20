import { HTMLAttributes, ReactNode } from 'react'

interface Step {
  id: string
  label: ReactNode
}

interface StepIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  steps: Step[]
  currentStep?: number
  heading?: ReactNode
}

export function StepIndicator({
  steps,
  currentStep,
  heading,
  className = '',
  ...rest
}: StepIndicatorProps) {
  const classes = ['pathable-step-indicator', className]
    .filter(Boolean)
    .join(' ')

  const isValidCurrent =
    typeof currentStep === 'number' &&
    currentStep >= 1 &&
    currentStep <= steps.length

  return (
    <div className={classes} {...rest}>
      {heading && (
        <div className="pathable-step-indicator__header">
          <h3 className="pathable-step-indicator__heading">{heading}</h3>
        </div>
      )}
      <ol className="pathable-step-indicator__segments">
        {steps.map((step, index) => {
          const stepNumber = index + 1
          let stateClass = ''
          let ariaCurrent: { 'aria-current'?: 'step' } = {}

          if (isValidCurrent) {
            if (stepNumber < currentStep!) {
              stateClass = 'pathable-step-indicator__segment--completed'
            } else if (stepNumber === currentStep!) {
              stateClass = 'pathable-step-indicator__segment--current'
              ariaCurrent = { 'aria-current': 'step' }
            }
          }

          const segmentClasses = [
            'pathable-step-indicator__segment',
            stateClass,
          ]
            .filter(Boolean)
            .join(' ')

          return (
            <li key={step.id} className={segmentClasses} {...ariaCurrent}>
              <span className="pathable-step-indicator__segment-label">
                {step.label}
              </span>
            </li>
          )
        })}
      </ol>
    </div>
  )
}

export type { Step }
