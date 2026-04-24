import { Metadata } from 'next'
import { getAllTools, getAllCategories } from '@/lib/sanity.queries'
import { generateItemListSchema, renderJsonLd } from '@/lib/schema'
import { PageHero } from '@/components/layout/page-hero'
import { InteractiveToolsPage } from './interactive-page'

export const metadata: Metadata = {
  title: 'All Tools - SaaS & AI Tool Directory | Verza',
  description: 'Browse our complete directory of SaaS and AI tools with reviews, pricing, and comparisons. Filter by category, pricing, and rating.',
}

export const revalidate = 60

export default async function ToolsPage() {
  const [tools, categories] = await Promise.all([
    getAllTools(),
    getAllCategories(),
  ])

  const itemListSchema = tools.length > 0
    ? generateItemListSchema(tools, 'SaaS and AI Tools Directory')
    : null

  return (
    <>
      {itemListSchema && renderJsonLd(itemListSchema)}

      <PageHero
        label="Directory"
        title="All Tools"
        subtitle="Browse SaaS and AI tools with detailed reviews and comparisons."
        breadcrumbs={[{ label: 'Tools', href: '/tools' }]}
        meta={`${tools.length} tools reviewed`}
      />

      <section className="py-16 md:py-24 bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          {tools.length === 0 ? (
            <div className="text-center py-12 border border-border">
              <p className="text-muted-foreground mb-2">No tools found</p>
              <p className="text-sm text-muted-foreground">Add your first tool in Sanity Studio at /studio</p>
            </div>
          ) : (
            <InteractiveToolsPage initialTools={tools} categories={categories} />
          )}
        </div>
      </section>
    </>
  )
}
