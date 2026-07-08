export default {
  title: 'Components/Communication/Accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Note:** This component requires USWDS JavaScript for full interactivity (accordion toggle, etc.). Only static CSS documentation is provided here. See the USWDS documentation for JS setup.',
      },
    },
  },
}

export const Default = {
  render: () => `
    <div class="pathable-accordion">
      <div class="pathable-accordion__heading">
        <button class="pathable-accordion__button" aria-expanded="false" aria-controls="accordion-content-1">
          First Amendment
        </button>
      </div>
      <div class="pathable-accordion__content" id="accordion-content-1" hidden>
        <p>Congress shall make no law respecting an establishment of religion, or prohibiting the free exercise thereof; or abridging the freedom of speech, or of the press; or the right of the people peaceably to assemble, and to petition the Government for a redress of grievances.</p>
      </div>
      <div class="pathable-accordion__heading">
        <button class="pathable-accordion__button" aria-expanded="false" aria-controls="accordion-content-2">
          Second Amendment
        </button>
      </div>
      <div class="pathable-accordion__content" id="accordion-content-2" hidden>
        <p>A well regulated Militia, being necessary to the security of a free State, the right of the people to keep and bear Arms, shall not be infringed.</p>
      </div>
      <div class="pathable-accordion__heading">
        <button class="pathable-accordion__button" aria-expanded="false" aria-controls="accordion-content-3">
          Third Amendment
        </button>
      </div>
      <div class="pathable-accordion__content" id="accordion-content-3" hidden>
        <p>No Soldier shall, in time of peace be quartered in any house, without the consent of the Owner, nor in time of war, but in a manner to be prescribed by law.</p>
      </div>
    </div>
  `,
}

export const BorderBox = {
  render: () => `
    <div class="pathable-accordion pathable-accordion--border-box">
      <div class="pathable-accordion__heading">
        <button class="pathable-accordion__button" aria-expanded="false" aria-controls="accordion-bb-1">
          Section One
        </button>
      </div>
      <div class="pathable-accordion__content" id="accordion-bb-1" hidden>
        <p>This accordion uses the border-box variant, which adds a visible border around each accordion item.</p>
      </div>
      <div class="pathable-accordion__heading">
        <button class="pathable-accordion__button" aria-expanded="false" aria-controls="accordion-bb-2">
          Section Two
        </button>
      </div>
      <div class="pathable-accordion__content" id="accordion-bb-2" hidden>
        <p>Each section is visually separated with a border for clearer content delineation.</p>
      </div>
    </div>
  `,
}
