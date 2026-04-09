import { Metadata } from 'next'
import { getAllTools, getAllCategories } from '@/lib/sanity.queries'
import { generateItemListSchema, renderJsonLd } from '@/lib/schema'
import { InteractiveToolsPage } from './interactive-page'

export const metadata: Metadata = {
  title: 'All Tools - SaaS & AI Tool Directory | Verza',
  description: 'Browse our complete directory of SaaS and AI tools with reviews, pricing, and comparisons. Filter by category, pricing, and rating.',
}

export const revalidate = 3600

export default async function ToolsPage() {
  const [tools, categories] = await Promise.all([
    getAllTools(),
    getAllCategories(),
  ])

  // Generate schema markup
  const itemListSchema = tools.length > 0 
    ? generateItemListSchema(tools, 'SaaS and AI Tools Directory')
    : null

  return (
    <>
      {itemListSchema && renderJsonLd(itemListSchema)}
      
      <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <h1 className="text-4xl font-bold mb-4">All Tools</h1>
          <p className="text-lg text-muted-foreground">
            Browse {tools.length} SaaS and AI tools with detailed reviews and comparisons
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-6xl">
        {tools.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-4">No tools found</p>
            <p className="text-sm text-muted-foreground">
              Add your first tool in Sanity Studio at /studio
            </p>
          </div>
        ) : (
          <InteractiveToolsPage initialTools={tools} categories={categories} />
        )}
      </div>
      </div>
    </>
  )
}
