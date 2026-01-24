'use client'

import { useVaultStore } from '@/stores/vaultStore'
import VaultCard from '@/components/vault/VaultCard'
import { useEffect } from 'react'
import Link from 'next/link'
import { Button } from '@/components/Button'
import Plus from '@/fa-regular/plus.svg'

const VaultsClientPage = () => {
  const { vaults } = useVaultStore()

  useEffect(() => {
    // Fetch vaults when the component mounts
    useVaultStore.getState().fetchVaults()
  }, [])

  const VaultsMap = () =>
    vaults
    && vaults.length > 0 && (
      <div>
        <ul>
          {vaults.map(vault => (
            <Link href={`/src/app/vaults/${vault.id}`} key={vault.id}>
              <li className="mb-4">
                <VaultCard {...vault} key={vault.id} />
              </li>
            </Link>
          ))}
        </ul>
      </div>
    )

  return (
    <div>
      <div className="mb-4 text-center">
        <h1 className="text-4xl font-semibold">Vaults</h1>
        <p>Manage your vaults here.</p>
        <Link href="/src/app/vaults/add">
          <Button type="button">
            <Plus className="text-secondary mr-2 fill-current" /> Add Vault
          </Button>
        </Link>
      </div>
      <VaultsMap />
    </div>
  )
}

export default VaultsClientPage
