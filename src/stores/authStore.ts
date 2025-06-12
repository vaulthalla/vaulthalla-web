import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { getErrorMessage } from '@/util/handleErrors'
import { useWebSocketStore } from '@/stores/useWebSocket'

interface User {
  id: string
  name: string
  email: string
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
          sendCommand('auth.logout', null)
        } catch (err) {
          set({ error: getErrorMessage(err) || 'Logout failed' })
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
      partialize: state => ({ token: state.token }),
      onRehydrateStorage: () => state => {
        if (state?.token) {
          state.fetchUser()
          state.setTokenCookie(state.token) // re-sync token to cookie after hydration
        }
      },
    },
  ),
)
