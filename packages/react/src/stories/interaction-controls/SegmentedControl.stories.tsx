import { useState } from 'react'
import { SegmentedControl } from '../../components/SegmentedControl/SegmentedControl'
import type { SegmentedControlOption } from '../../components/SegmentedControl/SegmentedControl'
import type { Meta, StoryObj } from '@storybook/react'
import { expect, fn, userEvent, within } from 'storybook/test'

const meta = {
  title: 'Interaction Controls/SegmentedControl',
  component: SegmentedControl,
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A compact group of related options for switching between short, mutually exclusive choices or independently toggleable choices.

**When to use**: Use \`SegmentedControl\` for small option sets such as view modes, text formatting, alignment, or density. Keep option labels short and use 2-5 segments.

**When not to use**: Do not use segmented controls for long lists, navigation between pages, destructive actions, or forms where a native select/radio group would be clearer.

**Single-select semantics**: The default mode renders \`role="radiogroup"\` with \`role="radio"\` options. Arrow keys move focus and request selection changes through \`onValueChange\`.

**Multi-select semantics**: \`mode="multi"\` renders \`role="group"\` with toggle buttons using \`aria-pressed\`. Tab moves between buttons, and Space or Enter toggles a segment through \`onValuesChange\`.

**Controlled state**: Selection is controlled by consumers through \`value\`/\`onValueChange\` or \`values\`/\`onValuesChange\`. The component provides the CSS class contract, roles, and keyboard focus behavior.`,
      },
    },
  },
  argTypes: {
    mode: {
      options: ['single', 'multi'],
      control: { type: 'select' },
      description:
        'Selection model. `single` uses radiogroup semantics; `multi` uses toggle button semantics.',
    },
    orientation: {
      options: ['horizontal', 'vertical'],
      control: { type: 'select' },
      description:
        'Visual orientation. Vertical orientation stacks options. In single-select mode, vertical orientation also exposes `aria-orientation="vertical"` on the radiogroup.',
    },
    value: {
      control: { type: 'text' },
      description: 'Selected value for single-select mode.',
    },
    values: {
      control: { type: 'object' },
      description: 'Selected values for multi-select mode.',
    },
    options: {
      control: { type: 'object' },
      description:
        'Option definitions. Each option requires a stable `value` and visible `label`; optional icons are rendered before the label.',
    },
  },
  args: {
    mode: 'single',
    'aria-label': 'View mode',
    value: 'list',
    options: [],
    onValueChange: fn(),
  },
} satisfies Meta<typeof SegmentedControl>

export default meta
type Story = StoryObj<typeof meta>

const icon = (path: string) => (
  <svg width="16" height="16" viewBox="0 0 16 16" aria-hidden="true">
    <path d={path} />
  </svg>
)

const listIcon = icon('M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z')
const gridIcon = icon('M1 1h6v6H1V1zm8 0h6v6H9V1zM1 9h6v6H1V9zm8 0h6v6H9V9z')
const detailIcon = icon(
  'M1 3h10v2H1V3zm0 4h14v2H1V7zm0 4h10v2H1v-2zm12-4h2v2h-2V7zm0 4h2v2h-2v-2z',
)

const boldIcon = icon(
  'M4 2h4.5a3.5 3.5 0 012.8 5.6A3.5 3.5 0 019 14H4V2zm2 4.5V5h2.5a1 1 0 010 2H6zm0 2.5V13h3a1 1 0 000-2H6z',
)
const italicIcon = icon('M9.5 2l-3 12H5l3-12h1.5z')
const underlineIcon = icon(
  'M2 13h12v2H2v-2zM4 2h2v6a2 2 0 004 0V2h2v6a4 4 0 01-8 0V2z',
)

const viewModeOptions: readonly SegmentedControlOption[] = [
  { value: 'list', label: 'List', icon: listIcon },
  { value: 'grid', label: 'Grid', icon: gridIcon },
  { value: 'detail', label: 'Detail', icon: detailIcon },
]

const formattingOptions: readonly SegmentedControlOption[] = [
  { value: 'bold', label: 'Bold', icon: boldIcon },
  { value: 'italic', label: 'Italic', icon: italicIcon },
  { value: 'underline', label: 'Underline', icon: underlineIcon },
]

const defaultMultiValues: readonly string[] = ['bold']

