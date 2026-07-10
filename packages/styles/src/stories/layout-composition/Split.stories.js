export default {
  title: 'Layout Composition/Split',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.\n\nTwo-region layout with configurable ratio and alignment. Collapses to single column below 1024px, preserving DOM reading order.',
      },
    },
  },
}

const regionA = (label) => `
  <div style="background: #dde2e8; padding: 2rem; border-radius: 4px; text-align: center;">
    <span style="font-size: 1.25rem; font-weight: 600; color: #00365c;">${label}</span>
    <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #555;">Primary region</p>
  </div>
`

const regionB = (label) => `
  <div style="background: #e8f4f0; padding: 2rem; border-radius: 4px; text-align: center;">
    <span style="font-size: 1.25rem; font-weight: 600; color: #1cae96;">${label}</span>
    <p style="margin: 0.5rem 0 0; font-size: 0.875rem; color: #555;">Secondary region</p>
  </div>
`

export const EqualSplit = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Equal Split (default 1:1)</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      Two equal regions. Resize below 1024px to see them stack.
    </p>
    <div class="pathable-split">
      ${regionA('Region A')}
      ${regionB('Region B')}
    </div>
  `,
}

export const Ratio1to2 = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Ratio 1:2</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      First region narrower, second region wider.
    </p>
    <div class="pathable-split pathable-split--ratio-1-2">
      ${regionA('1')}
      ${regionB('2')}
    </div>
  `,
}

export const Ratio2to1 = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Ratio 2:1</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      First region wider, second region narrower.
    </p>
    <div class="pathable-split pathable-split--ratio-2-1">
      ${regionA('2')}
      ${regionB('1')}
    </div>
  `,
}

export const AlignEnd = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Align End</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      When regions differ in height, alignment controls vertical positioning.
    </p>
    <div class="pathable-split pathable-split--align-end">
      <div style="background: #dde2e8; padding: 1rem; border-radius: 4px; text-align: center;">
        <span style="font-size: 0.875rem;">Short content</span>
      </div>
      <div style="background: #e8f4f0; padding: 4rem 1rem; border-radius: 4px; text-align: center;">
        <span style="font-size: 0.875rem;">Tall content</span>
      </div>
    </div>
  `,
}

export const EmptyRegion = {
  render: () => `
    <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">Empty Second Region</h3>
    <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">
      When one region is empty, the grid still reserves its track.
    </p>
    <div class="pathable-split">
      ${regionA('Filled')}
      <div></div>
    </div>
  `,
}

export const Default = EqualSplit