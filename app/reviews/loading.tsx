export default function ReviewsLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-12 max-w-6xl">
          <div className="h-10 w-64 bg-muted animate-pulse rounded-md mb-4" />
          <div className="h-6 w-96 bg-muted animate-pulse rounded-md" />
        </div>
      </div>
      
      <div className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="space-y-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <article key={i} className="border rounded-lg p-8">
              <div className="flex items-start gap-6 mb-6">
                <div className="w-16 h-16 bg-muted animate-pulse rounded-xl flex-shrink-0" />
                <div className="flex-1 space-y-3">
                  <div className="h-7 bg-muted animate-pulse rounded w-3/4" />
                  <div className="h-5 bg-muted animate-pulse rounded w-1/2" />
                </div>
                <div className="w-16 text-center space-y-2">
                  <div className="h-10 bg-muted animate-pulse rounded mx-auto" />
                  <div className="h-4 bg-muted animate-pulse rounded" />
                </div>
              </div>
              <div className="space-y-2 mb-6">
                <div className="h-4 bg-muted animate-pulse rounded w-full" />
                <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                <div className="h-4 bg-muted animate-pulse rounded w-4/5" />
              </div>
              <div className="flex items-center gap-4">
                <div className="h-8 w-8 bg-muted animate-pulse rounded-full" />
                <div className="h-4 w-32 bg-muted animate-pulse rounded" />
                <div className="h-4 w-24 bg-muted animate-pulse rounded" />
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}
