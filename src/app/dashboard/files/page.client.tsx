'use client'

import { useVaultStore } from '@/stores/vaultStore'
import VaultCard from '@/components/vault/VaultCard'
import Link from 'next/link'

const FilesClientPage = () => {
  const { vaults } = useVaultStore()

  if (vaults.length === 0) return <p>No Vaults found...</p>

  return (
    <div>
      {vaults.map(vault => (
        <Link href="/dashboard/files/vault/[vault_id]" as={`/dashboard/files/vault/${vault.id}`} key={vault.id}>
          <VaultCard {...vault} />
        </Link>
      ))}
    </div>
  )
}

export default FilesClientPage
