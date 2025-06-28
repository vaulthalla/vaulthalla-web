'use client'

import NextImage from 'next/image'
import Logo from '../../../public/vaulthalla-logo.png'
import { useAuthStore } from '@/stores/authStore'
import Navbar from '@/components/sidebar/Navbar'
import { Button } from '@/components/Button'
import VaultSelector from '@/components/sidebar/VaultSelector'
import { useRouter } from 'next/navigation'
import ToggleNavButton from '@/components/sidebar/ToggleNavButton'

export const Sidebar = () => {
  const Footer = () => <div className="text-xs text-cyan-400 opacity-70">v0.1.0 • Vaulthalla</div>

  const { user } = useAuthStore()

  const Banner = () => (
    <div>
      <NextImage
        src={Logo}
        alt="Vaulthalla Logo"
        width={100}
        height={100}
        priority
        className="mx-auto mb-4 h-auto w-auto"
      />
      {user && user.name && <h3 className="text-center text-2xl">Welcome, {user.name}!</h3>}
    </div>
  )

  const Spacer = () => <div className="flex-grow" />

  const LogoutButton = () => {
    const router = useRouter()
    return (
      <Button
        variant="destructive"
        onClick={() => {
          useAuthStore.getState().logout()
          router.push('/login')
        }}>
        Logout
      </Button>
    )
  }

  return (
    <aside className="h-full w-72 border-r border-white/20 bg-gradient-to-b from-white/10 to-black/20 shadow-[0_0_60px_20px_rgba(100,255,255,0.1)] backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-full flex-col space-y-3 p-6">
        <Banner />
        <VaultSelector />
        <ToggleNavButton />
        <Spacer />
        <Navbar />
        <Spacer />
        <LogoutButton />
        <Footer />
      </div>
    </aside>
  )
}
