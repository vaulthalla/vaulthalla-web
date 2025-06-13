'use client'

import { useAuthStore } from '@/stores/authStore'

export const useAuth = () => {
  const user = useAuthStore(state => state.user)
  const token = useAuthStore(state => state.token)
  const loading = useAuthStore(state => state.loading)
  const error = useAuthStore(state => state.error)
  const isUserAuthenticated = useAuthStore(state => state.isUserAuthenticated)

  return { user, token, loading, error, isUserAuthenticated }
}
