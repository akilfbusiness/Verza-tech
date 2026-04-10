export const categorySchema = {
  name: 'category',
  title: 'Category',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Category Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'name',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 2,
      description: 'Shown in category cards and meta descriptions.',
    },
    {
      name: 'longDescription',
      title: 'Long Description',
      type: 'text',
      rows: 5,
      description: 'Shown at the top of the category landing page.',
    },
    {
      name: 'icon',
      title: 'Icon Name',
      type: 'string',
      description: 'Lucide icon name (e.g., "Sparkles", "Zap", "Layout", "Bot")',
    },
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string' },
      ],
    },
    {
      name: 'featuredArticle',
      title: 'Featured Article',
      type: 'reference',
      to: [{ type: 'blog' }],
      description: 'Pinned article shown at the top of this category page.',
    },
    {
      name: 'order',
      title: 'Nav Order',
      type: 'number',
      description: 'Controls the order this category appears in navigation. Lower = first.',
      initialValue: 99,
    },
    {
      name: 'showInNav',
      title: 'Show in Navigation?',
      type: 'boolean',
      description: 'Toggle to show or hide this category in the top navigation bar.',
      initialValue: true,
    },
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'description',
      media: 'heroImage',
    },
  },
}
