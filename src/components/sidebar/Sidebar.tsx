'use client'

import NextImage from 'next/image'
import Logo from '../../../public/Vaulthalla-logo.png'
import { useAuthStore } from '@/stores/authStore'
import Navbar from '@/components/sidebar/Navbar'
import { Button } from '@/components/Button'

export const Sidebar = () => {
  const Footer = () => <div className="text-xs text-cyan-400 opacity-70">v0.1.0 • Vaulthalla</div>

  const { user } = useAuthStore()

  return (
    <aside className="h-full w-72 border-r border-white/20 bg-gradient-to-b from-white/10 to-black/20 shadow-[0_0_60px_20px_rgba(100,255,255,0.1)] backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-full flex-col space-y-8 p-6">
        <NextImage src={Logo} alt="Vaulthalla Logo" width={100} height={100} className="mx-auto mb-4" />
        {user && user.name && <h3 className="text-center text-2xl">Welcome, {user.name}!</h3>}
        <Navbar />
        <div className="flex-grow" />
        {/* Spacer */}
        <Button
          variant="destructive"
          onClick={() => {
            useAuthStore.getState().logout()
            window.location.href = '/login'
          }}>
          Logout
        </Button>
        <Footer />
      </div>
    </aside>
  )
}
