import Link from 'next/link'
import type { Tool } from '@/lib/sanity.types'

interface RelatedToolsProps {
  currentTool: Tool
  allTools: Tool[]
  maxResults?: number
}

export function RelatedTools({ currentTool, allTools, maxResults = 4 }: RelatedToolsProps) {
  // Find related tools based on shared categories
  const relatedTools = allTools
    .filter((tool) => {
      // Exclude current tool
      if (tool._id === currentTool._id) return false

      // Check if shares at least one category
      const hasSharedCategory = currentTool.categories?.some((currentCat) =>
        tool.categories?.some((toolCat) => toolCat._id === currentCat._id)
      )

      return hasSharedCategory
    })
    .slice(0, maxResults)

  if (relatedTools.length === 0) {
    return null
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-6">Related Tools</h2>
      <div className="grid md:grid-cols-2 gap-4">
        {relatedTools.map((tool) => (
          <Link
            key={tool._id}
            href={`/tools/${tool.slug.current}`}
            className="border rounded-lg p-4 hover:border-primary hover:shadow-md transition-all group"
          >
            <div className="flex items-start gap-3">
              {tool.logo && (
                <div className="w-10 h-10 bg-muted rounded-lg flex-shrink-0" />
              )}
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold mb-1 group-hover:text-primary transition-colors truncate">
                  {tool.name}
                </h3>
                {tool.tagline && (
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    {tool.tagline}
                  </p>
                )}
                {tool.rating && (
                  <div className="flex items-center gap-1 mt-2 text-sm">
                    <span className="font-medium">{tool.rating}</span>
                    <span className="text-muted-foreground">/5</span>
                  </div>
                )}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}
