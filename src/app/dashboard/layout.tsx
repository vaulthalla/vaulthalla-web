import type { Metadata } from 'next'
import { Sidebar } from '@/components/Sidebar/Component'

export const metadata: Metadata = { title: 'Vaulthalla | Dashboard', description: 'The Final Cloud' }

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen w-full text-white">
      <Sidebar />
      <main className="flex flex-1 items-center justify-center overflow-hidden">{children}</main>
    </div>
  )
}
