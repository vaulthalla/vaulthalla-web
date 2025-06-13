'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { getErrorMessage } from '@/util/handleErrors'
import { useState } from 'react'

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

  const onSubmit = async (data: LoginFormValues) => {
    setError('')
    try {
      await login(data.email, data.password)
      if (useAuthStore.getState().token) {
        router.push('/dashboard')
      } else {
        setError('Login failed')
      }
    } catch (err) {
      setError(getErrorMessage(err) || 'Login failed')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-12 max-w-sm space-y-4 rounded bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="text-2xl font-bold">Login to Vaulthalla</h2>

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

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand dark:bg-brand-dark w-full rounded py-2 text-white hover:opacity-90 disabled:opacity-50">
        {isSubmitting ? 'Logging in...' : 'Login'}
      </button>
      <p className="text-sm text-gray-500">
        Don&apos;t have an account?{' '}
        <a href="/register" className="text-brand dark:text-brand-dark hover:underline">
          Register here
        </a>
      </p>
    </form>
  )
}

export default LoginForm
