export const blogSchema = {
  name: 'blog',
  title: 'Blog Articles',
  type: 'document',
  groups: [
    { name: 'content', title: 'Content', default: true },
    { name: 'aeo', title: 'AEO / AI Optimisation' },
    { name: 'affiliate', title: 'Affiliate Marketing' },
    { name: 'media', title: 'Media' },
    { name: 'seo', title: 'SEO' },
  ],
  fields: [
    // ─── CORE CONTENT ───────────────────────────────────────────────
    {
      name: 'title',
      title: 'Article Title',
      type: 'string',
      group: 'content',
      validation: (Rule: any) => Rule.required().max(100),
    },
    {
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      group: 'content',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'articleType',
      title: 'Article Type',
      type: 'string',
      group: 'content',
      options: {
        list: [
          { title: 'Tool Review', value: 'review' },
          { title: 'Tool Comparison', value: 'comparison' },
          { title: 'Best-Of List', value: 'best-of' },
          { title: 'Tutorial / How-To', value: 'tutorial' },
          { title: 'News / Update', value: 'news' },
          { title: 'Opinion / Editorial', value: 'opinion' },
        ],
        layout: 'radio',
      },
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      group: 'content',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'excerpt',
      title: 'Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short summary shown in article listings and meta description.',
      validation: (Rule: any) => Rule.required().max(300),
    },
    {
      name: 'body',
      title: 'Article Body',
      type: 'array',
      group: 'content',
      of: [
        {
          type: 'block',
          styles: [
            { title: 'Normal', value: 'normal' },
            { title: 'H2', value: 'h2' },
            { title: 'H3', value: 'h3' },
            { title: 'H4', value: 'h4' },
            { title: 'Quote', value: 'blockquote' },
          ],
          marks: {
            decorators: [
              { title: 'Bold', value: 'strong' },
              { title: 'Italic', value: 'em' },
              { title: 'Code', value: 'code' },
              { title: 'Underline', value: 'underline' },
              { title: 'Strike', value: 'strike-through' },
            ],
            annotations: [
              {
                name: 'link',
                type: 'object',
                title: 'Link',
                fields: [
                  {
                    name: 'href',
                    title: 'URL',
                    type: 'url',
                    validation: (Rule: any) =>
                      Rule.uri({ allowRelative: true, scheme: ['http', 'https', 'mailto'] }),
                  },
                  {
                    name: 'isAffiliate',
                    title: 'Affiliate Link?',
                    type: 'boolean',
                    description: 'Mark as affiliate link for tracking and disclosure.',
                    initialValue: false,
                  },
                  {
                    name: 'openInNewTab',
                    title: 'Open in new tab?',
                    type: 'boolean',
                    initialValue: true,
                  },
                ],
              },
            ],
          },
        },
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
        // Callout block
        {
          type: 'object',
          name: 'callout',
          title: 'Callout Box',
          fields: [
            {
              name: 'type',
              title: 'Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Info', value: 'info' },
                  { title: 'Tip', value: 'tip' },
                  { title: 'Warning', value: 'warning' },
                  { title: 'Success', value: 'success' },
                ],
                layout: 'radio',
              },
              initialValue: 'info',
            },
            { name: 'text', title: 'Text', type: 'text', rows: 3 },
          ],
          preview: {
            select: { title: 'type', subtitle: 'text' },
          },
        },
      ],
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'content',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      group: 'content',
    },
    {
      name: 'nextReviewDate',
      title: 'Next Review Date',
      type: 'date',
      group: 'content',
      description: 'When this article should be reviewed for accuracy.',
    },

    // ─── AEO / AI OPTIMISATION ───────────────────────────────────────
    {
      name: 'verdictBox',
      title: 'Verdict Box',
      type: 'object',
      group: 'aeo',
      description: 'AI engines extract this first. Be direct and clear.',
      fields: [
        {
          name: 'summary',
          title: 'One-Line Verdict',
          type: 'string',
          description: 'e.g. "The best AI writing tool for content creators in 2026."',
          validation: (Rule: any) => Rule.required(),
        },
        {
          name: 'rating',
          title: 'Rating (out of 5)',
          type: 'number',
          validation: (Rule: any) => Rule.min(0).max(5).precision(1),
        },
        {
          name: 'recommendation',
          title: 'Recommendation',
          type: 'string',
          options: {
            list: [
              { title: 'Highly Recommended', value: 'highly-recommended' },
              { title: 'Recommended', value: 'recommended' },
              { title: 'Conditional', value: 'conditional' },
              { title: 'Not Recommended', value: 'not-recommended' },
            ],
            layout: 'radio',
          },
        },
        {
          name: 'verdictChanged',
          title: 'Verdict Changed Since Last Review?',
          type: 'boolean',
          description: 'Trust signal for AI engines - shows editorial integrity.',
          initialValue: false,
        },
        {
          name: 'verdictChangedDate',
          title: 'Date Verdict Changed',
          type: 'date',
          hidden: ({ parent }: any) => !parent?.verdictChanged,
        },
      ],
    },
    {
      name: 'keyPoints',
      title: 'Key Points / Quick Answers',
      type: 'array',
      group: 'aeo',
      description: 'Bullet answers AI engines cite directly. Keep each point concise.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'point', title: 'Key Point', type: 'string', validation: (Rule: any) => Rule.required() },
          ],
          preview: { select: { title: 'point' } },
        },
      ],
    },
    {
      name: 'faqs',
      title: 'FAQs',
      type: 'array',
      group: 'aeo',
      description: 'FAQPage schema - critical for AI citation. Use real questions people ask.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'question', title: 'Question', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'answer', title: 'Answer', type: 'text', rows: 3, validation: (Rule: any) => Rule.required() },
          ],
          preview: { select: { title: 'question' } },
        },
      ],
    },
    {
      name: 'toolsCompared',
      title: 'Tools Compared',
      type: 'array',
      group: 'aeo',
      description: 'For comparison and best-of articles.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'tool', title: 'Tool', type: 'reference', to: [{ type: 'tool' }] },
            { name: 'rating', title: 'Rating (out of 5)', type: 'number', validation: (Rule: any) => Rule.min(0).max(5).precision(1) },
            { name: 'verdict', title: 'One-line Verdict', type: 'string' },
            { name: 'pros', title: 'Pros', type: 'array', of: [{ type: 'string' }] },
            { name: 'cons', title: 'Cons', type: 'array', of: [{ type: 'string' }] },
            { name: 'pricingLastVerified', title: 'Pricing Last Verified', type: 'date' },
            {
              name: 'affiliateLink',
              title: 'Affiliate Link (for this tool)',
              type: 'url',
              description: 'Affiliate URL specific to this tool in the comparison.',
            },
            { name: 'promoCode', title: 'Promo Code', type: 'string' },
          ],
          preview: {
            select: { title: 'tool.name', subtitle: 'verdict' },
          },
        },
      ],
    },

    // ─── AFFILIATE MARKETING ────────────────────────────────────────
    {
      name: 'primaryAffiliateLink',
      title: 'Primary Affiliate Link',
      type: 'url',
      group: 'affiliate',
      description: 'Main CTA button URL. This is your primary conversion point.',
    },
    {
      name: 'affiliateButtonLabel',
      title: 'Affiliate Button Label',
      type: 'string',
      group: 'affiliate',
      description: 'e.g. "Try Notion Free", "Get 50% Off", "Start Free Trial"',
      placeholder: 'Try [Tool Name] Free',
    },
    {
      name: 'secondaryAffiliateLinks',
      title: 'Secondary Affiliate Links',
      type: 'array',
      group: 'affiliate',
      description: 'Additional affiliate CTAs (for articles covering multiple tools).',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'label', title: 'Button Label', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'url', title: 'Affiliate URL', type: 'url', validation: (Rule: any) => Rule.required() },
            { name: 'promoCode', title: 'Promo Code', type: 'string' },
          ],
          preview: { select: { title: 'label', subtitle: 'url' } },
        },
      ],
    },
    {
      name: 'promoCode',
      title: 'Promo Code',
      type: 'string',
      group: 'affiliate',
      description: 'Renders as a copyable promo code box in the article.',
    },
    {
      name: 'affiliateDisclosure',
      title: 'Show Affiliate Disclosure?',
      type: 'boolean',
      group: 'affiliate',
      description: 'Legal requirement. Toggle on for any article with affiliate links.',
      initialValue: true,
    },
    {
      name: 'commissionTier',
      title: 'Commission Tier (Internal Only)',
      type: 'string',
      group: 'affiliate',
      description: 'NEVER displayed publicly. For internal tracking only.',
      options: {
        list: [
          { title: 'High (30%+)', value: 'high' },
          { title: 'Medium (15-30%)', value: 'medium' },
          { title: 'Low (under 15%)', value: 'low' },
          { title: 'Flat Rate', value: 'flat' },
        ],
      },
    },

    // ─── MEDIA ──────────────────────────────────────────────────────
    {
      name: 'heroImage',
      title: 'Hero Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [
        { name: 'alt', title: 'Alt Text', type: 'string', validation: (Rule: any) => Rule.required() },
        { name: 'caption', title: 'Caption', type: 'string' },
      ],
    },
    {
      name: 'gallery',
      title: 'Image Gallery',
      type: 'array',
      group: 'media',
      description: 'Screenshots, UI images, before/after comparisons.',
      of: [
        {
          type: 'image',
          options: { hotspot: true },
          fields: [
            { name: 'alt', title: 'Alt Text', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'caption', title: 'Caption', type: 'string' },
          ],
        },
      ],
    },
    {
      name: 'youtubeUrl',
      title: 'YouTube Video URL',
      type: 'url',
      group: 'media',
      description: 'e.g. https://www.youtube.com/watch?v=xxxxx',
    },
    {
      name: 'videoTitle',
      title: 'Video Title',
      type: 'string',
      group: 'media',
      description: 'Used for VideoObject schema markup - helps AI engines cite your video.',
    },
    {
      name: 'videoDescription',
      title: 'Video Description',
      type: 'text',
      rows: 2,
      group: 'media',
    },

    // ─── SEO ────────────────────────────────────────────────────────
    {
      name: 'metaTitle',
      title: 'Meta Title',
      type: 'string',
      group: 'seo',
      description: 'Overrides default title for search engines. Max 60 chars.',
      validation: (Rule: any) => Rule.max(60),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Max 160 chars.',
      validation: (Rule: any) => Rule.max(160),
    },
    {
      name: 'focusKeyword',
      title: 'Focus Keyword',
      type: 'string',
      group: 'seo',
    },
    {
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      group: 'seo',
      of: [{ type: 'reference', to: [{ type: 'blog' }] }],
    },
    {
      name: 'externalSources',
      title: 'External Sources / Citations',
      type: 'array',
      group: 'seo',
      description: 'Link to sources you cite. Builds credibility with AI engines.',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Source Title', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'url', title: 'URL', type: 'url', validation: (Rule: any) => Rule.required() },
          ],
          preview: { select: { title: 'title', subtitle: 'url' } },
        },
      ],
    },
  ],
  preview: {
    select: {
      title: 'title',
      articleType: 'articleType',
      authorName: 'author.name',
      media: 'heroImage',
    },
    prepare({ title, articleType, authorName, media }: any) {
      return {
        title,
        subtitle: `${articleType ? articleType.toUpperCase() : 'ARTICLE'} — ${authorName || 'No author'}`,
        media,
      }
    },
  },
}
