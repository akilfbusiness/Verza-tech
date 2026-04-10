import Link from 'next/link'
import type { Category } from '@/lib/sanity.types'

interface SiteFooterProps {
  categories?: Category[]
}

export function SiteFooter({ categories = [] }: SiteFooterProps) {
  const year = new Date().getFullYear()

  return (
    <footer className="border-t bg-secondary/30 mt-20">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-bold text-xl text-primary">
              Verza
            </Link>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              Honest SaaS and AI tool reviews to help you make smarter software decisions.
            </p>
          </div>

          {/* Browse */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Browse</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/tools" className="text-sm text-muted-foreground hover:text-primary transition-colors">All Tools</Link></li>
              <li><Link href="/reviews" className="text-sm text-muted-foreground hover:text-primary transition-colors">Reviews</Link></li>
              <li><Link href="/blog" className="text-sm text-muted-foreground hover:text-primary transition-colors">Blog</Link></li>
              <li><Link href="/submit-tool" className="text-sm text-muted-foreground hover:text-primary transition-colors">Submit a Tool</Link></li>
            </ul>
          </div>

          {/* Categories */}
          {categories.length > 0 && (
            <div>
              <h3 className="font-semibold text-sm mb-3">Categories</h3>
              <ul className="flex flex-col gap-2">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat._id}>
                    <Link
                      href={`/blog/category/${cat.slug.current}`}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Legal */}
          <div>
            <h3 className="font-semibold text-sm mb-3">Legal</h3>
            <ul className="flex flex-col gap-2">
              <li><Link href="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">About</Link></li>
              <li><Link href="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">Terms of Use</Link></li>
              <li><Link href="/affiliate-disclosure" className="text-sm text-muted-foreground hover:text-primary transition-colors">Affiliate Disclosure</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-xs text-muted-foreground">
            &copy; {year} Verza. All rights reserved. Based in Australia.
          </p>
          <p className="text-xs text-muted-foreground">
            Some links on this site are affiliate links. We may earn a commission at no extra cost to you.
          </p>
        </div>
      </div>
    </footer>
  )
}
