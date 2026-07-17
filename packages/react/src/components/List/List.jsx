import React from 'react'
import PropTypes from 'prop-types'

const PRESENTATION_CLASS = {
  unordered: 'pathable-list--unordered',
  ordered: 'pathable-list--ordered',
  unstyled: 'pathable-list--unstyled',
}

function resolvePresentation(presentation) {
  return PRESENTATION_CLASS[presentation] ? presentation : 'unordered'
}

function hasItems(items) {
  return Array.isArray(items) && items.length > 0
}

function getItemKey(item, index) {
  if (item && typeof item === 'object' && !React.isValidElement(item)) {
    return item.key ?? index
  }

  return index
}

function getItemContent(item) {
  if (item && typeof item === 'object' && !React.isValidElement(item)) {
    return item.content
  }

  return item
}

function getItemProps(item) {
  if (item && typeof item === 'object' && !React.isValidElement(item)) {
    const { className, attributes = {} } = item
    return {
      ...attributes,
      className,
    }
  }

  return {}
}

function renderItems(items) {
  if (!hasItems(items)) {
    return null
  }

  return items.map((item, index) => {
    const content = getItemContent(item)
    const itemProps = getItemProps(item)

    return (
      <li key={getItemKey(item, index)} {...itemProps}>
        {content}
      </li>
    )
  })
}

/**
 * @param {object} props
 * @param {'unordered'|'ordered'|'unstyled'} [props.presentation='unordered'] - Existing Pathable list presentation.
 * @param {Array<React.ReactNode|object>} [props.items] - Ordered list item content.
 * @param {React.ReactNode} [props.children] - Consumer-composed list content.
 * @param {string} [props.className=''] - Additional root class names.
 * @param {*} [props.rest] - Any other props to spread onto the root list element.
 * @returns {React.ReactElement} The List component.
 */
export function List({
  presentation = 'unordered',
  items,
  children,
  className = '',
  ...rest
}) {
  const resolvedPresentation = resolvePresentation(presentation)
  const Element = resolvedPresentation === 'ordered' ? 'ol' : 'ul'
  const classes = [
    'pathable-list',
    PRESENTATION_CLASS[resolvedPresentation],
    className,
  ]
    .filter(Boolean)
    .join(' ')
  const renderedItems = renderItems(items)

  return (
    <Element className={classes} {...rest}>
      {renderedItems}
      {children}
    </Element>
  )
}

List.propTypes = {
  presentation: PropTypes.oneOf(['unordered', 'ordered', 'unstyled']),
  items: PropTypes.arrayOf(
    PropTypes.oneOfType([
      PropTypes.node,
      PropTypes.shape({
        content: PropTypes.node.isRequired,
        key: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        className: PropTypes.string,
        attributes: PropTypes.object,
      }),
    ]),
  ),
  children: PropTypes.node,
  className: PropTypes.string,
}
