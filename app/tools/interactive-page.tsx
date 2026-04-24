'use client'

import { useState } from 'react'
import { SearchTools } from '@/components/features/search-tools'
import { FilterTools } from '@/components/features/filter-tools'
import { SortTools } from '@/components/features/sort-tools'
import { ContentCard } from '@/components/ui/content-card'
import { StaggerChildren } from '@/components/animations/stagger-children'
import { urlForImageSafe } from '@/lib/sanity.image'
import type { Tool, Category } from '@/lib/sanity.types'

interface InteractiveToolsPageProps {
  initialTools: Tool[]
  categories: Category[]
}

export function InteractiveToolsPage({ initialTools, categories }: InteractiveToolsPageProps) {
  const [displayedTools, setDisplayedTools] = useState<Tool[]>(initialTools)

  return (
    <div className="space-y-8">
      <SearchTools tools={initialTools} onFilteredResults={setDisplayedTools} />

      <div className="grid lg:grid-cols-4 gap-8">
        <aside className="lg:col-span-1">
          <FilterTools
            tools={initialTools}
            categories={categories}
            onFilterChange={setDisplayedTools}
          />
        </aside>

        <div className="lg:col-span-3 space-y-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              Showing {displayedTools.length} {displayedTools.length === 1 ? 'tool' : 'tools'}
            </p>
            <SortTools tools={displayedTools} onSortChange={setDisplayedTools} />
          </div>

          {displayedTools.length === 0 ? (
            <div className="text-center py-12 border border-border">
              <p className="text-muted-foreground mb-2">No tools found</p>
              <p className="text-sm text-muted-foreground">Try adjusting your search or filters</p>
            </div>
          ) : (
            <StaggerChildren className="grid md:grid-cols-2 gap-px bg-border">
              {displayedTools.map((tool) => (
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
      </div>
    </div>
  )
}
