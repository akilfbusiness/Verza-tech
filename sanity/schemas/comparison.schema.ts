export const comparisonSchema = {
  name: 'comparison',
  title: 'Comparison',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Comparison Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
      description: 'E.g., "Notion vs ClickUp: Which is Better?"',
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {
        source: 'title',
        maxLength: 96,
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'tools',
      title: 'Tools to Compare',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tool' }] }],
      validation: (Rule: any) => Rule.required().min(2),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'content',
      title: 'Comparison Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
          ],
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
        {
          type: 'image',
          options: {
            hotspot: true,
          },
          fields: [
            {
              name: 'alt',
              title: 'Alt Text',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'comparisonTable',
      title: 'Comparison Table',
      type: 'array',
      description: 'Feature-by-feature comparison',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'feature',
              title: 'Feature Name',
              type: 'string',
            },
            {
              name: 'values',
              title: 'Tool Values',
              type: 'object',
              description: 'Key: tool name, Value: feature value',
            },
          ],
        },
      ],
    },
    {
      name: 'verdict',
      title: 'Verdict',
      type: 'text',
      rows: 4,
      description: 'Final comparison conclusion',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'title',
      tools: 'tools',
    },
    prepare({ title, tools }: any) {
      const toolCount = tools?.length || 0
      return {
        title,
        subtitle: `Comparing ${toolCount} tools`,
      }
    },
  },
}
