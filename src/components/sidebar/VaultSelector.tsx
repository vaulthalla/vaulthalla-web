'use client'

import { Volume } from '@/models/volumes'
import { useFSStore } from '@/stores/fsStore'
import { useVaultStore } from '@/stores/vaultStore'
import { useVolumeStore } from '@/stores/volumeStore'
import { usePathname } from 'next/navigation'

const VaultSelector = () => {
  const { currVault, currVolume, setCurrVault, setCurrVolume } = useFSStore()
  const { vaults } = useVaultStore()
  const { volumes } = useVolumeStore()

  const path = usePathname()
  const isFilesPage = path.startsWith('/dashboard/files')

  const VaultInput = () => {
    const onVaultChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selected = vaults.find(v => String(v.id) === e.target.value)
      if (selected) {
        setCurrVault(selected)
        setCurrVolume(new Volume()) // reset volume
      }
    }

    if (vaults.length === 0) {
      return (
        <select disabled className="w-full rounded border bg-gray-200 p-1">
          <option value="">No Vaults Available</option>
        </select>
      )
    }

    if (vaults.length === 1) {
      return (
        <p className="font-extralight text-gray-300">
          Vault: <span className="font-medium text-white">{currVault?.name}</span>
        </p>
      )
    }

    return (
      <select value={currVault?.id || ''} onChange={onVaultChange} className="w-full rounded border p-1">
        <option value={currVault?.name}>Select Vault</option>
        {vaults.map(v => (
          <option key={v.id} value={v.id}>
            {v.name}
          </option>
        ))}
      </select>
    )
  }

  const VolumeInput = () => {
    const onVolumeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const selected = volumes.find(vol => String(vol.id) === e.target.value)
      if (selected) setCurrVolume(selected)
    }

    return (
      currVault && (
        <select value={currVolume?.id || ''} onChange={onVolumeChange} className="w-full rounded border p-1">
          <option value="">Select Volume</option>
          {volumes.map(vol => (
            <option key={vol.id} value={vol.id}>
              {vol.name}
            </option>
          ))}
        </select>
      )
    )
  }

  return (
    <div className="space-y-2">
      <VaultInput />
      <VolumeInput />
    </div>
  )
}

export default VaultSelector
