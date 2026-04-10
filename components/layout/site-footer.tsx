import Link from 'next/link'
import type { Category, Navigation, SiteSettings } from '@/lib/sanity.types'

interface SiteFooterProps {
  categories?: Category[]
  navigation?: Navigation | null
  siteSettings?: SiteSettings | null
}

// Fallback columns used before a Navigation document is published in Sanity
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
    heading: 'Legal',
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

  // Resolve values — CMS wins, fallback used when documents aren't published yet
  const siteName    = siteSettings?.siteName   || 'Verza'
  const tagline     = navigation?.footerTagline || siteSettings?.tagline || FALLBACK_TAGLINE
  const disclosure  = siteSettings?.affiliateDisclosureText || FALLBACK_DISCLOSURE
  const rawCopyright = siteSettings?.copyrightText || `© {year} ${siteName}. All rights reserved.`
  const copyright   = rawCopyright.replace('{year}', String(year))

  // Footer link columns — CMS columns take precedence, then fallback
  const columns = navigation?.footerColumns?.length
    ? navigation.footerColumns
    : FALLBACK_COLUMNS

  // Bottom bar links — CMS wins, otherwise nothing (links are in columns)
  const bottomLinks = navigation?.footerBottomLinks ?? []

  return (
    <footer className="border-t bg-secondary/30 mt-20">
      <div className="container mx-auto px-4 max-w-6xl py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Brand column — always first */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="font-bold text-xl text-primary">
              {siteName}
            </Link>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              {tagline}
            </p>
            {/* Social links */}
            {siteSettings?.socialLinks && (
              <div className="flex gap-3 mt-4 flex-wrap">
                {siteSettings.socialLinks.twitter && (
                  <a href={siteSettings.socialLinks.twitter} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Twitter</a>
                )}
                {siteSettings.socialLinks.linkedin && (
                  <a href={siteSettings.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">LinkedIn</a>
                )}
                {siteSettings.socialLinks.youtube && (
                  <a href={siteSettings.socialLinks.youtube} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">YouTube</a>
                )}
                {siteSettings.socialLinks.instagram && (
                  <a href={siteSettings.socialLinks.instagram} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">Instagram</a>
                )}
                {siteSettings.socialLinks.tiktok && (
                  <a href={siteSettings.socialLinks.tiktok} target="_blank" rel="noopener noreferrer" className="text-xs text-muted-foreground hover:text-primary transition-colors">TikTok</a>
                )}
              </div>
            )}
          </div>

          {/* CMS-controlled or fallback link columns */}
          {columns.map((col) => (
            <div key={col.heading}>
              <h3 className="font-semibold text-sm mb-3">{col.heading}</h3>
              <ul className="flex flex-col gap-2">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      target={(link as any).openInNewTab ? '_blank' : undefined}
                      rel={(link as any).openInNewTab ? 'noopener noreferrer' : undefined}
                      className="text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Auto-generated categories column — only shown when no CMS columns override it */}
          {!navigation?.footerColumns?.length && categories.length > 0 && (
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
        </div>

        {/* Bottom bar */}
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row items-center justify-between gap-4 flex-wrap">
          <p className="text-xs text-muted-foreground">{copyright}</p>

          {/* Bottom bar links from CMS (e.g. Privacy, Terms) */}
          {bottomLinks.length > 0 && (
            <div className="flex gap-4 flex-wrap">
              {bottomLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-xs text-muted-foreground hover:text-primary transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          )}

          <p className="text-xs text-muted-foreground text-right">{disclosure}</p>
        </div>
      </div>
    </footer>
  )
}
