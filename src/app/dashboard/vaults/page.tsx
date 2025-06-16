'use client'

import { useVaultStore } from '@/stores/vaultStore'
import VaultCard from '@/components/vault/VaultCard'
import { useEffect } from 'react'

const VaultsPage = () => {
  const { vaults } = useVaultStore()

  useEffect(() => {
    // Fetch vaults when the component mounts
    useVaultStore.getState().fetchVaults()
  }, [])

  return (
    <div>
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-semibold">Vaults</h1>
        <p>Manage your vaults here.</p>
      </div>
      {vaults && vaults.length > 0 && (
        <div>
          <ul>
            {vaults.map(vault => (
              <VaultCard {...vault} key={vault.id} />
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default VaultsPage
