import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { LocalDiskVault, S3Vault, toVaultArray, Vault } from '@/models/vaults'

interface VaultStore {
  vaults: Vault[]
  fetchVaults: () => Promise<void>
  addVault: (vaultPayload: WSCommandPayload<'storage.vault.add'>) => Promise<void>
  removeVault: (payload: WSCommandPayload<'storage.vault.remove'>) => Promise<void>
  getVault: (payload: WSCommandPayload<'storage.vault.get'>) => Promise<LocalDiskVault | S3Vault | Vault>
  getLocalVault: () => Promise<LocalDiskVault | undefined>
}

export const useVaultStore = create<VaultStore>()(
  persist(
    (set, get) => ({
      vaults: [],

      async fetchVaults() {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        const response = await ws.sendCommand('storage.vault.list', null)
        set({ vaults: toVaultArray(response.vaults) })
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
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('storage.vault.get', { id })
        return response.vault
      },

      async getLocalVault() {
        if (!get().vaults.length) await get().fetchVaults()
        const local = get().vaults.find(v => v.type === 'local' && v.is_active)

        if (local instanceof LocalDiskVault) return local
        if (local) return new LocalDiskVault(local)

        return undefined
      },
    }),
    {
      name: 'vaulthalla-vaults', // 🔐 localStorage key
      partialize: state => ({ vaults: state.vaults }), // store only what matters
    },
  ),
)
