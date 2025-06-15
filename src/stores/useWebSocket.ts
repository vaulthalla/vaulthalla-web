import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { useAuthStore } from './authStore'
import { WebSocketCommandMap } from '@/util/webSocketCommands'
import { getWebsocketUrl } from '@/util/getUrl'
import { subscribeWithSelector } from 'zustand/middleware'

interface WebSocketMessage<C extends keyof WebSocketCommandMap> {
  command: C
  payload: WebSocketCommandMap[C]['payload']
  requestId: string
  token: string
}

interface WebSocketStore {
  socket: WebSocket | null
  connected: boolean
  pending: Record<
    string,
    <C extends keyof WebSocketCommandMap>(
      data: WebSocketCommandMap[C]['response'] | PromiseLike<WebSocketCommandMap[C]['response']>,
    ) => void
  >

  waitForConnection: () => Promise<void>
  connect: () => void
  disconnect: () => void
  sendCommand: <C extends keyof WebSocketCommandMap>(
    command: C,
    payload: WebSocketCommandMap[C]['payload'],
  ) => Promise<WebSocketCommandMap[C]['response']>
}

export const useWebSocketStore = create<WebSocketStore>()(
  subscribeWithSelector((set, get) => {
    let reconnectTimeout: ReturnType<typeof setTimeout> | null = null
    let shouldReconnect = true

    return {
      socket: null,
      connected: false,
      pending: {},

      waitForConnection: async (): Promise<void> => {
        return new Promise(resolve => {
          if (get().connected) return resolve()

          const unsubscribe = useWebSocketStore.subscribe(
            state => state.connected,
            connected => {
              if (connected) {
                unsubscribe()
                resolve()
              }
            },
          )
        })
      },

      connect: () => {
        const { socket, connected } = get()
        if (connected || socket) return

        const ws = new WebSocket(getWebsocketUrl())

        ws.onopen = () => {
          set({ connected: true })
          console.log('[WS] Connected')
        }

        ws.onclose = () => {
          set({ connected: false, socket: null })
          console.warn('[WS] Disconnected')

          if (shouldReconnect) {
            const retryDelay = 2000 // ms, can implement exponential backoff
            console.log(`[WS] Attempting to reconnect in ${retryDelay / 1000}s...`)
            reconnectTimeout = setTimeout(() => {
              get().connect()
            }, retryDelay)
          }
        }

        ws.onmessage = async event => {
          try {
            const message = JSON.parse(event.data)

            // 🚨 Handle unauthorized error globally
            if (message.command === 'error' && message.status === 'unauthorized') {
              console.warn('[WS] Received unauthorized response — attempting token refresh')

              try {
                await useAuthStore.getState().refreshToken()
                console.log('[WS] Token refreshed — retrying original request not implemented yet')
                // ⚠️ Optionally retry the original message here with message.requestId
              } catch (err) {
                console.error('[WS] Failed to refresh token:', err)
                useAuthStore.getState().logout()
              }

              return // Don't call handler if we're in unauthorized state
            }

            const handler = get().pending[message.requestId]
            if (handler) {
              handler(message.data)
              const newPending = { ...get().pending }
              delete newPending[message.requestId]
              set({ pending: newPending })
            }
          } catch (err) {
            console.error('[WS] Failed to parse message', err)
          }
        }

        set({ socket: ws })
      },

      disconnect: () => {
        const socket = get().socket
        shouldReconnect = false
        if (reconnectTimeout) clearTimeout(reconnectTimeout)
        if (socket) socket.close()
        set({ socket: null, connected: false, pending: {} })
      },

      sendCommand: async (command, payload) => {
        const { socket, connected, pending, connect } = get()
        const token = useAuthStore.getState().token

        if (!connected || !socket) {
          console.warn('[WS] Not connected, attempting to reconnect...')
          connect()
        }

        if (!token && !command.startsWith('auth')) throw new Error('No auth token')

        const requestId = uuidv4()

        const message: WebSocketMessage<typeof command> = { command, payload, requestId, token: token || '' }

        console.log('sending', message)

        if (!socket || !connected) throw new Error('WebSocket is not connected')

        return new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            reject(new Error('Request timed out'))
            const updated = { ...get().pending }
            delete updated[requestId]
            set({ pending: updated })
          }, 10000)

          set({
            pending: {
              ...pending,
              [requestId]: data => {
                clearTimeout(timeout)
                resolve(data)
              },
            },
          })

          socket.send(JSON.stringify(message))
        })
      },
    }
  }),
)
