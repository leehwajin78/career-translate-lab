import Nav from '@/components/site/Nav'
import Footer from '@/components/site/Footer'
import ScrollRestoration from '@/components/site/ScrollRestoration'

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen bg-background flex flex-col">
      <ScrollRestoration />
      <Nav />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  )
}
