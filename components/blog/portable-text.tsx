'use client'

import { PortableText as SanityPortableText } from '@portabletext/react'
import Image from 'next/image'
import { urlForImage } from '@/lib/sanity.image'
import { ExternalLink, Quote, TrendingUp, AlertCircle, Info, CheckCircle, Lightbulb, Tag } from 'lucide-react'

// ── Callout block ────────────────────────────────────────────────────────────
function CalloutBlock({ value }: { value: any }) {
  const config: Record<string, { bg: string; border: string; text: string; icon: React.ReactNode }> = {
    info:      { bg: 'bg-blue-50',   border: 'border-blue-400',   text: 'text-blue-900',   icon: <Info className="w-4 h-4" /> },
    tip:       { bg: 'bg-green-50',  border: 'border-green-400',  text: 'text-green-900',  icon: <Lightbulb className="w-4 h-4" /> },
    warning:   { bg: 'bg-yellow-50', border: 'border-yellow-400', text: 'text-yellow-900', icon: <AlertCircle className="w-4 h-4" /> },
    success:   { bg: 'bg-green-50',  border: 'border-emerald-400',text: 'text-emerald-900',icon: <CheckCircle className="w-4 h-4" /> },
    affiliate: { bg: 'bg-primary/5', border: 'border-primary',    text: 'text-foreground', icon: <Tag className="w-4 h-4 text-primary" /> },
  }
  const style = config[value.type] || config.info
  const labels: Record<string, string> = {
    info: 'Note', tip: 'Tip', warning: 'Warning', success: 'Success', affiliate: 'Affiliate Offer',
  }
  return (
    <div className={`my-6 border-l-4 rounded-r-xl px-5 py-4 ${style.bg} ${style.border} ${style.text}`}>
      <div className={`flex items-center gap-2 font-semibold mb-1 text-sm ${style.text}`}>
        {style.icon}
        {value.title || labels[value.type] || 'Note'}
      </div>
      <p className="text-sm leading-relaxed">{value.text}</p>
    </div>
  )
}

// ── Pull Quote block ─────────────────────────────────────────────────────────
function PullQuoteBlock({ value }: { value: any }) {
  return (
    <figure className="my-10 relative">
      <div className="border-l-4 border-primary pl-6 py-2">
        <Quote className="w-8 h-8 text-primary/20 mb-2" aria-hidden="true" />
        <blockquote className="text-xl font-semibold leading-relaxed text-foreground italic">
          {value.quote}
        </blockquote>
        {value.attribution && (
          <figcaption className="mt-3 text-sm text-muted-foreground font-medium">
            — {value.attribution}
          </figcaption>
        )}
      </div>
    </figure>
  )
}

// ── Stat Highlight block ─────────────────────────────────────────────────────
function StatBlock({ value }: { value: any }) {
  return (
    <div className="my-8 p-6 rounded-xl bg-primary/5 border border-primary/20 flex items-start gap-4">
      <TrendingUp className="w-6 h-6 text-primary mt-1 flex-shrink-0" aria-hidden="true" />
      <div>
        <div className="text-3xl font-bold text-primary">{value.stat}</div>
        <p className="text-sm text-foreground mt-1 font-medium">{value.context}</p>
        {value.source && (
          <p className="text-xs text-muted-foreground mt-1">
            Source:{' '}
            {value.sourceUrl ? (
              <a href={value.sourceUrl} target="_blank" rel="noopener noreferrer" className="underline hover:text-foreground transition-colors">
                {value.source}
              </a>
            ) : value.source}
          </p>
        )}
      </div>
    </div>
  )
}

// ── HowTo Steps block ────────────────────────────────────────────────────────
function HowToBlock({ value }: { value: any }) {
  return (
    <div className="my-8 border rounded-xl overflow-hidden">
      {value.title && (
        <div className="px-6 py-4 bg-secondary/50 border-b">
          <h3 className="font-bold text-lg">{value.title}</h3>
          {value.description && <p className="text-sm text-muted-foreground mt-1">{value.description}</p>}
        </div>
      )}
      <ol className="divide-y">
        {value.steps?.map((step: any, i: number) => (
          <li key={i} className="px-6 py-4 flex gap-4 items-start">
            <span className="flex-shrink-0 w-7 h-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm font-bold">
              {i + 1}
            </span>
            <div>
              {step.name && <p className="font-semibold text-sm mb-1">{step.name}</p>}
              {step.text && <p className="text-sm text-muted-foreground leading-relaxed">{step.text}</p>}
            </div>
          </li>
        ))}
      </ol>
    </div>
  )
}

