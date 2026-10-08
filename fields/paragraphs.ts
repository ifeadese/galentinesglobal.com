import type { ArrayField } from 'payload'

// A list of plain-text paragraphs. Pages render each entry as its own <p>, so editors add,
// remove and reorder paragraphs instead of formatting rich text.
export const paragraphsField = (
  overrides: Partial<Omit<ArrayField, 'type' | 'fields'>> = {},
): ArrayField => ({
  name: 'paragraphs',
  type: 'array',
  labels: { singular: 'Paragraph', plural: 'Paragraphs' },
  ...overrides,
  fields: [
    {
      name: 'text',
      type: 'textarea',
      required: true,
    },
  ],
})
