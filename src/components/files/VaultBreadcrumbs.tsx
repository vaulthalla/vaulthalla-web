'use client'

import { useFSStore } from '@/stores/fsStore'
import { useVaultStore } from '@/stores/vaultStore'
import { cn } from '@/util/cn'

const VaultBreadcrumbs = ({ className }: { className?: string }) => {
  const { currVault, setCurrVault, path } = useFSStore()
  const { vaults } = useVaultStore()

  const onVaultChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = vaults.find(v => String(v.id) === e.target.value)
    if (selected) setCurrVault(selected)
  }

  const parts = path.split('/').filter(Boolean)

  return (
    <nav className={cn('flex items-center gap-2 text-sm text-gray-300', className)}>
      {/* Vault selector */}
      {vaults.length > 1 ?
        <select value={currVault?.id || ''} onChange={onVaultChange} className="rounded border bg-transparent p-1">
          <option value="">Select Vault</option>
          {vaults.map(v => (
            <option key={v.id} value={v.id}>
              {v.name}
            </option>
          ))}
        </select>
      : vaults.length === 1 ?
        <span className="font-medium text-cyan-400">{currVault?.name}</span>
      : <span className="text-gray-500 italic">No Vaults</span>}

      <span>/</span>

      {/* Breadcrumbs */}
      {parts.length > 0
        && parts.map((part, index) => {
          const fullPath = '/' + parts.slice(0, index + 1).join('/')
          return (
            <span key={fullPath} className="flex items-center">
              <span className="cursor-pointer text-cyan-400 hover:underline">{part}</span>
              {index < parts.length - 1 && <span className="mx-1">/</span>}
            </span>
          )
        })}
    </nav>
  )
}

export default VaultBreadcrumbs
