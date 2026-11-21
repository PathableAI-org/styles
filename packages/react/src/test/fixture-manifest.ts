/**
 * Which React component renders each fixture folder in `@pathableai/fixtures`.
 * Folder names are the styles component page slugs. The fixture coverage test
 * reads this; see docs/testing/fixtures.md.
 */
export interface FixtureFolderMapping {
  /**
   * The React component, as exported from `src/index.ts`. Its examples live
   * in `src/components/<component>/examples/<state>.tsx`, one per fixture.
   */
  component: string
  /**
   * Fixture states React does not offer, each mapped to the reason. Every
   * other `.html` file in the folder needs a fixture test.
   */
  notOffered?: Record<string, string>
}

export const fixtureManifest: Record<string, FixtureFolderMapping> = {}
