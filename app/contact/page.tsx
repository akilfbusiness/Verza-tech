import { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Contact Verza - Get in Touch',
  description: 'Contact Verza for tool review suggestions, partnerships, or general enquiries. Based in Australia, serving businesses worldwide.',
}

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-12 max-w-4xl">
          <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
          <p className="text-xl text-muted-foreground">
            Have questions or suggestions? We&apos;d love to hear from you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-4xl">
        <div className="grid md:grid-cols-2 gap-12">
          <div className="space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">Get in Touch</h2>
              <p className="text-muted-foreground mb-6">
                Based in Australia and serving businesses globally, we&apos;re here to help 
                with feedback on our reviews, suggestions for tools to cover, partnership 
                opportunities, or general enquiries about our platform.
              </p>
            </section>

            <section>
              <h3 className="font-semibold mb-4">What We&apos;d Love to Hear About</h3>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div className="text-sm text-muted-foreground">
                    Tools you&apos;d like us to review
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div className="text-sm text-muted-foreground">
                    Feedback on our existing reviews
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div className="text-sm text-muted-foreground">
                    Partnership opportunities
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <span className="text-primary mt-1">→</span>
                  <div className="text-sm text-muted-foreground">
                    General questions or suggestions
                  </div>
                </li>
              </ul>
            </section>

            <section className="border rounded-lg p-6 bg-muted/30">
              <h3 className="font-semibold mb-2">For Tool Vendors</h3>
              <p className="text-sm text-muted-foreground">
                If you&apos;re a tool vendor interested in having your product reviewed, 
                please reach out with information about your tool and what makes it unique.
              </p>
            </section>
          </div>

          <div>
            <div className="border rounded-lg p-8 bg-card">
              <h3 className="text-xl font-bold mb-6">Send Us a Message</h3>
              <p className="text-sm text-muted-foreground mb-6">
                Contact form integration can be added here with your preferred form service 
                (Formspree, Tally, etc.) or email service.
              </p>
              
              <div className="space-y-4">
                <div className="border rounded-lg p-4 text-center">
                  <p className="text-sm font-medium mb-1">Email Us</p>
                  <a 
                    href="mailto:hello@verza.com" 
                    className="text-sm text-primary hover:underline"
                  >
                    hello@verza.com
                  </a>
                </div>

                <div className="border rounded-lg p-4">
                  <p className="text-sm font-medium mb-2">Quick Links</p>
                  <ul className="space-y-2">
                    <li>
                      <Link 
                        href="/about" 
                        className="text-sm text-primary hover:underline"
                      >
                        About Us
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/tools" 
                        className="text-sm text-primary hover:underline"
                      >
                        Browse Tools
                      </Link>
                    </li>
                    <li>
                      <Link 
                        href="/reviews" 
                        className="text-sm text-primary hover:underline"
                      >
                        Read Reviews
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>

            <p className="text-xs text-muted-foreground mt-6 text-center">
              We typically respond within 1-2 business days
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
