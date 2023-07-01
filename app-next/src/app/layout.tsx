import './globals.css'
import { Quattrocento_Sans } from 'next/font/google'

const inter = Quattrocento_Sans({
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
    <html lang="es">
      <body className={inter.className}>{children}</body>
    </html>
  )
}
