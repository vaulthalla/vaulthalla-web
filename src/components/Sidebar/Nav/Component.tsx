import Link from 'next/link'
import clsx from 'clsx'
import { usePathname } from 'next/navigation'

interface navItem {
  label: string
  href: string
  subItems?: navItem[]
}

const Navbar = () => {
  const pathname = usePathname()

  const navItems = [
    { label: 'Dashboard', href: '/dashboard/dashboard' },
    { label: 'Files', href: '/dashboard/files' },
    {
      label: 'Vaults',
      href: '/dashboard/vaults',
      subItems: [
        {
          label: 'Local Disk',
          href: '/dashboard/vaults/local',
          subItems: [{ label: 'Volumes', href: '/dashboard/vaults/local/volumes' }],
        },
        {
          label: 'S3',
          href: '/dashboard/vaults/s3',
          subItems: [
            { label: 'Buckets', href: '/dashboard/vaults/s3/buckets' },
            { label: 'Volumes', href: '/dashboard/vaults/s3/volumes' },
            { label: 'API Keys', href: '/dashboard/vaults/s3/api-keys' },
          ],
        },
      ],
    },
    {
      label: 'Users',
      href: '/dashboard/users',
      subItems: [
        { label: 'Groups', href: '/dashboard/groups' },
        { label: 'Roles', href: '/dashboard/policies' },
      ],
    },
    { label: 'Settings', href: '/dashboard/settings' },
    { label: 'Admin', href: '/dashboard/admin' },
  ]

  const renderNavItem = (item: navItem, depth = 0) => {
    const isActive = pathname.startsWith(item.href)
    const isExactActive = pathname === item.href
    const hasSubItems = item.subItems && item.subItems.length > 0
    const isExpanded = isActive && hasSubItems

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
          <span>{item.label}</span>
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
    <nav className="flex h-full flex-col space-y-2 rounded-xl bg-cyan-950 p-4 text-cyan-100 shadow-lg">
      {navItems.map(item => renderNavItem(item))}
    </nav>
  )
}

export default Navbar
