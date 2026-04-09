import Link from 'next/link'

interface PortableTextProps {
  value: any
}

export function PortableText({ value }: PortableTextProps) {
  if (!value || !Array.isArray(value)) {
    return null
  }

  return (
    <div className="prose prose-lg max-w-none">
      {value.map((block: any, index: number) => {
        if (block._type === 'block') {
          return <TextBlock key={block._key || index} block={block} />
        }
        
        if (block._type === 'image') {
          return <ImageBlock key={block._key || index} block={block} />
        }

        if (block._type === 'callout') {
          return <CalloutBlock key={block._key || index} block={block} />
        }

        if (block._type === 'code') {
          return <CodeBlock key={block._key || index} block={block} />
        }

        return null
      })}
    </div>
  )
}

function TextBlock({ block }: { block: any }) {
  const style = block.style || 'normal'
  const children = block.children?.map((child: any, i: number) => (
    <span key={i} className={getTextStyle(child)}>
      {child.text}
    </span>
  ))

  switch (style) {
    case 'h2':
      return <h2 className="text-3xl font-bold mt-12 mb-4 text-balance">{children}</h2>
    case 'h3':
      return <h3 className="text-2xl font-bold mt-8 mb-3 text-balance">{children}</h3>
    case 'h4':
      return <h4 className="text-xl font-semibold mt-6 mb-2 text-balance">{children}</h4>
    case 'blockquote':
      return (
        <blockquote className="border-l-4 border-primary pl-6 py-2 my-6 italic text-muted-foreground">
          {children}
        </blockquote>
      )
    default:
      return <p className="mb-4 leading-relaxed text-pretty">{children}</p>
  }
}

function getTextStyle(child: any): string {
  const styles: string[] = []
  if (child.marks?.includes('strong')) styles.push('font-bold')
  if (child.marks?.includes('em')) styles.push('italic')
  if (child.marks?.includes('underline')) styles.push('underline')
  if (child.marks?.includes('code')) styles.push('bg-muted px-1.5 py-0.5 rounded text-sm font-mono')
  return styles.join(' ')
}

function ImageBlock({ block }: { block: any }) {
  return (
    <figure className="my-8">
      <div className="bg-muted rounded-lg aspect-video flex items-center justify-center">
        <span className="text-muted-foreground text-sm">Image placeholder</span>
      </div>
      {block.caption && (
        <figcaption className="text-sm text-muted-foreground text-center mt-2">
          {block.caption}
        </figcaption>
      )}
    </figure>
  )
}

function CalloutBlock({ block }: { block: any }) {
  const typeStyles = {
    info: 'border-blue-500 bg-blue-50 dark:bg-blue-950/30',
    warning: 'border-amber-500 bg-amber-50 dark:bg-amber-950/30',
    success: 'border-green-500 bg-green-50 dark:bg-green-950/30',
    error: 'border-red-500 bg-red-50 dark:bg-red-950/30',
  }

  const style = typeStyles[block.type as keyof typeof typeStyles] || typeStyles.info

  return (
    <aside className={`border-l-4 rounded-r-lg p-6 my-6 ${style}`}>
      {block.title && <div className="font-semibold mb-2">{block.title}</div>}
      {block.content && <div className="text-sm">{block.content}</div>}
    </aside>
  )
}

function CodeBlock({ block }: { block: any }) {
  return (
    <div className="my-6">
      <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
        <code className="text-sm font-mono">{block.code}</code>
      </pre>
      {block.language && (
        <div className="text-xs text-muted-foreground mt-1">{block.language}</div>
      )}
    </div>
  )
}
