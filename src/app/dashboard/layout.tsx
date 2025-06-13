import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import { WebSocketProvider } from '@/components/WebSocketProvider'
import '@/app/globals.css'
import { Sidebar } from '@/components/Sidebar/Component'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = { title: 'Vaulthalla | Dashboard', description: 'The Final Cloud' }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <Sidebar />
        <div className="flex h-screen w-full items-center justify-center overflow-hidden text-white">{children}</div>
        <WebSocketProvider />
      </body>
    </html>
  )
}
