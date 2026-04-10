import { Metadata } from 'next'
import Link from 'next/link'
import { generateWebPageSchema, renderJsonLd } from '@/lib/schema'

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'

export const metadata: Metadata = {
  title: 'About Verza | SaaS & AI Tool Reviews',
  description: 'Learn about Verza — an independent platform helping businesses worldwide discover the best SaaS and AI tools through expert reviews and comparisons.',
  alternates: { canonical: `${siteUrl}/about` },
}

export default function AboutPage() {
  const webPageSchema = generateWebPageSchema(
    'About Verza',
    'Independent SaaS and AI tool reviews, comparisons, and guides to help you choose the right software.',
    `${siteUrl}/about`
  )

  return (
    <>
      {renderJsonLd(webPageSchema)}
      
      <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">About Verza</h1>
          <p className="text-xl text-muted-foreground">
            Helping you discover and choose the right tools for your business
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="prose prose-lg max-w-none space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
            <p className="text-muted-foreground leading-relaxed">
              Based in Australia and serving businesses worldwide, Verza is committed to making 
              software selection simple and transparent. We believe that finding the right tools 
              shouldn&apos;t be overwhelming. With thousands of SaaS and AI tools available, we 
              cut through the noise to bring you honest, in-depth reviews and comparisons that 
              help you make informed decisions.
            </p>
            <p className="text-muted-foreground leading-relaxed mt-4">
              Whether you&apos;re a startup in Sydney, an enterprise in Melbourne, or a business 
              anywhere in the world, we provide the insights you need to choose software with confidence.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">What We Do</h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Expert Reviews</h3>
                <p className="text-sm text-muted-foreground">
                  Our team tests and reviews each tool thoroughly, providing detailed analysis 
                  of features, pricing, and real-world performance.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Honest Comparisons</h3>
                <p className="text-sm text-muted-foreground">
                  We compare similar tools side-by-side, highlighting the strengths and 
                  weaknesses of each to help you choose what&apos;s best for your needs.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Regular Updates</h3>
                <p className="text-sm text-muted-foreground">
                  The software landscape changes rapidly. We keep our reviews current with 
                  the latest features, pricing, and developments.
                </p>
              </div>
              <div className="border rounded-lg p-6">
                <h3 className="font-semibold mb-2">Transparent Process</h3>
                <p className="text-sm text-muted-foreground">
                  We clearly disclose affiliate relationships while maintaining editorial 
                  independence. Our opinions are our own.
                </p>
              </div>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Our Standards</h2>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <div>
                  <strong>Hands-on Testing:</strong> We test each tool ourselves before reviewing it
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <div>
                  <strong>Editorial Independence:</strong> Reviews reflect our genuine opinions and experiences
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <div>
                  <strong>Comprehensive Analysis:</strong> We cover features, pricing, pros, cons, and alternatives
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-primary mt-1">✓</span>
                <div>
                  <strong>Clear Communication:</strong> We write in plain language, avoiding jargon and marketing speak
                </div>
              </li>
            </ul>
          </section>

          <section className="bg-muted rounded-lg p-8">
            <h2 className="text-2xl font-bold mb-4">Affiliate Disclosure</h2>
            <p className="text-muted-foreground leading-relaxed">
              Verza may earn a commission when you purchase through links on our site. This helps 
              us keep our content free and continue providing in-depth reviews. However, affiliate 
              partnerships never influence our editorial opinions or review scores. We only recommend 
              tools we genuinely believe are valuable.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Our Location</h2>
            <p className="text-muted-foreground mb-4">
              Verza operates from Australia, giving us unique insights into both the Asia-Pacific 
              and global software markets. We understand the needs of Australian businesses while 
              maintaining a worldwide perspective.
            </p>
            <div className="border rounded-lg p-6 bg-muted/30 mb-6">
              <p className="text-sm font-medium mb-2">Verza</p>
              <p className="text-sm text-muted-foreground">Australia-based</p>
              <p className="text-sm text-muted-foreground">Serving businesses globally</p>
            </div>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
            <p className="text-muted-foreground mb-4">
              Have questions or suggestions? We&apos;d love to hear from you.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center justify-center rounded-md bg-primary px-6 py-3 text-sm font-medium text-primary-foreground hover:bg-primary/90 transition-colors"
            >
              Contact Us
            </Link>
          </section>
        </div>
      </div>
      </div>
    </>
  )
}
