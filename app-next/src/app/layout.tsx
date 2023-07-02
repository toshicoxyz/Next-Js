import { ClerkProvider } from '@clerk/nextjs'
import './globals.css'
import { Quattrocento_Sans } from 'next/font/google'

const font = Quattrocento_Sans({
  subsets: ['latin'],
  weight: '400',
})

export const metadata = {
  title: 'Portafolio',
  description: 'Pagina de proyectos',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="es">
        <body className={font.className}>{children}</body>
      </html>
    </ClerkProvider>
  )
}
