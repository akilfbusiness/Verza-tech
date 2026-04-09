export const metadata = {
  title: 'Verza CMS Studio',
  description: 'Content management for Verza',
}

export default function StudioLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <>{children}</>
}
