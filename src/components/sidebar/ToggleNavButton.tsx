'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/Button'
import GaugeHigh from '@/fa-duotone/gauge-high.svg'
import FolderOpen from '@/fa-duotone/folder-open.svg'

const ToggleNavButton = () => {
  const path = usePathname()
  const router = useRouter()

  const isFilesPage = path.startsWith('/dashboard/files')
  const Icon = isFilesPage ? GaugeHigh : FolderOpen
  const route = isFilesPage ? '/dashboard' : '/dashboard/files'
  const buttonText = isFilesPage ? 'Go to Dashboard' : 'Go to Files'

  return (
    <Button
      variant="glow"
      type="button"
      onClick={() => router.push(route)}
      className="flex items-center gap-4 text-xl font-thin">
      {buttonText} <Icon className="fill-current" />
    </Button>
  )
}

export default ToggleNavButton
