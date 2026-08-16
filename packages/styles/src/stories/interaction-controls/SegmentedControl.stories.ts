type PlayContext = {
  canvasElement: HTMLElement
}

type SegmentOption = {
  label: string
  iconSvg: string
  checked?: boolean
  pressed?: boolean
  selectedClass?: boolean
  disabled?: boolean
}

const selectedClass = 'pathable-segmented-control__option--selected'

export default {
  title: 'Interaction Controls/SegmentedControl',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          'Segmented controls present short option sets as compact single-select radio groups or multi-select toggle groups. The styles package provides the framework-neutral visual contract; runtime state updates and keyboard handling are consumer-owned, and these stories include deterministic reference fixtures for that behavior.',
      },
    },
  },
}

const svgIcon = (path: string) =>
  `<svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true" focusable="false"><path d="${path}"/></svg>`

const listIcon = svgIcon('M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z')
const gridIcon = svgIcon('M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z')
const detailIcon = svgIcon(
  'M1 3h10v2H1V3zm0 4h14v2H1V7zm0 4h10v2H1v-2zm12-4h2v2h-2V7zm0 4h2v2h-2v-2z',
)
const boldIcon = svgIcon(
  'M4 2h4.5a3.5 3.5 0 012.8 5.6A3.5 3.5 0 019 14H4V2zm2 4.5V5h2.5a1 1 0 010 2H6zm0 2.5V13h3a1 1 0 000-2H6z',
)
const italicIcon = svgIcon('M9.5 2l-3 12H5l3-12h1.5z')
const underlineIcon = svgIcon(
  'M2 13h12v2H2v-2zM4 2h2v6a2 2 0 004 0V2h2v6a4 4 0 01-8 0V2z',
)

const storyIntro = (heading: string, body: string) => `
  <h3 style="margin: 0 0 0.5rem; font-size: 1rem; font-weight: 600;">${heading}</h3>
  <p style="color: #555; font-size: 0.875rem; margin: 0 0 1rem;">${body}</p>
`

const singleOption = ({
  label,
  iconSvg,
  checked = false,
  selectedClass: includeSelectedClass = false,
  disabled = false,
}: SegmentOption) => {
  const className = includeSelectedClass ? ` ${selectedClass}` : ''
  const disabledAttr = disabled ? ' disabled' : ''
  const tabIndex = checked && !disabled ? '0' : '-1'

  return `
    <button class="pathable-segmented-control__option${className}" role="radio" aria-checked="${checked}" tabindex="${tabIndex}"${disabledAttr}>
      ${iconSvg}
      <span style="margin-left: 0.25rem;">${label}</span>
    </button>
  `
}

const multiOption = ({
  label,
  iconSvg,
  pressed = false,
  selectedClass: includeSelectedClass = false,
  disabled = false,
}: SegmentOption) => {
  const className = includeSelectedClass ? ` ${selectedClass}` : ''
  const disabledAttr = disabled ? ' disabled' : ''

  return `
    <button class="pathable-segmented-control__option${className}" aria-pressed="${pressed}"${disabledAttr}>
      ${iconSvg}
      <span style="margin-left: 0.25rem;">${label}</span>
    </button>
  `
}

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    throw new Error(message)
  }
}

const getButtons = (container: ParentNode) =>
  Array.from(
    container.querySelectorAll<HTMLButtonElement>(
      '.pathable-segmented-control__option',
    ),
  )

const setSingleSelection = (
  buttons: HTMLButtonElement[],
  selectedButton: HTMLButtonElement,
) => {
  buttons.forEach((button) => {
    const isSelected = button === selectedButton
    button.setAttribute('aria-checked', String(isSelected))
    button.tabIndex = isSelected && !button.disabled ? 0 : -1
  })
}

const setupSingleSelect = (canvasElement: HTMLElement) => {
  const groups = Array.from(
    canvasElement.querySelectorAll<HTMLElement>('[role="radiogroup"]'),
  )

  groups.forEach((group) => {
    if (group.dataset.segmentedControlReady === 'true') {
      return
    }

    group.dataset.segmentedControlReady = 'true'
    const buttons = getButtons(group)

    group.addEventListener('keydown', (event) => {
      const direction =
        event.key === 'ArrowRight' || event.key === 'ArrowDown'
          ? 1
          : event.key === 'ArrowLeft' || event.key === 'ArrowUp'
            ? -1
            : 0

      if (direction === 0) {
        return
      }

      event.preventDefault()

      const enabledButtons = buttons.filter((button) => !button.disabled)
      const activeButton = group.ownerDocument.activeElement
      const checkedButton = enabledButtons.find(
        (button) => button.getAttribute('aria-checked') === 'true',
      )
      const currentButton = enabledButtons.includes(
        activeButton as HTMLButtonElement,
      )
        ? (activeButton as HTMLButtonElement)
        : checkedButton || enabledButtons[0]
      const currentIndex = enabledButtons.indexOf(currentButton)
      const nextButton =
        enabledButtons[
          (currentIndex + direction + enabledButtons.length) %
            enabledButtons.length
        ]

      setSingleSelection(buttons, nextButton)
      nextButton.focus()
    })
  })
}

