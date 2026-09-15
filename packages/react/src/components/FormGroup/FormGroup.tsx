import {
  Children,
  cloneElement,
  Fragment,
  isValidElement,
  useId,
  type HTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react'
import { ErrorMessage } from '../ErrorMessage/ErrorMessage.js'
import { Hint } from '../Hint/Hint.js'
import { Input } from '../Input/Input.js'
import { Label } from '../Label/Label.js'
import { Range } from '../Range/Range.js'
import { Select } from '../Select/Select.js'
import { Textarea } from '../Textarea/Textarea.js'

export type FormGroupProps = HTMLAttributes<HTMLDivElement>

const BASE_CLASS = 'pathable-form-group'

interface AssociationProps {
  'aria-describedby'?: null | string
  'aria-labelledby'?: null | string
  children?: ReactNode
  htmlFor?: null | string
  id?: null | string
}

interface Description {
  element: ReactElement
  kind: 'error' | 'hint'
  path: string
}

interface Participant {
  element: ReactElement
  path: string
}

function encodeKey(key: string) {
  return Array.from(key, (character) =>
    character
      .codePointAt(0)!
      .toString(16)
      .padStart(character.length === 1 ? 4 : 6, '0'),
  ).join('-')
}

function participantPath(
  element: ReactElement,
  index: number,
  parentPath: string,
) {
  const segment =
    element.key === null
      ? `index:${index}`
      : `key:${encodeKey(String(element.key))}`
  return `${parentPath}/${segment}`
}

function isUsableId(value: null | string | undefined): value is string {
  return (
    typeof value === 'string' &&
    value.length > 0 &&
    !/[\u0009\u000a\u000c\u000d\u0020]/.test(value)
  )
}

function hasIdReference(value: null | string | undefined) {
  return typeof value === 'string' && value.trim().length > 0
}

function forEachParticipant(
  children: ReactNode,
  visit: (element: ReactElement, path: string) => void,
  parentPath = '',
) {
  Children.toArray(children).forEach((child, index) => {
    if (!isValidElement(child)) return
    const path = participantPath(child, index, parentPath)

    if (child.type === Fragment) {
      forEachParticipant(
        (child.props as AssociationProps).children,
        visit,
        path,
      )
      return
    }

    visit(child, path)
  })
}

function isSupportedControl(element: ReactElement) {
  return (
    element.type === Input ||
    element.type === Select ||
    element.type === Textarea ||
    element.type === Range
  )
}

function isNativeControl(element: ReactElement) {
  return (
    element.type === 'input' ||
    element.type === 'select' ||
    element.type === 'textarea'
  )
}

export function FormGroup({ children, className, ...rest }: FormGroupProps) {
  const generatedId = useId()
  const combinedClassName = `${BASE_CLASS} ${className || ''}`.trim()
  const controls: Participant[] = []
  const labels: Participant[] = []
  const descriptions: Description[] = []
  let controlCount = 0

  forEachParticipant(children, (element, path) => {
    if (isSupportedControl(element)) {
      controls.push({ element, path })
      controlCount += 1
    } else if (isNativeControl(element)) {
      controlCount += 1
    }
    if (element.type === Label) labels.push({ element, path })
    if (element.type === Hint) {
      descriptions.push({ element, kind: 'hint', path })
    }
    if (element.type === ErrorMessage) {
      descriptions.push({ element, kind: 'error', path })
    }
  })

  const control = controlCount === 1 ? controls[0] : undefined
  const controlProps = (control?.element.props ?? {}) as AssociationProps
  const label = control && labels.length === 1 ? labels[0] : undefined
  const labelProps = label?.element.props as AssociationProps | undefined
  const controlId =
    (isUsableId(controlProps.id) && controlProps.id) ||
    (isUsableId(labelProps?.htmlFor) && labelProps.htmlFor) ||
    `${generatedId}-control`
  const managesDescriptions =
    control !== undefined && controlProps['aria-describedby'] == null
  const managesLabel = !hasIdReference(controlProps['aria-labelledby'])
  const descriptionIds = managesDescriptions
    ? descriptions.map(({ element, kind }, index) => {
        const props = element.props as AssociationProps
        return isUsableId(props.id)
          ? props.id
          : `${generatedId}-${kind}-${index.toString(36)}`
      })
    : []
  const descriptionIdsByPath = new Map(
    descriptions.map(({ path }, index) => [path, descriptionIds[index]]),
  )
  const ariaDescribedBy = descriptionIds.filter(Boolean).join(' ')

  function associate(participants: ReactNode, parentPath = ''): ReactNode {
    return Children.toArray(participants).map((child, index) => {
      if (!isValidElement(child)) return child
      const path = participantPath(child, index, parentPath)

      if (child.type === Fragment) {
        const fragmentChildren = (child.props as AssociationProps).children
        return cloneElement(child, undefined, associate(fragmentChildren, path))
      }

      const props = child.props as AssociationProps
      const associationProps: AssociationProps = {}

      if (path === control?.path) {
        if (!isUsableId(props.id)) associationProps.id = controlId
        if (managesDescriptions && ariaDescribedBy) {
          associationProps['aria-describedby'] = ariaDescribedBy
        }
      }

      if (managesLabel && path === label?.path && !isUsableId(props.htmlFor)) {
        associationProps.htmlFor = controlId
      }

      if (child.type === Hint || child.type === ErrorMessage) {
        const descriptionId = descriptionIdsByPath.get(path)
        if (managesDescriptions && !isUsableId(props.id)) {
          associationProps.id = descriptionId
        }
      }

      return Object.keys(associationProps).length > 0
        ? cloneElement(
            child as ReactElement<AssociationProps>,
            associationProps,
          )
        : child
    })
  }

  return (
    <div className={combinedClassName} {...rest}>
      {associate(children)}
    </div>
  )
}
