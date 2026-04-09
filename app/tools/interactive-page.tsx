'use client'

import { useState } from 'react'
import Link from 'next/link'
import { SearchTools } from '@/components/features/search-tools'
import { FilterTools } from '@/components/features/filter-tools'
import { SortTools } from '@/components/features/sort-tools'
import type { Tool, Category } from '@/lib/sanity.types'

interface InteractiveToolsPageProps {
  initialTools: Tool[]
  categories: Category[]
}

export function InteractiveToolsPage({
  initialTools,
  categories,
}: InteractiveToolsPageProps) {
  const [displayedTools, setDisplayedTools] = useState<Tool[]>(initialTools)

  return (
    <div className="space-y-8">
      {/* Search Bar */}
      <SearchTools tools={initialTools} onFilteredResults={setDisplayedTools} />

      <div className="grid lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <aside className="lg:col-span-1">
          <FilterTools
            tools={initialTools}
            categories={categories}
            onFilterChange={setDisplayedTools}
          />
        </aside>

        {/* Results */}
        <div className="lg:col-span-3 space-y-6">
          {/* Sort and Count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {displayedTools.length} {displayedTools.length === 1 ? 'tool' : 'tools'}
            </p>
            <SortTools tools={displayedTools} onSortChange={setDisplayedTools} />
          </div>

          {/* Tool Grid */}
          {displayedTools.length === 0 ? (
            <div className="text-center py-12 border rounded-lg bg-muted/30">
              <p className="text-muted-foreground mb-2">No tools found</p>
              <p className="text-sm text-muted-foreground">
                Try adjusting your search or filters
              </p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 gap-6">
              {displayedTools.map((tool) => (
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
    </div>
  )
}
