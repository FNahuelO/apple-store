import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const inter = Inter({ 
  subsets: ['latin'],
  variable: '--font-inter',
})

export const metadata: Metadata = {
  title: 'Apple Reseller | iPhones Nuevos y Usados',
  description: 'Tu tienda de confianza para comprar iPhones nuevos, usados seleccionados y accesorios originales Apple. Garantía, financiación y plan de canje. Reseller',
  keywords: ['iPhone', 'Apple', 'Reseller', 'Córdoba', 'celulares', 'usados', 'reacondicionados', 'accesorios', 'AirPods'],
  authors: [{ name: 'Apple Reseller' }],
  creator: 'Apple Reseller',
  openGraph: {
    type: 'website',
    locale: 'es_AR',
    url: 'https://applereseller.com',
    siteName: 'Apple Reseller',
    title: 'Apple Reseller | iPhones Nuevos y Usados',
    description: 'Compra iPhones nuevos, usados y accesorios originales Apple con garantía. Financiación y plan de canje disponibles.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Apple Reseller | iPhones Nuevos y Usados',
    description: 'Compra iPhones nuevos, usados y accesorios originales Apple con garantía.',
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
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#fafafa' },
    { media: '(prefers-color-scheme: dark)', color: '#171717' },
  ],
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="es" className={`${inter.variable} bg-background`}>
      <body className="font-sans antialiased">
        {children}
        {process.env.NODE_ENV === 'production' && <Analytics />}
      </body>
    </html>
  )
}