type PlaygroundArgs = {
  readonly mode?: 'single' | 'multi'
  readonly orientation?: 'horizontal' | 'vertical'
  readonly options?: readonly SegmentedControlOption[]
  readonly value?: string
  readonly values?: readonly string[]
  readonly onValueChange?: (value: string) => void
  readonly onValuesChange?: (values: readonly string[]) => void
  readonly 'aria-label'?: string
}

const alignmentOptions: readonly SegmentedControlOption[] = [
  {
    value: 'left',
    label: 'Left',
    icon: icon('M1 3h14v2H1V3zm0 4h10v2H1V7zm0 4h14v2H1v-2z'),
  },
  {
    value: 'center',
    label: 'Center',
    icon: icon('M1 3h14v2H1V3zm2 4h10v2H3V7zm1 4h12v2H4v-2z'),
  },
  {
    value: 'right',
    label: 'Right',
    icon: icon('M1 3h14v2H1V3zm4 4h10v2H5V7zm0 4h14v2H5v-2z'),
  },
  {
    value: 'justify',
    label: 'Justify',
    icon: icon('M1 3h14v2H1V3zm0 4h14v2H1V7zm0 4h14v2H1v-2z'),
  },
]

function ControlledSingleSelect({
  initialValue = 'list',
  onValueChange,
}: {
  readonly initialValue?: string
  readonly onValueChange?: (value: string) => void
}) {
  const [value, setValue] = useState(initialValue)

  return (
    <SegmentedControl
      aria-label="View mode"
      options={viewModeOptions}
      value={value}
      onValueChange={(nextValue) => {
        setValue(nextValue)
        onValueChange?.(nextValue)
      }}
    />
  )
}

function ControlledMultiSelect({
  initialValues = ['bold'],
  onValuesChange,
}: {
  readonly initialValues?: readonly string[]
  readonly onValuesChange?: (values: readonly string[]) => void
}) {
  const [values, setValues] = useState<readonly string[]>(initialValues)

  return (
    <SegmentedControl
      mode="multi"
      aria-label="Text formatting"
      options={formattingOptions}
      values={values}
      onValuesChange={(nextValues) => {
        setValues(nextValues)
        onValuesChange?.(nextValues)
      }}
    />
  )
}

function PlaygroundRender(args: PlaygroundArgs) {
  const mode = args.mode === 'multi' ? 'multi' : 'single'
  const options =
    args.options && args.options.length > 0
      ? args.options
      : mode === 'multi'
        ? formattingOptions
        : viewModeOptions
  const controlledValue = args.value ?? 'list'
  const controlledValues = args.values ?? defaultMultiValues
  const [value, setValue] = useState(controlledValue)
  const [values, setValues] = useState<readonly string[]>(controlledValues)

  if (mode === 'multi') {
    return (
      <SegmentedControl
        mode="multi"
        aria-label={args['aria-label'] ?? 'Text formatting'}
        orientation={args.orientation}
        options={options}
        values={values}
        onValuesChange={(nextValues) => {
          setValues(nextValues)
          args.onValuesChange?.(nextValues)
        }}
      />
    )
  }

  return (
    <SegmentedControl
      mode="single"
      aria-label={args['aria-label'] ?? 'View mode'}
      orientation={args.orientation}
      options={options}
      value={value}
      onValueChange={(nextValue) => {
        setValue(nextValue)
        args.onValueChange?.(nextValue)
      }}
    />
  )
}

export const Playground: Story = {
  render: (args) => <PlaygroundRender {...(args as PlaygroundArgs)} />,
  args: {
    options: viewModeOptions,
    value: 'list',
  },
}

export const SingleSelect: Story = {
  args: {
    'aria-label': 'View mode',
    options: viewModeOptions,
    value: 'list',
  },
}

export const MultiSelect: Story = {
  args: {
    mode: 'multi',
    'aria-label': 'Text formatting',
    options: formattingOptions,
    values: [],
    onValuesChange: fn(),
  },
  play: async ({ canvasElement }) => {
    const canvas = within(canvasElement)

    await expect(
      canvas.getByRole('group', { name: 'Text formatting' }),
    ).toBeVisible()
    for (const name of ['Bold', 'Italic', 'Underline']) {
      await expect(canvas.getByRole('button', { name })).toHaveAttribute(
        'aria-pressed',
        'false',
      )
    }
  },
}

export const Vertical: Story = {
  args: {
    'aria-label': 'Alignment',
    orientation: 'vertical',
    options: alignmentOptions,
    value: 'left',
  },
}

