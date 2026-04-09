export const faqSchema = {
  name: 'faq',
  title: 'FAQ',
  type: 'document',
  fields: [
    {
      name: 'question',
      title: 'Question',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'answer',
      title: 'Answer',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [{ title: 'Normal', value: 'normal' }],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    type: 'url',
                  },
                ],
              },
            ],
          },
        },
      ],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tool',
      title: 'Related Tool',
      type: 'reference',
      to: [{ type: 'tool' }],
      description: 'Optional: Associate with a specific tool',
    },
    {
      name: 'category',
      title: 'Related Category',
      type: 'reference',
      to: [{ type: 'category' }],
      description: 'Optional: Associate with a category',
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Display order (lower numbers appear first)',
    },
  ],
  preview: {
    select: {
      title: 'question',
      toolName: 'tool.name',
      categoryName: 'category.name',
    },
    prepare({ title, toolName, categoryName }: any) {
      const subtitle = toolName || categoryName || 'General FAQ'
      return {
        title,
        subtitle,
      }
    },
  },
}
