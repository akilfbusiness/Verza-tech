import { getAllCategories } from '@/lib/sanity.queries'
import { SiteNav } from './site-nav'
import { SiteFooter } from './site-footer'

interface SiteLayoutProps {
  children: React.ReactNode
}

export async function SiteLayout({ children }: SiteLayoutProps) {
  // Fetch categories server-side so nav and footer always have fresh data
  const categories = await getAllCategories().catch(() => [])

  return (
    <>
      <SiteNav categories={categories} />
      <main>{children}</main>
      <SiteFooter categories={categories} />
    </>
  )
}
