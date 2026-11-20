/**
 * Doc blocks for the generated component pages (apps/storybook/generated/,
 * written by scripts/component-docs).
 *
 * CodeTabs shows a fixture story's sources verbatim: the HTML fixture and,
 * when the React package covers the component, the React example module.
 * They come from the story's `parameters.componentDocs`, not from Storybook's
 * generated snippet, so the code shown is exactly what the tests check. The
 * preview above it is the fixture rendered with styles.css; the React tests
 * prove the example renders the same markup, so one preview serves both.
 *
 * PackageNote marks content that applies to one package only.
 */

import React, { useId, useRef, useState } from 'react'
import type { KeyboardEvent, ReactNode } from 'react'
import { Source, useOf } from '@storybook/addon-docs/blocks'

type Sources = { html: string; react: string | null }
type Tab = {
  id: 'html' | 'react'
  label: string
  language: string
  code: string
}

/** The tabs a story's sources give: HTML always, React when there is one. */
function tabsFor(sources: Sources): Tab[] {
  const tabs: Tab[] = [
    { id: 'html', label: 'HTML', language: 'html', code: sources.html },
  ]
  if (sources.react !== null) {
    tabs.push({
      id: 'react',
      label: 'React',
      language: 'tsx',
      code: sources.react,
    })
  }
  return tabs
}

const tabListStyle = {
  display: 'flex',
  gap: '0.25rem',
  borderBottom: '1px solid var(--pathable-color-border)',
  marginTop: '-1rem',
}

const tabStyle = (selected: boolean) => ({
  appearance: 'none' as const,
  background: 'none',
  border: 0,
  borderBottom: `3px solid ${selected ? 'var(--pathable-color-text)' : 'transparent'}`,
  color: 'var(--pathable-color-text)',
  cursor: 'pointer',
  font: 'inherit',
  fontWeight: selected ? 700 : 400,
  padding: '0.5rem 0.75rem',
})

export function CodeTabs({ of }: { of: unknown }) {
  const resolved = useOf(of as Parameters<typeof useOf>[0], ['story'])
  const sources = (resolved.story.parameters as { componentDocs?: Sources })
    .componentDocs
  if (!sources) {
    throw new Error(
      `CodeTabs: story ${resolved.story.id} has no parameters.componentDocs`,
    )
  }
  const tabs = tabsFor(sources)
  const [selected, setSelected] = useState(0)
  const refs = useRef<Array<HTMLButtonElement | null>>([])
  const id = useId()

  const onKeyDown = (event: KeyboardEvent) => {
    const step = { ArrowRight: 1, ArrowLeft: -1 }[event.key]
    let next
    if (step) next = (selected + step + tabs.length) % tabs.length
    else if (event.key === 'Home') next = 0
    else if (event.key === 'End') next = tabs.length - 1
    else return
    event.preventDefault()
    setSelected(next)
    refs.current[next]?.focus()
  }

  return (
    <div>
      <div role="tablist" aria-label="Code" style={tabListStyle}>
        {tabs.map((tab, index) => (
          <button
            key={tab.id}
            ref={(element) => {
              refs.current[index] = element
            }}
            type="button"
            role="tab"
            id={`${id}-${tab.id}-tab`}
            aria-selected={index === selected}
            aria-controls={`${id}-${tab.id}-panel`}
            tabIndex={index === selected ? 0 : -1}
            style={tabStyle(index === selected)}
            onClick={() => setSelected(index)}
            onKeyDown={onKeyDown}
          >
            {tab.label}
          </button>
        ))}
      </div>
      {tabs.map((tab, index) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`${id}-${tab.id}-panel`}
          aria-labelledby={`${id}-${tab.id}-tab`}
          hidden={index !== selected}
        >
          <Source code={tab.code} language={tab.language} dark />
        </div>
      ))}
    </div>
  )
}

const packageLabels = {
  styles: 'HTML and CSS (@pathableai/styles) only',
  react: 'React (@pathableai/react) only',
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
        borderLeft: '4px solid var(--pathable-color-border)',
        margin: '1rem 0',
        paddingLeft: '1rem',
      }}
    >
      <p style={{ fontWeight: 700, margin: 0 }}>{packageLabels[name]}</p>
      {children}
    </div>
  )
}
