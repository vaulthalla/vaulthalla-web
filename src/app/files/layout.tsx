import type { Metadata } from 'next'
import Sidebar from '@/components/sidebar/Sidebar'
import RequireAuth from '@/components/auth/RequireAuth'

export const metadata: Metadata = { title: 'Vaulthalla | Files', description: 'The Final Cloud' }

export default function FilesLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <div className="flex h-screen w-full text-white">
        <Sidebar />
        <main className="my-4 flex flex-1 justify-center overflow-y-auto">{children}</main>
      </div>
    </RequireAuth>
  )
}
