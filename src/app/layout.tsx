import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { WebSocketProvider } from '@/components/WebSocketProvider'
import { AuthRefresher } from '@/components/auth/AutoRefresher'
import Sidebar from '@/components/sidebar/Sidebar'
import RequireAuth from '@/components/auth/RequireAuth'

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] })

const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] })

export const metadata: Metadata = { title: 'Vaulthalla', description: 'The Final Cloud' }

const MainLayout = ({ children }: { children: React.ReactNode }) => (
  <RequireAuth>
    <div className="flex h-screen w-full text-white">
      <Sidebar />
      <main className="my-4 flex flex-1 justify-center overflow-y-auto">{children}</main>
    </div>
  </RequireAuth>
)

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <AuthRefresher />
      <body className={`${geistSans.variable} ${geistMono.variable} bg-background antialiased`}>
        <WebSocketProvider />
        <MainLayout>{children}</MainLayout>
      </body>
    </html>
  )
}
