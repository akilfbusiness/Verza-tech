import type { Metadata, Viewport } from 'next'
import { Inter, JetBrains_Mono } from 'next/font/google'
import Script from 'next/script'
import { Analytics } from '@vercel/analytics/next'
import { generateOrganizationSchema, generateWebsiteSchema, renderJsonLd } from '@/lib/schema'
import { SiteLayout } from '@/components/layout/site-layout'
import { PostHogProvider } from '@/components/providers/posthog-provider'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
})

const jetbrainsMono = JetBrains_Mono({ 
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
})

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://verza.tech'
const siteName = 'Verza'
const siteDescription = 'Discover and compare the best SaaS and AI tools. In-depth reviews, pricing comparisons, and expert recommendations to help you choose the right software.'

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteName} - SaaS & AI Tool Reviews and Comparisons`,
    template: `%s | ${siteName}`,
  },
  description: siteDescription,
  keywords: [
    'SaaS tools',
    'AI tools',
    'software reviews',
    'tool comparisons',
    'productivity software',
    'business tools',
    'software recommendations',
  ],
  authors: [{ name: siteName }],
  creator: siteName,
  publisher: siteName,
  verification: {
    google: 'zBMIraDoF3hPcg6NO6YduUiCiQfmXJWzKpAM3dEfFtE',
    other: {
      'msvalidate.01': '932E848ABAED86FFF610630F176F9F5F',
    },
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'en_AU',
    url: siteUrl,
    siteName,
    title: `${siteName} - SaaS & AI Tool Reviews`,
    description: siteDescription,
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: siteName,
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: `${siteName} - SaaS & AI Tool Reviews`,
    description: siteDescription,
    images: ['/og-image.png'],
  },
  alternates: {
    canonical: siteUrl,
  },
  icons: {
    icon: [
      {
        url: '/icon-light-32x32.png',
        media: '(prefers-color-scheme: light)',
      },
      {
        url: '/icon-dark-32x32.png',
        media: '(prefers-color-scheme: dark)',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    apple: '/apple-icon.png',
  },
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#000000' },
  ],
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const organizationSchema = generateOrganizationSchema()
  const websiteSchema = generateWebsiteSchema()

  return (
    <html lang="en-AU" className={`${inter.variable} ${jetbrainsMono.variable}`}>
      <head>
        {renderJsonLd(organizationSchema)}
        {renderJsonLd(websiteSchema)}
      </head>
      <body className="font-sans antialiased">
        <PostHogProvider>
          <SiteLayout>
            {children}
          </SiteLayout>
        </PostHogProvider>
        <Analytics />

        {/* Google Analytics 4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-JRT7F4V6BM"
          strategy="afterInteractive"
        />
        <Script id="ga4-init" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-JRT7F4V6BM');
          `}
        </Script>

        {/* Microsoft Clarity */}
        <Script id="clarity-init" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
              c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
              t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
              y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "w9o6g0g5py");
          `}
        </Script>
      </body>
    </html>
  )
}
