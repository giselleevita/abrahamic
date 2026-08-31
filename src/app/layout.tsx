import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'
import { PublicDemoBanner } from '@/components/layout/PublicDemoBanner'
import { getSiteUrl } from '@/lib/site-url'

export async function generateMetadata(): Promise<Metadata> {
  const baseUrl = getSiteUrl()

  return {
    title: {
      default: 'Abrahamic Texts',
      template: '%s — Abrahamic Texts',
    },
    description:
      'Public engineering demo: structured comparison of Jewish, Christian, and Islamic scriptures with license-free original-language text and project-authored reader notes.',
    metadataBase: new URL(baseUrl),
    openGraph: {
      type: 'website',
      siteName: 'Abrahamic Texts',
      title: 'Abrahamic Texts',
      description:
        'Public engineering demo — cross-tradition scripture comparison with editorial workflows. License-free original Hebrew/Arabic text and reader notes only.',
      url: baseUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: 'Abrahamic Texts',
      description:
        'Public demo — cross-tradition scripture comparison. License-free original-language text and project-authored reader notes.',
    },
  }
}

export const dynamic = 'force-dynamic'

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-slate-50 text-slate-900">
        <PublicDemoBanner />
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
