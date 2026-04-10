import { getAllCategories, getSiteSettings, getNavigation } from '@/lib/sanity.queries'
import { SiteNav } from './site-nav'
import { SiteFooter } from './site-footer'

interface SiteLayoutProps {
  children: React.ReactNode
}

export async function SiteLayout({ children }: SiteLayoutProps) {
  const [categories, siteSettings, navigation] = await Promise.all([
    getAllCategories().catch(() => []),
    getSiteSettings().catch(() => null),
    getNavigation().catch(() => null),
  ])

  return (
    <>
      <SiteNav
        categories={categories}
        navigation={navigation}
        siteSettings={siteSettings}
      />
      <main>{children}</main>
      <SiteFooter
        categories={categories}
        navigation={navigation}
        siteSettings={siteSettings}
      />
    </>
  )
}
