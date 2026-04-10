import { defineType, defineField } from 'sanity'

export const siteSettingsSchema = defineType({
  name: 'siteSettings',
  title: 'Site Settings',
  type: 'document',
  // Singleton — only one document of this type
  __experimental_actions: ['update', 'publish'],
  fields: [
    // ─── BRANDING ────────────────────────────────────────────────────────────
    defineField({
      name: 'siteName',
      title: 'Site Name',
      type: 'string',
      description: 'Displayed in the header logo and browser tab. e.g. "Verza"',
      validation: (R) => R.required(),
    }),
    defineField({
      name: 'tagline',
      title: 'Tagline',
      type: 'string',
      description: 'Short descriptor shown under the site name or in the hero. e.g. "SaaS & AI Tool Reviews"',
    }),
    defineField({
      name: 'logo',
      title: 'Logo',
      type: 'image',
      description: 'Site logo. If not set, the Site Name text is used as the logo.',
      options: { hotspot: true },
      fields: [
        defineField({ name: 'alt', title: 'Alt Text', type: 'string' }),
      ],
    }),
    defineField({
      name: 'favicon',
      title: 'Favicon',
      type: 'image',
      description: 'Browser tab icon. Recommended: 32×32 or 64×64 PNG.',
    }),

    // ─── HOMEPAGE HERO ───────────────────────────────────────────────────────
    defineField({
      name: 'heroHeadline',
      title: 'Hero Headline',
      type: 'string',
      description: 'Main headline on the homepage. e.g. "Discover the Best SaaS & AI Tools"',
    }),
    defineField({
      name: 'heroSubheadline',
      title: 'Hero Subheadline',
      type: 'text',
      rows: 2,
      description: 'Supporting line below the hero headline.',
    }),
    defineField({
      name: 'heroPrimaryCtaLabel',
      title: 'Hero Primary CTA — Label',
      type: 'string',
      description: 'Button text. e.g. "Browse All Tools"',
    }),
    defineField({
      name: 'heroPrimaryCtaLink',
      title: 'Hero Primary CTA — Link',
      type: 'string',
      description: 'Internal path. e.g. "/tools"',
    }),
    defineField({
      name: 'heroSecondaryCtaLabel',
      title: 'Hero Secondary CTA — Label',
      type: 'string',
      description: 'e.g. "Read Reviews"',
    }),
    defineField({
      name: 'heroSecondaryCtaLink',
      title: 'Hero Secondary CTA — Link',
      type: 'string',
      description: 'e.g. "/reviews"',
    }),

    // ─── HOMEPAGE TRUST STATS ────────────────────────────────────────────────
    defineField({
      name: 'statsEnabled',
      title: 'Show Trust Stats Bar',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'stats',
      title: 'Trust Stats',
      type: 'array',
      description: 'Up to 4 stats shown in the bar below the hero.',
      of: [
        {
          type: 'object',
          fields: [
            defineField({ name: 'value', title: 'Value', type: 'string', description: 'e.g. "200+"' }),
            defineField({ name: 'label', title: 'Label', type: 'string', description: 'e.g. "Tools Reviewed"' }),
          ],
          preview: { select: { title: 'value', subtitle: 'label' } },
        },
      ],
      validation: (R) => R.max(4),
    }),

    // ─── HOMEPAGE SECTIONS TOGGLE ────────────────────────────────────────────
    defineField({
      name: 'showCategoriesSection',
      title: 'Show "Browse by Category" section on Homepage',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'categoriesSectionHeading',
      title: 'Categories Section Heading',
      type: 'string',
      initialValue: 'Browse by Category',
    }),
    defineField({
      name: 'categoriesSectionSubheading',
      title: 'Categories Section Subheading',
      type: 'string',
      initialValue: 'Find the perfect tools for your needs',
    }),
    defineField({
      name: 'showFeaturedToolsSection',
      title: 'Show "Featured Tools" section on Homepage',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'featuredToolsHeading',
      title: 'Featured Tools Section Heading',
      type: 'string',
      initialValue: 'Featured Tools',
    }),
    defineField({
      name: 'featuredToolsSubheading',
      title: 'Featured Tools Section Subheading',
      type: 'string',
      initialValue: 'Handpicked tools we recommend',
    }),

    // ─── HOMEPAGE BOTTOM CTA ─────────────────────────────────────────────────
    defineField({
      name: 'bottomCtaHeading',
      title: 'Bottom CTA Heading',
      type: 'string',
      initialValue: 'Stay Updated',
    }),
    defineField({
      name: 'bottomCtaBody',
      title: 'Bottom CTA Body Text',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'bottomCtaButtonLabel',
      title: 'Bottom CTA Button Label',
      type: 'string',
      initialValue: 'Learn More About Verza',
    }),
    defineField({
      name: 'bottomCtaButtonLink',
      title: 'Bottom CTA Button Link',
      type: 'string',
      initialValue: '/about',
    }),

    // ─── CONTACT + SOCIAL ─────────────────────────────────────────────────────
    defineField({
      name: 'contactEmail',
      title: 'Contact Email',
      type: 'string',
    }),
    defineField({
      name: 'socialLinks',
      title: 'Social Media Links',
      type: 'object',
      fields: [
        defineField({ name: 'twitter',   title: 'Twitter / X',  type: 'url' }),
        defineField({ name: 'linkedin',  title: 'LinkedIn',     type: 'url' }),
        defineField({ name: 'youtube',   title: 'YouTube',      type: 'url' }),
        defineField({ name: 'instagram', title: 'Instagram',    type: 'url' }),
        defineField({ name: 'facebook',  title: 'Facebook',     type: 'url' }),
        defineField({ name: 'tiktok',    title: 'TikTok',       type: 'url' }),
      ],
    }),

    // ─── LEGAL + TRUST ────────────────────────────────────────────────────────
    defineField({
      name: 'affiliateDisclosureText',
      title: 'Global Affiliate Disclosure Text',
      type: 'text',
      rows: 2,
      description: 'Shown in the footer and optionally on articles.',
      initialValue: 'Some links on this site are affiliate links. We may earn a commission at no extra cost to you.',
    }),
    defineField({
      name: 'cookieBannerText',
      title: 'Cookie Banner Text',
      type: 'string',
      description: 'Text shown in the cookie consent banner. Leave blank to disable banner.',
    }),
    defineField({
      name: 'copyrightText',
      title: 'Copyright Text',
      type: 'string',
      description: 'Displayed in the footer. Use {year} to auto-insert the current year. e.g. "© {year} Verza. All rights reserved."',
      initialValue: '© {year} Verza. All rights reserved.',
    }),

    // ─── SEO DEFAULTS ─────────────────────────────────────────────────────────
    defineField({
      name: 'defaultMetaDescription',
      title: 'Default Meta Description',
      type: 'text',
      rows: 2,
      description: 'Used when a page has no specific meta description.',
    }),
    defineField({
      name: 'defaultOgImage',
      title: 'Default OG / Social Share Image',
      type: 'image',
      description: 'Fallback image for social sharing when a page has no hero image.',
    }),
  ],

  preview: {
    select: { title: 'siteName', subtitle: 'tagline' },
  },
})
