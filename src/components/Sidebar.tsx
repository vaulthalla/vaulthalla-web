'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import clsx from 'clsx'
import NextImage from 'next/image'
import Logo from '../../public/Vaulthalla-logo.png'

const navItems = [
  { label: 'Dashboard', href: '/dashboard' },
  { label: 'Files', href: '/files' },
  { label: 'Settings', href: '/settings' },
  { label: 'Admin', href: '/admin' },
]

export const Sidebar = () => {
  const pathname = usePathname()

  const Navigation = () => (
    <nav className="flex flex-col space-y-4">
      {navItems.map(item => (
        <Link
          key={item.href}
          href={item.href}
          className={clsx(
            'text-cyan-100 transition-colors hover:text-white',
            'rounded-md px-4 py-2',
            pathname.startsWith(item.href)
              ? 'bg-cyan-800/30 font-semibold text-white shadow-inner'
              : 'bg-transparent',
          )}
        >
          {item.label}
        </Link>
      ))}
    </nav>
  )

  const Footer = () => <div className="text-xs text-cyan-400 opacity-70">v0.1.0 • Vaulthalla</div>

  return (
    <aside className="fixed top-0 left-0 z-50 h-full w-42 border-r border-white/20 bg-gradient-to-b from-white/10 to-black/20 shadow-[0_0_60px_20px_rgba(100,255,255,0.1)] backdrop-blur-xl backdrop-saturate-150">
      <div className="flex h-full flex-col space-y-8 p-6">
        <NextImage
          src={Logo}
          alt="Vaulthalla Logo"
          width={100}
          height={100}
          className="mx-auto mb-4"
        />
        <Navigation />
        <div className="flex-grow" /> {/* Spacer */}
        <Footer />
      </div>
    </aside>
  )
}
