export default {
  title: 'Components/Communication/Accordion',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        component:
          '**Status**: CSS-only in this package. The React wrapper at `@pathable/react` provides JS behavior (expand/collapse, keyboard navigation via Enter/Space).\n\n**CSS markup**: Requires `.pathable-accordion`, `.pathable-accordion__heading`, `.pathable-accordion__button`, `.pathable-accordion__content`.\n\n**Disclosure behavior (verified)**:\n- Each accordion item is a disclosure widget.\n- The button uses `aria-expanded="false"` (collapsed) or `aria-expanded="true"` (expanded).\n- The content panel is associated via `aria-controls` on the button and `id` on the panel.\n- The content panel uses the `hidden` attribute when collapsed.\n- Keyboard: Enter or Space toggles the disclosure.\n\n**Consumers must**: Import `@pathable/styles` CSS. For JS behavior, use `@pathable/react` Accordion component or import `@pathable/styles/js`.',
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
