import { PortableText as SanityPortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity.image'
import { ExternalLink } from 'lucide-react'

const components = {
  types: {
    image: ({ value }: any) => {
      if (!value?.asset) return null
      return (
        <figure className="my-8">
          <div className="relative rounded-lg overflow-hidden border">
            <Image
              src={urlForImage(value).url()}
              alt={value.alt || ''}
              width={800}
              height={500}
              className="w-full h-auto"
            />
          </div>
          {value.caption && (
            <figcaption className="text-sm text-muted-foreground text-center mt-2">
              {value.caption}
            </figcaption>
          )}
        </figure>
      )
    },
    callout: ({ value }: any) => {
      const styles: Record<string, string> = {
        info: 'border-blue-300 bg-blue-50 text-blue-900',
        tip: 'border-green-300 bg-green-50 text-green-900',
        warning: 'border-yellow-300 bg-yellow-50 text-yellow-900',
        success: 'border-green-400 bg-green-50 text-green-900',
      }
      const icons: Record<string, string> = {
        info: 'ℹ',
        tip: '💡',
        warning: '⚠️',
        success: '✅',
      }
      return (
        <div className={`my-6 border-l-4 rounded-r-lg px-5 py-4 ${styles[value.type] || styles.info}`}>
          <p className="font-semibold mb-1">{icons[value.type] || ''} {value.type?.charAt(0).toUpperCase() + value.type?.slice(1)}</p>
          <p className="text-sm leading-relaxed">{value.text}</p>
        </div>
      )
    },
  },
  marks: {
    link: ({ children, value }: any) => {
      const isExternal = value?.href?.startsWith('http')
      return (
        <a
          href={value?.href}
          target={value?.openInNewTab || isExternal ? '_blank' : undefined}
          rel={value?.isAffiliate ? 'nofollow noopener noreferrer sponsored' : isExternal ? 'noopener noreferrer' : undefined}
          className={`underline underline-offset-2 transition-colors ${
            value?.isAffiliate
              ? 'text-accent font-medium hover:text-accent/80'
              : 'text-primary hover:text-primary/80'
          }`}
        >
          {children}
          {isExternal && <ExternalLink className="inline w-3 h-3 ml-0.5 mb-0.5" aria-hidden="true" />}
        </a>
      )
    },
    code: ({ children }: any) => (
      <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded">{children}</code>
    ),
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-balance">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold mt-8 mb-3 text-balance">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-semibold mt-6 mb-2">{children}</h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-5 py-1 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="leading-relaxed mb-4">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-outside pl-6 mb-4 space-y-1.5">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-outside pl-6 mb-4 space-y-1.5">{children}</ol>
    ),
  },
  listItem: {
    bullet: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    number: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
  },
}

interface PortableTextProps {
  value: any
}

export function PortableText({ value }: PortableTextProps) {
  if (!value) return null
  return (
    <div className="prose-custom">
      <SanityPortableText value={value} components={components} />
    </div>
  )
}
