'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import type { Category, Navigation, SiteSettings, NavItem } from '@/lib/sanity.types'

interface SiteNavProps {
  categories?: Category[]
  navigation?: Navigation | null
  siteSettings?: SiteSettings | null
}

// Hardcoded fallback nav items — used when no Navigation document exists in Sanity yet
const FALLBACK_NAV_ITEMS: NavItem[] = [
  { label: 'Tools',       href: '/tools' },
  { label: 'Reviews',     href: '/reviews' },
  { label: 'Blog',        isBlogDropdown: true },
  { label: 'Submit Tool', href: '/submit-tool' },
]

const FALLBACK_CTA = { label: 'Browse Reviews', link: '/blog', style: 'primary' as const }

export function SiteNav({ categories = [], navigation, siteSettings }: SiteNavProps) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [openDropdown, setOpenDropdown] = useState<string | null>(null)
  const pathname = usePathname()

  const isActive = (href?: string) =>
    href ? pathname === href || pathname.startsWith(href + '/') : false

  // Resolve data — CMS wins, fallback used when CMS document isn't published yet
  const siteName  = siteSettings?.siteName || 'Verza'
  const navItems  = navigation?.headerItems?.length
    ? navigation.headerItems
    : FALLBACK_NAV_ITEMS

  const ctaEnabled = navigation ? (navigation.headerCtaEnabled ?? true) : true
  const ctaLabel   = navigation?.headerCtaLabel || FALLBACK_CTA.label
  const ctaLink    = navigation?.headerCtaLink  || FALLBACK_CTA.link
  const ctaStyle   = navigation?.headerCtaStyle || FALLBACK_CTA.style

  const ctaClassName =
    ctaStyle === 'outline'
      ? 'px-4 py-2 rounded-lg border-2 border-primary text-primary text-sm font-medium hover:bg-primary/10 transition-colors'
      : ctaStyle === 'ghost'
      ? 'px-4 py-2 rounded-lg text-primary text-sm font-medium hover:bg-secondary transition-colors'
      : 'px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-colors'

  const navCategories = categories
    .filter((cat) => cat.showInNav !== false)
    .slice(0, 8)

  function closeAll() {
    setOpenDropdown(null)
    setMobileOpen(false)
  }

  function renderNavItem(item: NavItem) {
    const hasBlogDropdown = item.isBlogDropdown
    const hasManualDropdown = !hasBlogDropdown && item.dropdown && item.dropdown.length > 0
    const hasDropdown = hasBlogDropdown || hasManualDropdown
    const key = item.label

    if (!hasDropdown) {
      return (
        <Link
          key={key}
          href={item.href || '#'}
          target={item.openInNewTab ? '_blank' : undefined}
          rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive(item.href)
              ? 'text-primary bg-primary/10'
              : 'text-foreground hover:text-primary hover:bg-secondary'
          }`}
        >
          {item.label}
        </Link>
      )
    }

    const isOpen = openDropdown === key

    return (
      <div key={key} className="relative">
        <button
          onClick={() => setOpenDropdown(isOpen ? null : key)}
          onBlur={() => setTimeout(() => setOpenDropdown(null), 150)}
          className={`flex items-center gap-1 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
            isActive(item.href) ? 'text-primary bg-primary/10' : 'text-foreground hover:text-primary hover:bg-secondary'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {item.label}
          <ChevronDown className={`w-4 h-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} aria-hidden="true" />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-1 w-64 bg-background border rounded-xl shadow-xl py-2 z-50">
            {/* Blog category dropdown */}
            {hasBlogDropdown && (
              <>
                <Link
                  href="/blog"
                  className="flex items-center px-4 py-2.5 mx-1 text-sm hover:bg-secondary transition-colors font-semibold rounded-lg"
                  onClick={closeAll}
                >
                  All Articles
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" aria-hidden="true" />
                </Link>
                {navCategories.length > 0 && (
                  <>
                    <div className="border-t my-2 mx-4" />
                    <p className="px-4 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Browse by Category
                    </p>
                    {navCategories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/blog/category/${cat.slug.current}`}
                        className="block px-4 py-2 mx-1 text-sm hover:bg-secondary transition-colors rounded-lg"
                        onClick={closeAll}
                      >
                        <span className="font-medium">{cat.name}</span>
                        {cat.description && (
                          <span className="block text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {cat.description}
                          </span>
                        )}
                      </Link>
                    ))}
                  </>
                )}
              </>
            )}

            {/* Manual dropdown items */}
            {hasManualDropdown && item.dropdown!.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                target={sub.openInNewTab ? '_blank' : undefined}
                rel={sub.openInNewTab ? 'noopener noreferrer' : undefined}
                className="block px-4 py-2 mx-1 text-sm hover:bg-secondary transition-colors rounded-lg font-medium"
                onClick={closeAll}
              >
                {sub.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    )
  }

  return (
    <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex items-center justify-between h-16">
          {/* Logo / Site Name */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            {siteName}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1" aria-label="Main navigation">
            {navItems.map(renderNavItem)}
          </nav>

          {/* Header CTA */}
          {ctaEnabled && (
            <div className="hidden md:flex items-center gap-3">
              <Link href={ctaLink} className={ctaClassName}>
                {ctaLabel}
              </Link>
            </div>
          )}

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
          <nav className="container mx-auto px-4 py-4 max-w-6xl flex flex-col gap-1" aria-label="Mobile navigation">
            {navItems.map((item) => {
              if (item.isBlogDropdown) {
                return (
                  <div key={item.label}>
                    <Link
                      href="/blog"
                      className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                      onClick={closeAll}
                    >
                      Blog — All Articles
                    </Link>
                    {navCategories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/blog/category/${cat.slug.current}`}
                        className="block px-3 py-2 pl-6 rounded-md text-sm text-muted-foreground hover:bg-secondary transition-colors"
                        onClick={closeAll}
                      >
                        {cat.name}
                      </Link>
                    ))}
                  </div>
                )
              }
              if (item.dropdown?.length) {
                return (
                  <div key={item.label}>
                    {item.href && (
                      <Link
                        href={item.href}
                        className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                        onClick={closeAll}
                      >
                        {item.label}
                      </Link>
                    )}
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-3 py-2 pl-6 rounded-md text-sm text-muted-foreground hover:bg-secondary transition-colors"
                        onClick={closeAll}
                      >
                        {sub.label}
                      </Link>
                    ))}
                  </div>
                )
              }
              return (
                <Link
                  key={item.label}
                  href={item.href || '#'}
                  target={item.openInNewTab ? '_blank' : undefined}
                  className="block px-3 py-2 rounded-md text-sm font-medium hover:bg-secondary transition-colors"
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              )
            })}

            {ctaEnabled && (
              <div className="pt-2 border-t mt-2">
                <Link
                  href={ctaLink}
                  className="block w-full text-center px-4 py-2 rounded-lg bg-primary text-primary-foreground text-sm font-medium"
                  onClick={closeAll}
                >
                  {ctaLabel}
                </Link>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