// ── Data Table block ─────────────────────────────────────────────────────────
function TableBlock({ value }: { value: any }) {
  const isStriped = value.tableStyle === 'striped'
  return (
    <figure className="my-8 overflow-x-auto">
      {value.tableTitle && (
        <p className="font-semibold text-sm mb-2">{value.tableTitle}</p>
      )}
      <div className="border rounded-xl overflow-hidden">
        <table className="w-full text-sm">
          {value.columnHeaders?.length > 0 && (
            <thead className="bg-secondary/60">
              <tr>
                {value.columnHeaders.map((header: string, i: number) => (
                  <th key={i} className="px-4 py-3 text-left font-semibold text-foreground">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
          )}
          <tbody>
            {value.rows?.map((row: any, i: number) => (
              <tr key={i} className={isStriped && i % 2 === 1 ? 'bg-secondary/30' : ''}>
                {row.cells?.map((cell: string, j: number) => (
                  <td key={j} className="px-4 py-3 text-muted-foreground border-t">
                    {cell}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {value.tableCaption && (
        <figcaption className="text-xs text-muted-foreground mt-2 italic">{value.tableCaption}</figcaption>
      )}
    </figure>
  )
}

// ── Code Block ───────────────────────────────────────────────────────────────
function CodeBlock({ value }: { value: any }) {
  return (
    <figure className="my-6">
      {value.filename && (
        <div className="flex items-center gap-2 px-4 py-2 bg-secondary rounded-t-lg border border-b-0 text-xs font-mono text-muted-foreground">
          <span>{value.filename}</span>
        </div>
      )}
      <pre className={`overflow-x-auto p-4 bg-foreground/95 text-background text-sm font-mono leading-relaxed ${value.filename ? 'rounded-b-lg border' : 'rounded-lg border'}`}>
        <code>{value.code}</code>
      </pre>
      {value.caption && (
        <figcaption className="text-xs text-muted-foreground mt-2">{value.caption}</figcaption>
      )}
    </figure>
  )
}

// ── CTA Block ────────────────────────────────────────────────────────────────
function CTABlock({ value }: { value: any }) {
  if (!value.url) return null
  return (
    <div className="my-8 p-6 rounded-xl border-2 border-primary/20 bg-primary/5 text-center">
      {value.heading && <h3 className="font-bold text-lg mb-2">{value.heading}</h3>}
      {value.description && <p className="text-sm text-muted-foreground mb-4">{value.description}</p>}
      <a
        href={value.url}
        target="_blank"
        rel={value.isAffiliate ? 'nofollow noopener noreferrer sponsored' : 'noopener noreferrer'}
        className="inline-block px-6 py-3 rounded-lg bg-primary text-primary-foreground font-semibold text-sm hover:bg-primary/90 transition-colors"
      >
        {value.buttonLabel || 'Learn More'}
      </a>
      {value.promoCode && (
        <p className="text-xs text-muted-foreground mt-3">
          Use code: <span className="font-mono font-bold text-foreground">{value.promoCode}</span>
        </p>
      )}
    </div>
  )
}

// ── Accordion Block ──────────────────────────────────────────────────────────
function AccordionBlock({ value }: { value: any }) {
  return (
    <div className="my-6 space-y-2">
      {value.title && <p className="font-semibold mb-3">{value.title}</p>}
      {value.items?.map((item: any, i: number) => (
        <details key={i} className="border rounded-lg group">
          <summary className="flex items-center justify-between px-4 py-3 cursor-pointer font-medium text-sm list-none hover:bg-secondary/50 rounded-lg transition-colors">
            {item.heading}
            <span className="text-muted-foreground group-open:rotate-180 transition-transform ml-4">&#8964;</span>
          </summary>
          <div className="px-4 pb-3 text-sm text-muted-foreground leading-relaxed">{item.content}</div>
        </details>
      ))}
    </div>
  )
}

// ── Image block ──────────────────────────────────────────────────────────────
function ImageBlock({ value }: { value: any }) {
  if (!value?.asset) return null
  return (
    <figure className="my-8">
      <div className="relative rounded-xl overflow-hidden border">
        <Image
          src={urlForImage(value).url()}
          alt={value.alt || ''}
          width={800}
          height={500}
          className="w-full h-auto"
        />
      </div>
      {value.caption && (
        <figcaption className="text-xs text-muted-foreground text-center mt-2 italic">
          {value.caption}
        </figcaption>
      )}
    </figure>
  )
}

// ── Portable Text components map ─────────────────────────────────────────────
const components = {
  types: {
    image:       (props: any) => <ImageBlock value={props.value} />,
    callout:     (props: any) => <CalloutBlock value={props.value} />,
    pullQuote:   (props: any) => <PullQuoteBlock value={props.value} />,
    statBlock:   (props: any) => <StatBlock value={props.value} />,
    howToBlock:  (props: any) => <HowToBlock value={props.value} />,
    tableBlock:  (props: any) => <TableBlock value={props.value} />,
    codeBlock:   (props: any) => <CodeBlock value={props.value} />,
    ctaBlock:    (props: any) => <CTABlock value={props.value} />,
    accordion:   (props: any) => <AccordionBlock value={props.value} />,
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
          {isExternal && !value?.isAffiliate && (
            <ExternalLink className="inline w-3 h-3 ml-0.5 mb-0.5" aria-hidden="true" />
          )}
        </a>
      )
    },
    code: ({ children }: any) => (
      <code className="font-mono text-sm bg-secondary px-1.5 py-0.5 rounded border">{children}</code>
    ),
    strong: ({ children }: any) => <strong className="font-semibold">{children}</strong>,
    em:     ({ children }: any) => <em className="italic">{children}</em>,
  },
  block: {
    h2: ({ children }: any) => (
      <h2 className="text-2xl font-bold mt-10 mb-4 text-balance scroll-mt-20">{children}</h2>
    ),
    h3: ({ children }: any) => (
      <h3 className="text-xl font-semibold mt-8 mb-3 text-balance scroll-mt-20">{children}</h3>
    ),
    h4: ({ children }: any) => (
      <h4 className="text-lg font-semibold mt-6 mb-2 scroll-mt-20">{children}</h4>
    ),
    blockquote: ({ children }: any) => (
      <blockquote className="border-l-4 border-primary pl-5 py-1 my-6 italic text-muted-foreground">
        {children}
      </blockquote>
    ),
    normal: ({ children }: any) => (
      <p className="leading-relaxed mb-4 text-foreground">{children}</p>
    ),
  },
  list: {
    bullet: ({ children }: any) => (
      <ul className="list-disc list-outside pl-6 mb-4 space-y-1.5 text-foreground">{children}</ul>
    ),
    number: ({ children }: any) => (
      <ol className="list-decimal list-outside pl-6 mb-4 space-y-1.5 text-foreground">{children}</ol>
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
