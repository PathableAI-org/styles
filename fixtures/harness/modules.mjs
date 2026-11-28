/**
 * Maps a fixture to the CSS modules it needs, from the manifest that
 * @pathableai/styles writes to dist/css/manifest.json, and builds the page
 * that links them.
 */

import { readFileSync } from 'node:fs'
import { join } from 'node:path'

import { parseFragment } from 'parse5'

import { manifestPath } from './css.mjs'

/** Every class in a `class` attribute of an element in the markup. */
export function classesIn(html) {
  const classes = new Set()
  const visit = (node) => {
    for (const attr of node.attrs ?? []) {
      if (attr.name !== 'class') continue
      for (const name of attr.value.split(/\s+/u)) if (name) classes.add(name)
    }
    for (const child of node.childNodes ?? []) visit(child)
    if (node.content) visit(node.content)
  }
  visit(parseFragment(html))
  return classes
}

/** The parsed dist/css/manifest.json; throws if the styles package is unbuilt. */
export function readManifest() {
  return JSON.parse(readFileSync(manifestPath(), 'utf8'))
}

/** A Map from each class a module owns to that module's name. */
export function classOwners(manifest) {
  const owners = new Map()
  for (const { name, classes } of manifest.modules) {
    for (const cls of classes) owners.set(cls, name)
  }
  return owners
}

/**
 * The module names a fixture needs, in manifest order: the owners of its
 * `pathable-*` classes, closed over `requires`, plus base and utilities.
 * Classes no module defines are ignored (the contract check reports them).
 */
export function modulesFor(html, manifest) {
  const owners = classOwners(manifest)
  const byName = new Map(
    manifest.modules.map((module) => [module.name, module]),
  )
  const needed = new Set(['base', 'utilities'])
  const pending = [...classesIn(html)]
    .filter((name) => name.startsWith('pathable-'))
    .map((name) => owners.get(name))
    .filter(Boolean)
  while (pending.length > 0) {
    const name = pending.pop()
    if (needed.has(name) && name !== 'base' && name !== 'utilities') continue
    needed.add(name)
    for (const required of byName.get(name)?.requires ?? []) {
      if (!needed.has(required)) pending.push(required)
    }
  }
  return manifest.modules
    .map((module) => module.name)
    .filter((name) => needed.has(name))
}

/** The href of a module's stylesheet as the harness serves it. */
export const moduleHref = (manifest, name) =>
  `/dist/css/${manifest.modules.find((module) => module.name === name).file}`

/** page.html with `hrefs` linked as stylesheets, in order. */
export function renderPage(hrefs) {
  const template = readFileSync(join(import.meta.dirname, 'page.html'), 'utf8')
  const links = hrefs
    .map((href) => `<link rel="stylesheet" href="${href}" />`)
    .join('\n    ')
  return template.replace('<!-- stylesheets -->', links)
}
