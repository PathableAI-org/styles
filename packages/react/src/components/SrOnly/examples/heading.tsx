import { useId } from 'react'
import { SrOnly } from '../SrOnly'

function UpcomingSessions() {
  const titleId = useId()
  return (
    <section aria-labelledby={titleId}>
      <SrOnly as="h2" id={titleId}>
        Upcoming sessions
      </SrOnly>
      <p>Three sessions are booked for this week.</p>
    </section>
  )
}

export default <UpcomingSessions />