const togglePressed = (button: HTMLButtonElement) => {
  const nextPressed = button.getAttribute('aria-pressed') !== 'true'
  button.setAttribute('aria-pressed', String(nextPressed))
}

const setupMultiSelect = (canvasElement: HTMLElement) => {
  const buttons = getButtons(canvasElement).filter((button) =>
    button.hasAttribute('aria-pressed'),
  )

  buttons.forEach((button) => {
    if (button.dataset.segmentedControlReady === 'true') {
      return
    }

    button.dataset.segmentedControlReady = 'true'
    button.addEventListener('click', () => {
      if (!button.disabled) {
        togglePressed(button)
      }
    })
    button.addEventListener('keydown', (event) => {
      if (event.key === ' ' || event.key === 'Enter') {
        event.preventDefault()
        togglePressed(button)
      }
    })
  })
}

const pressKey = (element: HTMLElement, key: string) => {
  const KeyboardEventConstructor =
    element.ownerDocument.defaultView?.KeyboardEvent || KeyboardEvent

  element.dispatchEvent(
    new KeyboardEventConstructor('keydown', { key, bubbles: true }),
  )
}

export const SingleSelect = {
  parameters: {
    docs: {
      description: {
        story:
          'Single-select segmented controls use `role="radiogroup"`, option `role="radio"`, and `aria-checked`. This fixture demonstrates consumer-owned Arrow key behavior and intentionally relies on ARIA-selected styling rather than the selected class.',
      },
    },
  },
  render: () => `
    ${storyIntro(
      'Single Select',
      'Arrow keys move focus and selection between enabled radio options. Selected styling is driven by aria-checked.',
    )}
    <div class="pathable-segmented-control" role="radiogroup" aria-label="View mode">
      ${singleOption({ label: 'List', iconSvg: listIcon, checked: true })}
      ${singleOption({ label: 'Grid', iconSvg: gridIcon })}
      ${singleOption({ label: 'Detail', iconSvg: detailIcon })}
    </div>
  `,
  play: async ({ canvasElement }: PlayContext) => {
    setupSingleSelect(canvasElement)

    const buttons = getButtons(canvasElement)
    buttons[0].focus()
    pressKey(buttons[0], 'ArrowRight')

    assert(
      buttons[1].getAttribute('aria-checked') === 'true',
      'ArrowRight should select the next segment.',
    )
    assert(
      canvasElement.ownerDocument.activeElement === buttons[1],
      'ArrowRight should move focus to the selected segment.',
    )
  },
}

export const MultiSelect = {
  render: () => `
    ${storyIntro(
      'Multi Select',
      'Space or Enter toggles each option independently. Selected styling is driven by aria-pressed.',
    )}
    <div class="pathable-segmented-control pathable-segmented-control--multi" role="group" aria-label="Text formatting">
      ${multiOption({ label: 'Bold', iconSvg: boldIcon })}
      ${multiOption({ label: 'Italic', iconSvg: italicIcon, pressed: true })}
      ${multiOption({ label: 'Underline', iconSvg: underlineIcon })}
    </div>
  `,
  play: async ({ canvasElement }: PlayContext) => {
    setupMultiSelect(canvasElement)

    const buttons = getButtons(canvasElement)
    buttons[0].focus()
    pressKey(buttons[0], ' ')

    assert(
      buttons[0].getAttribute('aria-pressed') === 'true',
      'Space should toggle the focused segment on.',
    )
    assert(
      buttons[1].getAttribute('aria-pressed') === 'true',
      'Toggling one segment should not clear another pressed segment.',
    )
  },
}

