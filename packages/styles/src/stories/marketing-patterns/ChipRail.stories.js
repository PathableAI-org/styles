export default {
  title: 'Marketing Patterns/Chip Rail',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only — static overflow by default; opt-in marquee\n\n**Consumers must**: Import `@pathable/styles` CSS. Wrap chips in a `.pathable-chip-rail` container. Each chip is a `.pathable-chip-rail__chip` element.\n\n**Marquee**: Apply the `--marquee` modifier for auto-scrolling. Duplicate chip content for seamless looping and mark the duplicate set with `aria-hidden="true"`.',
      },
    },
  },
}

const chips = [
  'Job Training',
  'Education',
  'Healthcare',
  'Transportation',
  'Housing',
  'Career Counseling',
  'Financial Aid',
  'Disability Services',
]

const chipElements = chips
  .map((c) => `<span class="pathable-chip-rail__chip">${c}</span>`)
  .join('\n        ')

export const Static = {
  parameters: {
    docs: {
      description: {
        story: 'Default static chip rail with horizontal overflow. No motion.',
      },
    },
  },
  render: () => `
    <div style="max-width: 600px;">
      <div class="pathable-chip-rail" tabindex="0">
        ${chipElements}
      </div>
    </div>
  `,
}

export const Marquee = {
  parameters: {
    docs: {
      description: {
        story:
          'Marquee variant with auto-scrolling. Hover or focus to pause. Disabled under prefers-reduced-motion.',
      },
    },
  },
  render: () => `
    <div style="max-width: 600px;">
      <div class="pathable-chip-rail pathable-chip-rail--marquee">
        <div class="pathable-chip-rail__track">
          ${chipElements}
          <!-- Duplicate set for seamless loop; hidden from assistive technology -->
          <span aria-hidden="true">${chips.map((c) => `<span class="pathable-chip-rail__chip">${c}</span>`).join('\n            ')}</span>
        </div>
      </div>
    </div>
  `,
}

export const FewChips = {
  parameters: {
    docs: {
      description: {
        story:
          'Chip rail with very few chips. Renders inline without overflow or broken layout.',
      },
    },
  },
  render: () => `
    <div class="pathable-chip-rail" tabindex="0">
      <span class="pathable-chip-rail__chip">New</span>
      <span class="pathable-chip-rail__chip">Popular</span>
      <span class="pathable-chip-rail__chip">Featured</span>
    </div>
  `,
}
