import { defineType, defineField } from 'sanity'

// Reusable link object used throughout the navigation schema
const linkField = {
  type: 'object',
  fields: [
    defineField({ name: 'label', title: 'Label', type: 'string', validation: (R: any) => R.required() }),
    defineField({ name: 'href',  title: 'Link (URL or path)', type: 'string', description: 'Use a path for internal links, e.g. "/tools". Use a full URL for external links.', validation: (R: any) => R.required() }),
    defineField({ name: 'openInNewTab', title: 'Open in new tab?', type: 'boolean', initialValue: false }),
  ],
  preview: { select: { title: 'label', subtitle: 'href' } },
}

export const navigationSchema = defineType({
  name: 'navigation',
  title: 'Navigation',
  type: 'document',
  __experimental_actions: ['update', 'publish'],
  fields: [
    defineField({
      name: 'title',
      title: 'Internal Title',
      type: 'string',
      description: 'Just for your reference in the CMS.',
      initialValue: 'Main Navigation',
    }),

    // ─── HEADER ───────────────────────────────────────────────────────────────
    defineField({
      name: 'headerItems',
      title: 'Header Navigation Items',
      type: 'array',
      description: 'Drag to reorder. Each item can be a simple link or a dropdown with nested links.',
      of: [
        {
          type: 'object',
          name: 'navItem',
          title: 'Nav Item',
          fields: [
            defineField({ name: 'label', title: 'Label', type: 'string', validation: (R) => R.required() }),
            defineField({ name: 'href',  title: 'Link (optional — leave blank if this item is a dropdown)', type: 'string' }),
            defineField({ name: 'openInNewTab', title: 'Open in new tab?', type: 'boolean', initialValue: false }),
            defineField({
              name: 'isBlogDropdown',
              title: 'Use Blog Category Dropdown?',
              type: 'boolean',
              description: 'If enabled, this item will automatically show a dropdown of blog categories from the CMS.',
              initialValue: false,
            }),
            defineField({
              name: 'dropdown',
              title: 'Dropdown Items (manual)',
              description: 'Only used when "Use Blog Category Dropdown" is off. Manually list nested links.',
              type: 'array',
              of: [{ ...linkField, name: 'dropdownItem', title: 'Dropdown Item' }],
            }),
          ],
          preview: {
            select: { title: 'label', subtitle: 'href' },
            prepare({ title, subtitle }: any) {
              return { title, subtitle: subtitle || '(dropdown)' }
            },
          },
        },
      ],
    }),

    // ─── HEADER CTA BUTTON ────────────────────────────────────────────────────
    defineField({
      name: 'headerCtaEnabled',
      title: 'Show CTA Button in Header',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'headerCtaLabel',
      title: 'Header CTA Button Label',
      type: 'string',
      initialValue: 'Browse Reviews',
    }),
    defineField({
      name: 'headerCtaLink',
      title: 'Header CTA Button Link',
      type: 'string',
      initialValue: '/blog',
    }),
    defineField({
      name: 'headerCtaStyle',
      title: 'Header CTA Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (filled)', value: 'primary' },
          { title: 'Outline', value: 'outline' },
          { title: 'Ghost', value: 'ghost' },
        ],
        layout: 'radio',
      },
      initialValue: 'primary',
    }),

    // ─── FOOTER ───────────────────────────────────────────────────────────────
    defineField({
      name: 'footerTagline',
      title: 'Footer Brand Tagline',
      type: 'string',
      description: 'Short description shown below the logo in the footer.',
      initialValue: 'Honest SaaS and AI tool reviews to help you make smarter software decisions.',
    }),
    defineField({
      name: 'footerColumns',
      title: 'Footer Link Columns',
      type: 'array',
      description: 'Up to 3 columns of links in the footer (the brand column is automatic). Drag to reorder.',
      of: [
        {
          type: 'object',
          name: 'footerColumn',
          title: 'Footer Column',
          fields: [
            defineField({ name: 'heading', title: 'Column Heading', type: 'string', validation: (R) => R.required() }),
            defineField({
              name: 'links',
              title: 'Links',
              type: 'array',
              of: [{ ...linkField, name: 'footerLink', title: 'Footer Link' }],
            }),
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
      validation: (R) => R.max(3),
    }),

    // ─── FOOTER BOTTOM BAR ────────────────────────────────────────────────────
    defineField({
      name: 'footerBottomLinks',
      title: 'Footer Bottom Bar Links',
      type: 'array',
      description: 'Small links shown in the very bottom bar of the footer (e.g. Privacy Policy, Terms).',
      of: [{ ...linkField, name: 'bottomLink', title: 'Bottom Bar Link' }],
    }),
  ],

  preview: {
    select: { title: 'title' },
  },
})
