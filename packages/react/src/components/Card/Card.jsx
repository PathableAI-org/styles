import React from 'react'
import PropTypes from 'prop-types'

const PRESENTATION_CLASS = {
  base: '',
  media: 'pathable-card--media',
  flag: 'pathable-card--flag',
  'header-first': 'pathable-card--header-first',
  workflow: 'pathable-card--workflow',
}

function hasContent(value) {
  return value !== null && value !== undefined && value !== false
}

function resolvePresentation(
  presentation,
  { media, metadata, status, actions },
) {
  if (PRESENTATION_CLASS[presentation]) {
    return presentation
  }

  if (hasContent(metadata) || hasContent(status) || hasContent(actions)) {
    return 'workflow'
  }

  if (hasContent(media)) {
    return 'media'
  }

  return 'base'
}

function CardTitle({ children, workflow = false }) {
  if (!hasContent(children)) {
    return null
  }

  return workflow ? (
    <h3 className="pathable-card__heading">{children}</h3>
  ) : (
    <h3 className="pathable-card__header">{children}</h3>
  )
}

CardTitle.propTypes = {
  children: PropTypes.node,
  workflow: PropTypes.bool,
}

function CardMedia({ children }) {
  if (!hasContent(children)) {
    return null
  }

  return <div className="pathable-card__media">{children}</div>
}

CardMedia.propTypes = {
  children: PropTypes.node,
}

function CardBody({ children, title }) {
  if (!hasContent(children) && !hasContent(title)) {
    return null
  }

  return (
    <div className="pathable-card__body">
      <CardTitle>{title}</CardTitle>
      {children}
    </div>
  )
}

CardBody.propTypes = {
  children: PropTypes.node,
  title: PropTypes.node,
}

function CardFooter({ children }) {
  if (!hasContent(children)) {
    return null
  }

  return <div className="pathable-card__footer">{children}</div>
}

CardFooter.propTypes = {
  children: PropTypes.node,
}

function WorkflowCardBody({ children, metadata, actions }) {
  if (!hasContent(children) && !hasContent(metadata) && !hasContent(actions)) {
    return null
  }

  return (
    <div className="pathable-card__body">
      {children}
      {hasContent(metadata) ? (
        <div className="pathable-card__meta">{metadata}</div>
      ) : null}
      {hasContent(actions) ? (
        <div className="pathable-card__action">{actions}</div>
      ) : null}
    </div>
  )
}

WorkflowCardBody.propTypes = {
  children: PropTypes.node,
  metadata: PropTypes.node,
  actions: PropTypes.node,
}

/**
 * @param {object} props
 * @param {React.ReactNode} props.children - Main card body content.
 * @param {string} [props.className=''] - Additional root class names.
 * @param {React.ReactNode} [props.title] - Card heading content.
 * @param {React.ReactNode} [props.footer] - Footer region content.
 * @param {React.ReactNode} [props.media] - Media region content.
 * @param {'base'|'media'|'flag'|'header-first'|'workflow'} [props.presentation='base'] - Existing Pathable card presentation.
 * @param {React.ReactNode} [props.metadata] - Workflow metadata content.
 * @param {React.ReactNode} [props.status] - Workflow status content.
 * @param {React.ReactNode} [props.actions] - Workflow action content.
 * @param {*} [props.rest] - Any other props to spread onto the root element.
 * @returns {React.ReactElement} The Card component.
 */
export function Card({
  children,
  className = '',
  title,
  footer,
  media,
  presentation = 'base',
  metadata,
  status,
  actions,
  ...rest
}) {
  const resolvedPresentation = resolvePresentation(presentation, {
    media,
    metadata,
    status,
    actions,
  })
  const presentationClass = PRESENTATION_CLASS[resolvedPresentation]
  const classes = ['pathable-card', presentationClass, className]
    .filter(Boolean)
    .join(' ')

  if (resolvedPresentation === 'workflow') {
    return (
      <div className={classes} {...rest}>
        <div className="pathable-card__container">
          {hasContent(title) || hasContent(status) ? (
            <div className="pathable-card__header">
              <CardTitle workflow>{title}</CardTitle>
              {hasContent(status) ? (
                <span className="pathable-card__status">{status}</span>
              ) : null}
            </div>
          ) : null}
          <WorkflowCardBody metadata={metadata} actions={actions}>
            {children}
          </WorkflowCardBody>
          <CardFooter>{footer}</CardFooter>
        </div>
      </div>
    )
  }

  return (
    <div className={classes} {...rest}>
      <CardMedia>{media}</CardMedia>
      <CardBody title={title}>{children}</CardBody>
      <CardFooter>{footer}</CardFooter>
    </div>
  )
}

Card.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  title: PropTypes.node,
  footer: PropTypes.node,
  media: PropTypes.node,
  presentation: PropTypes.oneOf([
    'base',
    'media',
    'flag',
    'header-first',
    'workflow',
  ]),
  metadata: PropTypes.node,
  status: PropTypes.node,
  actions: PropTypes.node,
}
