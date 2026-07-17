export default {
  title: 'Marketing Patterns/Text Highlight',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only — inline modifier classes\n\n**Consumers must**: Import `@pathable/styles` CSS. Apply `.pathable-text-highlight` and a variant modifier to a `<span>` or inline element.\n\n**Multi-line support**: Uses `box-decoration-break: clone` so each wrapped line fragment gets the full background treatment.',
      },
    },
  },
}

export const Marker = {
  parameters: {
    docs: {
      description: {
        story:
          'Marker/highlighter-pen style. Covers the lower 40% of each text line.',
      },
    },
  },
  render: () => `
    <p style="max-width: 500px; font-size: 1rem; line-height: 1.8;">
      This is a paragraph with a
      <span class="pathable-text-highlight pathable-text-highlight--marker">marker highlight</span>
      applied to a key phrase. The highlight uses a warm color and sits behind the text for readability.
    </p>
  `,
}

export const Underline = {
  parameters: {
    docs: {
      description: {
        story:
          'Accent-colored underline beneath text. Provides a structural visual cue beyond color alone.',
      },
    },
  },
  render: () => `
    <p style="max-width: 500px; font-size: 1rem; line-height: 1.8;">
      Emphasize key terms with an
      <span class="pathable-text-highlight pathable-text-highlight--underline">accent underline</span>
      that remains visible regardless of background color.
    </p>
  `,
}

export const SoftBackground = {
  parameters: {
    docs: {
      description: {
        story:
          'Subtle background-color fill with padding for a gentle emphasis.',
      },
    },
  },
  render: () => `
    <p style="max-width: 500px; font-size: 1rem; line-height: 1.8;">
      Use a
      <span class="pathable-text-highlight pathable-text-highlight--soft-bg">soft background fill</span>
      for subtle emphasis that works well with large bodies of text.
    </p>
  `,
}

export const MultiLine = {
  parameters: {
    docs: {
      description: {
        story:
          'Marker highlight spanning multiple wrapped lines. Each line fragment receives the full background.',
      },
    },
  },
  render: () => `
    <p style="max-width: 350px; font-size: 1rem; line-height: 1.8;">
      This demonstrates
      <span class="pathable-text-highlight pathable-text-highlight--marker">
        a marker highlight applied to a very long phrase that wraps across multiple lines so you can verify multi-line readability
      </span>
      and see how each fragment is independently styled.
    </p>
  `,
}

export const MultiLineSoftBg = {
  parameters: {
    docs: {
      description: {
        story:
          'Soft background highlight spanning multiple lines with box-decoration-break: clone.',
      },
    },
  },
  render: () => `
    <p style="max-width: 350px; font-size: 1rem; line-height: 1.8;">
      A
      <span class="pathable-text-highlight pathable-text-highlight--soft-bg">
        soft background highlight applied to a long passage of text that wraps naturally across several lines
      </span>
      with proper per-fragment background application.
    </p>
  `,
}
