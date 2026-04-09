// Updated Badge - Shows content freshness for AI engines
// Critical for AI engines to determine data recency

type UpdatedBadgeProps = {
  publishedAt?: string
  updatedAt?: string
  format?: 'short' | 'long' | 'relative'
}

export function UpdatedBadge({ publishedAt, updatedAt, format = 'long' }: UpdatedBadgeProps) {
  if (!publishedAt && !updatedAt) return null

  const getRelativeTime = (date: Date) => {
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

    if (diffDays === 0) return 'today'
    if (diffDays === 1) return 'yesterday'
    if (diffDays < 7) return `${diffDays} days ago`
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr)
    
    if (format === 'relative') {
      return getRelativeTime(date)
    }
    
    if (format === 'short') {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: 'numeric' 
      })
    }
    
    return date.toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric',
      year: 'numeric' 
    })
  }

  const displayDate = updatedAt || publishedAt
  const label = updatedAt && updatedAt !== publishedAt ? 'Updated' : 'Published'

  return (
    <div className="flex items-center gap-2 text-sm text-muted-foreground">
      <span className="font-medium">{label}:</span>
      <time dateTime={displayDate}>
        {formatDate(displayDate!)}
      </time>
    </div>
  )
}
