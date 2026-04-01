import type { Metadata } from 'next'
import './globals.css'
import { Nav } from '@/components/layout/Nav'
import { Footer } from '@/components/layout/Footer'

const BASE_URL = process.env.NEXTAUTH_URL ?? 'http://localhost:3000'

export const metadata: Metadata = {
  title: {
    default: 'Abrahamic Texts',
    template: '%s — Abrahamic Texts',
  },
  description:
    'A structured, neutral, and citable comparison of Jewish, Christian, and Islamic sacred texts. Every claim is cited. Every comparison is editorially authored.',
  metadataBase: new URL(BASE_URL),
  openGraph: {
    type: 'website',
    siteName: 'Abrahamic Texts',
    title: 'Abrahamic Texts',
    description:
      'A structured, neutral comparison of Jewish, Christian, and Islamic scriptures. Every claim is cited. Every comparison is editorially authored.',
    url: BASE_URL,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Abrahamic Texts',
    description:
      'A structured, neutral comparison of Jewish, Christian, and Islamic scriptures. Every claim is cited.',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="flex min-h-full flex-col bg-stone-950 text-stone-100">
        <Nav />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
