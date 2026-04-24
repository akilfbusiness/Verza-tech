import { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getCategoryBySlug, getToolsByCategory, getAllCategorySlugs } from '@/lib/sanity.queries'
import { PageHero } from '@/components/layout/page-hero'
import { ContentCard } from '@/components/ui/content-card'
import { StaggerChildren } from '@/components/animations/stagger-children'
import { urlForImageSafe } from '@/lib/sanity.image'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)
  if (!category) return { title: 'Category Not Found' }
  return {
    title: `${category.name} Tools - Reviews & Comparisons`,
    description: category.description || `Discover the best ${category.name} tools. Compare features, pricing, and reviews to find the perfect software for your needs.`,
    keywords: [
      category.name,
      `${category.name} tools`,
      `${category.name} software`,
      `best ${category.name} tools`,
    ],
  }
}

export const revalidate = 60

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const [category, tools] = await Promise.all([
    getCategoryBySlug(slug),
    getToolsByCategory(slug),
  ])

  if (!category) notFound()

  return (
    <>
      <PageHero
        label="Category"
        title={category.name}
        subtitle={category.description}
        breadcrumbs={[
          { label: 'Tools', href: '/tools' },
          { label: category.name, href: `/category/${slug}` },
        ]}
        meta={`${tools.length} ${tools.length === 1 ? 'tool' : 'tools'} in this category`}
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          {tools.length === 0 ? (
            <div className="text-center py-12 border border-border">
              <p className="text-muted-foreground mb-2">No tools found in this category</p>
              <Link href="/tools" className="text-sm text-primary hover:underline">
                Browse all tools →
              </Link>
            </div>
          ) : (
            <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-px bg-border">
              {tools.map((tool) => (
                <ContentCard
                  key={tool._id}
                  href={`/tools/${tool.slug.current}`}
                  logo={urlForImageSafe(tool.logo) ?? undefined}
                  logoAlt={tool.name}
                  label={tool.categories?.[0]?.name}
                  title={tool.name}
                  description={tool.tagline ?? tool.description}
                  badge={tool.rating}
                  badgeVariant="rating"
                  tags={tool.categories?.map((c) => c.name)}
                  className="bg-background"
                />
              ))}
            </StaggerChildren>
          )}
        </div>
      </section>
    </>
  )
}
