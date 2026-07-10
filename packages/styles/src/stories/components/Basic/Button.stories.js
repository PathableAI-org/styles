export default {
  title: 'Components/Button',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.',
      },
    },
  },
}

export const Default = {
  render: () => '<button class="pathable-button">Default Button</button>',
}

export const Primary = {
  render: () =>
    '<button class="pathable-button pathable-button--primary">Primary Button</button>',
}

export const AccentCool = {
  render: () =>
    '<button class="pathable-button pathable-button--accent-cool">Accent Cool</button>',
}

export const AccentWarm = {
  render: () =>
    '<button class="pathable-button pathable-button--accent-warm">Accent Warm</button>',
}

export const Outline = {
  render: () =>
    '<button class="pathable-button pathable-button--outline">Outline</button>',
}

export const Inverse = {
  render: () =>
    '<button class="pathable-button pathable-button--inverse">Inverse</button>',
}

export const Base = {
  render: () =>
    '<button class="pathable-button pathable-button--base">Base</button>',
}

export const Secondary = {
  render: () =>
    '<button class="pathable-button pathable-button--secondary">Secondary</button>',
}

export const Big = {
  render: () =>
    '<button class="pathable-button pathable-button--big">Big Button</button>',
}

export const Unstyled = {
  render: () =>
    '<button class="pathable-button pathable-button--unstyled">Unstyled</button>',
}

// Workflow-specific button stories
export const WorkflowPrimaryCTA = {
  render: () => '<button class="pathable-button">Save Coaching Note</button>',
}

export const WorkflowSecondaryAction = {
  render: () =>
    '<button class="pathable-button pathable-button--secondary">Add Support Activity</button>',
}

export const WorkflowTertiaryAction = {
  render: () =>
    '<button class="pathable-button pathable-button--accent-cool">View Details</button>',
}

export const WorkflowSave = {
  render: () =>
    '<button class="pathable-button pathable-button--save">Save Coaching Note</button>',
}

export const WorkflowContinue = {
  render: () =>
    '<button class="pathable-button pathable-button--continue">Continue to Review</button>',
}

export const WorkflowReview = {
  render: () =>
    '<button class="pathable-button pathable-button--review">Review Compliance</button>',
}

export const WorkflowDestructive = {
  render: () =>
    '<button class="pathable-button pathable-button--destructive">Delete Activity</button>',
}

export const WorkflowLowEmphasis = {
  render: () =>
    '<button class="pathable-button pathable-button--low-emphasis">Cancel</button>',
}
