import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { Vault, LocalDiskStorage, toVaultArray, S3Storage } from '@/models/vaults'

interface VaultStore {
  vaults: Vault[]
  fetchVaults: () => Promise<void>
  addVault: (vaultPayload: WSCommandPayload<'storage.vault.add'>) => Promise<void>
  removeVault: (payload: WSCommandPayload<'storage.vault.remove'>) => Promise<void>
  getVault: (
    payload: WSCommandPayload<'storage.vault.get'>,
  ) => Promise<Vault | LocalDiskStorage | S3Storage | undefined>
  getLocalVault: () => LocalDiskStorage | undefined
}

export const useVaultStore = create<VaultStore>()(
  persist(
    (set, get) => ({
      vaults: [],

      async fetchVaults() {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        const response = await ws.sendCommand('storage.vault.list', null)

        const vaults = toVaultArray(JSON.parse(response.vaults))

        set({ vaults })
      },

      async addVault(vaultPayload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        await sendCommand('storage.vault.add', vaultPayload)
      },

      async removeVault({ id }) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        await sendCommand('storage.vault.remove', { id })
      },

      async getVault({ id }) {
        const vault = get().vaults.find(v => v.id === id)
        if (vault) {
          if (vault instanceof LocalDiskStorage || vault instanceof S3Storage) return vault

          if (vault.type === 'local')
            return new LocalDiskStorage(
              vault.id,
              vault.name,
              (vault as LocalDiskStorage).mount_point,
              vault.isActive,
              vault.createdAt,
            )
        }

        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('storage.vault.get', { id })
        return response.vault
      },

      getLocalVault(): LocalDiskStorage | undefined {
        const local = get().vaults.find(v => v.type === 'local' && v.isActive)

        if (local instanceof LocalDiskStorage) return local

        // fallback: rehydrate as class instance if it was plain JSON
        if (local) {
          return new LocalDiskStorage(
            local.id,
            local.name,
            (local as LocalDiskStorage).mount_point,
            local.isActive,
            local.createdAt,
          )
        }

        return undefined
      },
    }),
    {
      name: 'vault-store', // 🔐 localStorage key
      partialize: state => ({ vaults: state.vaults }), // store only what matters
    },
  ),
)
