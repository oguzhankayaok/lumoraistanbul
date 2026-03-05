import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Lumora Istanbul | Lüks Gayrimenkul',
  description: "İstanbul'un en seçkin lüks gayrimenkul danışmanlık firması.",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="tr">
      <body>{children}</body>
    </html>
  )
}
