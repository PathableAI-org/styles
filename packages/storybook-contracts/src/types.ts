/** Minimal accessible-query surface supplied by a Storybook story. */
export interface Queryable {
  getByRole(
    role: string,
    options?: {
      name?: string | RegExp
      checked?: boolean
      pressed?: boolean
    },
  ): HTMLElement
  getAllByRole(
    role: string,
    options?: {
      name?: string | RegExp
      checked?: boolean
      pressed?: boolean
    },
  ): HTMLElement[]
  queryByRole(
    role: string,
    options?: {
      name?: string | RegExp
      checked?: boolean
      pressed?: boolean
    },
  ): HTMLElement | null
  getByText(text: string | RegExp): HTMLElement
  getByLabelText(
    text: string | RegExp,
    options?: { selector?: string },
  ): HTMLElement
}

/** Structural subset of Storybook's jest-dom assertion object. */
export interface StructuralAssertion {
  toBeDisabled(): Promise<void>
  toHaveAttribute(attribute: string, value?: string): Promise<void>
  toHaveFocus(): Promise<void>
}

/** Renderer-neutral browser-testing surface injected by each adopting story. */
export interface StoryHarness {
  root: HTMLElement
  within: (element: HTMLElement) => Queryable
  userEvent: {
    keyboard(input: string): Promise<void>
    click(element: HTMLElement): Promise<void>
    tab(): Promise<void>
  }
  expect: (actual: HTMLElement) => StructuralAssertion
}
