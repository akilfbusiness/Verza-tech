'use client'

import Link from 'next/link'
import { motion } from 'framer-motion'
import { FadeIn } from '@/components/animations/fade-in'
import { StaggerChildren } from '@/components/animations/stagger-children'
import type { Category } from '@/lib/sanity.types'

interface CategoriesSectionProps {
  categories: Category[]
  heading: string
  subheading: string
}

export function CategoriesSection({ categories, heading, subheading }: CategoriesSectionProps) {
  return (
    <section className="border-b border-border">
      <div className="container mx-auto px-6 py-28 max-w-7xl">

        <FadeIn direction="up" className="text-center mb-16">
          <p className="text-xs font-semibold tracking-[0.25em] uppercase text-primary mb-4">
            Explore
          </p>
          <h2
            className="text-4xl md:text-5xl font-light text-foreground mb-4"
            style={{ fontFamily: 'var(--font-display), sans-serif' }}
          >
            {heading}
          </h2>
          <p className="text-muted-foreground max-w-xl mx-auto">{subheading}</p>
        </FadeIn>

        <StaggerChildren className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {categories.map((category) => (
            <Link
              key={category._id}
              href={`/category/${category.slug.current}`}
              className="group block p-6 border border-border hover:border-primary/50 hover:bg-secondary/50 transition-all duration-300"
            >
              {category.icon && (
                <div className="text-2xl mb-3 transition-transform duration-300 group-hover:scale-110 origin-left">
                  {category.icon}
                </div>
              )}
              <h3 className="font-medium text-sm mb-1.5 group-hover:text-primary transition-colors duration-200">
                {category.name}
              </h3>
              {category.description && (
                <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                  {category.description}
                </p>
              )}
              <div className="mt-4 flex items-center text-xs text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-200 font-medium tracking-wide">
                Explore <span className="ml-1 transition-transform duration-200 group-hover:translate-x-1">→</span>
              </div>
            </Link>
          ))}
        </StaggerChildren>
      </div>
    </section>
  )
}