export const Vertical = {
  render: () => `
    ${storyIntro(
      'Vertical Orientation',
      'Vertical segmented controls stack options for narrow sidebars or dense settings panels.',
    )}
    <div class="pathable-segmented-control pathable-segmented-control--vertical" role="radiogroup" aria-label="Alignment">
      ${singleOption({ label: 'Left', iconSvg: listIcon, checked: true })}
      ${singleOption({ label: 'Center', iconSvg: detailIcon })}
      ${singleOption({ label: 'Right', iconSvg: gridIcon })}
    </div>
  `,
  play: async ({ canvasElement }: PlayContext) => {
    setupSingleSelect(canvasElement)

    const buttons = getButtons(canvasElement)
    buttons[0].focus()
    pressKey(buttons[0], 'ArrowDown')

    assert(
      buttons[1].getAttribute('aria-checked') === 'true',
      'ArrowDown should select the next segment in vertical orientation.',
    )
  },
}

export const DisabledOption = {
  render: () => `
    ${storyIntro(
      'Disabled Option',
      'Disabled options remain visually present but are skipped by keyboard selection behavior.',
    )}
    <div class="pathable-segmented-control" role="radiogroup" aria-label="Page size">
      ${singleOption({ label: '10', iconSvg: listIcon, checked: true })}
      ${singleOption({ label: '25', iconSvg: detailIcon, disabled: true })}
      ${singleOption({ label: '50', iconSvg: gridIcon })}
    </div>
  `,
  play: async ({ canvasElement }: PlayContext) => {
    setupSingleSelect(canvasElement)

    const buttons = getButtons(canvasElement)
    buttons[0].focus()
    pressKey(buttons[0], 'ArrowRight')

    assert(
      buttons[2].getAttribute('aria-checked') === 'true',
      'Arrow navigation should skip disabled segments.',
    )
  },
}

export const ClassSelected = {
  render: () => `
    ${storyIntro(
      'Class Selected State',
      'Consumers may apply the selected modifier class when ARIA state is managed elsewhere. The class and ARIA state sources produce equivalent styling.',
    )}
    <div class="pathable-segmented-control" role="radiogroup" aria-label="Density">
      ${singleOption({ label: 'Compact', iconSvg: listIcon, selectedClass: true })}
      ${singleOption({ label: 'Comfortable', iconSvg: detailIcon, checked: true })}
      ${singleOption({ label: 'Spacious', iconSvg: gridIcon })}
    </div>
  `,
}

export const StaticSingleOption = {
  render: () => `
    ${storyIntro(
      'Static Single Option',
      'A one-option presentation is a noninteractive indicator, not a radiogroup, radio, or button.',
    )}
    <div class="pathable-segmented-control pathable-segmented-control--static" aria-label="Current mode">
      <span class="pathable-segmented-control__option pathable-segmented-control__option--selected">
        ${listIcon}
        <span style="margin-left: 0.25rem;">List view</span>
      </span>
    </div>
  `,
  play: async ({ canvasElement }: PlayContext) => {
    assert(
      canvasElement.querySelector('button') === null,
      'Static single-option usage should not render a button.',
    )
    assert(
      canvasElement.querySelector('[role="radio"]') === null,
      'Static single-option usage should not render radio semantics.',
    )
  },
}

export const ConstrainedHorizontal = {
  render: () => `
    ${storyIntro(
      'Constrained Horizontal Layout',
      'Long labels and more than five options scroll inside the control instead of creating page-level horizontal overflow.',
    )}
    <div style="max-width: 20rem; border: 1px dashed var(--pathable-color-border); padding: var(--space-4);">
      <div class="pathable-segmented-control" role="radiogroup" aria-label="Reporting timeframe">
        ${singleOption({ label: 'Today', iconSvg: listIcon, checked: true })}
        ${singleOption({ label: 'This week', iconSvg: detailIcon })}
        ${singleOption({ label: 'This month', iconSvg: gridIcon })}
        ${singleOption({ label: 'Previous quarter', iconSvg: listIcon })}
        ${singleOption({ label: 'Year to date', iconSvg: detailIcon })}
        ${singleOption({ label: 'Custom localized reporting period', iconSvg: gridIcon })}
      </div>
    </div>
  `,
  play: async ({ canvasElement }: PlayContext) => {
    const control = canvasElement.querySelector<HTMLElement>(
      '.pathable-segmented-control',
    )

    assert(control !== null, 'Constrained story should render the control.')
    const getStoryComputedStyle =
      canvasElement.ownerDocument.defaultView?.getComputedStyle ||
      getComputedStyle

    assert(
      getStoryComputedStyle(control).overflowX === 'auto',
      'Horizontal constrained controls should scroll internally.',
    )
  },
}

export const Default = SingleSelect
