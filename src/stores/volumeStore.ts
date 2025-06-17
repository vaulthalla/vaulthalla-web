import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { useAuthStore } from '@/stores/authStore'
import { toVolumeArray, Volume } from '@/models/volumes'

interface VolumeStore {
  volumes: Volume[]
  getVolumes: ({ vaultId }: { vaultId: number }) => Volume[]
  fetchVolumes: (payload: WSCommandPayload<'storage.volume.list'>) => Promise<void>
  fetchUserVolumes: (payload: WSCommandPayload<'storage.volume.list.user'>) => Promise<void>
  addVolume: (payload: WSCommandPayload<'storage.volume.add'>) => Promise<void>
  removeVolume: (payload: WSCommandPayload<'storage.volume.remove'>) => Promise<void>
  getVolume: (payload: WSCommandPayload<'storage.volume.get'>) => Promise<Volume | undefined>
}

export const useVolumeStore = create<VolumeStore>()(
  persist(
    (set, get) => ({
      volumes: [],

      getVolumes({ vaultId }) {
        if (vaultId) return get().volumes.filter(v => v.vault_id === vaultId)
        return get().volumes
      },

      async fetchVolumes({ vaultId }) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('storage.volume.list', { vaultId })
        set({ volumes: toVolumeArray(JSON.parse(response.volumes)) })
      },

      async fetchUserVolumes(payload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('storage.volume.list.user', payload)
        set({ volumes: toVolumeArray(JSON.parse(response.volumes)) })
      },

      async addVolume(payload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        await sendCommand('storage.volume.add', payload)
        await get().fetchVolumes({ vaultId: payload.vaultID })
      },

      async removeVolume(payload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        await sendCommand('storage.volume.remove', payload)

        const removed = get().volumes.find(v => v.id === payload.volumeId)
        if (removed) {
          await get().fetchVolumes({ vaultId: removed.vault_id })
        }
      },

      async getVolume(payload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('storage.volume.get', payload)
        return response.volume
      },
    }),
    {
      name: 'volume-storage',
      partialize: state => ({ volumes: state.volumes }),

      // Rehydrate handler: reconnect and refresh volumes on reload
      onRehydrateStorage: () => () => {
        console.log('[VolumeStore] Rehydrated from storage')
        ;(async () => {
          try {
            console.log('[VolumeStore] Waiting for WebSocket connection...')
            const ws = (await import('@/stores/useWebSocket')).useWebSocketStore
            await ws.getState().waitForConnection()
            console.log('[VolumeStore] WebSocket connected. Re-fetching volumes...')

            // Optional: fetch all user volumes or specific by vault
            await useVolumeStore.getState().fetchUserVolumes({ userId: Number(useAuthStore.getState().user?.id) || 0 })
            console.log('[VolumeStore] Volume fetch complete')
          } catch (err) {
            console.error('[VolumeStore] Rehydrate fetch failed:', err)
          }
        })()
      },
    },
  ),
)
