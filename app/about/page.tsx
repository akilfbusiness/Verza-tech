import { Metadata } from 'next'
import Link from 'next/link'
import { generateWebPageSchema, renderJsonLd } from '@/lib/schema'
import { PageHero } from '@/components/layout/page-hero'
import { FadeIn } from '@/components/animations/fade-in'
import { StaggerChildren } from '@/components/animations/stagger-children'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'

export const metadata: Metadata = {
  title: 'About Verza | SaaS & AI Tool Reviews',
  description: 'Learn about Verza — an independent platform helping businesses worldwide discover the best SaaS and AI tools through expert reviews and comparisons.',
  alternates: { canonical: `${siteUrl}/about` },
}

const HERO_BG = '#07080c'
const ACCENT  = 'oklch(0.72 0.1 255)'

const PILLARS = [
  { num: '01', label: 'Expert Reviews', body: 'Our team tests each tool thoroughly — features, pricing, and real-world performance.' },
  { num: '02', label: 'Honest Comparisons', body: 'Side-by-side analysis highlights strengths and weaknesses so you can choose with clarity.' },
  { num: '03', label: 'Regular Updates', body: 'We keep reviews current as the software landscape evolves and tools change.' },
  { num: '04', label: 'Transparent Process', body: 'Affiliate relationships are clearly disclosed. Our editorial opinions remain our own.' },
]

const STANDARDS = [
  { label: 'Hands-on Testing', body: 'We test each tool ourselves before writing a word.' },
  { label: 'Editorial Independence', body: 'Reviews reflect genuine opinions and experiences — not vendor relationships.' },
  { label: 'Comprehensive Analysis', body: 'We cover features, pricing, pros, cons, and alternatives in every review.' },
  { label: 'Plain Language', body: 'No jargon, no marketing speak. Just clear, useful information.' },
]

export default function AboutPage() {
  const webPageSchema = generateWebPageSchema(
    'About Verza',
    'Independent SaaS and AI tool reviews, comparisons, and guides to help you choose the right software.',
    `${siteUrl}/about`
  )

  return (
    <>
      {renderJsonLd(webPageSchema)}

      <PageHero
        label="About"
        title="About Verza"
        subtitle="Helping businesses worldwide discover the right tools through independent, expert-driven reviews."
        breadcrumbs={[{ label: 'About', href: '/about' }]}
      />

      {/* Mission */}
      <section className="py-24 md:py-36 border-t border-border bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16 items-start">
            <FadeIn direction="left">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary mb-6">
                Our Mission
              </p>
              <h2
                className="font-light leading-tight mb-6"
                style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  fontSize: 'clamp(2rem, 3.5vw, 3rem)',
                  letterSpacing: '-0.01em',
                }}
              >
                Making software selection simple and transparent
              </h2>
              <p className="text-muted-foreground leading-relaxed mb-4 text-sm">
                Based in Australia and serving businesses worldwide, Verza cuts through the noise of
                thousands of SaaS and AI tools to bring you honest, in-depth reviews and comparisons
                that help you make informed decisions.
              </p>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Whether you&apos;re a startup in Sydney, an enterprise in Melbourne, or a business
                anywhere in the world — we provide the insights you need to choose software with confidence.
              </p>
            </FadeIn>

            <StaggerChildren className="grid grid-cols-2 gap-px bg-border">
              {PILLARS.map((p) => (
                <div key={p.num} className="bg-background p-6">
                  <p
                    className="mb-3 font-light"
                    style={{
                      fontFamily: 'var(--font-display), sans-serif',
                      fontSize: '2rem',
                      color: 'var(--primary)',
                      opacity: 0.3,
                    }}
                  >
                    {p.num}
                  </p>
                  <h3
                    className="font-medium mb-2"
                    style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.05rem' }}
                  >
                    {p.label}
                  </h3>
                  <p className="text-xs text-muted-foreground leading-relaxed">{p.body}</p>
                </div>
              ))}
            </StaggerChildren>
          </div>
        </div>
      </section>

      {/* Standards — dark */}
      <section style={{ background: HERO_BG }} className="py-24 md:py-36 border-t border-border">
        <div className="container mx-auto px-6 max-w-7xl">
          <FadeIn>
            <p
              className="text-[10px] font-semibold tracking-[0.25em] uppercase mb-5"
              style={{ color: ACCENT }}
            >
              Our Standards
            </p>
            <h2
              className="text-white font-light leading-tight mb-16 max-w-xl"
              style={{
                fontFamily: 'var(--font-display), sans-serif',
                fontSize: 'clamp(1.8rem, 3vw, 2.6rem)',
                letterSpacing: '-0.01em',
              }}
            >
              Every review is held to the same bar
            </h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 gap-px bg-white/[0.05]">
            {STANDARDS.map((s) => (
              <div key={s.label} className="p-8" style={{ background: HERO_BG }}>
                <div className="flex items-start gap-4">
                  <span className="mt-0.5 text-sm shrink-0" style={{ color: ACCENT }}>✓</span>
                  <div>
                    <h3
                      className="font-medium text-white mb-2"
                      style={{ fontFamily: 'var(--font-display), sans-serif', fontSize: '1.1rem' }}
                    >
                      {s.label}
                    </h3>
                    <p className="text-sm leading-relaxed" style={{ color: 'rgba(255,255,255,0.45)' }}>
                      {s.body}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Disclosure + Location — light */}
      <section className="py-24 md:py-36 border-t border-border bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-2 gap-16">
            <FadeIn direction="left">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary mb-5">
                Affiliate Disclosure
              </p>
              <h2
                className="font-light leading-tight mb-6"
                style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                  letterSpacing: '-0.01em',
                }}
              >
                Transparent by design
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm">
                Verza may earn a commission when you purchase through links on our site. This helps us
                keep content free and continue providing in-depth reviews. Affiliate partnerships never
                influence our editorial opinions or review scores — we only recommend tools we genuinely
                believe are valuable.
              </p>
            </FadeIn>

            <FadeIn direction="right" delay={0.15}>
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary mb-5">
                Our Location
              </p>
              <h2
                className="font-light leading-tight mb-6"
                style={{
                  fontFamily: 'var(--font-display), sans-serif',
                  fontSize: 'clamp(1.6rem, 2.5vw, 2.2rem)',
                  letterSpacing: '-0.01em',
                }}
              >
                Australia-based,<br />globally minded
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm mb-10">
                Operating from Australia gives us unique insights into both the Asia-Pacific and global
                software markets. We understand the needs of Australian businesses while maintaining a
                worldwide perspective.
              </p>
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 text-[11px] font-semibold tracking-[0.2em] uppercase text-primary hover:text-primary/70 transition-colors"
              >
                Get in touch <span className="transition-transform duration-300 group-hover:translate-x-1">→</span>
              </Link>
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}
