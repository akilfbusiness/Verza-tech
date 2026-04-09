export const reviewSchema = {
  name: 'review',
  title: 'Review',
  type: 'document',
  fields: [
    {
      name: 'title',
      title: 'Review Title',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
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
      name: 'tool',
      title: 'Tool',
      type: 'reference',
      to: [{ type: 'tool' }],
      validation: (Rule: any) => Rule.required(),
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
      title: 'Review Content',
      type: 'array',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Strong', value: 'strong' },
              { title: 'Emphasis', value: 'em' },
              { title: 'Code', value: 'code' },
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
            {
              name: 'caption',
              title: 'Caption',
              type: 'string',
            },
          ],
        },
      ],
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule: any) => Rule.required().min(0).max(5),
    },
    {
      name: 'pros',
      title: 'Pros',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'cons',
      title: 'Cons',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'verdict',
      title: 'Verdict',
      type: 'text',
      rows: 3,
      description: 'Summary verdict/conclusion',
    },
    {
      name: 'publishedAt',
      title: 'Published At',
      type: 'datetime',
    },
    {
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
    },
  ],
  preview: {
    select: {
      title: 'title',
      toolName: 'tool.name',
      rating: 'rating',
    },
    prepare({ title, toolName, rating }: any) {
      return {
        title,
        subtitle: `${toolName} - ${rating}/5 stars`,
      }
    },
  },
}
