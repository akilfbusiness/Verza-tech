'use client'

import { useState } from 'react'
import { Metadata } from 'next'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export default function SubmitToolPage() {
  const [formData, setFormData] = useState({
    toolName: '',
    website: '',
    category: '',
    description: '',
    yourName: '',
    yourEmail: '',
  })
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')

    // TODO: Send to your preferred endpoint (email, form service, database)
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      
      setStatus('success')
      setMessage('Thanks for your submission! We will review it and add it to our directory soon.')
      setFormData({
        toolName: '',
        website: '',
        category: '',
        description: '',
        yourName: '',
        yourEmail: '',
      })
    } catch (error) {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="border-b">
        <div className="container mx-auto px-4 py-12 max-w-3xl">
          <h1 className="text-4xl font-bold mb-4">Submit a Tool</h1>
          <p className="text-lg text-muted-foreground">
            Know a great SaaS or AI tool we should review? Let us know!
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Tool Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Tool Information</h2>
            
            <div className="space-y-2">
              <label htmlFor="toolName" className="text-sm font-medium">
                Tool Name *
              </label>
              <Input
                id="toolName"
                required
                value={formData.toolName}
                onChange={(e) => setFormData({ ...formData, toolName: e.target.value })}
                placeholder="e.g. Notion, ChatGPT, Figma"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="website" className="text-sm font-medium">
                Website URL *
              </label>
              <Input
                id="website"
                type="url"
                required
                value={formData.website}
                onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                placeholder="https://example.com"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="category" className="text-sm font-medium">
                Category *
              </label>
              <Input
                id="category"
                required
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g. Productivity, AI Writing, Design"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Brief Description *
              </label>
              <textarea
                id="description"
                required
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Tell us what makes this tool special..."
                className="w-full min-h-32 rounded-md border bg-background px-3 py-2 text-sm"
              />
            </div>
          </section>

          {/* Your Information */}
          <section className="space-y-4">
            <h2 className="text-xl font-semibold">Your Information</h2>
            
            <div className="space-y-2">
              <label htmlFor="yourName" className="text-sm font-medium">
                Your Name
              </label>
              <Input
                id="yourName"
                value={formData.yourName}
                onChange={(e) => setFormData({ ...formData, yourName: e.target.value })}
                placeholder="Optional"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="yourEmail" className="text-sm font-medium">
                Your Email *
              </label>
              <Input
                id="yourEmail"
                type="email"
                required
                value={formData.yourEmail}
                onChange={(e) => setFormData({ ...formData, yourEmail: e.target.value })}
                placeholder="your@email.com"
              />
              <p className="text-xs text-muted-foreground">
                We will contact you if we need more information
              </p>
            </div>
          </section>

          {message && (
            <div
              className={`p-4 rounded-lg ${
                status === 'success'
                  ? 'bg-green-50 text-green-800 border border-green-200'
                  : 'bg-red-50 text-red-800 border border-red-200'
              }`}
            >
              {message}
            </div>
          )}

          <Button
            type="submit"
            disabled={status === 'loading' || status === 'success'}
            className="w-full"
          >
            {status === 'loading' ? 'Submitting...' : 'Submit Tool'}
          </Button>
        </form>
      </div>
    </div>
  )
}
