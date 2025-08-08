'use client'

import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import Navbar from '@/components/sidebar/Navbar'
import { Button } from '@/components/Button'
import { usePathname, useRouter } from 'next/navigation'
import ToggleNavButton from '@/components/sidebar/ToggleNavButton'
import Logo from '@/components/Logo'
import Bars from '@/fa-light/bars.svg'

const Sidebar = () => {
  const [isCollapsed, setIsCollapsed] = useState(false)
  const { user } = useAuthStore()
  const router = useRouter()
  const path = usePathname()

  useEffect(() => {
    if (path.startsWith('/files')) setIsCollapsed(true)
    else setIsCollapsed(false)
  }, [path])

  const Footer = () => <div className="text-xs text-cyan-400 opacity-70">v0.1.0 • Vaulthalla</div>

  const Banner = () => (
    <div className="flex flex-col items-center space-y-2">
      <Logo />
      {!isCollapsed && user?.name && <h3 className="text-center text-2xl">Welcome, {user.name}!</h3>}
    </div>
  )

  const Spacer = () => <div className="flex-grow" />

  const LogoutButton = () => (
    <Button
      variant="destructive"
      onClick={() => {
        useAuthStore.getState().logout()
        router.push('/login')
      }}>
      {isCollapsed ? '⏻' : 'Logout'}
    </Button>
  )

  return (
    <aside
      className={`h-full ${
        isCollapsed ? 'w-20' : 'w-72'
      } border-r border-white/20 bg-gradient-to-b from-white/10 to-black/20 shadow-[0_0_60px_20px_rgba(100,255,255,0.1)] backdrop-blur-xl backdrop-saturate-150 transition-all duration-300 ease-in-out`}>
      <div className={`flex h-full flex-col space-y-3 ${isCollapsed ? 'items-center p-2' : 'p-6'}`}>
        <div
          className={`text-primary border-spacing-4 rounded-md border-2 ${isCollapsed ? 'mx-auto w-fit' : 'absolute top-4 left-4'}`}>
          <Bars className="text-primary fill-current p-1 text-4xl" onClick={() => setIsCollapsed(prev => !prev)} />
        </div>
        <Banner />
        <ToggleNavButton isCollapsed={isCollapsed} />
        <Spacer />
        <Navbar isCollapsed={isCollapsed} />
        <Spacer />
        <LogoutButton />
        <Footer />
      </div>
    </aside>
  )
}

export default Sidebar
