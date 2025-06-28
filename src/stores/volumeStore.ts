import { create } from 'zustand'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { Volume } from '@/models/volumes'

interface VolumeStore {
  getVaultVolumes: (payload: WSCommandPayload<'storage.volume.list'>) => Promise<Volume[] | null>
  getUserVolumes: (payload: WSCommandPayload<'storage.volume.list.user'>) => Promise<void>
  addVolume: (payload: WSCommandPayload<'storage.volume.add'>) => Promise<void>
  removeVolume: (payload: WSCommandPayload<'storage.volume.remove'>) => Promise<void>
  getVolume: (payload: WSCommandPayload<'storage.volume.get'>) => Promise<Volume | null>
}

export const useVolumeStore = create<VolumeStore>()(() => ({
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
}))
