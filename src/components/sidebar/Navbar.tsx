'use client'

import Link from 'next/link'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

import GaugeHigh from '@/fa-duotone/gauge-high.svg'
import FolderOpen from '@/fa-duotone/folder-open.svg'
import Vault from '@/fa-duotone/vault.svg'
import KeySkeleton from '@/fa-duotone/key-skeleton.svg'
import UserGroup from '@/fa-duotone/user-group.svg'
import PeopleGroup from '@/fa-duotone/people-group.svg'
import Sliders from '@/fa-duotone/sliders.svg'
import ShieldKeyhole from '@/fa-duotone/shield-keyhole.svg'
import CaretDown from '@/fa-duotone/caret-down.svg'
import { FC, SVGProps } from 'react'

interface navItem {
  label: string
  href: string
  icon: FC<SVGProps<SVGSVGElement>>
  subItems?: navItem[]
}

const Navbar = () => {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: '/dashboard', icon: GaugeHigh },
    { label: 'Files', href: '/dashboard/files', icon: FolderOpen },
    { label: 'Vaults', href: '/dashboard/vaults', icon: Vault },
    { label: 'API Keys', href: '/dashboard/api-keys', icon: KeySkeleton },
    { label: 'Users', href: '/dashboard/users', icon: UserGroup },
    { label: 'Roles', href: '/dashboard/roles', icon: ShieldKeyhole },
    { label: 'Groups', href: '/dashboard/groups', icon: PeopleGroup },
    { label: 'Settings', href: '/dashboard/settings', icon: Sliders },
  ]

  const renderNavItem = (item: navItem, depth = 0) => {
    const isActive = pathname.startsWith(item.href)
    const isExactActive = pathname === item.href
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = isActive && hasSubItems

    const Icon = item.icon

    return (
      <div
        key={item.href}
        className={clsx(
          'flex flex-col transition-all duration-300',
          depth === 0 && 'border-b border-cyan-900/30 pb-1',
        )}>
        <Link
          href={item.href}
          className={clsx(
            'flex items-center justify-between transition-colors',
            'rounded-md px-4 py-2',
            depth === 0 ? 'text-base font-medium' : 'pl-4 text-sm font-normal',
            isExactActive ? 'bg-cyan-700/80 font-semibold text-white shadow-inner'
            : isActive ? 'bg-cyan-800/40 text-white'
            : 'text-cyan-300 hover:bg-cyan-700/30 hover:text-white',
          )}>
          <span className="inline-flex gap-4">
            <Icon className="fill-current text-xl text-cyan-300" />
            {item.label}
          </span>
          {hasSubItems && <CaretDown className="fill-current text-cyan-600" />}
        </Link>

        {hasSubItems && isExpanded && (
          <div className={clsx('ml-2 flex flex-col border-l border-cyan-900/30 pl-4')}>
            {item.subItems && item.subItems.map((subItem: navItem) => renderNavItem(subItem, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav className="bg-secondary text-primary flex h-full flex-col space-y-2 rounded-xl p-4 shadow-lg">
      {navItems.map(item => renderNavItem(item))}
    </nav>
  )
}

export default Navbar
