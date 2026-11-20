import { useId } from 'react'
import { describe, expect, it } from 'vitest'
import { expectToRenderFixture } from '../fixtures'

const fixture = `
<section aria-labelledby="title">
  <h2 id="title" class="pathable-sr-only extra">Upcoming sessions</h2>
  <p>Three sessions are booked.</p>
</section>
`

function Labelled({ suffix = '' }: { suffix?: string }) {
  const id = `${useId()}${suffix}`
  return (
    <section aria-labelledby={id}>
      <h2 className="extra pathable-sr-only" id={id}>
        Upcoming sessions
      </h2>
      <p>Three sessions are booked.</p>
    </section>
  )
}

describe('expectToRenderFixture', () => {
  it('passes when attribute and class order differ', () => {
    expectToRenderFixture(
      <p data-b="2" className="b a" data-a="1">
        Text
      </p>,
      '<p data-a="1" data-b="2" class="a b">Text</p>',
    )
  })

  it('passes when generated IDs differ but references resolve to the same element', () => {
    expectToRenderFixture(<Labelled suffix="-generated" />, fixture)
  })

  it('fails when the component adds a wrapper element', () => {
    expect(() =>
      expectToRenderFixture(
        <div>
          <p>Text</p>
        </div>,
        '<p>Text</p>',
      ),
    ).toThrow(/rendered markup/u)
  })

  it('fails when a class moves to another element', () => {
    expect(() =>
      expectToRenderFixture(
        <p className="pathable-sr-only">
          <span>Text</span>
        </p>,
        '<p><span class="pathable-sr-only">Text</span></p>',
      ),
    ).toThrow(/rendered markup/u)
  })

  it('fails when an ID reference does not resolve', () => {
    expect(() =>
      expectToRenderFixture(
        <section aria-labelledby="missing">
          <h2 id="title">Upcoming sessions</h2>
        </section>,
        '<section aria-labelledby="title"><h2 id="title">Upcoming sessions</h2></section>',
      ),
    ).toThrow(
      /aria-labelledby="missing"> refers to an id that is not in the markup/u,
    )
  })

  it('fails when a reference points at a different element', () => {
    expect(() =>
      expectToRenderFixture(
        <section aria-labelledby="b">
          <h2 id="a">Upcoming sessions</h2>
          <p id="b">Three sessions are booked.</p>
        </section>,
        '<section aria-labelledby="a"><h2 id="a">Upcoming sessions</h2><p id="b">Three sessions are booked.</p></section>',
      ),
    ).toThrow(/rendered markup/u)
  })

  it('fails when the text differs', () => {
    expect(() =>
      expectToRenderFixture(<p>Other words</p>, '<p>Text</p>'),
    ).toThrow(/rendered markup/u)
  })

  it('fails when a space between inline words is missing', () => {
    expect(() =>
      expectToRenderFixture(
        <a href="/edit">
          Edit
          <span className="pathable-sr-only">Jordan Lee&apos;s profile</span>
        </a>,
        `<a href="/edit">Edit<span class="pathable-sr-only"> Jordan Lee's profile</span></a>`,
      ),
    ).toThrow(/rendered text/u)
  })

  it('compares style attributes rather than ignoring them', () => {
    expect(() =>
      expectToRenderFixture(
        <p style={{ color: 'red' }}>Text</p>,
        '<p>Text</p>',
      ),
    ).toThrow(/rendered markup/u)
  })

  it('fails when an svg differs', () => {
    expect(() =>
      expectToRenderFixture(
        <svg className="pathable-icon" aria-hidden="true">
          <use href="#check" />
        </svg>,
        '<svg class="pathable-icon" aria-hidden="true"><use href="#close"></use></svg>',
      ),
    ).toThrow(/rendered markup/u)
  })

  it('passes when an svg matches', () => {
    expectToRenderFixture(
      <svg className="pathable-icon" aria-hidden="true">
        <use href="#check" />
      </svg>,
      '<svg aria-hidden="true" class="pathable-icon"><use href="#check"></use></svg>',
    )
  })

  it('passes when the fixture wraps text across lines', () => {
    expectToRenderFixture(
      <p>Three sessions are booked for this week.</p>,
      '<p>\n  Three sessions are booked\n  for this week.\n</p>',
    )
  })
})
