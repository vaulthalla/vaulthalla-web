import { create } from 'zustand'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { JSONParsed, WSCommandPayload, WSCommandResponse } from '@/util/webSocketCommands'

type ApiKey = JSONParsed<WSCommandResponse<'storage.apiKey.list'>['data']>[number]

interface ApiKeyStore {
  apiKeys: ApiKey[]
  fetchApiKeys: (payload: WSCommandPayload<'storage.apiKey.list'>) => Promise<void>
  addApiKey: (payload: WSCommandPayload<'storage.apiKey.add'>) => Promise<void>
  removeApiKey: (payload: WSCommandPayload<'storage.apiKey.remove'>) => Promise<void>
  getApiKey: (payload: WSCommandPayload<'storage.apiKey.get'>) => Promise<ApiKey>
}

export const useApiKeyStore = create<ApiKeyStore>(set => ({
  apiKeys: [],

  async fetchApiKeys({ userId }) {
    const sendCommand = useWebSocketStore.getState().sendCommand
    const response = await sendCommand('storage.apiKey.list', { userId })
    const data = JSON.parse(response.data)
    set({ apiKeys: data })
  },

  async addApiKey(apiKeyPayload) {
    const sendCommand = useWebSocketStore.getState().sendCommand
    await sendCommand('storage.apiKey.add', apiKeyPayload)
  },

  async removeApiKey({ keyId }) {
    const sendCommand = useWebSocketStore.getState().sendCommand
    await sendCommand('storage.apiKey.remove', { keyId })
  },

  async getApiKey({ keyId }) {
    const sendCommand = useWebSocketStore.getState().sendCommand
    const response = await sendCommand('storage.apiKey.get', { keyId })
    return response.data
  },
}))
