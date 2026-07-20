// Shared deterministic fixtures for Communication component stories
// All content is synthetic, no dates, random values, or live data

export const LONG_CONTENT =
  'Lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident sunt in culpa qui officia deserunt mollit anim id est laborum.'

export const ACCORDION_ITEMS = [
  {
    id: 'first',
    heading: 'First Amendment',
    content: (
      <p>
        Congress shall make no law respecting an establishment of religion, or
        prohibiting the free exercise thereof; or abridging the freedom of
        speech, or of the press; or the right of the people peaceably to
        assemble, and to petition the Government for a redress of grievances.
      </p>
    ),
  },
  {
    id: 'second',
    heading: 'Second Amendment',
    content: (
      <p>
        A well regulated Militia, being necessary to the security of a free
        State, the right of the people to keep and bear Arms, shall not be
        infringed.
      </p>
    ),
  },
  {
    id: 'third',
    heading: 'Third Amendment',
    content: (
      <p>
        No Soldier shall, in time of peace be quartered in any house, without
        the consent of the Owner, nor in time of war, but in a manner to be
        prescribed by law.
      </p>
    ),
  },
]

export const PROCESS_ITEMS = [
  {
    id: 'research',
    heading: 'Research',
    body: (
      <p>
        Conduct initial research to understand user needs and project
        requirements.
      </p>
    ),
  },
  {
    id: 'design',
    heading: 'Design',
    body: <p>Create wireframes and prototypes based on research findings.</p>,
  },
  {
    id: 'develop',
    heading: 'Develop',
    body: (
      <p>
        Build the solution following design specifications and accessibility
        guidelines.
      </p>
    ),
  },
  {
    id: 'test',
    heading: 'Test',
    body: (
      <p>
        Validate the implementation through user testing and quality assurance.
      </p>
    ),
  },
  {
    id: 'launch',
    heading: 'Launch',
    body: <p>Deploy the solution and monitor for any issues.</p>,
  },
]

export const STEPS = [
  { id: 'create-account', label: 'Create Account' },
  { id: 'verify-identity', label: 'Verify Identity' },
  { id: 'setup-profile', label: 'Set Up Profile' },
  { id: 'complete', label: 'Complete' },
]

export const BILL_OF_RIGHTS = [
  {
    id: 'first',
    heading: 'First Amendment',
    content:
      'Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.',
  },
  {
    id: 'second',
    heading: 'Second Amendment',
    content:
      'A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.',
  },
  {
    id: 'third',
    heading: 'Third Amendment',
    content:
      'No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law.',
  },
]
