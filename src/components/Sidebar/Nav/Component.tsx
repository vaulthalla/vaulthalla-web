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
    { label: 'Dashboard', href: '/dashboard' },
    { label: 'Files', href: '/files' },
    {
      label: 'Vaults',
      href: '/vaults',
      subItems: [
        { label: 'Local Disk', href: '/vaults/local', subItems: [{ label: 'Volumes', href: '/vaults/local/volumes' }] },
        {
          label: 'S3',
          href: '/vaults/s3',
          subItems: [
            { label: 'Buckets', href: '/vaults/s3/buckets' },
            { label: 'Volumes', href: '/vaults/s3/volumes' },
            { label: 'API Keys', href: '/vaults/s3/api-keys' },
          ],
        },
      ],
    },
    { label: 'Settings', href: '/settings' },
    { label: 'Admin', href: '/admin' },
  ]

  console.log(`Current Pathname: ${pathname}`)

  const renderNavItem = (item: navItem, depth = 0) => {
    const isActive = pathname.startsWith(item.href)
    const isExactActive = pathname === item.href

    return (
      <div
        key={item.href}
        className={`flex flex-col ${isActive ? '' : 'space-y-2'} ${isExactActive ? 'bg-cyan-700/50' : ''}`}>
        <Link
          href={item.href}
          className={clsx(
            'transition-colors hover:text-white',
            'px-4 py-2',
            depth === 0 ? 'rounded-t-2xl text-cyan-100' : 'text-sm text-cyan-200',
            isExactActive ? 'bg-cyan-700/50 font-semibold text-white shadow-inner'
            : isActive ? 'bg-cyan-800/30 font-semibold text-white shadow-inner'
            : 'bg-transparent',
          )}>
          {item.label}
        </Link>

        {item.subItems && isActive && (
          <div className={clsx('flex flex-col space-y-2', `ml-${depth * 4} pl-2`, isActive ? 'bg-cyan-800/30' : '')}>
            {item.subItems.map((subItem: navItem) => renderNavItem(subItem, depth + 1))}
          </div>
        )}
      </div>
    )
  }

  return <nav className="flex flex-col space-y-4">{navItems.map(item => renderNavItem(item))}</nav>
}

export default Navbar