export const DisabledOption: Story = {
  args: {
    'aria-label': 'Page size',
    options: [
      { value: '10', label: '10', icon: listIcon },
      { value: '25', label: '25', icon: listIcon },
      { value: '50', label: '50', icon: listIcon, disabled: true },
    ],
    value: '10',
  },
  play: async ({ canvasElement, step }) => {
    const canvas = within(canvasElement)

    await step('disabled segment is exposed as disabled', async () => {
      const option = canvas.getByRole('radio', { name: '50' })
      await expect(option).toBeDisabled()
    })
  },
}

export const SingleOption: Story = {
  args: {
    'aria-label': 'Single option',
    options: [
      {
        value: 'enable',
        label: 'Enable Feature',
        icon: icon('M6 12l-4-4 1.5-1.5L6 9l6.5-6.5L14 4l-8 8z'),
      },
    ],
    value: 'enable',
  },
}

export const Narrow: Story = {
  args: {
    'aria-label': 'Mobile view mode',
    options: viewModeOptions,
    value: 'grid',
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
}

export const LongLabels: Story = {
  args: {
    'aria-label': 'Report layout',
    options: [
      { value: 'summary', label: 'Summary dashboard' },
      { value: 'comparison', label: 'Comparison table' },
      { value: 'detail', label: 'Detailed activity feed' },
    ],
    value: 'summary',
  },
}

export const KeyboardNavigation: Story = {
  render: (args) => (
    <ControlledSingleSelect onValueChange={args.onValueChange} />
  ),
  args: {
    onValueChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Tab focuses the selected radio option', async () => {
      await userEvent.tab()
      const list = canvas.getByRole('radio', { name: 'List' })
      await expect(list).toHaveFocus()
      await expect(list).toHaveAttribute('aria-checked', 'true')
    })

    await step(
      'ArrowRight moves focus and requests the next value',
      async () => {
        await userEvent.keyboard('{ArrowRight}')
        const grid = canvas.getByRole('radio', { name: 'Grid' })
        await expect(grid).toHaveFocus()
        await expect(grid).toHaveAttribute('aria-checked', 'true')
        await expect(args.onValueChange).toHaveBeenCalledWith('grid')
      },
    )

    await step('ArrowLeft wraps focus and selection backward', async () => {
      await userEvent.keyboard('{ArrowLeft}')
      const list = canvas.getByRole('radio', { name: 'List' })
      await expect(list).toHaveFocus()
      await expect(list).toHaveAttribute('aria-checked', 'true')
      await expect(args.onValueChange).toHaveBeenCalledWith('list')
    })
  },
}

export const MultiSelectKeyboardToggle: Story = {
  render: (args) => (
    <ControlledMultiSelect onValuesChange={args.onValuesChange} />
  ),
  args: {
    mode: 'multi',
    onValuesChange: fn(),
  },
  play: async ({ canvasElement, args, step }) => {
    const canvas = within(canvasElement)

    await step('Tab reaches the first toggle button', async () => {
      await userEvent.tab()
      const bold = canvas.getByRole('button', { name: 'Bold' })
      await expect(bold).toHaveFocus()
      await expect(bold).toHaveAttribute('aria-pressed', 'true')
    })

    await step('Space toggles the focused segment off', async () => {
      await userEvent.keyboard(' ')
      const bold = canvas.getByRole('button', { name: 'Bold' })
      await expect(bold).toHaveAttribute('aria-pressed', 'false')
      await expect(args.onValuesChange).toHaveBeenCalledWith([])
    })

    await step('Tab and Enter toggle another segment on', async () => {
      await userEvent.tab()
      const italic = canvas.getByRole('button', { name: 'Italic' })
      await userEvent.keyboard('{Enter}')
      await expect(italic).toHaveAttribute('aria-pressed', 'true')
      await expect(args.onValuesChange).toHaveBeenCalledWith(['italic'])
    })
  },
}

export const InToolbar: Story = {
  render: () => (
    <div
      aria-label="Document toolbar"
      role="toolbar"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        gap: '1rem',
        alignItems: 'center',
        padding: '1rem',
        border: '1px solid var(--pathable-color-border, #dfe1e2)',
        borderRadius: 8,
      }}
    >
      <ControlledMultiSelect />
      <SegmentedControl
        aria-label="View mode"
        options={viewModeOptions}
        value="grid"
        onValueChange={fn()}
      />
    </div>
  ),
}

export const Default: Story = SingleSelect
