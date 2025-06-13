import { create } from 'zustand'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { JSONParsed, WSCommandPayload, WSCommandResponse } from '@/util/webSocketCommands'

type Volume = JSONParsed<WSCommandResponse<'storage.volume.list'>['data']>[number]

interface VolumeStore {
  volumes: Volume[]
  fetchVolumes: (payload: WSCommandPayload<'storage.volume.list'>) => Promise<void>
  addVolume: (payload: WSCommandPayload<'storage.volume.add'>) => Promise<void>
  removeVolume: (payload: WSCommandPayload<'storage.volume.remove'>) => Promise<void>
  getVolume: (payload: WSCommandPayload<'storage.volume.get'>) => Promise<Volume>
}

export const useVolumeStore = create<VolumeStore>(set => ({
  volumes: [],

  async fetchVolumes({ userId }) {
    const sendCommand = useWebSocketStore.getState().sendCommand
    const response = await sendCommand('storage.volume.list', { userId })
    const data = JSON.parse(response.data)
    set({ volumes: data })
  },

  async addVolume(volumePayload) {
    const sendCommand = useWebSocketStore.getState().sendCommand
    await sendCommand('storage.volume.add', volumePayload)
  },

  async removeVolume({ volumeId }) {
    const sendCommand = useWebSocketStore.getState().sendCommand
    await sendCommand('storage.volume.remove', { volumeId })
  },

  async getVolume({ volumeId }) {
    const sendCommand = useWebSocketStore.getState().sendCommand
    const response = await sendCommand('storage.volume.get', { volumeId })
    return response.data
  },
}))
