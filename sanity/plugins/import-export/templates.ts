// ─── JSON TEMPLATES FOR EACH DOCUMENT TYPE ────────────────────────────────────
// These templates are used by the Import/Export plugin.
// Give the blank template + your raw notes to an AI, it fills it out,
// then import the filled JSON back into Sanity.

export const DOCUMENT_TYPES = [
  { value: 'blog', label: 'Blog Article' },
  { value: 'category', label: 'Category' },
  { value: 'tool', label: 'Tool' },
  { value: 'author', label: 'Author' },
  { value: 'review', label: 'Review' },
  { value: 'comparison', label: 'Comparison' },
]

export const templates: Record<string, object> = {

  blog: {
    _type: 'blog',
    _instructions: 'Fill in all fields. Remove _instructions before importing. Fields marked [REQUIRED] must have a value.',
    title: '[REQUIRED] Full article title. Max 100 chars.',
    slug: { _type: 'slug', current: '[REQUIRED] url-friendly-slug-here' },
    articleType: '[REQUIRED] One of: review | comparison | best-of | tutorial | news | opinion',
    categories: [
      { _instructions: 'Replace with actual Sanity category _id. Find it in the Categories tab.', _type: 'reference', _ref: 'CATEGORY_ID_HERE' }
    ],
    targetAudience: ['[One or more of: marketers | developers | freelancers | smb | enterprise | content-creators | founders | students | agencies | general]'],
    heroImage: {
      _instructions: 'Upload image in Sanity, then paste the image asset _id here.',
      _type: 'image',
      asset: { _type: 'reference', _ref: 'IMAGE_ASSET_ID' },
      alt: '[REQUIRED] Descriptive alt text for accessibility and SEO.',
      caption: 'Optional image caption or credit.',
    },
    summary: '[REQUIRED] Short TLDR shown at top of article and in listings. Max 300 chars.',
    articleAnswerCapsule: '[REQUIRED for AEO] 20-25 word direct answer to the article\'s core question. This is the single most important AEO field — AI engines pull this verbatim when citing the article. Reads as a standalone sentence.',
    introduction: '[REQUIRED] Opening paragraph that hooks readers and sets context.',
    contentSections: [
      {
        _type: 'contentSection',
        heading: '[REQUIRED] Section H2 heading',
        sectionAnswerCapsule: 'A 20-40 word direct answer to what this section covers. AI engines extract this for section-level citations. Should read as a standalone answer to the heading.',
        content: [
          {
            _type: 'block',
            style: 'normal',
            children: [{ _type: 'span', text: 'Section body text goes here.' }],
            markDefs: [],
          }
        ],
      }
    ],
    decisionFramework: {
      _instructions: 'A branded, named framework that helps readers make a decision. AI engines cite named frameworks directly. Remove _instructions before importing.',
      frameworkName: 'e.g. "The Verza Stack Audit" | "The 4-Point Tool Evaluation" | "The Verza Selection Method"',
      steps: [
        { stepTitle: '[REQUIRED] Step 1 title', stepDescription: '[REQUIRED] What the reader does or considers in this step.' },
        { stepTitle: '[REQUIRED] Step 2 title', stepDescription: '[REQUIRED] What the reader does or considers in this step.' },
      ],
    },
    dataProvenance: 'One sentence on how the data was gathered. e.g. "Based on hands-on testing of 12 tools over 3 months, last verified April 2026." Renders as a visible trust badge.',
    verdictBox: {
      summary: 'One-line verdict. e.g. "The best AI writing tool for content creators in 2026."',
      rating: 4.5,
      recommendation: 'One of: highly-recommended | recommended | conditional | not-recommended',
      verdictChanged: false,
      verdictChangedDate: null,
    },
    keyPoints: [
      {
        question: 'Optional question framing the key point.',
        quickAnswer: '[REQUIRED] Concise answer for AI extraction. 40-60 words.',
        fullExplanation: 'Optional detailed explanation.',
      }
    ],
    faqs: [
      {
        question: '[REQUIRED] FAQ question.',
        quickAnswer: '[REQUIRED] Concise answer. Max 300 chars.',
        fullAnswer: 'Optional complete detailed answer.',
      }
    ],
    toolsCompared: [
      {
        _instructions: 'Replace TOOL_ID with actual Sanity tool _id.',
        tool: { _type: 'reference', _ref: 'TOOL_ID_HERE' },
        rating: 4.5,
        verdict: 'One-line verdict for this tool.',
        pros: ['Pro 1', 'Pro 2'],
        cons: ['Con 1', 'Con 2'],
        pricingLastVerified: '2026-04-10',
        affiliateLink: 'https://youraffiliatelink.com',
        promoCode: 'VERZA20',
      }
    ],
    dataSources: [
      { title: 'Source name e.g. HubSpot State of Marketing 2026', url: 'https://source-url.com' }
    ],
    relatedResources: [
      {
        title: 'Resource title',
        url: 'https://resource-url.com',
        description: 'Brief description of what this resource provides.',
        resourceType: 'One of: internal | external | government | research | tool',
      }
    ],
    primaryAffiliateLink: 'https://your-affiliate-link.com',
    affiliateButtonLabel: 'Try [Tool Name] Free — Get 30% Off',
    secondaryAffiliateLinks: [
      { label: 'Button label', url: 'https://affiliate-link.com', promoCode: 'CODE' }
    ],
    promoCode: 'VERZA20',
    affiliateDisclosure: true,
    commissionTier: 'One of: high | medium | low | flat',
    gallery: [
      {
        _type: 'image',
        asset: { _type: 'reference', _ref: 'IMAGE_ASSET_ID' },
        alt: '[REQUIRED] Alt text',
        caption: 'Optional caption',
      }
    ],
    youtubeUrl: 'https://www.youtube.com/watch?v=VIDEO_ID',
    videoTitle: 'Video title for VideoObject schema markup.',
    videoDescription: 'Video description.',
    metaTitle: 'Custom SEO title. Max 60 chars. Uses article title if blank.',
    metaDescription: 'Custom meta description. Max 160 chars. Uses summary if blank.',
    focusKeyword: 'primary seo keyword',
    targetKeywords: ['keyword 1', 'keyword 2', 'keyword 3'],
    relatedArticles: [
      { _instructions: 'Replace with actual Sanity blog _id.', _type: 'reference', _ref: 'BLOG_ID_HERE' }
    ],
    author: { _instructions: 'Replace with actual Sanity author _id.', _type: 'reference', _ref: 'AUTHOR_ID_HERE' },
    estimatedReadTime: 8,
    publishedAt: '2026-04-10T00:00:00.000Z',
    updatedAt: '2026-04-10T00:00:00.000Z',
    reviewFrequency: 'One of: monthly | quarterly | bi-annually | annually',
    nextReviewDate: '2026-07-10T00:00:00.000Z',
  },

  category: {
    _type: 'category',
    _instructions: 'Fill in all fields. Remove _instructions before importing.',
    name: '[REQUIRED] Category name e.g. "Content Creation Tools"',
    slug: { _type: 'slug', current: '[REQUIRED] content-creation-tools' },
    description: '[REQUIRED] Short description shown in category cards. Max 160 chars.',
    longDescription: 'Longer description shown at the top of the category landing page.',
    icon: 'Lucide icon name e.g. Sparkles | Zap | Layout | Bot | PenTool | BarChart',
    heroImage: {
      _type: 'image',
      asset: { _type: 'reference', _ref: 'IMAGE_ASSET_ID' },
      alt: 'Alt text',
    },
    featuredArticle: { _type: 'reference', _ref: 'BLOG_ID_HERE' },
    order: 1,
    showInNav: true,
  },

  tool: {
    _type: 'tool',
    _instructions: 'Fill in all fields. Remove _instructions before importing.',
    name: '[REQUIRED] Tool name',
    slug: { _type: 'slug', current: '[REQUIRED] tool-name' },
    tagline: 'Short one-liner description.',
    description: 'Full description of the tool.',
    website: 'https://tool-website.com',
    affiliateLink: 'https://your-affiliate-link.com',
    categories: [{ _type: 'reference', _ref: 'CATEGORY_ID_HERE' }],
    features: ['Feature 1', 'Feature 2', 'Feature 3'],
    pricing: [
      {
        name: 'Free',
        price: '$0',
        billingPeriod: 'month',
        features: ['Feature 1', 'Feature 2'],
      },
      {
        name: 'Pro',
        price: '$20',
        billingPeriod: 'month',
        features: ['Everything in Free', 'Pro Feature 1'],
      },
    ],
    rating: 4.5,
    reviewCount: 120,
    pros: ['Pro 1', 'Pro 2', 'Pro 3'],
    cons: ['Con 1', 'Con 2'],
    bestFor: ['Use case 1', 'Use case 2'],
    integrations: ['Zapier', 'Slack', 'Google Drive'],
    freeTrialAvailable: true,
    freePlanAvailable: true,
    status: 'One of: active | discontinued | beta',
    publishedAt: '2026-04-10T00:00:00.000Z',
    updatedAt: '2026-04-10T00:00:00.000Z',
  },

  author: {
    _type: 'author',
    _instructions: 'Fill in all fields. Remove _instructions before importing.',
    name: '[REQUIRED] Author full name',
    slug: { _type: 'slug', current: '[REQUIRED] author-name' },
    bio: 'Short biography for E-E-A-T signals. 2-3 sentences.',
    role: 'e.g. Senior AI Tools Analyst | Founder & Editor',
    yearsOfExperience: 5,
    certifications: ['Google Analytics Certified', 'HubSpot Content Marketing'],
    expertise: ['AI Tools', 'SaaS', 'Productivity', 'B2B Marketing'],
    socialLinks: {
      twitter: 'https://twitter.com/username',
      linkedin: 'https://linkedin.com/in/username',
      website: 'https://yourwebsite.com',
    },
  },

  review: {
    _type: 'review',
    _instructions: 'Fill in all fields. Remove _instructions before importing.',
    title: '[REQUIRED] Review title',
    slug: { _type: 'slug', current: '[REQUIRED] review-slug' },
    tool: { _type: 'reference', _ref: 'TOOL_ID_HERE' },
    author: { _type: 'reference', _ref: 'AUTHOR_ID_HERE' },
    rating: 4.5,
    pros: ['Pro 1', 'Pro 2'],
    cons: ['Con 1', 'Con 2'],
    verdict: 'Overall verdict summary.',
    publishedAt: '2026-04-10T00:00:00.000Z',
  },

  comparison: {
    _type: 'comparison',
    _instructions: 'Fill in all fields. Remove _instructions before importing.',
    title: '[REQUIRED] Comparison title e.g. "Notion vs Coda: Which is Better in 2026?"',
    slug: { _type: 'slug', current: '[REQUIRED] notion-vs-coda-2026' },
    tools: [
      { _type: 'reference', _ref: 'TOOL_1_ID_HERE' },
      { _type: 'reference', _ref: 'TOOL_2_ID_HERE' },
    ],
    author: { _type: 'reference', _ref: 'AUTHOR_ID_HERE' },
    verdict: 'Overall winner and summary.',
    comparisonTable: [
      { feature: 'Feature name', tool1Value: 'Value for Tool 1', tool2Value: 'Value for Tool 2' },
    ],
    publishedAt: '2026-04-10T00:00:00.000Z',
  },
}
