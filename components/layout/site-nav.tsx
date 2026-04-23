'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Menu, X, ChevronDown, ChevronRight } from 'lucide-react'
import type { Category, Navigation, SiteSettings, NavItem } from '@/lib/sanity.types'

// Reads the data-dark-hero attribute set by HeroSection when a dark hero is mounted
function useDarkHero() {
  const [dark, setDark] = useState(false)
  useEffect(() => {
    const check = () => setDark(document.body.hasAttribute('data-dark-hero'))
    check()
    const observer = new MutationObserver(check)
    observer.observe(document.body, { attributes: true, attributeFilter: ['data-dark-hero'] })
    return () => observer.disconnect()
  }, [])
  return dark
}

interface SiteNavProps {
  categories?: Category[]
  navigation?: Navigation | null
  siteSettings?: SiteSettings | null
}

const FALLBACK_NAV_ITEMS: NavItem[] = [
  { label: 'Tools',       href: '/tools' },
  { label: 'Reviews',     href: '/reviews' },
  { label: 'Blog',        isBlogDropdown: true },
  { label: 'Submit Tool', href: '/submit-tool' },
]

const FALLBACK_CTA = { label: 'Browse Reviews', link: '/blog', style: 'primary' as const }

const HERO_BG = '#07080c'
const ACCENT  = 'oklch(0.72 0.1 255)'

