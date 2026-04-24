import { Metadata } from 'next'
import Link from 'next/link'
import { PageHero } from '@/components/layout/page-hero'
import { FadeIn } from '@/components/animations/fade-in'

const HERO_BG = '#07080c'
const ACCENT  = 'oklch(0.72 0.1 255)'

export const metadata: Metadata = {
  title: 'Contact Verza - Get in Touch',
  description: 'Contact Verza for tool review suggestions, partnerships, or general enquiries. Based in Australia, serving businesses worldwide.',
}

const TOPICS = [
  "Tools you'd like us to review",
  'Feedback on our existing reviews',
  'Partnership opportunities',
  'General questions or suggestions',
]

const LINKS = [
  { label: 'About Us', href: '/about' },
  { label: 'Browse Tools', href: '/tools' },
  { label: 'Read Reviews', href: '/reviews' },
  { label: 'Submit a Tool', href: '/submit-tool' },
]

export default function ContactPage() {
  return (
    <>
      <PageHero
        label="Contact"
        title="Get in Touch"
        subtitle="Have questions or suggestions? We'd love to hear from you."
        breadcrumbs={[{ label: 'Contact', href: '/contact' }]}
      />

      {/* Main contact section */}
      <section className="py-24 md:py-36 border-t border-border bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16">
            <FadeIn direction="left">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary mb-8">
                What we'd love to hear about
              </p>
              <ul className="space-y-0 mb-12">
                {TOPICS.map((topic) => (
                  <li key={topic} className="flex items-start gap-4 border-b border-border py-5 first:border-t">
                    <span className="text-primary mt-0.5 text-sm shrink-0">→</span>
                    <span className="text-sm text-muted-foreground">{topic}</span>
                  </li>
                ))}
              </ul>
              <p className="text-xs text-muted-foreground tracking-wide">
                We typically respond within 1–2 business days.
              </p>
            </FadeIn>

            <FadeIn direction="right" delay={0.15}>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary mb-8">
                Reach Us
              </p>

              <div className="border border-border p-8 mb-px">
                <h3
                  className="font-light mb-3"
                  style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.2rem' }}
                >
                  Email
                </h3>
                <a
                  href="mailto:hello@verza.com"
                  className="text-primary hover:text-primary/70 transition-colors text-sm font-medium"
                >
                  hello@verza.com
                </a>
              </div>

              <div className="border border-border p-8">
                <h3
                  className="font-light mb-6"
                  style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.2rem' }}
                >
                  Quick Links
                </h3>
                <ul className="space-y-4">
                  {LINKS.map((link) => (
                    <li key={link.href}>
                      <Link
                        href={link.href}
                        className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center gap-3"
                      >
                        <span className="text-primary/40 text-xs">→</span>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </FadeIn>
          </div>
        </div>
      </section>

      {/* Vendors CTA — dark */}
      <section style={{ background: HERO_BG }} className="py-24 md:py-36 border-t border-border">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn>
            <div className="max-w-2xl">
              <p
                className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-5"
                style={{ color: ACCENT }}
              >
                For Tool Vendors
              </p>
              <h2
                className="text-white font-light leading-tight mb-6"
                style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                  letterSpacing: '-0.01em',
                }}
              >
                Want your product reviewed?
              </h2>
              <p className="text-sm leading-relaxed mb-10 max-w-lg" style={{ color: 'rgba(255,255,255,0.45)' }}>
                If you&apos;re a tool vendor interested in having your product reviewed, reach out with
                information about your tool and what makes it unique. We review all submissions and
                select tools that would genuinely benefit our audience.
              </p>
              <a
                href="mailto:hello@verza.com"
                className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase transition-colors hover:opacity-70"
                style={{ color: ACCENT }}
              >
                Reach out <span>→</span>
              </a>
            </div>
          </FadeIn>
        </div>
      </section>
    </>
  )
}
