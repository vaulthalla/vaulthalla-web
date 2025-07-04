'use client'

import Link from 'next/link'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

import Vault from '@/fa-duotone/vault.svg'
import KeySkeleton from '@/fa-duotone/key-skeleton.svg'
import UserGroup from '@/fa-duotone/user-group.svg'
import PeopleGroup from '@/fa-duotone/people-group.svg'
import Sliders from '@/fa-duotone/sliders.svg'
import ShieldKeyhole from '@/fa-duotone/shield-keyhole.svg'
import CaretDown from '@/fa-duotone/caret-down.svg'
import FolderPlus from '@/fa-duotone/folder-plus.svg'
import { FC, SVGProps } from 'react'

interface navItem {
  label: string
  href: string
  icon: FC<SVGProps<SVGSVGElement>>
  subItems?: navItem[]
}

interface NavbarProps {
  isCollapsed: boolean
}

const Navbar = ({ isCollapsed }: NavbarProps) => {
  const pathname = usePathname()

  const dashboardNavItems: navItem[] = [
    { label: 'Vaults', href: '/dashboard/vaults', icon: Vault },
    { label: 'API Keys', href: '/dashboard/api-keys', icon: KeySkeleton },
    { label: 'Users', href: '/dashboard/users', icon: UserGroup },
    {
      label: 'Roles',
      href: '/dashboard/roles',
      icon: ShieldKeyhole,
      subItems: [
        { label: 'User Roles', href: '/dashboard/roles/user', icon: ShieldKeyhole },
        { label: 'Vault Roles', href: '/dashboard/roles/vault', icon: ShieldKeyhole },
      ],
    },
    { label: 'Groups', href: '/dashboard/groups', icon: PeopleGroup },
    { label: 'Settings', href: '/dashboard/settings', icon: Sliders },
  ]

  const filesNavItems: navItem[] = [{ label: 'Add Directory', href: '/files/add-directory', icon: FolderPlus }]

  const navItems: navItem[] = pathname.startsWith('/files') ? filesNavItems : dashboardNavItems

  const isSubItemActive = (item: navItem): boolean => {
    if (!item.subItems) return false
    return item.subItems.some(sub => pathname.startsWith(sub.href))
  }

  const renderNavItem = (item: navItem, depth = 0) => {
    const isActive = pathname.startsWith(item.href) || isSubItemActive(item)
    const isExactActive = pathname === item.href
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = hasSubItems && isActive

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
            'rounded-md px-2 py-2',
            depth === 0 ? 'text-base font-medium' : 'pl-4 text-sm font-normal',
            isExactActive ? 'bg-cyan-700/80 font-semibold text-white shadow-inner'
            : isActive ? 'bg-cyan-800/40 text-white'
            : 'text-cyan-300 hover:bg-cyan-700/30 hover:text-white',
          )}>
          <span className="inline-flex items-center gap-2">
            <Icon className={`fill-current text-cyan-300 ${isCollapsed ? 'text-2xl' : 'text-xl'}`} />
            {!isCollapsed && item.label}
          </span>
          {!isCollapsed && hasSubItems && <CaretDown className="fill-current text-cyan-600" />}
        </Link>

        {!isCollapsed && hasSubItems && isExpanded && (
          <div className="ml-2 flex flex-col border-l border-cyan-900/30 pl-4">
            {item.subItems?.map(subItem => renderNavItem(subItem, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return (
    <nav
      className={`bg-secondary text-primary flex h-full flex-col space-y-2 rounded-xl p-4 shadow-lg ${isCollapsed ? 'w-[85%] items-center' : ''}`}>
      {navItems.map(item => renderNavItem(item))}
    </nav>
  )
}

export default Navbar
