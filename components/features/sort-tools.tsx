'use client'

import type { Tool } from '@/lib/sanity.types'

interface SortToolsProps {
  tools: Tool[]
  onSortChange: (sorted: Tool[]) => void
}

export function SortTools({ tools, onSortChange }: SortToolsProps) {
  const handleSort = (sortBy: string) => {
    let sorted = [...tools]

    switch (sortBy) {
      case 'name-asc':
        sorted.sort((a, b) => a.name.localeCompare(b.name))
        break
      case 'name-desc':
        sorted.sort((a, b) => b.name.localeCompare(a.name))
        break
      case 'rating-desc':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0))
        break
      case 'rating-asc':
        sorted.sort((a, b) => (a.rating || 0) - (b.rating || 0))
        break
      case 'newest':
        sorted.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return dateB - dateA
        })
        break
      case 'oldest':
        sorted.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return dateA - dateB
        })
        break
      default:
        // Default: newest first
        sorted.sort((a, b) => {
          const dateA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
          const dateB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
          return dateB - dateA
        })
    }

    onSortChange(sorted)
  }

  return (
    <div className="flex items-center gap-2">
      <label htmlFor="sort" className="text-sm font-medium whitespace-nowrap">
        Sort by:
      </label>
      <select
        id="sort"
        onChange={(e) => handleSort(e.target.value)}
        className="rounded-md border bg-background px-3 py-2 text-sm"
        defaultValue="newest"
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
        <option value="rating-desc">Highest Rated</option>
        <option value="rating-asc">Lowest Rated</option>
      </select>
    </div>
  )
}
