import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { APIKey, S3APIKey, toAPIKeyArray } from '@/models/apiKey'

interface ApiKeyStore {
  apiKeys: APIKey[]
  fetchApiKeys: (payload: WSCommandPayload<'storage.apiKey.list.user'>) => Promise<void>
  addApiKey: (payload: WSCommandPayload<'storage.apiKey.add'>) => Promise<void>
  removeApiKey: (payload: WSCommandPayload<'storage.apiKey.remove'>) => Promise<void>
  getApiKey: (payload: WSCommandPayload<'storage.apiKey.get'>) => Promise<APIKey | S3APIKey>
}

export const useApiKeyStore = create<ApiKeyStore>()(
  persist(
    (set, get) => ({
      apiKeys: [],

      async fetchApiKeys() {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('storage.apiKey.list.user', {})
        set({ apiKeys: toAPIKeyArray(JSON.parse(response.keys)) })
      },

      async addApiKey(apiKeyPayload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        await sendCommand('storage.apiKey.add', apiKeyPayload)
        await get().fetchApiKeys({})
      },

      async removeApiKey({ keyId }) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        await sendCommand('storage.apiKey.remove', { keyId })

        const current = get().apiKeys.find(k => k.id === keyId)
        if (current) {
          await get().fetchApiKeys({})
        }
      },

      async getApiKey({ keyId }) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('storage.apiKey.get', { keyId })
        return response.key
      },
    }),
    {
      name: 'vaulthalla-api-keys',
      partialize: state => ({ apiKeys: state.apiKeys }),

      onRehydrateStorage: () => () => {
        console.log('[ApiKeyStore] Rehydrated from storage')
        ;(async () => {
          try {
            console.log('[ApiKeyStore] Waiting for WebSocket connection...')
            const ws = (await import('@/stores/useWebSocket')).useWebSocketStore
            await ws.getState().waitForConnection()
            console.log('[ApiKeyStore] WebSocket connected. Re-fetching API keys...')

            await useApiKeyStore.getState().fetchApiKeys({})
            console.log('[ApiKeyStore] API key fetch complete')
          } catch (err) {
            console.error('[ApiKeyStore] Rehydrate fetch failed:', err)
          }
        })()
      },
    },
  ),
)
