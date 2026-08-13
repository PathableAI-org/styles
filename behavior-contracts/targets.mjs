const REQUIRED_CAPABILITIES = [
  'accordion.keyboard-enter',
  'accordion.keyboard-space',
  'accordion.single-open',
  'accordion.panel-association',
  'accordion.focus-retention',
]

const commonFixtures = {
  'accordion.default': 'components-communication-accordion--default',
  'accordion.first-expanded':
    'components-communication-accordion--initially-expanded',
}

const commonCapabilities = [...REQUIRED_CAPABILITIES]

export const targets = {
  styles: {
    name: 'styles',
    storybookWorkspace: '@pathable/storybook',
    buildCommands: [
      ['pnpm', '--filter', '@pathableai/styles', 'build'],
      ['pnpm', '--filter', '@pathable/storybook', 'build-storybook'],
    ],
    staticDirectory: 'apps/storybook/storybook-static',
    port: 6106,
    fixtures: { ...commonFixtures },
    capabilities: [...commonCapabilities],
  },
  react: {
    name: 'react',
    storybookWorkspace: '@pathable/storybook-react',
    buildCommands: [
      ['pnpm', '--filter', '@pathableai/styles', 'build'],
      ['pnpm', '--filter', '@pathableai/react', 'build'],
      ['pnpm', '--filter', '@pathable/storybook-react', 'build-storybook'],
    ],
    staticDirectory: 'apps/storybook-react/storybook-static',
    port: 6107,
    fixtures: { ...commonFixtures },
    capabilities: [...commonCapabilities],
  },
}

export function getTarget(name) {
  const target = targets[name]

  if (!target) {
    const knownTargets = Object.keys(targets).join(', ')
    throw new Error(
      `Unknown behavior-contract target "${name ?? ''}". Expected one of: ${knownTargets}`,
    )
  }

  validateTarget(target)
  return target
}

export function validateTarget(target) {
  const missingCapabilities = REQUIRED_CAPABILITIES.filter(
    (capability) => !target.capabilities.includes(capability),
  )

  if (missingCapabilities.length > 0) {
    throw new Error(
      `Target "${target.name}" is missing required capabilities: ${missingCapabilities.join(', ')}`,
    )
  }

  for (const fixtureName of Object.keys(commonFixtures)) {
    if (!target.fixtures[fixtureName]) {
      throw new Error(
        `Target "${target.name}" is missing required fixture "${fixtureName}"`,
      )
    }
  }

  if (!target.staticDirectory || !target.port || !target.storybookWorkspace) {
    throw new Error(`Target "${target.name}" has incomplete server metadata`)
  }

  return target
}

export { REQUIRED_CAPABILITIES }
