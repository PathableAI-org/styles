// Fixture tests import HTML fixtures as strings with Vite's `?raw` query.
declare module '*.html?raw' {
  const html: string
  export default html
}
