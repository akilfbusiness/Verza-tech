import Link from 'next/link'
import type { Category, Navigation, SiteSettings } from '@/lib/sanity.types'

interface SiteFooterProps {
  categories?: Category[]
  navigation?: Navigation | null
  siteSettings?: SiteSettings | null
}

const FALLBACK_COLUMNS = [
  {
    heading: 'Browse',
    links: [
      { label: 'All Tools',     href: '/tools' },
      { label: 'Reviews',       href: '/reviews' },
      { label: 'Blog',          href: '/blog' },
      { label: 'Submit a Tool', href: '/submit-tool' },
    ],
  },
  {
    heading: 'Company',
    links: [
      { label: 'About',                href: '/about' },
      { label: 'Privacy Policy',       href: '/privacy' },
      { label: 'Terms of Use',         href: '/terms' },
      { label: 'Affiliate Disclosure', href: '/affiliate-disclosure' },
    ],
  },
]

const FALLBACK_TAGLINE =
  'Honest SaaS and AI tool reviews to help you make smarter software decisions.'

const FALLBACK_DISCLOSURE =
  'Some links on this site are affiliate links. We may earn a commission at no extra cost to you.'

export function SiteFooter({ categories = [], navigation, siteSettings }: SiteFooterProps) {
  const year = new Date().getFullYear()

  const siteName    = siteSettings?.siteName   || 'Verza'
  const tagline     = navigation?.footerTagline || siteSettings?.tagline || FALLBACK_TAGLINE
  const disclosure  = siteSettings?.affiliateDisclosureText || FALLBACK_DISCLOSURE
  const rawCopyright = siteSettings?.copyrightText || `© {year} ${siteName}. All rights reserved.`
  const copyright   = rawCopyright.replace('{year}', String(year))
  const columns     = navigation?.footerColumns?.length ? navigation.footerColumns : FALLBACK_COLUMNS
  const bottomLinks = navigation?.footerBottomLinks ?? []

  return (
    <footer className="border-t border-border">
      <div className="container mx-auto px-6 max-w-7xl py-20">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">

          {/* Brand column */}
          <div className="col-span-2 md:col-span-1">
            <Link
              href="/"
              className="text-xl font-medium tracking-tight text-foreground hover:text-primary transition-colors duration-200 block mb-4"
              style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.5rem' }}
            >
              {siteName}
            </Link>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">{tagline}</p>
            {siteSettings?.socialLinks && (
              <div className="flex gap-5 flex-wrap">
                {siteSettings.socialLinks.twitter && (
                  <a href={siteSettings.socialLinks.twitter} target="_blank" rel="noopener noreferrer"
                    className="text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                    Twitter
                  </a>
                )}
                {siteSettings.socialLinks.linkedin && (
                  <a href={siteSettings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer"
                    className="text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                    LinkedIn
                  </a>
                )}
                {siteSettings.socialLinks.youtube && (
                  <a href={siteSettings.socialLinks.youtube} target="_blank" rel="noopener noreferrer"
                    className="text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                    YouTube
                  </a>
                )}
                {siteSettings.socialLinks.instagram && (
                  <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer"
                    className="text-xs tracking-wide text-muted-foreground hover:text-foreground transition-colors">
                    Instagram
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground mb-5">
                {col.heading}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={(link as { openInNewTab?: boolean }).openInNewTab ? '_blank' : undefined}
                      rel={(link as { openInNewTab?: boolean }).openInNewTab ? 'noopener noreferrer' : undefined}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Auto categories */}
          {!navigation?.footerColumns?.length && categories.length > 0 && (
            <div>
              <h3 className="text-xs font-semibold tracking-[0.2em] uppercase text-foreground mb-5">
                Categories
              </h3>
              <ul className="flex flex-col gap-3">
                {categories.slice(0, 6).map((cat) => (
                  <li key={cat._id}>
                    <Link
                      href={`/blog/category/${cat.slug.current}`}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors duration-200"
                    >
                      {cat.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border mt-16 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-muted-foreground">{copyright}</p>
          {bottomLinks.length > 0 && (
            <div className="flex gap-6 flex-wrap">
              {bottomLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-foreground transition-colors duration-200"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}
          <p className="text-xs text-muted-foreground text-right max-w-xs">{disclosure}</p>
        </div>
      </div>
    </footer>
  )
}
