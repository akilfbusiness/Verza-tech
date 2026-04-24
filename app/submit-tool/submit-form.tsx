'use client'

import { useState } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

type FormData = {
  toolName: string
  website: string
  category: string
  description: string
  yourName: string
  yourEmail: string
}

const INITIAL: FormData = {
  toolName: '',
  website: '',
  category: '',
  description: '',
  yourName: '',
  yourEmail: '',
}

export function SubmitToolForm() {
  const [formData, setFormData] = useState<FormData>(INITIAL)
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')

  const set = (field: keyof FormData) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setFormData((prev) => ({ ...prev, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus('loading')
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setStatus('success')
      setMessage("Thanks for your submission! We'll review it and add it to our directory soon.")
      setFormData(INITIAL)
    } catch {
      setStatus('error')
      setMessage('Something went wrong. Please try again.')
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-12 max-w-2xl">
      {/* Tool information */}
      <div className="space-y-6">
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary">
          Tool Information
        </p>

        <Field label="Tool Name" required>
          <Input
            id="toolName"
            required
            value={formData.toolName}
            onChange={set('toolName')}
            placeholder="e.g. Notion, ChatGPT, Figma"
          />
        </Field>

        <Field label="Website URL" required>
          <Input
            id="website"
            type="url"
            required
            value={formData.website}
            onChange={set('website')}
            placeholder="https://example.com"
          />
        </Field>

        <Field label="Category" required>
          <Input
            id="category"
            required
            value={formData.category}
            onChange={set('category')}
            placeholder="e.g. Productivity, AI Writing, Design"
          />
        </Field>

        <Field label="Brief Description" required>
          <textarea
            id="description"
            required
            value={formData.description}
            onChange={set('description')}
            placeholder="Tell us what makes this tool special..."
            className="w-full min-h-32 border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:border-primary/60 transition-colors resize-none"
          />
        </Field>
      </div>

      {/* Your information */}
      <div className="space-y-6 pt-6 border-t border-border">
        <p className="text-[10px] font-semibold tracking-[0.25em] uppercase text-primary">
          Your Information
        </p>

        <Field label="Your Name">
          <Input
            id="yourName"
            value={formData.yourName}
            onChange={set('yourName')}
            placeholder="Optional"
          />
        </Field>

        <Field label="Your Email" required hint="We'll contact you if we need more information">
          <Input
            id="yourEmail"
            type="email"
            required
            value={formData.yourEmail}
            onChange={set('yourEmail')}
            placeholder="your@email.com"
          />
        </Field>
      </div>

      {message && (
        <div
          className={`p-4 border text-sm ${
            status === 'success'
              ? 'border-primary/30 text-primary bg-primary/5'
              : 'border-destructive/30 text-destructive bg-destructive/5'
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
        {status === 'loading' ? 'Submitting…' : 'Submit Tool'}
      </Button>
    </form>
  )
}

function Field({
  label,
  required,
  hint,
  children,
}: {
  label: string
  required?: boolean
  hint?: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">
        {label} {required && <span className="text-muted-foreground">*</span>}
      </label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  )
}