export function SiteNav({ categories = [], navigation, siteSettings }: SiteNavProps) {
  const [mobileOpen,    setMobileOpen]    = useState(false)
  const [openDropdown,  setOpenDropdown]  = useState<string | null>(null)
  const [scrolled,      setScrolled]      = useState(false)
  const pathname  = usePathname()
  const heroIsDark = useDarkHero()

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const isDark = heroIsDark && !scrolled

  const isActive = (href?: string) =>
    href ? pathname === href || pathname.startsWith(href + '/') : false

  const siteName   = siteSettings?.siteName || 'Verza'
  const navItems   = navigation?.headerItems?.length ? navigation.headerItems : FALLBACK_NAV_ITEMS
  const ctaEnabled = navigation ? (navigation.headerCtaEnabled ?? true) : true
  const ctaLabel   = navigation?.headerCtaLabel || FALLBACK_CTA.label
  const ctaLink    = navigation?.headerCtaLink  || FALLBACK_CTA.link

  const navCategories = categories.filter((cat) => cat.showInNav !== false).slice(0, 8)

  function closeAll() {
    setOpenDropdown(null)
    setMobileOpen(false)
  }

  function renderNavItem(item: NavItem) {
    const hasBlogDropdown   = item.isBlogDropdown
    const hasManualDropdown = !hasBlogDropdown && item.dropdown && item.dropdown.length > 0
    const hasDropdown       = hasBlogDropdown || hasManualDropdown
    const key               = item.label

    const baseLinkCls = isDark
      ? 'relative px-1 py-2 text-sm tracking-wide transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:transition-all after:duration-300 hover:after:w-full'
      : 'relative px-1 py-2 text-sm tracking-wide transition-colors duration-200 after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-primary after:transition-all after:duration-300 hover:after:w-full'

    if (!hasDropdown) {
      const active = isActive(item.href)
      return (
        <Link
          key={key}
          href={item.href || '#'}
          target={item.openInNewTab ? '_blank' : undefined}
          rel={item.openInNewTab ? 'noopener noreferrer' : undefined}
          className={`${baseLinkCls} ${
            isDark
              ? active
                ? 'text-white after:w-full'
                : 'text-white/55 hover:text-white after:bg-white/40'
              : active
                ? 'text-primary after:w-full'
                : 'text-foreground/70 hover:text-foreground'
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
          className={`flex items-center gap-1 px-1 py-2 text-sm tracking-wide transition-colors duration-200 ${
            isDark
              ? isActive(item.href) ? 'text-white' : 'text-white/55 hover:text-white'
              : isActive(item.href) ? 'text-primary' : 'text-foreground/70 hover:text-foreground'
          }`}
          aria-expanded={isOpen}
          aria-haspopup="true"
        >
          {item.label}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
            aria-hidden="true"
          />
        </button>

        {isOpen && (
          <div className="absolute top-full left-0 mt-2 w-60 bg-background border border-border shadow-lg py-1.5 z-50">
            {hasBlogDropdown && (
              <>
                <Link
                  href="/blog"
                  className="flex items-center px-5 py-2.5 text-sm hover:bg-secondary transition-colors font-medium"
                  onClick={closeAll}
                >
                  All Articles
                  <ChevronRight className="w-3.5 h-3.5 ml-auto text-muted-foreground" aria-hidden="true" />
                </Link>
                {navCategories.length > 0 && (
                  <>
                    <div className="border-t my-1.5 mx-4" />
                    <p className="px-5 py-1 text-xs font-semibold text-muted-foreground uppercase tracking-widest">
                      Categories
                    </p>
                    {navCategories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/blog/category/${cat.slug.current}`}
                        className="block px-5 py-2 text-sm hover:bg-secondary transition-colors"
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
            {hasManualDropdown && item.dropdown!.map((sub) => (
              <Link
                key={sub.href}
                href={sub.href}
                target={sub.openInNewTab ? '_blank' : undefined}
                rel={sub.openInNewTab ? 'noopener noreferrer' : undefined}
                className="block px-5 py-2 text-sm hover:bg-secondary transition-colors font-medium"
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
    <header
      className="sticky top-0 z-50 transition-all duration-400"
      style={
        isDark
          ? { background: HERO_BG, borderBottom: '1px solid rgba(255,255,255,0.06)' }
          : scrolled
            ? { background: 'rgba(255,255,255,0.98)', backdropFilter: 'blur(12px)', borderBottom: '1px solid var(--border)', boxShadow: '0 1px 0 var(--border)' }
            : { background: 'var(--background)', borderBottom: '1px solid var(--border)' }
      }
    >
      <div className="container mx-auto px-6 max-w-7xl">
        <div className="flex items-center justify-between py-4">
          {/* Logo */}
          <Link
            href="/"
            className="font-medium tracking-tight transition-colors duration-300"
            style={{
              fontFamily: 'var(--font-cormorant), Georgia, serif',
              fontSize: '1.5rem',
              color: isDark ? '#ffffff' : 'var(--foreground)',
            }}
          >
            {siteName}
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8" aria-label="Main navigation">
            {navItems.map(renderNavItem)}
          </nav>

          {/* CTA */}
          {ctaEnabled && (
            <div className="hidden md:flex items-center">
              <Link
                href={ctaLink}
                className="px-5 py-2.5 text-sm tracking-wide transition-all duration-300"
                style={
                  isDark
                    ? { background: ACCENT, color: HERO_BG }
                    : { border: '1px solid var(--primary)', color: 'var(--primary)' }
                }
                onMouseEnter={(e) => {
                  if (!isDark) {
                    ;(e.currentTarget as HTMLAnchorElement).style.background = 'var(--primary)'
                    ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary-foreground)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isDark) {
                    ;(e.currentTarget as HTMLAnchorElement).style.background = ''
                    ;(e.currentTarget as HTMLAnchorElement).style.color = 'var(--primary)'
                  }
                }}
              >
                {ctaLabel}
              </Link>
            </div>
          )}

          {/* Mobile toggle */}
          <button
            className="md:hidden p-2 transition-colors"
            style={{ color: isDark ? 'rgba(255,255,255,0.6)' : 'var(--foreground)' }}
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
        <div className="md:hidden border-t border-border bg-background">
          <nav
            className="container mx-auto px-6 py-6 max-w-7xl flex flex-col gap-1"
            aria-label="Mobile navigation"
          >
            {navItems.map((item) => {
              if (item.isBlogDropdown) {
                return (
                  <div key={item.label}>
                    <Link
                      href="/blog"
                      className="block px-2 py-3 text-sm font-medium border-b border-border/50"
                      onClick={closeAll}
                    >
                      Blog — All Articles
                    </Link>
                    {navCategories.map((cat) => (
                      <Link
                        key={cat._id}
                        href={`/blog/category/${cat.slug.current}`}
                        className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                        className="block px-2 py-3 text-sm font-medium border-b border-border/50"
                        onClick={closeAll}
                      >
                        {item.label}
                      </Link>
                    )}
                    {item.dropdown.map((sub) => (
                      <Link
                        key={sub.href}
                        href={sub.href}
                        className="block px-4 py-2.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
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
                  className="block px-2 py-3 text-sm font-medium border-b border-border/50 last:border-0"
                  onClick={closeAll}
                >
                  {item.label}
                </Link>
              )
            })}
            {ctaEnabled && (
              <div className="pt-4">
                <Link
                  href={ctaLink}
                  className="block w-full text-center px-5 py-3 text-sm tracking-wide border border-primary text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
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
