export default {
  paths: ['behavior-contracts/features/**/*.feature'],
  import: [
    'behavior-contracts/support/world.mjs',
    'behavior-contracts/support/hooks.mjs',
    'behavior-contracts/steps/**/*.mjs',
  ],
  format: ['progress'],
}
