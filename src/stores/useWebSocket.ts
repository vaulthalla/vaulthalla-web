import { create } from 'zustand'
import { v4 as uuidv4 } from 'uuid'
import { useAuthStore } from './authStore'
import { WebSocketCommandMap } from '@/util/webSocketCommands'

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

  connect: () => void
  disconnect: () => void
  sendCommand: <C extends keyof WebSocketCommandMap>(
    command: C,
    payload: WebSocketCommandMap[C]['payload'],
  ) => Promise<WebSocketCommandMap[C]['response']>
}

export const useWebSocketStore = create<WebSocketStore>((set, get) => ({
  socket: null,
  connected: false,
  pending: {},

  connect: () => {
    const { socket, connected } = get()
    if (connected || socket) return

    const ws = new WebSocket(`ws://${window.location.hostname}:9001`)

    ws.onopen = () => {
      set({ connected: true })
      console.log('[WS] Connected')
    }

    ws.onclose = () => {
      set({ connected: false, socket: null })
      console.warn('[WS] Disconnected')
      // TODO: retry logic here if needed
    }

    ws.onmessage = event => {
      try {
        const message = JSON.parse(event.data)
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
    if (socket) socket.close()
    set({ socket: null, connected: false, pending: {} })
  },

  sendCommand: async (command, payload) => {
    const { socket, connected, pending } = get()
    const token = useAuthStore.getState().token

    if (!connected || !socket) throw new Error('WebSocket not connected')
    if (!token) throw new Error('No auth token')

    const requestId = uuidv4()

    const message: WebSocketMessage<typeof command> = {
      command,
      payload,
      requestId,
      token,
    }

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
}))
