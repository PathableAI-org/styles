export default {
  title: 'Brand/Typography',
  tags: ['autodocs'],
  parameters: {
    docs: {
      description: {
        story:
          '**Interaction Model**: CSS-only\n\n**Consumers must**: Import `@pathable/styles` CSS. No JavaScript required.',
      },
    },
  },
}

const fontRoles = [
  {
    name: 'heading',
    displayName: 'Heading',
    typeface: 'Fredoka',
    weight: 400,
    weightName: 'Regular',
    cssToken: '--pathable-font-heading',
    fontStack: "'Fredoka', system-ui, sans-serif",
    fallback: 'system-ui, sans-serif',
    uswdsRole: 'heading',
    usage: 'Primary headings — page titles, section headers, display text',
  },
  {
    name: 'alternate-heading',
    displayName: 'Alternate Heading',
    typeface: 'Montserrat',
    weight: 700,
    weightName: 'Bold',
    cssToken: '--pathable-font-alt',
    fontStack: "'Montserrat', system-ui, sans-serif",
    fallback: 'system-ui, sans-serif',
    uswdsRole: 'alt',
    usage: 'Secondary headings — banners, hero sections, alternative emphasis',
  },
  {
    name: 'subheading',
    displayName: 'Subheading',
    typeface: 'Poppins',
    weight: 700,
    weightName: 'Bold',
    cssToken: '--pathable-font-subheading',
    fontStack: "'Poppins', system-ui, sans-serif",
    fallback: 'system-ui, sans-serif',
    uswdsRole: null,
    usage: 'Subheadings — card titles, section labels, navigation items',
  },
  {
    name: 'body',
    displayName: 'Body Text',
    typeface: 'Nunito',
    weight: 400,
    weightName: 'Regular',
    cssToken: '--pathable-font-body',
    fontStack: "'Nunito', system-ui, serif",
    fallback: 'system-ui, serif',
    uswdsRole: 'body, ui',
    usage: 'Body text — paragraphs, labels, UI text, long-form content',
  },
]

const typeScale = [
  {
    name: 'display-lg',
    displayName: 'Display Large',
    typeface: 'Fredoka',
    fontSize: '32px',
    lineHeight: '40px',
    fontWeight: 400,
    sizeToken: '--pathable-font-size-display-lg',
    uiToken: '--ui-display-lg',
  },
  {
    name: 'heading-lg',
    displayName: 'Heading Large',
    typeface: 'Poppins',
    fontSize: '24px',
    lineHeight: '32px',
    fontWeight: 700,
    sizeToken: '--pathable-font-size-heading-lg',
    uiToken: '--ui-heading-lg',
  },
  {
    name: 'heading-md',
    displayName: 'Heading Medium',
    typeface: 'Poppins',
    fontSize: '20px',
    lineHeight: '28px',
    fontWeight: 700,
    sizeToken: '--pathable-font-size-heading-md',
    uiToken: '--ui-heading-md',
  },
  {
    name: 'heading-sm',
    displayName: 'Heading Small',
    typeface: 'Poppins',
    fontSize: '18px',
    lineHeight: '24px',
    fontWeight: 700,
    sizeToken: '--pathable-font-size-heading-sm',
    uiToken: '--ui-heading-sm',
  },
  {
    name: 'body-lg',
    displayName: 'Body Large',
    typeface: 'Nunito',
    fontSize: '18px',
    lineHeight: '28px',
    fontWeight: 400,
    sizeToken: '--pathable-font-size-body-lg',
    uiToken: '--ui-body-lg',
  },
  {
    name: 'body-md',
    displayName: 'Body Medium',
    typeface: 'Nunito',
    fontSize: '16px',
    lineHeight: '24px',
    fontWeight: 400,
    sizeToken: '--pathable-font-size-body-md',
    uiToken: '--ui-body-md',
  },
  {
    name: 'body-sm',
    displayName: 'Body Small',
    typeface: 'Nunito',
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
    sizeToken: '--pathable-font-size-body-sm',
    uiToken: '--ui-body-sm',
  },
  {
    name: 'label-md',
    displayName: 'Label Medium',
    typeface: 'Nunito',
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 600,
    sizeToken: '--pathable-font-size-label-md',
    uiToken: '--ui-label-md',
  },
  {
    name: 'label-sm',
    displayName: 'Label Small',
    typeface: 'Nunito',
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 600,
    sizeToken: '--pathable-font-size-label-sm',
    uiToken: '--ui-label-sm',
  },
  {
    name: 'caption-md',
    displayName: 'Caption Medium',
    typeface: 'Nunito',
    fontSize: '12px',
    lineHeight: '16px',
    fontWeight: 400,
    sizeToken: '--pathable-font-size-caption-md',
    uiToken: '--ui-caption-md',
  },
]

