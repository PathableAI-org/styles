import assert from 'node:assert/strict'
import test from 'node:test'
import { parseFrontmatter } from './check-agent-guidance.mjs'

test('accepts CRLF skill frontmatter', () => {
  const frontmatter = [
    '---',
    'name: pathable-react',
    'description: Use PathAble React.',
    '---',
    '',
    '# PathAble React',
    '',
  ].join('\r\n')

  assert.deepEqual(parseFrontmatter(frontmatter), {
    name: 'pathable-react',
    description: 'Use PathAble React.',
  })
})
