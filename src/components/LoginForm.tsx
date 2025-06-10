'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import { getErrorMessage } from '@/util/handleErrors'

const LoginForm = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const { login, token } = useAuthStore()

  const handleLogin = async () => {
    setError('')
    const res = await login(email, password)
    if (token) router.push('/')
    else setError(getErrorMessage(res) || 'Login failed')
  }

  return (
    <form
      onSubmit={handleLogin}
      className="mx-auto mt-12 max-w-sm space-y-4 rounded bg-white p-6 shadow dark:bg-gray-800"
    >
      <h2 className="text-2xl font-bold">Login to Vaulthalla</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={e => setEmail(e.target.value)}
        className="w-full rounded border px-3 py-2 dark:bg-gray-700"
        required
      />
      <input
        type="password"
        placeholder="Enter your password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        className="w-full rounded border px-3 py-2 dark:bg-gray-700"
        required
      />

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        className="bg-brand dark:bg-brand-dark w-full rounded py-2 text-white hover:opacity-90"
      >
        Login
      </button>
    </form>
  )
}

export default LoginForm