const typographyViolations = [
  {
    name: 'heading-for-long-text',
    description: 'Using heading typeface (Fredoka) for long passages of text',
    rule: 'Do not use the heading typeface for long sections of text',
    sample: `Fredoka is a friendly rounded sans-serif typeface designed for short, impactful headings. When used for long paragraphs like this one, it becomes visually tiring and reduces readability. The rounded letterforms that work well at large sizes feel crowded and informal at body text length, making sustained reading more difficult. Headings should be reserved for short, prominent statements — anything longer than one sentence should use body text styling with Nunito.`,
    violatingStyle:
      'font-family: Fredoka, system-ui, sans-serif; font-size: 16px; line-height: 1.5; font-weight: 400;',
    correctStyle:
      'font-family: Nunito, system-ui, serif; font-size: 16px; line-height: 1.5; font-weight: 400;',
  },
  {
    name: 'centered-long-body',
    description: 'Centering body text blocks longer than 3 lines',
    rule: 'Do not center sections of body text longer than 3 lines',
    sample: `This is a long body text paragraph that has been center-aligned. Centered text is harder to read for extended passages because the eye struggles to find the start of each line. The uneven line lengths create a ragged appearance that disrupts reading flow. For body text longer than three lines, left alignment is the standard for readability in left-to-right languages. Center alignment should be reserved for short labels, callouts, and decorative text.`,
    violatingStyle:
      'text-align: center; font-family: Nunito, system-ui, serif; font-size: 16px; line-height: 1.5;',
    correctStyle:
      'text-align: left; font-family: Nunito, system-ui, serif; font-size: 16px; line-height: 1.5;',
  },
  {
    name: 'body-all-caps',
    description: 'Formatting body text in all capital letters',
    rule: 'Do not format body text in all caps',
    sample:
      'ALL CAPS TEXT REDUCES READABILITY BECAUSE WORDS LOSE THEIR DISTINCTIVE SHAPES. READERS RELY ON THE ASCENDERS AND DESCENDERS OF LOWERCASE LETTERS TO RECOGNIZE WORDS QUICKLY. WHEN EVERYTHING IS THE SAME HEIGHT, READING SPEED DECREASES AND EYE FATIGUE INCREASES. ALL CAPS SHOULD BE RESERVED FOR SHORT ACRONYMS, LOGOS, AND OCCASIONAL LABELS — NEVER FOR BODY TEXT OR LONG PHRASES.',
    violatingStyle:
      'text-transform: uppercase; font-family: Nunito, system-ui, serif; font-size: 16px; line-height: 1.5;',
    correctStyle:
      'font-family: Nunito, system-ui, serif; font-size: 16px; line-height: 1.5;',
  },
]

