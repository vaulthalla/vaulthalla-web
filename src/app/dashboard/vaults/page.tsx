'use client'

import { useVaultStore } from '@/stores/vaultStore'
import VaultCard from '@/components/vault/VaultCard'
import { useEffect } from 'react'

const VaultsPage = () => {
  const { vaults, fetchVaults } = useVaultStore()

  useEffect(() => {
    const fetchData = async () => await fetchVaults()
    fetchData()
  })

  return (
    <div>
      <h1>Vaults</h1>
      <p>Manage your vaults here.</p>
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
