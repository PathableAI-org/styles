export default {
  title: 'Components/Feedback/Skeleton',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. Render skeleton placeholders in place of real content while data loads. Container is `aria-hidden="true"`.',
      },
    },
  },
}

export const TextHeading = {
  render: () => `
    <div class="pathable-skeleton" aria-hidden="true">
      <div class="pathable-skeleton--text-heading"></div>
    </div>
  `,
}

export const TextBody = {
  render: () => `
    <div class="pathable-skeleton" aria-hidden="true">
      <div class="pathable-skeleton--text-heading"></div>
      <div class="pathable-skeleton--text-body"></div>
      <div class="pathable-skeleton--text-body"></div>
      <div class="pathable-skeleton--text-body"></div>
    </div>
  `,
}

export const Avatar = {
  render: () => `
    <div class="pathable-skeleton" aria-hidden="true">
      <div class="pathable-skeleton--avatar"></div>
    </div>
  `,
}

export const Card = {
  render: () => `
    <div class="pathable-skeleton" aria-hidden="true">
      <div class="pathable-skeleton--card"></div>
    </div>
  `,
}

export const TableRow = {
  render: () => `
    <div class="pathable-skeleton" aria-hidden="true">
      <div class="pathable-skeleton--table-row"></div>
      <div class="pathable-skeleton--table-row"></div>
      <div class="pathable-skeleton--table-row"></div>
    </div>
  `,
}

export const RowWithAvatar = {
  render: () => `
    <div class="pathable-skeleton" aria-hidden="true">
      <div class="pathable-skeleton--row">
        <div class="pathable-skeleton--avatar"></div>
        <div style="flex:1">
          <div class="pathable-skeleton--text-heading"></div>
          <div class="pathable-skeleton--text-body"></div>
        </div>
      </div>
    </div>
  `,
}

export const MobileCard = {
  globals: { viewport: { value: 'mobile1', isRotated: false } },
  render: () => `
    <div class="pathable-skeleton" aria-hidden="true">
      <div class="pathable-skeleton--card"></div>
      <div class="pathable-skeleton--text-body"></div>
      <div class="pathable-skeleton--text-body"></div>
    </div>
  `,
}
