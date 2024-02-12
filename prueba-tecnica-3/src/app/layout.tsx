
/* eslint-disable @next/next/no-img-element */
import { AuthProvider } from '@/context/AuthContext'
import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'App Note',
  description: 'Ultima prueba tecnica',
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${inter.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  )
}
