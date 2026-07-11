export default {
  title: 'Marketing Patterns/Screenshot Frame',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only — frame variants\n\n**Consumers must**: Import `@pathable/styles` CSS. Wrap an `<img>` in a `<figure>` element with `.pathable-screenshot-frame`. Add an optional `.pathable-screenshot-frame__caption` (`<figcaption>`) and apply a variant modifier.\n\n**Images**: Screenshot images are provided by the consuming application. Placeholder images are used in these examples.',
      },
    },
  },
  decorators: [
    (story) => `
      <div style="display: flex; flex-wrap: wrap; gap: 2rem; align-items: flex-start;">
        ${story()}
      </div>
    `,
  ],
}

const placeholderImg = (text) => `
  <img
    class="pathable-screenshot-frame__image"
    src="https://placehold.co/800x500/e0e0e0/666666?text=${encodeURIComponent(text)}"
    alt="Screenshot showing ${text}"
    loading="lazy"
  />
`

export const Plain = {
  parameters: {
    docs: {
      description: {
        story: 'Default elevated frame with subtle shadow and rounded corners.',
      },
    },
  },
  render: () => `
    <figure class="pathable-screenshot-frame" style="max-width: 400px;">
      ${placeholderImg('Product Dashboard')}
      <figcaption class="pathable-screenshot-frame__caption">Product dashboard showing key metrics</figcaption>
    </figure>
  `,
}

export const BrowserFrame = {
  parameters: {
    docs: {
      description: {
        story: 'Browser chrome frame with navigation dots and URL bar.',
      },
    },
  },
  render: () => `
    <figure class="pathable-screenshot-frame pathable-screenshot-frame--browser" style="max-width: 500px;">
      <div class="pathable-screenshot-frame__browser-bar">
        <div class="pathable-screenshot-frame__browser-dots">
          <span></span><span></span><span></span>
        </div>
        <div class="pathable-screenshot-frame__browser-url">app.pathable.com/dashboard</div>
      </div>
      ${placeholderImg('Browser View')}
      <figcaption class="pathable-screenshot-frame__caption">Application viewed in a browser</figcaption>
    </figure>
  `,
}

export const PhoneFrame = {
  parameters: {
    docs: {
      description: {
        story: 'Phone device bezel with notch and rounded corners.',
      },
    },
  },
  render: () => `
    <figure class="pathable-screenshot-frame pathable-screenshot-frame--phone">
      <div class="pathable-screenshot-frame__phone-notch"></div>
      ${placeholderImg('Mobile View')}
      <figcaption class="pathable-screenshot-frame__caption">Mobile application view</figcaption>
    </figure>
  `,
}

export const DashboardFrame = {
  parameters: {
    docs: {
      description: {
        story:
          'Dashboard-style frame with dark background and grid lines overlay.',
      },
    },
  },
  render: () => `
    <figure class="pathable-screenshot-frame pathable-screenshot-frame--dashboard" style="max-width: 500px;">
      ${placeholderImg('Dark Dashboard')}
      <div class="pathable-screenshot-frame__dashboard-grid">
        <span class="dashboard-grid-wide"></span>
        <span></span><span></span>
        <span class="dashboard-grid-wide"></span>
      </div>
      <figcaption class="pathable-screenshot-frame__caption">Dashboard analytics view</figcaption>
    </figure>
  `,
}

export const InteractiveFrame = {
  parameters: {
    docs: {
      description: {
        story:
          'Interactive frame with hover lift and keyboard-visible focus. Try tabbing to this element.',
      },
    },
  },
  render: () => `
    <figure class="pathable-screenshot-frame" style="max-width: 400px;">
      <a href="#" style="display: block; text-decoration: none; color: inherit;">
        ${placeholderImg('Interactive Demo')}
      </a>
      <figcaption class="pathable-screenshot-frame__caption">Click to view full size (interactive)</figcaption>
    </figure>
  `,
}
