import { NextResponse } from 'next/server'
import { getBlogPostBySlug } from '@/lib/sanity.queries'

export const revalidate = 3600

// Lightweight portable text → markdown converter
function portableTextToMarkdown(blocks: any[]): string {
  if (!Array.isArray(blocks)) return ''

  return blocks
    .map((block: any) => {
      if (!block) return ''

      // Handle image blocks
      if (block._type === 'image') {
        return `![${block.alt || 'Image'}](${block.asset?._ref || ''})\n`
      }

      // Handle callout / tip blocks
      if (block._type === 'callout') {
        return `> **${block.title || 'Note'}:** ${block.body || ''}\n`
      }

      // Handle howToBlock
      if (block._type === 'howToBlock') {
        const steps = (block.steps || [])
          .map((s: any, i: number) => `${i + 1}. **${s.stepName || s.title || ''}** — ${s.stepDescription || s.description || ''}`)
          .join('\n')
        return `${steps}\n`
      }

      // Handle comparisonTable
      if (block._type === 'comparisonTable') {
        return `*Comparison table — see full article for details.*\n`
      }

      // Standard block types
      if (block._type === 'block') {
        const text = (block.children || [])
          .map((child: any) => {
            let t = child.text || ''
            if (!t) return ''
            const marks: string[] = child.marks || []
            if (marks.includes('strong')) t = `**${t}**`
            if (marks.includes('em')) t = `*${t}*`
            if (marks.includes('code')) t = `\`${t}\``
            // Handle links
            const linkMark = marks.find((m: string) =>
              block.markDefs?.some((d: any) => d._key === m && d._type === 'link')
            )
            if (linkMark) {
              const def = block.markDefs?.find((d: any) => d._key === linkMark)
              if (def?.href) t = `[${t}](${def.href})`
            }
            return t
          })
          .join('')

        const style = block.style || 'normal'
        if (style === 'h1') return `# ${text}\n`
        if (style === 'h2') return `## ${text}\n`
        if (style === 'h3') return `### ${text}\n`
        if (style === 'h4') return `#### ${text}\n`
        if (style === 'blockquote') return `> ${text}\n`
        if (style === 'normal' && text.trim() === '') return ''
        return `${text}\n`
      }

      // Handle lists
      if (block._type === 'block' && block.listItem) {
        const text = (block.children || []).map((c: any) => c.text || '').join('')
        return block.listItem === 'bullet' ? `- ${text}` : `1. ${text}`
      }

      return ''
    })
    .filter(Boolean)
    .join('\n')
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params
  const post = await getBlogPostBySlug(slug).catch(() => null)

  if (!post) {
    return new NextResponse('Not found', { status: 404 })
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'
  const url = `${siteUrl}/blog/${slug}`
  const updated = post.updatedAt || post.publishedAt
  const lines: string[] = []

  // Frontmatter-style header
  lines.push(`# ${post.title}`)
  lines.push(``)
  if (post.author?.name) lines.push(`**Author:** ${post.author.name}${post.author.role ? ` — ${post.author.role}` : ''}`)
  if (post.publishedAt) lines.push(`**Published:** ${new Date(post.publishedAt).toISOString().split('T')[0]}`)
  if (updated) lines.push(`**Last updated:** ${new Date(updated).toISOString().split('T')[0]}`)
  if (post.categories?.length) lines.push(`**Categories:** ${post.categories.map((c: any) => c.name).join(', ')}`)
  lines.push(`**URL:** ${url}`)
  lines.push(``)

  // Article answer capsule
  if ((post as any).articleAnswerCapsule) {
    lines.push(`## Direct Answer`)
    lines.push(``)
    lines.push((post as any).articleAnswerCapsule)
    lines.push(``)
  }

  // Summary
  if (post.summary) {
    lines.push(`## Summary`)
    lines.push(``)
    lines.push(post.summary)
    lines.push(``)
  }

  // Data provenance
  if ((post as any).dataProvenance) {
    lines.push(`*${(post as any).dataProvenance}*`)
    lines.push(``)
  }

  // Introduction
  if (post.introduction) {
    lines.push(post.introduction)
    lines.push(``)
  }

  // Content sections
  for (const section of post.contentSections || []) {
    lines.push(`## ${section.heading}`)
    lines.push(``)
    if (section.sectionAnswerCapsule) {
      lines.push(`*${section.sectionAnswerCapsule}*`)
      lines.push(``)
    }
    if (section.content) {
      lines.push(portableTextToMarkdown(section.content))
    }
  }

  // Decision framework
  const framework = (post as any).decisionFramework
  if (framework?.steps?.length) {
    lines.push(`## ${framework.frameworkName || 'Decision Framework'}`)
    lines.push(``)
    for (let i = 0; i < framework.steps.length; i++) {
      const step = framework.steps[i]
      lines.push(`${i + 1}. **${step.stepTitle}** — ${step.stepDescription}`)
    }
    lines.push(``)
  }

  // FAQs
  if (post.faqs?.length) {
    lines.push(`## Frequently Asked Questions`)
    lines.push(``)
    for (const faq of post.faqs) {
      lines.push(`### ${faq.question}`)
      lines.push(``)
      lines.push(faq.quickAnswer || '')
      lines.push(``)
    }
  }

  // Verdict
  if (post.verdictBox?.verdict) {
    lines.push(`## Verdict`)
    lines.push(``)
    lines.push(post.verdictBox.verdict)
    lines.push(``)
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      'X-Robots-Tag': 'noindex', // Don't index the raw version, only the canonical HTML page
    },
  })
}
