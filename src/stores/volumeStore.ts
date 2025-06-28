import { create } from 'zustand'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { Volume } from '@/models/volumes'
import { persist } from 'zustand/middleware'
import { useFSStore } from '@/stores/fsStore'

interface VolumeStore {
  volumes: Volume[]
  fetchVaultVolumes: (payload: WSCommandPayload<'storage.volume.list.vault'>) => Promise<void>
  getVaultVolumes: (payload: WSCommandPayload<'storage.volume.list'>) => Promise<Volume[] | null>
  getUserVolumes: (payload: WSCommandPayload<'storage.volume.list.user'>) => Promise<void>
  addVolume: (payload: WSCommandPayload<'storage.volume.add'>) => Promise<void>
  removeVolume: (payload: WSCommandPayload<'storage.volume.remove'>) => Promise<void>
  getVolume: (payload: WSCommandPayload<'storage.volume.get'>) => Promise<Volume | null>
}

export const useVolumeStore = create<VolumeStore>()(
  persist(
    (set, get) => ({
      volumes: [],

      async fetchVaultVolumes({ vault_id }) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('storage.volume.list.vault', { vault_id })
        set({ volumes: JSON.parse(response.volumes) })
      },

      async getVaultVolumes({ vault_id }) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('storage.volume.list.vault', { vault_id })
        return JSON.parse(response.volumes)
      },

      async getUserVolumes({ user_id }) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('storage.volume.list.user', { user_id })
        return JSON.parse(response.volumes)
      },

      async addVolume(payload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        await sendCommand('storage.volume.add', payload)
      },

      async removeVolume(payload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        await sendCommand('storage.volume.remove', payload)
      },

      async getVolume(payload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('storage.volume.get', payload)
        return response.volume
      },
    }),
    {
      name: 'vaulthalla-volumes',
      partialize: state => ({ volumes: state.volumes }),
      onRehydrateStorage: state => () => {
        console.log('[VolumeStore] Rehydrated from storage')
        ;(async () => {
          try {
            console.log('[VolumeStore] Waiting for WebSocket connection...')
            await useWebSocketStore.getState().waitForConnection()
            console.log('[VolumeStore] WebSocket connected. Re-fetching volumes...')
            const currVault = useFSStore.getState().currVault

            if (!currVault) {
              console.warn('[VolumeStore] No current vault set, skipping volume re-fetch')
              return
            }

            await state.fetchVaultVolumes({ vault_id: currVault.id })
          } catch (error) {
            console.error('[VolumeStore] Error during rehydration:', error)
          }
        })()
      },
    },
  ),
)
