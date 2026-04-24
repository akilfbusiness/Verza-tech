import { Metadata } from 'next'
import { PageHero } from '@/components/layout/page-hero'
import { FadeIn } from '@/components/animations/fade-in'
import { SubmitToolForm } from './submit-form'

export const metadata: Metadata = {
  title: 'Submit a Tool | Verza',
  description: 'Know a great SaaS or AI tool we should review? Submit it to the Verza directory.',
}

export default function SubmitToolPage() {
  return (
    <>
      <PageHero
        label="Directory"
        title="Submit a Tool"
        subtitle="Know a great SaaS or AI tool we should review? Let us know."
        breadcrumbs={[{ label: 'Submit a Tool', href: '/submit-tool' }]}
      />

      <section className="py-24 md:py-36 border-t border-border bg-background">
        <div className="container mx-auto px-6 max-w-7xl">
          <div className="grid md:grid-cols-[1fr_2fr] gap-16">
            <FadeIn direction="left">
              <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary mb-5">
                What happens next
              </p>
              <ol className="space-y-0">
                {[
                  { n: '01', text: 'We review your submission within a few days.' },
                  { n: '02', text: 'Our team evaluates the tool for inclusion.' },
                  { n: '03', text: 'If accepted, we test and write a full review.' },
                  { n: '04', text: 'The tool goes live in our directory.' },
                ].map((step) => (
                  <li key={step.n} className="flex items-start gap-4 border-b border-border py-5 first:border-t">
                    <span
                      className="font-light shrink-0 mt-0.5"
                      style={{
                        fontFamily: 'var(--font-display), sans-serif',
                        fontSize: '1.1rem',
                        color: 'var(--primary)',
                        opacity: 0.5,
                      }}
                    >
                      {step.n}
                    </span>
                    <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>
                  </li>
                ))}
              </ol>
            </FadeIn>

            <FadeIn direction="right" delay={0.1}>
              <SubmitToolForm />
            </FadeIn>
          </div>
        </div>
      </section>
    </>
  )
}
