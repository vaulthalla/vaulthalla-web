import { create } from 'zustand'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { JSONParsed, WSCommandPayload, WSCommandResponse } from '@/util/webSocketCommands'
import { toVaultArray } from '@/models/vaults'

type Vault = JSONParsed<WSCommandResponse<'storage.vault.list'>['data']>[number]

interface VaultStore {
  vaults: Vault[]
  fetchVaults: () => Promise<void>
  addVault: (vaultPayload: WSCommandPayload<'storage.vault.add'>) => Promise<void>
  removeVault: (payload: WSCommandPayload<'storage.vault.remove'>) => Promise<void>
  getVault: (payload: WSCommandPayload<'storage.vault.get'>) => Promise<Vault>
}

export const useVaultStore = create<VaultStore>(set => ({
  vaults: [],

  async fetchVaults() {
    const sendCommand = useWebSocketStore.getState().sendCommand
    const response = await sendCommand('storage.vault.list', {})
    console.log(response)
    set({ vaults: toVaultArray(response) })
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
    return response.data
  },
}))
