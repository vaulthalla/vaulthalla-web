'use client'

import { useVaultStore } from '@/stores/vaultStore'
import { useEffect, useState } from 'react'
import { LocalDiskStorage, S3Storage, Vault } from '@/models/vaults'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { getErrorMessage } from '@/util/handleErrors'
import VaultComponent from '@/components/vault/VaultComponent'

export default function VaultPage({ slug }: { slug: string }) {
  const [vault, setVault] = useState<Vault | LocalDiskStorage | S3Storage | undefined | null>(null)
  const [error, setError] = useState<string | null>(null)

  const getVault = useVaultStore(state => state.getVault)

  useEffect(() => {
    const vaultId = Number(slug)
    if (Number.isNaN(vaultId)) {
      setError('Invalid vault ID.')
      return
    }

    const loadVault = async () => {
      try {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        const vault = await getVault({ id: vaultId })
        setVault(vault)
      } catch (err) {
        console.error('[VaultPage] Failed to load vault:', err)
        setError(getErrorMessage(err) || 'Unknown error')
      }
    }

    loadVault()
  }, [slug, getVault])

  if (error) {
    return <div className="p-6 font-mono text-red-500">⚠️ Failed to load vault: {error}</div>
  }

  if (!vault) {
    return <div className="p-6 text-gray-500 italic">Loading vault...</div>
  }

  return (
    <div className="p-6">
      <VaultComponent vault={vault} />
    </div>
  )
}
