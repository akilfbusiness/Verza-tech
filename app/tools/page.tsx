import { Metadata } from 'next'
import Link from 'next/link'
import { getAllTools } from '@/lib/sanity.queries'

export const metadata: Metadata = {
  title: 'All Tools',
  description: 'Browse our complete directory of SaaS and AI tools with reviews, pricing, and comparisons.',
}

export const revalidate = 3600

export default async function ToolsPage() {
  const tools = await getAllTools()

  return (
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

                {tool.categories && tool.categories.length > 0 && (
                  <div className="flex gap-2 mt-4 flex-wrap">
                    {tool.categories.slice(0, 3).map((category) => (
                      <span
                        key={category._id}
                        className="text-xs bg-muted px-2 py-1 rounded"
                      >
                        {category.name}
                      </span>
                    ))}
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