export const Default = {
  render: () => `
    <div style="font-family: system-ui, sans-serif; max-width: 960px; margin: 0 auto; padding: 2rem; color: #162e51;">

      <!-- Section 1: Introduction -->
      <section style="margin-bottom: 3rem;">
        <h1 style="font-size: 1.75rem; font-weight: 700; margin: 0 0 1rem; color: #162e51;">Brand Typography</h1>
        <p style="font-size: 1rem; line-height: 1.6; margin: 0 0 1rem; color: #00687d;">
          PathAble uses four distinct typefaces, each assigned to a typographic role with specific weight and usage guidelines.
        </p>
        <p style="font-size: 0.875rem; line-height: 1.6; margin: 0; color: #555;">
          The typography scale below maps each role to its font family, weight, and size tokens.
          Values are defined in <code style="font-size: 0.8rem;">_typography.scss</code> and emitted as <code style="font-size: 0.8rem;">--pathable-font-*</code> and <code style="font-size: 0.8rem;">--ui-*</code> CSS custom properties.
        </p>
      </section>

      <!-- Section 2: Font Roles -->
      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #162e51;">Font Roles</h2>
        <div style="display: flex; flex-wrap: wrap; gap: 1.5rem;">
          ${fontRoles
            .map(
              (r) => `
            <div style="flex: 0 0 420px; border-radius: 8px; overflow: hidden; box-shadow: 0 2px 8px rgba(0,0,0,0.1); background: #fff;">
              <div style="padding: 1.5rem 1.25rem 1rem;">
                <div style="font-family: ${r.fontStack}; font-size: 1.75rem; font-weight: ${r.weight}; margin-bottom: 0.75rem; color: #162e51; line-height: 1.2;">
                  ${r.typeface} ${r.weightName}
                </div>
                <div style="font-family: ${r.fontStack}; font-size: 1rem; font-weight: ${r.weight}; margin-bottom: 0.75rem; color: #555;">
                  The quick brown fox jumps over the lazy dog.
                </div>
              </div>
              <div style="padding: 0 1.25rem 1rem;">
                <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; margin-bottom: 0.5rem;">
                  <span style="background: #162e51; color: #fff; font-size: 0.65rem; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: monospace;">${r.typeface}</span>
                  <span style="background: #00687d; color: #fff; font-size: 0.65rem; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: monospace;">${r.weightName}</span>
                  ${
                    r.uswdsRole
                      ? `<span style="background: #4899e8; color: #fff; font-size: 0.65rem; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: monospace;">USWDS: ${r.uswdsRole}</span>`
                      : `<span style="background: #888; color: #fff; font-size: 0.65rem; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: monospace;">No USWDS role</span>`
                  }
                </div>
                <div style="font-family: monospace; font-size: 0.7rem; color: #888; margin-bottom: 0.375rem;">
                  <span style="font-weight: 600; color: #555;">Token:</span> ${r.cssToken}
                </div>
                <div style="font-family: monospace; font-size: 0.7rem; color: #888; margin-bottom: 0.375rem;">
                  <span style="font-weight: 600; color: #555;">Stack:</span> ${r.fontStack}
                </div>
                <div style="font-family: monospace; font-size: 0.7rem; color: #888; margin-bottom: 0.5rem;">
                  <span style="font-weight: 600; color: #555;">Fallback:</span> ${r.fallback}
                </div>
                <div style="font-size: 0.75rem; color: #666; border-top: 1px solid #eee; padding-top: 0.5rem;">
                  ${r.usage}
                </div>
              </div>
            </div>
          `,
            )
            .join('')}
        </div>
      </section>

      <!-- Section 3: Type Scale -->
      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #162e51;">Type Scale</h2>
        <p style="font-size: 0.875rem; line-height: 1.6; margin: 0 0 1rem; color: #555;">
          The complete typography scale with font size, line height, font weight, and CSS custom property references.
        </p>
        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 0.8rem;">
            <thead>
              <tr style="background: #162e51; color: #fff;">
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Token</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Typeface</th>
                <th style="padding: 0.5rem 0.75rem; text-align: center;">Font Size</th>
                <th style="padding: 0.5rem 0.75rem; text-align: center;">Line Height</th>
                <th style="padding: 0.5rem 0.75rem; text-align: center;">Weight</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">Size Token</th>
                <th style="padding: 0.5rem 0.75rem; text-align: left;">UI Token</th>
              </tr>
            </thead>
            <tbody>
              ${typeScale
                .map(
                  (t, i) => `
                <tr style="border-bottom: 1px solid #eee; ${i % 2 === 0 ? 'background: #f9f9f9;' : ''}">
                  <td style="padding: 0.5rem 0.75rem; font-weight: 600; font-family: ${t.typeface === 'Fredoka' ? "'Fredoka', system-ui, sans-serif" : t.typeface === 'Poppins' ? "'Poppins', system-ui, sans-serif" : "'Nunito', system-ui, serif"}; font-size: ${t.fontSize}; line-height: ${t.lineHeight}; font-weight: ${t.fontWeight};">${t.displayName}</td>
                  <td style="padding: 0.5rem 0.75rem; font-family: monospace;">${t.typeface}</td>
                  <td style="padding: 0.5rem 0.75rem; text-align: center; font-family: monospace;">${t.fontSize}</td>
                  <td style="padding: 0.5rem 0.75rem; text-align: center; font-family: monospace;">${t.lineHeight}</td>
                  <td style="padding: 0.5rem 0.75rem; text-align: center; font-family: monospace;">${t.fontWeight}</td>
                  <td style="padding: 0.5rem 0.75rem; font-family: monospace; font-size: 0.7rem;">${t.sizeToken}</td>
                  <td style="padding: 0.5rem 0.75rem; font-family: monospace; font-size: 0.7rem;">${t.uiToken}</td>
                </tr>
              `,
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </section>

      <!-- Section 4: Long-Text Examples -->
      <section style="margin-bottom: 3rem;">
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #162e51;">Long-Text Examples</h2>
        <p style="font-size: 0.875rem; line-height: 1.6; margin: 0 0 1.5rem; color: #555;">
          Body text samples at the standard sizes, rendered in Nunito with correct line height and font weight.
        </p>

        <div style="margin-bottom: 2rem; padding: 1.25rem; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #1cae96;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span style="font-weight: 600; font-size: 0.8rem; color: #162e51;">Body Medium</span>
            <span style="background: #1cae96; color: #00365c; font-size: 0.65rem; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: monospace;">16px / 1.5</span>
            <span style="font-family: monospace; font-size: 0.65rem; color: #888;">--pathable-font-size-body-md</span>
          </div>
          <p style="font-family: Nunito, system-ui, serif; font-size: 16px; line-height: 1.5; font-weight: 400; margin: 0; color: #00365c;">
            PathAble is a workflow-first platform designed for staff who deliver guided behavioral health services. Every session, note, compliance signal, and approval artifact must be captured quickly and accurately. The typography system supports this mission by providing clear, readable body text that reduces eye strain during extended documentation sessions. Nunito was chosen for body text because its open letterforms and generous x-height maintain readability at small sizes, even on lower-resolution displays or when users are working under time pressure.
          </p>
        </div>

        <div style="padding: 1.25rem; background: #f9f9f9; border-radius: 8px; border-left: 4px solid #4899e8;">
          <div style="display: flex; align-items: center; gap: 0.5rem; margin-bottom: 0.75rem;">
            <span style="font-weight: 600; font-size: 0.8rem; color: #162e51;">Body Large</span>
            <span style="background: #4899e8; color: #fff; font-size: 0.65rem; padding: 0.125rem 0.375rem; border-radius: 3px; font-family: monospace;">18px / 1.5</span>
            <span style="font-family: monospace; font-size: 0.65rem; color: #888;">--pathable-font-size-body-lg</span>
          </div>
          <p style="font-family: Nunito, system-ui, serif; font-size: 18px; line-height: 1.5; font-weight: 400; margin: 0; color: #00365c;">
            For longer reading sessions, such as reviewing session notes, composing compliance documentation, or reading through participant history, the body large size provides additional comfort. The increased font size reduces the cognitive load of tracking lines of text, while the 1.5 line-height ensures adequate vertical rhythm. This size is particularly useful for primary content areas where users spend extended periods reading or writing, such as the session note editor, participant summary view, and report generation interfaces.
          </p>
        </div>
      </section>

      <!-- Section 5: Typography Violations -->
      <section>
        <h2 style="font-size: 1.25rem; font-weight: 700; margin: 0 0 1rem; color: #162e51;">Typography Violations</h2>
        <p style="font-size: 0.875rem; line-height: 1.6; margin: 0 0 1.5rem; color: #555;">
          Common brand rule violations that should be avoided. Each example shows the incorrect usage alongside a note about the correct approach.
        </p>

        ${typographyViolations
          .map(
            (v, i) => `
          <div style="margin-bottom: 1.5rem; border-radius: 8px; overflow: hidden; border: 1px solid #ecc; ${i < typographyViolations.length - 1 ? 'margin-bottom: 1.5rem;' : ''}">
            <div style="background: #c00; color: #fff; padding: 0.5rem 1rem; font-size: 0.75rem; font-weight: 600; display: flex; align-items: center; gap: 0.375rem;">
              <span style="font-size: 1rem;">&#9888;</span> Do Not Use — ${v.description}
            </div>
            <div style="padding: 1rem; background: #fff5f5;">
              <div style="margin-bottom: 0.75rem;">
                <span style="font-size: 0.7rem; font-weight: 600; color: #c00; text-transform: uppercase;">Violation</span>
              </div>
              <p style="${v.violatingStyle} margin: 0 0 0.75rem; color: #00365c;">
                ${v.sample}
              </p>
              <div style="background: #fff; border-radius: 4px; padding: 0.75rem; border: 1px solid #ecc;">
                <div style="font-size: 0.7rem; font-weight: 600; color: #1a7d38; margin-bottom: 0.25rem; text-transform: uppercase;">Brand Rule</div>
                <div style="font-size: 0.8rem; color: #555; font-style: italic;">"${v.rule}"</div>
              </div>
            </div>
          </div>
        `,
          )
          .join('')}
      </section>

    </div>
  `,
}
