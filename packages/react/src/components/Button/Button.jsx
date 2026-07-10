import React from 'react'

export function Button({ children }) {
  return (
    <button type="button" className="pathable-button">
      {children}
    </button>
  )
}
