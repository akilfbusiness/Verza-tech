import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getCategoryBySlug, getToolsByCategory, getAllCategorySlugs } from '@/lib/sanity.queries'

type Props = {
  params: Promise<{ slug: string }>
}

export async function generateStaticParams() {
  const slugs = await getAllCategorySlugs()
  return slugs.map((slug) => ({
    slug,
  }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const category = await getCategoryBySlug(slug)

  if (!category) {
    return {
      title: 'Category Not Found',
    }
  }

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

export const revalidate = 3600

export default async function CategoryPage({ params }: Props) {
  const { slug } = await params
  const [category, tools] = await Promise.all([
    getCategoryBySlug(slug),
    getToolsByCategory(slug),
  ])

  if (!category) {
    notFound()
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          {category.icon && (
            <div className="text-4xl mb-4">{category.icon}</div>
          )}
          <h1 className="text-4xl font-bold mb-4">{category.name}</h1>
          {category.description && (
            <p className="text-lg text-muted-foreground max-w-3xl">
              {category.description}
            </p>
          )}
          <p className="text-sm text-muted-foreground mt-4">
            {tools.length} {tools.length === 1 ? 'tool' : 'tools'} found
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {tools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No tools found in this category</p>
            <Link
              href="/tools"
              className="text-sm text-primary hover:underline"
            >
              Browse all tools →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {tools.map((tool) => (
              <Link
                key={tool._id}
                href={`/tools/${tool.slug.current}`}
                className="border rounded-lg p-6 hover:border-primary hover:shadow-lg transition-all group"
              >
                <div className="flex items-start gap-4 mb-4">
                  {tool.logo && (
                    <div className="w-12 h-12 bg-muted rounded-lg flex-shrink-0" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold mb-1 truncate group-hover:text-primary transition-colors">
                      {tool.name}
                    </h3>
                    {tool.tagline && (
                      <p className="text-sm text-muted-foreground line-clamp-1">
                        {tool.tagline}
                      </p>
                    )}
                  </div>
                </div>

                {tool.description && (
                  <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                    {tool.description}
                  </p>
                )}

                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm">
                    {tool.rating && (
                      <div className="flex items-center gap-1">
                        <span className="font-medium">{tool.rating}</span>
                        <span className="text-muted-foreground">/5</span>
                      </div>
                    )}
                    {tool.reviewCount && (
                      <span className="text-muted-foreground">
                        {tool.reviewCount} reviews
                      </span>
                    )}
                  </div>
                  {tool.freePlanAvailable && (
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">
                      Free plan
                    </span>
                  )}
                </div>

                {tool.bestFor && tool.bestFor.length > 0 && (
                  <div className="mt-4 pt-4 border-t">
                    <p className="text-xs text-muted-foreground mb-1">Best for:</p>
                    <p className="text-sm line-clamp-1">{tool.bestFor[0]}</p>
                  </div>
                )}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
