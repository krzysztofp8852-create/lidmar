import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'LiD-MAR – Producent pasty BHP do mycia rąk | Pasta BHP producent',
  description: 'Producent pasty BHP do mycia rąk dla zakładów produkcyjnych, warsztatów i przemysłu. Własna produkcja, kontrola jakości, współpraca B2B. Skuteczne usuwanie zabrudzeń przemysłowych.',
  keywords: 'producent pasty BHP, pasta BHP producent, pasta do mycia rąk, przemysł, B2B, zakłady produkcyjne, warsztaty',
  openGraph: {
    title: 'LiD-MAR – Producent pasty BHP do mycia rąk',
    description: 'Producent pasty BHP do mycia rąk dla zakładów produkcyjnych, warsztatów i przemysłu.',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <head>
        <link rel="icon" href="/logo.png" type="image/png" />
        <link rel="apple-touch-icon" href="/logo.png" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'Organization',
              name: 'LiD-MAR',
              description: 'Producent pasty BHP do mycia rąk',
              url: 'https://lidmar.pl',
            }),
          }}
        />
      </head>
      <body className="font-sans">{children}</body>
    </html>
  )
}
