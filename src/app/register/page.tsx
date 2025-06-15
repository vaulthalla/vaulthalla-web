'use client'

import RegistrationForm from '@/components/auth/RegistrationForm'
import { useAuthStore } from '@/stores/authStore'
import { redirect } from 'next/navigation'

const RegisterPage = () => {
  const { user, token } = useAuthStore()

  if (token && user?.name) return redirect('/dashboard')

  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <RegistrationForm />
    </main>
  )
}

export default RegisterPage
