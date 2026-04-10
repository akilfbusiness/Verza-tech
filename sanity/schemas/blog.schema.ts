// ─── PORTABLE TEXT CUSTOM BLOCKS ─────────────────────────────────────────────

const tableBlock = {
  type: 'object',
  name: 'tableBlock',
  title: 'Data Table',
  fields: [
    {
      name: 'tableTitle',
      title: 'Table Title',
      type: 'string',
      description: 'Optional title for the table',
    },
    {
      name: 'tableCaption',
      title: 'Table Caption',
      type: 'string',
      description: 'Optional caption or source citation',
    },
    {
      name: 'columnHeaders',
      title: 'Column Headers',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule: any) => Rule.required().min(2),
    },
    {
      name: 'rows',
      title: 'Table Rows',
      type: 'array',
      of: [
        {
          type: 'object',
          name: 'tableRow',
          title: 'Row',
          fields: [
            {
              name: 'cells',
              title: 'Cells',
              type: 'array',
              of: [{ type: 'string' }],
            },
          ],
          preview: {
            select: { cells: 'cells' },
            prepare({ cells }: any) {
              return { title: Array.isArray(cells) ? cells.join(' | ') : 'Row' }
            },
          },
        },
      ],
    },
    {
      name: 'tableStyle',
      title: 'Table Style',
      type: 'string',
      options: {
        list: [
          { title: 'Striped Rows', value: 'striped' },
          { title: 'Plain', value: 'plain' },
          { title: 'Bordered', value: 'bordered' },
        ],
      },
      initialValue: 'striped',
    },
  ],
  preview: {
    select: { title: 'tableTitle', caption: 'tableCaption' },
    prepare({ title, caption }: any) {
      return { title: title || 'Data Table', subtitle: caption }
    },
  },
}

const calloutBlock = {
  type: 'object',
  name: 'calloutBlock',
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
          { title: 'Affiliate Pick', value: 'affiliate' },
        ],
        layout: 'radio',
      },
      initialValue: 'info',
    },
    { name: 'heading', title: 'Heading', type: 'string' },
    { name: 'text', title: 'Text', type: 'text', rows: 3, validation: (Rule: any) => Rule.required() },
  ],
  preview: {
    select: { type: 'type', heading: 'heading', text: 'text' },
    prepare({ type, heading, text }: any) {
      return { title: heading || text || 'Callout', subtitle: type?.toUpperCase() }
    },
  },
}

const ctaBlock = {
  type: 'object',
  name: 'ctaBlock',
  title: 'CTA / Affiliate Button',
  fields: [
    { name: 'label', title: 'Button Label', type: 'string', validation: (Rule: any) => Rule.required() },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule: any) =>
        Rule.required().uri({ scheme: ['http', 'https'] }),
    },
    { name: 'promoCode', title: 'Promo Code', type: 'string' },
    {
      name: 'style',
      title: 'Button Style',
      type: 'string',
      options: {
        list: [
          { title: 'Primary (filled)', value: 'primary' },
          { title: 'Secondary (outline)', value: 'secondary' },
        ],
      },
      initialValue: 'primary',
    },
    {
      name: 'isAffiliate',
      title: 'Affiliate Link?',
      type: 'boolean',
      initialValue: true,
    },
  ],
  preview: {
    select: { title: 'label', subtitle: 'url' },
  },
}

const embedBlock = {
  type: 'object',
  name: 'embedBlock',
  title: 'Embed (YouTube / Video)',
  fields: [
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      description: 'YouTube, Vimeo, or other embed URL',
      validation: (Rule: any) => Rule.required(),
    },
    { name: 'caption', title: 'Caption', type: 'string' },
  ],
  preview: {
    select: { title: 'url', subtitle: 'caption' },
    prepare({ title, subtitle }: any) {
      return { title: 'Embed', subtitle: subtitle || title }
    },
  },
}

const accordionBlock = {
  type: 'object',
  name: 'accordionBlock',
  title: 'Accordion',
  fields: [
    {
      name: 'items',
      title: 'Accordion Items',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'heading', title: 'Heading', type: 'string', validation: (Rule: any) => Rule.required() },
            { name: 'content', title: 'Content', type: 'text', rows: 3 },
          ],
          preview: { select: { title: 'heading' } },
        },
      ],
    },
  ],
  preview: {
    select: { items: 'items' },
    prepare({ items }: any) {
      return { title: 'Accordion', subtitle: `${Array.isArray(items) ? items.length : 0} items` }
    },
  },
}

