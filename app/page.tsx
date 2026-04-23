import Link from 'next/link'
import { getAllTools, getAllCategories, getSiteSettings } from '@/lib/sanity.queries'
import { isSanityConfigured } from '@/lib/sanity.config'
import {
  generateOrganizationSchema,
  generateWebsiteSchema,
  generateItemListSchema,
  renderJsonLd,
} from '@/lib/schema'
import { HeroSection }         from '@/components/home/hero-section'
import { LogosSection }        from '@/components/home/logos-section'
import { StatsSection }        from '@/components/home/stats-section'
import { AboutSection }        from '@/components/home/about-section'
import { HowItWorksSection }   from '@/components/home/how-it-works-section'
import { CategoriesSection }   from '@/components/home/categories-section'
import { FeaturedToolsSection } from '@/components/home/featured-tools-section'
import { TestimonialsSection } from '@/components/home/testimonials-section'
import { ComparisonSection }   from '@/components/home/comparison-section'
import { NewsletterSection }   from '@/components/home/newsletter-section'
import { CtaSection }          from '@/components/home/cta-section'

export const revalidate = 60

export default async function HomePage() {
  if (!isSanityConfigured) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="max-w-xl mx-auto px-6 text-center">
          <h1 className="text-6xl font-light mb-4 text-foreground">Verza</h1>
          <p className="text-muted-foreground mb-8">SaaS & AI Tool Reviews and Comparisons</p>
          <div className="border border-border p-8 text-left">
            <h2 className="font-medium text-lg mb-3">Sanity CMS Setup Required</h2>
            <p className="text-sm text-muted-foreground mb-6">
              Configure your Sanity environment variables to get started.
            </p>
            <ol className="text-sm space-y-3 list-decimal list-inside mb-6 text-muted-foreground">
              <li>Create a Sanity project at sanity.io</li>
              <li>Copy your Project ID and Dataset name</li>
              <li>Add them to your environment variables</li>
              <li>Access Sanity Studio at /studio to add content</li>
            </ol>
            <Link
              href="/studio"
              className="inline-flex items-center justify-center px-6 py-3 text-sm tracking-wide border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
            >
              Go to Studio
            </Link>
          </div>
        </div>
      </div>
    )
  }

  const [tools, categories, siteSettings] = await Promise.all([
    getAllTools(),
    getAllCategories(),
    getSiteSettings().catch(() => null),
  ])

  const featuredTools = tools.slice(0, 6)

  const heroHeadline       = siteSettings?.heroHeadline       || 'Discover the Best AI & SaaS Tools'
  const heroSubheadline    = siteSettings?.heroSubheadline    || 'In-depth reviews, honest comparisons, and expert recommendations — everything you need to choose the right software.'
  const heroPrimaryLabel   = siteSettings?.heroPrimaryCtaLabel  || 'Browse All Tools'
  const heroPrimaryLink    = siteSettings?.heroPrimaryCtaLink   || '/tools'
  const heroSecondaryLabel = siteSettings?.heroSecondaryCtaLabel || 'Read Reviews'
  const heroSecondaryLink  = siteSettings?.heroSecondaryCtaLink  || '/reviews'

  const statsEnabled = siteSettings?.statsEnabled ?? true
  const stats = siteSettings?.stats?.length
    ? siteSettings.stats
    : [
        { value: `${tools.length}+`,      label: 'Tools Reviewed' },
        { value: `${categories.length}+`, label: 'Categories' },
        { value: 'Expert',                label: 'Analysis' },
        { value: 'Global',                label: 'Reach' },
      ]

  const showCategories       = siteSettings?.showCategoriesSection ?? true
  const categoriesHeading    = siteSettings?.categoriesSectionHeading    || 'Browse by Category'
  const categoriesSubheading = siteSettings?.categoriesSectionSubheading || 'Find the perfect tools for your workflow'

  const showFeaturedTools    = siteSettings?.showFeaturedToolsSection ?? true
  const featuredToolsHeading = siteSettings?.featuredToolsHeading    || 'Featured Tools'
  const featuredToolsSubhead = siteSettings?.featuredToolsSubheading || 'Handpicked tools we recommend'

  const bottomCtaHeading = siteSettings?.bottomCtaHeading     || 'Stay Updated'
  const bottomCtaBody    = siteSettings?.bottomCtaBody        || 'Get the latest tool reviews, comparisons, and recommendations delivered to your inbox.'
  const bottomCtaLabel   = siteSettings?.bottomCtaButtonLabel || 'Learn More About Verza'
  const bottomCtaLink    = siteSettings?.bottomCtaButtonLink  || '/about'

  return (
    <>
      {renderJsonLd(generateOrganizationSchema(siteSettings))}
      {renderJsonLd(generateWebsiteSchema())}
      {renderJsonLd(generateItemListSchema(featuredTools, 'Featured SaaS & AI Tools'))}

      <div className="min-h-screen bg-background">
        <HeroSection
          headline={heroHeadline}
          subheadline={heroSubheadline}
          primaryLabel={heroPrimaryLabel}
          primaryLink={heroPrimaryLink}
          secondaryLabel={heroSecondaryLabel}
          secondaryLink={heroSecondaryLink}
        />

        <LogosSection />

        {statsEnabled && stats.length > 0 && (
          <StatsSection stats={stats} />
        )}

        <AboutSection />

        <HowItWorksSection />

        {showCategories && categories.length > 0 && (
          <CategoriesSection
            categories={categories}
            heading={categoriesHeading}
            subheading={categoriesSubheading}
          />
        )}

        {showFeaturedTools && featuredTools.length > 0 && (
          <FeaturedToolsSection
            tools={featuredTools}
            heading={featuredToolsHeading}
            subheading={featuredToolsSubhead}
          />
        )}

        <ComparisonSection />

        <TestimonialsSection />

        <NewsletterSection />

        <CtaSection
          heading={bottomCtaHeading}
          body={bottomCtaBody}
          ctaLabel={bottomCtaLabel}
          ctaLink={bottomCtaLink}
        />
      </div>
    </>
  )
}
