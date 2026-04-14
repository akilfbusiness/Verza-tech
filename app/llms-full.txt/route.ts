import { NextResponse } from 'next/server'
import { getAllBlogPosts, getAllTools, getAllCategories } from '@/lib/sanity.queries'

export const revalidate = 3600

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'

  const [posts, tools, categories] = await Promise.all([
    getAllBlogPosts().catch(() => []),
    getAllTools().catch(() => []),
    getAllCategories().catch(() => []),
  ])

  const lines: string[] = [
    `# Verza — Full Content Index`,
    ``,
    `> This file contains the complete content index for Verza, including article summaries, for use by AI language models and crawlers.`,
    ``,
    `Site: ${siteUrl}`,
    `Last generated: ${new Date().toISOString()}`,
    ``,
    `---`,
    ``,
  ]

  if (posts.length > 0) {
    lines.push(`## Blog Articles (${posts.length} total)`)
    lines.push(``)
    for (const post of posts as any[]) {
      const updated = post.updatedAt || post.publishedAt
      const date = updated ? new Date(updated).toISOString().split('T')[0] : ''
      const category = post.categories?.[0]?.name || ''
      const articleType = post.articleType || ''

      lines.push(`### ${post.title}`)
      lines.push(``)
      lines.push(`- URL: ${siteUrl}/blog/${post.slug.current}`)
      lines.push(`- Markdown: ${siteUrl}/blog/${post.slug.current}/raw`)
      if (date) lines.push(`- Last updated: ${date}`)
      if (articleType) lines.push(`- Type: ${articleType}`)
      if (category) lines.push(`- Category: ${category}`)
      if (post.summary) {
        lines.push(`- Summary: ${post.summary}`)
      }
      if ((post as any).articleAnswerCapsule) {
        lines.push(`- Direct answer: ${(post as any).articleAnswerCapsule}`)
      }
      lines.push(``)
    }
  }

  if (tools.length > 0) {
    lines.push(`## Tools Reviewed (${tools.length} total)`)
    lines.push(``)
    for (const tool of tools as any[]) {
      lines.push(`### ${tool.name}`)
      lines.push(``)
      lines.push(`- URL: ${siteUrl}/tools/${tool.slug.current}`)
      if (tool.tagline) lines.push(`- Tagline: ${tool.tagline}`)
      if (tool.description) lines.push(`- Description: ${tool.description}`)
      if (tool.rating) lines.push(`- Rating: ${tool.rating}/5`)
      lines.push(``)
    }
  }

  if (categories.length > 0) {
    lines.push(`## Categories`)
    lines.push(``)
    for (const cat of categories as any[]) {
      lines.push(`- ${cat.name}: ${siteUrl}/blog/category/${cat.slug.current}`)
      if (cat.description) lines.push(`  ${cat.description}`)
    }
    lines.push(``)
  }

  return new NextResponse(lines.join('\n'), {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
    },
  })
}
