import {
  Accordion,
  Alert,
  Banner,
  Modal,
  ProcessList,
  SiteAlert,
  StepIndicator,
  SummaryBox,
} from '../../../index'
import type { Meta, StoryObj } from '@storybook/react'
import { useState } from 'react'
import { ACCORDION_ITEMS, PROCESS_ITEMS, STEPS } from './fixtures'

const meta = {
  title: 'Components/Communication/CommunicationPatterns',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component: `A deterministic workflow composition demonstrating all eight Communication components working together without creating a new production API.

**Purpose**: Validate that all components can be imported from the public package, composed in a single page, and render correctly with transitive PathAble styling.

**Components used**: SiteAlert, StepIndicator, Alert, Accordion, SummaryBox, ProcessList, Banner, and Modal.`,
      },
    },
  },
} satisfies Meta<typeof CommunicationPatternsStory>

export default meta
type Story = StoryObj<typeof meta>

function CommunicationPatternsStory() {
  const [modalOpen, setModalOpen] = useState(false)

  return (
    <div style={{ maxWidth: 800, margin: '0 auto', padding: '1rem' }}>
      <h2>Employment Program Enrollment</h2>

      <SiteAlert status="info">
        <p>
          New enrollment period opens January 1. Complete all steps to secure
          your spot.
        </p>
      </SiteAlert>

      <StepIndicator
        steps={STEPS}
        currentStep={2}
        heading="Enrollment progress"
      />

      <Alert status="success" heading="Prerequisites met" slim>
        <p>All required documents have been verified.</p>
      </Alert>

      <Accordion items={ACCORDION_ITEMS.slice(0, 2)} />

      <SummaryBox heading="Key deadlines">
        <p>
          Applications must be submitted by the 15th of the month. Late
          submissions are reviewed on a case-by-case basis.
        </p>
      </SummaryBox>

      <ProcessList items={PROCESS_ITEMS.slice(0, 3)} />

      <Banner summary="Official website of the United States government">
        <p>The .gov domain indicates official government information.</p>
      </Banner>

      <button type="button" onClick={() => setModalOpen(true)}>
        Review Terms
      </button>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Program Terms and Conditions"
        closeLabel="Close terms"
      >
        <p>
          By enrolling you agree to participate in all required sessions and
          assessments.
        </p>
      </Modal>
    </div>
  )
}

export const Default: Story = {
  render: () => <CommunicationPatternsStory />,
}
