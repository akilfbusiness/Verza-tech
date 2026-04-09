/**
 * Sanity Schema for Tool
 * This defines the content structure in Sanity Studio
 * 
 * To use this schema:
 * 1. Set up a Sanity Studio project (https://www.sanity.io/docs/getting-started)
 * 2. Copy this schema to your Sanity Studio project
 * 3. Import it in your schemas/index.ts file
 */

export const toolSchema = {
  name: 'tool',
  title: 'Tool',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Tool Name',
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
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short one-liner description',
    },
    {
      name: 'description',
      title: 'Description',
      type: 'text',
      rows: 4,
    },
    {
      name: 'logo',
      title: 'Logo',
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
    {
      name: 'screenshots',
      title: 'Screenshots',
      type: 'array',
      of: [
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
      name: 'website',
      title: 'Official Website',
      type: 'url',
    },
    {
      name: 'affiliateLink',
      title: 'Affiliate Link',
      type: 'url',
      description: 'Your affiliate tracking URL',
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
    },
    {
      name: 'features',
      title: 'Key Features',
      type: 'array',
      of: [{ type: 'string' }],
    },
    {
      name: 'pricing',
      title: 'Pricing Tiers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Tier Name',
              type: 'string',
            },
            {
              name: 'price',
              title: 'Price',
              type: 'string',
            },
            {
              name: 'billingPeriod',
              title: 'Billing Period',
              type: 'string',
              options: {
                list: [
                  { title: 'Monthly', value: 'month' },
                  { title: 'Yearly', value: 'year' },
                  { title: 'One-time', value: 'one-time' },
                ],
              },
            },
            {
              name: 'features',
              title: 'Features',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
        },
      ],
    },
    {
      name: 'rating',
      title: 'Rating',
      type: 'number',
      validation: (Rule: any) => Rule.min(0).max(5),
    },
    {
      name: 'reviewCount',
      title: 'Review Count',
      type: 'number',
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
      name: 'bestFor',
      title: 'Best For',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Use cases this tool is best suited for',
    },
    {
      name: 'alternatives',
      title: 'Alternative Tools',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'tool' }] }],
    },
    {
      name: 'integrations',
      title: 'Integrations',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Other tools/platforms this integrates with',
    },
    {
      name: 'freeTrialAvailable',
      title: 'Free Trial Available',
      type: 'boolean',
    },
    {
      name: 'freePlanAvailable',
      title: 'Free Plan Available',
      type: 'boolean',
    },
    {
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Discontinued', value: 'discontinued' },
          { title: 'Beta', value: 'beta' },
        ],
      },
      initialValue: 'active',
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
      title: 'name',
      subtitle: 'tagline',
      media: 'logo',
    },
  },
}
