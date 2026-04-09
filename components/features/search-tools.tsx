'use client'

import { useState, useMemo } from 'react'
import { Input } from '@/components/ui/input'
import type { Tool } from '@/lib/sanity.types'

interface SearchToolsProps {
  tools: Tool[]
  onFilteredResults: (tools: Tool[]) => void
}

export function SearchTools({ tools, onFilteredResults }: SearchToolsProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredTools = useMemo(() => {
    if (!searchQuery.trim()) {
      return tools
    }

    const query = searchQuery.toLowerCase()
    return tools.filter((tool) => {
      const matchesName = tool.name.toLowerCase().includes(query)
      const matchesTagline = tool.tagline?.toLowerCase().includes(query)
      const matchesDescription = tool.description?.toLowerCase().includes(query)
      const matchesCategories = tool.categories?.some((cat) =>
        cat.name.toLowerCase().includes(query)
      )

      return matchesName || matchesTagline || matchesDescription || matchesCategories
    })
  }, [tools, searchQuery])

  // Update parent component whenever filtered results change
  useMemo(() => {
    onFilteredResults(filteredTools)
  }, [filteredTools, onFilteredResults])

  return (
    <div className="relative">
      <Input
        type="search"
        placeholder="Search tools by name, category, or description..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full"
      />
      {searchQuery && (
        <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-muted-foreground">
          {filteredTools.length} {filteredTools.length === 1 ? 'result' : 'results'}
        </div>
      )}
    </div>
  )
}
