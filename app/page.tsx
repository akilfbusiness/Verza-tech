import { validateSanityConfig } from '@/lib/env'

export default function HomePage() {
  const sanityConfigured = validateSanityConfig()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8">
      <div className="max-w-2xl text-center space-y-6">
        <h1 className="text-4xl font-bold tracking-tight">
          Verza - Phase 1 Complete
        </h1>
        
        <p className="text-lg text-muted-foreground">
          Foundation and core architecture are ready. Next.js 16 with Sanity CMS integration.
        </p>

        <div className="rounded-lg border bg-card p-6 text-left space-y-4">
          <h2 className="text-xl font-semibold">Sanity Configuration Status</h2>
          
          {sanityConfigured ? (
            <div className="flex items-center gap-2 text-green-600">
              <svg
                className="h-5 w-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
              <span>Sanity is configured and ready</span>
            </div>
          ) : (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-600">
                <svg
                  className="h-5 w-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
                <span>Sanity needs configuration</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Follow the setup guide in <code className="rounded bg-muted px-1.5 py-0.5">/sanity/README.md</code>
              </p>
            </div>
          )}

          <div className="pt-4 space-y-2 text-sm">
            <h3 className="font-medium">Next Steps:</h3>
            <ol className="list-decimal list-inside space-y-1 text-muted-foreground">
              <li>Set up your Sanity project and get credentials</li>
              <li>Add environment variables to .env.local</li>
              <li>Deploy your Sanity Studio</li>
              <li>Create your first content</li>
            </ol>
          </div>
        </div>

        <div className="pt-4 text-sm text-muted-foreground">
          <p>
            Phase 1 includes: Next.js 16 setup, Sanity integration, metadata optimization, 
            robots.txt with AI crawler rules, and dynamic sitemap generation.
          </p>
        </div>
      </div>
    </main>
  )
}
