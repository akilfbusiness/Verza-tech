'use client'

import Link from 'next/link'
import { FadeIn } from '@/components/animations/fade-in'
import { StaggerChildren } from '@/components/animations/stagger-children'
import type { Tool } from '@/lib/sanity.types'

interface FeaturedToolsSectionProps {
  tools: Tool[]
  heading: string
  subheading: string
}

export function FeaturedToolsSection({ tools, heading, subheading }: FeaturedToolsSectionProps) {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-6 py-28 max-w-7xl">

        <FadeIn direction="up" className="mb-16">
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4">
            <div>
              <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">
                Recommended
              </p>
              <h2
                className="text-4xl md:text-5xl font-light text-foreground mb-3"
                style={{ fontFamily: 'var(--font-display), sans-serif' }}
              >
                {heading}
              </h2>
              <p className="text-muted-foreground">{subheading}</p>
            </div>
            <Link
              href="/tools"
              className="hidden md:inline-flex items-center text-sm text-foreground/60 hover:text-foreground transition-colors duration-200 shrink-0 group"
            >
              View all tools
              <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1">→</span>
            </Link>
          </div>
        </FadeIn>

        <StaggerChildren className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tools.map((tool) => (
            <Link
              key={tool._id}
              href={`/tools/${tool.slug.current}`}
              className="group block border border-border hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl transition-all duration-300 bg-card"
            >
              {/* Card top accent line */}
              <div className="h-px bg-gradient-to-r from-primary/0 via-primary/60 to-primary/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              <div className="p-6">
                <div className="flex items-start gap-4 mb-4">
                  {tool.logo ? (
                    <div className="w-12 h-12 bg-secondary flex-shrink-0 flex items-center justify-center border border-border">
                      <div className="w-8 h-8 bg-primary/10 rounded-sm" />
                    </div>
                  ) : (
                    <div className="w-12 h-12 bg-secondary flex-shrink-0 border border-border" />
                  )}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm mb-1 truncate group-hover:text-primary transition-colors duration-200">
                      {tool.name}
                    </h3>
                    {tool.tagline && (
                      <p className="text-xs text-muted-foreground line-clamp-1">{tool.tagline}</p>
                    )}
                  </div>
                </div>

                {tool.description && (
                  <p className="text-sm text-muted-foreground mb-5 line-clamp-2 leading-relaxed">
                    {tool.description}
                  </p>
                )}

                <div className="flex items-center justify-between text-xs">
                  {tool.rating && (
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-primary">{tool.rating}</span>
                      <span className="text-muted-foreground">/5</span>
                    </div>
                  )}
                  {tool.pricing && tool.pricing.length > 0 && (
                    <div>
                      {tool.freePlanAvailable ? (
                        <span className="px-2.5 py-1 border border-primary/30 text-primary text-xs tracking-wide">
                          Free plan
                        </span>
                      ) : (
                        <span className="text-muted-foreground">
                          {tool.pricing[0].price || 'Paid'}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </StaggerChildren>

        <div className="text-center mt-10 md:hidden">
          <Link
            href="/tools"
            className="inline-flex items-center text-sm text-foreground/60 hover:text-foreground transition-colors duration-200 group"
          >
            View all tools
            <span className="ml-1.5 transition-transform duration-200 group-hover:translate-x-1">→</span>
          </Link>
        </div>
      </div>
    </section>
  )
}
