'use client'

import { useVaultStore } from '@/stores/vaultStore'
import VaultCard from '@/components/vault/VaultCard'
import { useEffect } from 'react'
import Link from 'next/link'

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
              <Link href={`/dashboard/vaults/${vault.id}`} key={vault.id}>
                <li className="mb-4">
                  <VaultCard {...vault} key={vault.id} />
                </li>
              </Link>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default VaultsPage
