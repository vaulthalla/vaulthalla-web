import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { WebSocketProvider } from '@/components/WebSocketProvider'
import { AuthRefresher } from '@/components/auth/AutoRefresher'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = { title: 'Vaulthalla', description: 'The Final Cloud' }

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased`}>
        <AuthRefresher />
        <WebSocketProvider />
        {children}
      </body>
    </html>
  )
}