// Rich portable text definition for section content
const sectionPortableText = {
  name: 'content',
  title: 'Section Content',
  type: 'array',
  of: [
    {
      type: 'block',
      styles: [
        { title: 'Normal', value: 'normal' },
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
                description: 'Automatically adds rel="sponsored" and tracks for disclosure.',
                initialValue: false,
              },
              { name: 'openInNewTab', title: 'Open in new tab?', type: 'boolean', initialValue: true },
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
    tableBlock,
    calloutBlock,
    ctaBlock,
    embedBlock,
    accordionBlock,
  ],
}

// ─── MAIN BLOG SCHEMA ─────────────────────────────────────────────────────────

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
    { name: 'meta', title: 'Authorship & Freshness' },
  ],
  fields: [

    // ─── CORE CONTENT ──────────────────────────────────────────────────────────

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
      name: 'categories',
      title: 'Categories',
      type: 'array',
      group: 'content',
      of: [{ type: 'reference', to: [{ type: 'category' }] }],
      validation: (Rule: any) => Rule.required().min(1),
    },
    {
      name: 'targetAudience',
      title: 'Target Audience',
      type: 'array',
      group: 'content',
      description: 'Who is this article written for?',
      of: [{ type: 'string' }],
      options: {
        list: [
          { title: 'Marketers', value: 'marketers' },
          { title: 'Developers', value: 'developers' },
          { title: 'Freelancers', value: 'freelancers' },
          { title: 'Small Business', value: 'smb' },
          { title: 'Enterprise', value: 'enterprise' },
          { title: 'Content Creators', value: 'content-creators' },
          { title: 'Founders / Entrepreneurs', value: 'founders' },
          { title: 'Students', value: 'students' },
          { title: 'Agencies', value: 'agencies' },
          { title: 'General / All', value: 'general' },
        ],
        layout: 'tags',
      },
    },
    {
      name: 'summary',
      title: 'Summary / Excerpt',
      type: 'text',
      rows: 3,
      group: 'content',
      description: 'Short summary shown in article listings. Used as meta description if no custom one is set. Max 180 chars.',
      validation: (Rule: any) => Rule.required().max(300),
    },
    {
      name: 'introduction',
      title: 'Introduction',
      type: 'text',
      rows: 5,
      group: 'content',
      description: 'Opening paragraph that hooks readers and sets context. Displayed directly under the hero image.',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'contentSections',
      title: 'Content Sections',
      type: 'array',
      group: 'content',
      description: 'Main article content organised into sections. Each section gets its own H2 heading.',
      validation: (Rule: any) => Rule.required().min(1),
      of: [
        {
          type: 'object',
          name: 'contentSection',
          title: 'Section',
          fields: [
            {
              name: 'heading',
              title: 'Section Heading (H2)',
              type: 'string',
              description: 'Main heading for this section',
              validation: (Rule: any) => Rule.required(),
            },
            sectionPortableText,
          ],
          preview: {
            select: { title: 'heading' },
          },
        },
      ],
    },

    // ─── AEO / AI OPTIMISATION ─────────────────────────────────────────────────

    {
      name: 'verdictBox',
      title: 'Verdict Box',
      type: 'object',
      group: 'aeo',
      description: 'AI engines extract this first for "best tool" queries. Be direct and clear.',
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
          title: 'Overall Rating (out of 5)',
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
          description: 'Signals editorial integrity to AI engines.',
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
      description: 'Structured answers optimized for AI extraction and citations. Use 3-6 items.',
      of: [
        {
          type: 'object',
          name: 'keyPoint',
          fields: [
            {
              name: 'question',
              title: 'Question (Optional)',
              type: 'string',
              description: 'Frame as a question if applicable',
            },
            {
              name: 'quickAnswer',
              title: 'Quick Answer',
              type: 'text',
              rows: 3,
              description: 'Concise answer for AI extraction (40-60 words)',
              validation: (Rule: any) => Rule.required().max(1000),
            },
            {
              name: 'fullExplanation',
              title: 'Full Explanation (Optional)',
              type: 'text',
              rows: 4,
              description: 'Detailed explanation if needed',
            },
          ],
          preview: {
            select: { title: 'question', subtitle: 'quickAnswer' },
            prepare({ title, subtitle }: any) {
              return { title: title || subtitle?.slice(0, 60) || 'Key Point' }
            },
          },
        },
      ],
    },
    {
      name: 'faqs',
      title: 'Article FAQs',
      type: 'array',
      group: 'aeo',
      description: 'Frequently asked questions optimized for FAQPage schema and AI citations. Use 3-15 items.',
      of: [
        {
          type: 'object',
          name: 'faq',
          fields: [
            {
              name: 'question',
              title: 'Question',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'quickAnswer',
              title: 'Quick Answer',
              type: 'text',
              rows: 2,
              description: 'Concise answer for AI extraction (40-60 words). Max 300 chars.',
              validation: (Rule: any) => Rule.required().max(300),
            },
            {
              name: 'fullAnswer',
              title: 'Full Answer',
              type: 'text',
              rows: 5,
              description: 'Complete detailed answer',
            },
          ],
          preview: {
            select: { title: 'question', subtitle: 'quickAnswer' },
          },
        },
      ],
    },
    {
      name: 'toolsCompared',
      title: 'Tools Compared',
      type: 'array',
      group: 'aeo',
      description: 'For comparison and best-of articles. Each tool can have its own affiliate link.',
      of: [
        {
          type: 'object',
          name: 'toolComparison',
          fields: [
            {
              name: 'tool',
              title: 'Tool',
              type: 'reference',
              to: [{ type: 'tool' }],
            },
            {
              name: 'rating',
              title: 'Rating (out of 5)',
              type: 'number',
              validation: (Rule: any) => Rule.min(0).max(5).precision(1),
            },
            { name: 'verdict', title: 'One-line Verdict', type: 'string' },
            { name: 'pros', title: 'Pros', type: 'array', of: [{ type: 'string' }] },
            { name: 'cons', title: 'Cons', type: 'array', of: [{ type: 'string' }] },
            { name: 'pricingLastVerified', title: 'Pricing Last Verified', type: 'date' },
            {
              name: 'affiliateLink',
              title: 'Affiliate Link (for this tool)',
              type: 'url',
            },
            { name: 'promoCode', title: 'Promo Code', type: 'string' },
          ],
          preview: {
            select: { title: 'tool.name', subtitle: 'verdict' },
          },
        },
      ],
    },
    {
      name: 'dataSources',
      title: 'Data Sources',
      type: 'array',
      group: 'aeo',
      description: 'External authoritative sources used in this article. Boosts E-E-A-T signals.',
      validation: (Rule: any) => Rule.min(1),
      of: [
        {
          type: 'object',
          name: 'dataSource',
          fields: [
            {
              name: 'title',
              title: 'Source Title',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule: any) => Rule.required(),
            },
          ],
          preview: { select: { title: 'title', subtitle: 'url' } },
        },
      ],
    },
    {
      name: 'relatedResources',
      title: 'Related Resources',
      type: 'array',
      group: 'aeo',
      description: 'Links to related content, tools, and authoritative sources.',
      of: [
        {
          type: 'object',
          name: 'relatedResource',
          fields: [
            {
              name: 'title',
              title: 'Resource Title',
              type: 'string',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'url',
              title: 'URL',
              type: 'url',
              validation: (Rule: any) => Rule.required(),
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text',
              rows: 2,
              description: 'Brief description of what this resource provides',
            },
            {
              name: 'resourceType',
              title: 'Resource Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Internal Link', value: 'internal' },
                  { title: 'External Resource', value: 'external' },
                  { title: 'Government / Official', value: 'government' },
                  { title: 'Research Report', value: 'research' },
                  { title: 'Tool / Calculator', value: 'tool' },
                ],
              },
              initialValue: 'external',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'resourceType' },
          },
        },
      ],
    },

    // ─── AFFILIATE MARKETING ───────────────────────────────────────────────────

    {
      name: 'primaryAffiliateLink',
      title: 'Primary Affiliate Link',
      type: 'url',
      group: 'affiliate',
      description: 'Main CTA button URL. Displayed prominently at the top and bottom of the article.',
    },
    {
      name: 'affiliateButtonLabel',
      title: 'Affiliate Button Label',
      type: 'string',
      group: 'affiliate',
      description: 'e.g. "Try Notion Free", "Get 50% Off Today", "Start Free Trial"',
    },
    {
      name: 'secondaryAffiliateLinks',
      title: 'Secondary Affiliate Links',
      type: 'array',
      group: 'affiliate',
      description: 'Additional affiliate CTAs for articles covering multiple tools.',
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
      title: 'Show Affiliate Disclosure Banner?',
      type: 'boolean',
      group: 'affiliate',
      description: 'Legal requirement in most countries. Toggle on for any article with affiliate links.',
      initialValue: true,
    },
    {
      name: 'commissionTier',
      title: 'Commission Tier (Internal Only - Never Displayed)',
      type: 'string',
      group: 'affiliate',
      description: 'Internal tracking only. Never rendered on the front end.',
      options: {
        list: [
          { title: 'High (30%+)', value: 'high' },
          { title: 'Medium (15-30%)', value: 'medium' },
          { title: 'Low (under 15%)', value: 'low' },
          { title: 'Flat Rate', value: 'flat' },
        ],
      },
    },

    // ─── MEDIA ────────────────────────────────────────────────────────────────

    {
      name: 'heroImage',
      title: 'Featured Image',
      type: 'image',
      group: 'media',
      options: { hotspot: true },
      fields: [
        {
          name: 'alt',
          title: 'Alt Text',
          type: 'string',
          validation: (Rule: any) => Rule.required(),
        },
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
      description: 'Used for VideoObject schema markup — helps AI engines cite your video.',
    },
    {
      name: 'videoDescription',
      title: 'Video Description',
      type: 'text',
      rows: 2,
      group: 'media',
    },

    // ─── SEO ──────────────────────────────────────────────────────────────────

    {
      name: 'metaTitle',
      title: 'Meta Title (SEO)',
      type: 'string',
      group: 'seo',
      description: 'Custom SEO title. Uses article title if not set. Max 60 chars.',
      validation: (Rule: any) => Rule.max(60),
    },
    {
      name: 'metaDescription',
      title: 'Meta Description (SEO)',
      type: 'text',
      rows: 2,
      group: 'seo',
      description: 'Custom meta description for search engines. Uses summary if not set. Max 160 chars.',
      validation: (Rule: any) => Rule.max(160),
    },
    {
      name: 'focusKeyword',
      title: 'Focus Keyword',
      type: 'string',
      group: 'seo',
      description: 'Primary SEO keyword for this article.',
    },
    {
      name: 'targetKeywords',
      title: 'Target Keywords',
      type: 'array',
      group: 'seo',
      description: 'All keywords this article targets for SEO.',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'relatedArticles',
      title: 'Related Articles',
      type: 'array',
      group: 'seo',
      description: 'Internal linking — critical for SEO and affiliate funnel depth.',
      of: [{ type: 'reference', to: [{ type: 'blog' }] }],
    },

    // ─── AUTHORSHIP & FRESHNESS ────────────────────────────────────────────────

    {
      name: 'authorName',
      title: 'Author Name',
      type: 'string',
      group: 'meta',
      description: 'Displayed on the article. e.g. "Verza Editorial Team"',
      initialValue: 'Verza Editorial Team',
    },
    {
      name: 'authorRole',
      title: 'Author Role',
      type: 'string',
      group: 'meta',
      description: 'e.g. "Senior AI Tools Analyst", "Founder"',
    },
    {
      name: 'yearsOfExperience',
      title: 'Years of Experience',
      type: 'number',
      group: 'meta',
    },
    {
      name: 'certifications',
      title: 'Certifications / Credentials',
      type: 'array',
      group: 'meta',
      description: 'Professional certifications held by the author. Boosts E-E-A-T.',
      of: [{ type: 'string' }],
      options: { layout: 'tags' },
    },
    {
      name: 'estimatedReadTime',
      title: 'Estimated Read Time (minutes)',
      type: 'number',
      group: 'meta',
      validation: (Rule: any) => Rule.min(1).max(60),
    },
    {
      name: 'publishedAt',
      title: 'Published Date',
      type: 'datetime',
      group: 'meta',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'updatedAt',
      title: 'Last Updated',
      type: 'datetime',
      group: 'meta',
      description: 'Signals freshness to AI crawlers and search engines.',
    },
    {
      name: 'reviewFrequency',
      title: 'Review Frequency',
      type: 'string',
      group: 'meta',
      description: 'How often this article should be reviewed for accuracy.',
      options: {
        list: [
          { title: 'Monthly', value: 'monthly' },
          { title: 'Quarterly', value: 'quarterly' },
          { title: 'Bi-Annually', value: 'bi-annually' },
          { title: 'Annually', value: 'annually' },
        ],
      },
      initialValue: 'quarterly',
    },
    {
      name: 'nextReviewDate',
      title: 'Next Review Date',
      type: 'datetime',
      group: 'meta',
      description: 'Scheduled review reminder.',
    },
  ],

  preview: {
    select: {
      title: 'title',
      articleType: 'articleType',
      authorName: 'authorName',
      media: 'heroImage',
    },
    prepare({ title, articleType, authorName, media }: any) {
      const typeLabel: Record<string, string> = {
        review: 'REVIEW',
        comparison: 'COMPARISON',
        'best-of': 'BEST-OF',
        tutorial: 'TUTORIAL',
        news: 'NEWS',
        opinion: 'OPINION',
      }
      return {
        title,
        subtitle: `${typeLabel[articleType] || 'ARTICLE'} — ${authorName || 'No author'}`,
        media,
      }
    },
  },
}
