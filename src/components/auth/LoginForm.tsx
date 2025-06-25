'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { getErrorMessage } from '@/util/handleErrors'
import { useState } from 'react'
import Logo from '@/public/vaulthalla-logo.png'
import NextImage from 'next/image'
import { Button } from '@/components/Button'
import { useWebSocketStore } from '@/stores/useWebSocket'

interface LoginFormValues {
  email: string
  password: string
}

const LoginForm = () => {
  const router = useRouter()
  const { login } = useAuthStore()
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>()

  const loginQuotes = [
    'He who holds many keys may enter; but only the worthy unlock the vault.',
    'This is no ordinary cloud. This is Vaulthalla.',
    'Glory is not given; it is granted at the gate.',
    'You are not logging in. You are entering the archive of the gods.',
    'Only the sovereign may cross this threshold.',
    'Legacy begins with access. Protect it.',
    'Knowledge is power. In Vaulthalla, it is sacred.',
    'All who enter must remember why they came.',
  ]

  const randomQuote = loginQuotes[Math.floor(Math.random() * loginQuotes.length)]

  const onSubmit = async (data: LoginFormValues) => {
    setError('')
    try {
      await useWebSocketStore.getState().waitForConnection()
      await login(data.email, data.password)
      if (useAuthStore.getState().token) router.push('/dashboard')
      else setError('Login failed')
    } catch (err) {
      setError(getErrorMessage(err) || 'Login failed')
    }
  }

  return (
    <div className="flex flex-col items-center justify-center rounded-4xl bg-blue-800/20 p-8">
      <NextImage src={Logo} alt="Vaulthalla Logo" width={200} height={200} className="mb-8" />
      <p className="mb-6 max-w-sm text-center text-white italic">{randomQuote}</p>
      <form onSubmit={handleSubmit(onSubmit)} className="mx-auto max-w-sm space-y-4">
        <h2 className="text-center text-2xl font-bold">Login to Vaulthalla</h2>

        <input
          type="email"
          placeholder="Enter your email"
          {...register('email', { required: 'Email is required' })}
          className="w-full rounded border px-3 py-2 dark:bg-gray-700"
        />
        {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

        <input
          type="password"
          placeholder="Enter your password"
          {...register('password', { required: 'Password is required' })}
          className="w-full rounded border px-3 py-2 dark:bg-gray-700"
        />
        {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

        {error && <p className="text-sm text-red-500">{error}</p>}

        <Button type="submit" variant="default" disabled={isSubmitting} className="mt-2">
          {isSubmitting ? 'Logging in...' : 'Login'}
        </Button>
      </form>
    </div>
  )
}

export default LoginForm
