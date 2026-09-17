// @vitest-environment node

import React from 'react'
import { renderToString } from 'react-dom/server'
import { expect, it, vi } from 'vitest'
import { FilterableOptionList } from '../FilterableOptionList'

it('server-renders without layout-effect warnings', () => {
  const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})

  const html = renderToString(
    <FilterableOptionList legend="Services" options={[]} />,
  )

  expect(html).toContain('<legend class="pathable-legend">Services</legend>')
  expect(consoleError).not.toHaveBeenCalled()
  consoleError.mockRestore()
})
