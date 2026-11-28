/**
 * Doc blocks for the generated component pages (apps/storybook/generated/,
 * written by scripts/component-docs).
 *
 * CodeTabs shows a fixture story's HTML verbatim. It comes from the story's
 * `parameters.componentDocs`, not from Storybook's generated snippet, so the
 * code shown is exactly what the tests check. The preview above it is the
 * fixture rendered with styles.css. The Storybook documents HTML and CSS
 * only; it shows no React.
 *
 * PackageNote marks content that applies to one package only.
 */

import React from 'react'
import type { ReactNode } from 'react'
import { Source, useOf } from '@storybook/addon-docs/blocks'

type Sources = { html: string }

export function CodeTabs({ of }: { of: unknown }) {
  const resolved = useOf(of as Parameters<typeof useOf>[0], ['story'])
  const sources = (resolved.story.parameters as { componentDocs?: Sources })
    .componentDocs
  if (!sources) {
    throw new Error(
      `CodeTabs: story ${resolved.story.id} has no parameters.componentDocs`,
    )
  }
  return <Source code={sources.html} language="html" dark />
}

const packageLabels = {
  styles: 'HTML and CSS (@pathableai/styles) only',
}

export function PackageNote({
  name,
  children,
}: {
  name: keyof typeof packageLabels
  children: ReactNode
}) {
  return (
    <div
      style={{
        borderLeft: '4px solid var(--pathable-color-bg)',
        margin: '1rem 0',
        paddingLeft: '1rem',
      }}
    >
      <p style={{ fontWeight: 700, margin: 0 }}>{packageLabels[name]}</p>
      {children}
    </div>
  )
}
