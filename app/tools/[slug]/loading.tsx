export default function ToolLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <div className="flex items-start gap-6">
            <div className="w-20 h-20 bg-muted animate-pulse rounded-xl flex-shrink-0" />
            <div className="flex-1 space-y-4">
              <div className="h-10 bg-muted animate-pulse rounded w-2/3" />
              <div className="h-6 bg-muted animate-pulse rounded w-3/4" />
              <div className="flex gap-2">
                <div className="h-8 w-24 bg-muted animate-pulse rounded-full" />
                <div className="h-8 w-32 bg-muted animate-pulse rounded-full" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="space-y-12">
          {Array.from({ length: 4 }).map((_, i) => (
            <section key={i} className="space-y-4">
              <div className="h-8 bg-muted animate-pulse rounded w-48" />
              <div className="space-y-2">
                <div className="h-4 bg-muted animate-pulse rounded w-full" />
                <div className="h-4 bg-muted animate-pulse rounded w-5/6" />
                <div className="h-4 bg-muted animate-pulse rounded w-4/5" />
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  )
}
