import { it } from 'vitest'
import headingFixture from '@pathableai/fixtures/sr-only/heading.html?raw'
import inlineFixture from '@pathableai/fixtures/sr-only/inline.html?raw'
import { expectToRenderFixture } from '../../../test/fixtures'
import headingExample from '../examples/heading'
import inlineExample from '../examples/inline'

it('renders sr-only/inline', () => {
  expectToRenderFixture(inlineExample, inlineFixture)
})

it('renders sr-only/heading', () => {
  expectToRenderFixture(headingExample, headingFixture)
})
