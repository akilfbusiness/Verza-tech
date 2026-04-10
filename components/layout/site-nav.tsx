'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown } from 'lucide-react'
import type { Category } from '@/lib/sanity.types'

interface SiteNavProps {
  categories?: Category[]
}

export function SiteNav({ categories = [] }: SiteNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [blogDropdownOpen, setBlogDropdownOpen] = useState(false)
  const pathname = usePathname()

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/')

  const navCategories = categories.filter((cat: any) => cat.showInNav !== false).slice(0, 6)

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            Verza
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            <Link
              href="/tools"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/tools') ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-secondary'
              }`}
            >
              Tools
            </Link>
            <Link
              href="/reviews"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/reviews') ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-secondary'
              }`}
            >
              Reviews
            </Link>

            {/* Blog dropdown */}
            <div className="relative">
              <button
                onClick={() => setBlogDropdownOpen(!blogDropdownOpen)}
                onBlur={() => setTimeout(() => setBlogDropdownOpen(false), 150)}
                className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  isActive('/blog') ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-secondary'
                }`}
                aria-expanded={blogDropdownOpen}
                aria-haspopup="true"
              >
                Blog
                <ChevronDown className={`w-4 h-4 transition-transform ${blogDropdownOpen ? 'rotate-180' : ''}`} />
              </button>

              {blogDropdownOpen && (
                <div className="absolute top-full left-0 mt-1 w-52 bg-background border rounded-lg shadow-lg py-1 z-50">
                  <Link
                    href="/blog"
                    className="block px-4 py-2 text-sm hover:bg-secondary transition-colors font-medium"
                    onClick={() => setBlogDropdownOpen(false)}
                  >
                    All Articles
                  </Link>
                  {navCategories.length > 0 && (
                    <>
                      <div className="border-t my-1" />
                      {navCategories.map((cat) => (
                        <Link
                          key={cat._id}
                          href={`/blog/category/${cat.slug.current}`}
                          className="block px-4 py-2 text-sm hover:bg-secondary transition-colors"
                          onClick={() => setBlogDropdownOpen(false)}
                        >
                          {cat.name}
                        </Link>
                      ))}
                    </>
                  )}
                </div>
              )}
            </div>

            <Link
              href="/submit-tool"
              className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                isActive('/submit-tool') ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-secondary'
              }`}
            >
              Submit Tool
            </Link>
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link
              href="/blog"
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors"
            >
              Browse Reviews
            </Link>
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-secondary transition-colors"
            onClick={() => setMobileOpen(!mobileOpen)}
            aria-label="Toggle navigation menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background">
          <nav className="container mx-auto px-4 py-4 max-w-6xl flex flex-col gap-1">
            <Link
              href="/tools"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Tools
            </Link>
            <Link
              href="/reviews"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Reviews
            </Link>
            <Link
              href="/blog"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Blog - All Articles
            </Link>
            {navCategories.map((cat) => (
              <Link
                key={cat._id}
                href={`/blog/category/${cat.slug.current}`}
                className="px-3 py-2 pl-6 rounded-md text-sm text-muted-foreground hover:bg-secondary transition-colors"
                onClick={() => setMobileOpen(false)}
              >
                {cat.name}
              </Link>
            ))}
            <Link
              href="/submit-tool"
              className="px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
              onClick={() => setMobileOpen(false)}
            >
              Submit Tool
            </Link>
            <div className="pt-2 border-t mt-2">
              <Link
                href="/blog"
                className="block w-full text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                onClick={() => setMobileOpen(false)}
              >
                Browse Reviews
              </Link>
            </div>
          </nav>
        </div>
      )}
    </header>
  )
}
