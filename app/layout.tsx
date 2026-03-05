import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Senkron Gayrimenkul | Lüks Konut Danışmanlığı',
  description: "İstanbul'un en seçkin lüks gayrimenkul ve yatırım danışmanlık firması.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
