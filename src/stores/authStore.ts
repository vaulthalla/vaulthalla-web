import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getErrorMessage } from '@/util/handleErrors'
import { useWebSocketStore } from '@/stores/useWebSocket'

interface User {
  id: number
  name: string
  email: string
  lastLogin: string | null
}

interface AuthState {
  token: string | null
  user: User | null
  loading: boolean
  error: string | null

  setTokenCookie: (token: string | null) => void
  login: (email: string, password: string) => Promise<void>
  registerUser: (name: string, email: string, password: string) => Promise<void>
  isUserAuthenticated: () => Promise<boolean>
  logout: () => void
  refreshToken: () => Promise<void>
  fetchUser: () => Promise<void>
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      token: null,
      user: null,
      loading: false,
      error: null,

      // Helper to sync token to cookie
      setTokenCookie: (token: string | null) => {
        if (typeof document === 'undefined') return // SSR safety
        if (token) {
          document.cookie = `token=${token}; path=/; secure; sameSite=Strict`
        } else {
          document.cookie = 'token=; Max-Age=0; path=/'
        }
      },

      login: async (email, password) => {
        set({ loading: true, error: null })
        try {
          const sendCommand = useWebSocketStore.getState().sendCommand
          const response = await sendCommand('auth.login', { email, password })

          console.log(response)

          set({ token: response.token, user: response.user })
          get().setTokenCookie(response.token)
        } catch (err) {
          set({ error: getErrorMessage(err) || 'Login failed' })
          throw err
        } finally {
          set({ loading: false })
        }
      },

      registerUser: (name, email, password) => {
        set({ loading: true, error: null })
        return new Promise<void>(async (resolve, reject) => {
          try {
            const sendCommand = useWebSocketStore.getState().sendCommand
            const response = await sendCommand('auth.register', { name, email, password })

            set({ token: response.token, user: response.user })
            get().setTokenCookie(response.token)
            resolve()
          } catch (err) {
            const errorMessage = getErrorMessage(err) || 'Registration failed'
            set({ error: errorMessage })
            reject(errorMessage)
          } finally {
            set({ loading: false })
          }
        })
      },

      isUserAuthenticated: () => {
        set({ loading: true, error: null })
        return new Promise<boolean>(async resolve => {
          try {
            const sendCommand = useWebSocketStore.getState().sendCommand
            const response = await sendCommand('auth.isAuthenticated', null)

            console.log(response)

            set({ user: response.user })
            resolve(true)
            return response.isAuthenticated
          } catch (err) {
            const errorMessage = getErrorMessage(err) || 'Authentication check failed'
            set({ error: errorMessage, user: null })
            resolve(false)
          } finally {
            set({ loading: false })
          }
        })
      },

      logout: () => {
        set({ token: null, user: null })
        get().setTokenCookie(null)
        try {
          const sendCommand = useWebSocketStore.getState().sendCommand
          const socket = useWebSocketStore.getState().socket
          sendCommand('auth.logout', null)
          setTimeout(() => socket?.close(), 100) // Close socket after logout
        } catch (err) {
          set({ error: getErrorMessage(err) || 'Logout failed' })
        }
      },

      refreshToken: async () => {
        try {
          const sendCommand = useWebSocketStore.getState().sendCommand
          const response = await sendCommand('auth.refresh', {}) // relies on HttpOnly cookie

          set({ token: response.token, user: response.user })
          get().setTokenCookie(response.token) // Optional if you're also setting via WebSocketSession
          console.log('[Auth] Token refreshed')
        } catch (err) {
          console.error('[Auth] Token refresh failed', err)
          set({ token: null, user: null, error: getErrorMessage(err) })
          get().setTokenCookie(null)
        }
      },

      fetchUser: async () => {
        const token = get().token
        if (!token) {
          set({ user: null })
          return
        }

        set({ loading: true, error: null })

        try {
          const sendCommand = useWebSocketStore.getState().sendCommand
          const response = await sendCommand('auth.me', null)

          set({ user: response.user })
        } catch (err) {
          set({ token: null, user: null, error: getErrorMessage(err) })
          get().setTokenCookie(null)
        } finally {
          set({ loading: false })
        }
      },
    }),
    {
      name: 'auth-store',
      onRehydrateStorage: () => () => {
        if (useAuthStore.getState().token) return

        console.log('[AuthStore] Rehydrated')

        // Fire and forget (non-blocking)
        ;(async () => {
          try {
            console.log('[AuthStore] Waiting for WebSocket connection...')

            // 💡 MOVE this INSIDE the async block to avoid premature access
            const ws = (await import('@/stores/useWebSocket')).useWebSocketStore

            await ws.getState().waitForConnection()
            console.log('[AuthStore] WebSocket connected. Attempting silent refresh...')

            await useAuthStore.getState().refreshToken()
            console.log('[AuthStore] Silent refresh complete')
          } catch (err) {
            console.error('[AuthStore] Silent refresh failed:', err)
            useAuthStore.getState().logout()
          }
        })()
      },
    },
  ),
)
