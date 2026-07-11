export default {
  title: 'Components/Feedback/PageError',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. Render the appropriate variant when an error or access restriction occurs at the page level.',
      },
    },
  },
}

export const Compact = {
  render: () => `
    <div class="pathable-page-error pathable-page-error--compact">
      <svg class="pathable-page-error__icon" aria-hidden="true" viewBox="0 0 24 24" width="48" height="48" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
      </svg>
      <h2 class="pathable-page-error__heading">Unable to load data</h2>
      <p class="pathable-page-error__body">The data for this section could not be retrieved. Please try again.</p>
      <button class="pathable-page-error__retry pathable-button">Try again</button>
      <a href="#" class="pathable-page-error__nav">Go back</a>
    </div>
  `,
}

export const FullPage = {
  render: () => `
    <div class="pathable-page-error pathable-page-error--full-page">
      <svg class="pathable-page-error__icon" aria-hidden="true" viewBox="0 0 24 24" width="72" height="72" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <h1 class="pathable-page-error__heading">Something went wrong</h1>
      <p class="pathable-page-error__body">We encountered an unexpected error loading this page. Please try again or return home.</p>
      <button class="pathable-page-error__retry pathable-button">Try again</button>
      <a href="#" class="pathable-page-error__nav">Go to home</a>
    </div>
  `,
}

export const NotFound = {
  render: () => `
    <div class="pathable-page-error pathable-page-error--full-page pathable-page-error--not-found">
      <svg class="pathable-page-error__icon" aria-hidden="true" viewBox="0 0 24 24" width="72" height="72" fill="currentColor">
        <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z"/>
        <path d="M7 12h2v5H7zm4-3h2v8h-2zm4-2h2v10h-2z"/>
      </svg>
      <h1 class="pathable-page-error__heading">Page not found</h1>
      <p class="pathable-page-error__body">The page you requested does not exist or has been moved.</p>
      <a href="#" class="pathable-page-error__nav">Go to home</a>
    </div>
  `,
}

export const AccessRestricted = {
  render: () => `
    <div class="pathable-page-error pathable-page-error--full-page pathable-page-error--access-restricted">
      <svg class="pathable-page-error__icon" aria-hidden="true" viewBox="0 0 24 24" width="72" height="72" fill="currentColor">
        <path d="M18 8h-1V6c0-2.76-2.24-5-5-5S7 3.24 7 6v2H6c-1.1 0-2 .9-2 2v10c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V10c0-1.1-.9-2-2-2zm-6 9c-1.1 0-2-.9-2-2s.9-2 2-2 2 .9 2 2-.9 2-2 2zm3.1-9H8.9V6c0-1.71 1.39-3.1 3.1-3.1 1.71 0 3.1 1.39 3.1 3.1v2z"/>
      </svg>
      <h1 class="pathable-page-error__heading">Access restricted</h1>
      <p class="pathable-page-error__body">You do not have permission to view this page. Contact your administrator if you need access.</p>
      <a href="#" class="pathable-page-error__nav">Go to home</a>
    </div>
  `,
}

export const MobileFullPage = {
  parameters: { viewport: { defaultViewport: 'mobile1' } },
  render: () => `
    <div class="pathable-page-error pathable-page-error--full-page">
      <svg class="pathable-page-error__icon" aria-hidden="true" viewBox="0 0 24 24" width="72" height="72" fill="currentColor">
        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
      </svg>
      <h1 class="pathable-page-error__heading">Something went wrong</h1>
      <p class="pathable-page-error__body">We encountered an error. Please try again.</p>
      <button class="pathable-page-error__retry pathable-button">Try again</button>
      <a href="#" class="pathable-page-error__nav">Go home</a>
    </div>
  `,
}
