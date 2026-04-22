'use client'

import { CountUp } from '@/components/animations/count-up'
import { FadeIn } from '@/components/animations/fade-in'

interface Stat {
  value: string
  label: string
}

interface StatsSectionProps {
  stats: Stat[]
}

export function StatsSection({ stats }: StatsSectionProps) {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-6 py-20 max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12">
          {stats.map((stat, i) => (
            <FadeIn key={i} delay={i * 0.1} direction="up">
              <div className="text-center">
                <div className="text-4xl md:text-5xl font-light text-foreground mb-3"
                  style={{ fontFamily: 'var(--font-cormorant), Georgia, serif' }}>
                  <CountUp value={stat.value} />
                </div>
                <div className="text-xs font-semibold tracking-[0.2em] uppercase text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>
      </div>
    </section>
  )
}
