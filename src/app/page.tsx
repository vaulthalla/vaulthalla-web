'use client'

import { redirect } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'

const Home = () => {
  const { user, token } = useAuthStore()

  return token && user?.name ? redirect('/dashboard') : redirect('/login')
}

export default Home
