'use client'

import { useState } from 'react'
import type { Tool, Category } from '@/lib/sanity.types'

interface FilterToolsProps {
  tools: Tool[]
  categories: Category[]
  onFilterChange: (filtered: Tool[]) => void
}

export function FilterTools({ tools, categories, onFilterChange }: FilterToolsProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [selectedPricing, setSelectedPricing] = useState<string>('all')
  const [minRating, setMinRating] = useState<number>(0)

  const handleFilterChange = (
    category: string,
    pricing: string,
    rating: number
  ) => {
    let filtered = tools

    // Filter by category
    if (category !== 'all') {
      filtered = filtered.filter((tool) =>
        tool.categories?.some((cat) => cat.slug.current === category)
      )
    }

    // Filter by pricing
    if (pricing === 'free') {
      filtered = filtered.filter((tool) => tool.freePlanAvailable === true)
    } else if (pricing === 'trial') {
      filtered = filtered.filter((tool) => tool.freeTrialAvailable === true)
    } else if (pricing === 'paid') {
      filtered = filtered.filter((tool) => !tool.freePlanAvailable)
    }

    // Filter by rating
    if (rating > 0) {
      filtered = filtered.filter((tool) => tool.rating && tool.rating >= rating)
    }

    onFilterChange(filtered)
  }

  const updateCategory = (value: string) => {
    setSelectedCategory(value)
    handleFilterChange(value, selectedPricing, minRating)
  }

  const updatePricing = (value: string) => {
    setSelectedPricing(value)
    handleFilterChange(selectedCategory, value, minRating)
  }

  const updateRating = (value: number) => {
    setMinRating(value)
    handleFilterChange(selectedCategory, selectedPricing, value)
  }

  const clearFilters = () => {
    setSelectedCategory('all')
    setSelectedPricing('all')
    setMinRating(0)
    onFilterChange(tools)
  }

  const hasActiveFilters =
    selectedCategory !== 'all' || selectedPricing !== 'all' || minRating > 0

  return (
    <div className="space-y-6 border rounded-lg p-6 bg-muted/30">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold">Filters</h3>
        {hasActiveFilters && (
          <button
            onClick={clearFilters}
            className="text-sm text-primary hover:underline"
          >
            Clear all
          </button>
        )}
      </div>

      {/* Category Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Category</label>
        <select
          value={selectedCategory}
          onChange={(e) => updateCategory(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Categories</option>
          {categories.map((category) => (
            <option key={category._id} value={category.slug.current}>
              {category.name}
            </option>
          ))}
        </select>
      </div>

      {/* Pricing Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Pricing</label>
        <select
          value={selectedPricing}
          onChange={(e) => updatePricing(e.target.value)}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value="all">All Pricing</option>
          <option value="free">Free Plan Available</option>
          <option value="trial">Free Trial Available</option>
          <option value="paid">Paid Only</option>
        </select>
      </div>

      {/* Rating Filter */}
      <div className="space-y-2">
        <label className="text-sm font-medium">Minimum Rating</label>
        <select
          value={minRating}
          onChange={(e) => updateRating(Number(e.target.value))}
          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
        >
          <option value={0}>Any Rating</option>
          <option value={4}>4+ Stars</option>
          <option value={4.5}>4.5+ Stars</option>
        </select>
      </div>
    </div>
  )
}
