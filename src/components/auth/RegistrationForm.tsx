'use client'

import {useRouter} from 'next/navigation'
import {useForm} from 'react-hook-form'
import {useAuthStore} from '@/stores/authStore'
import {getErrorMessage} from '@/util/handleErrors'
import {useState} from 'react'

interface RegistrationFormValues {
  email: string
  password: string
  displayName: string
}

const RegistrationForm = () => {
  const router = useRouter()
  const {login, registerUser} = useAuthStore() // assuming `register` is a WS command, but we'll re-use login after registering
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: {errors, isSubmitting},
  } = useForm<RegistrationFormValues>()

  const onSubmit = async (data: RegistrationFormValues) => {
    setError('')
    try {
      await registerUser(data.displayName, data.email, data.password)
      router.push('/')
    } catch (err) {
      setError(getErrorMessage(err) || 'Registration failed')
    }
  }

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-12 max-w-sm space-y-4 rounded bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="text-2xl font-bold">Register for Vaulthalla</h2>

      <input
        type="text"
        placeholder="Enter display name"
        {...register('displayName', {required: 'Display name is required'})}
        className="w-full rounded border px-3 py-2 dark:bg-gray-700"
      />
      {errors.displayName && <p className="text-sm text-red-500">{errors.displayName.message}</p>}

      <input
        type="email"
        placeholder="Enter your email"
        {...register('email', {required: 'Email is required'})}
        className="w-full rounded border px-3 py-2 dark:bg-gray-700"
      />
      {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

      <input
        type="password"
        placeholder="Enter your password"
        {...register('password', {
          required: 'Password is required',
          minLength: {value: 6, message: 'Password must be at least 6 characters'},
        })}
        className="w-full rounded border px-3 py-2 dark:bg-gray-700"
      />
      {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}

      {error && <p className="text-sm text-red-500">{error}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="bg-brand dark:bg-brand-dark w-full rounded py-2 text-white hover:opacity-90 disabled:opacity-50">
        {isSubmitting ? 'Registering...' : 'Register'}
      </button>
    </form>
  )
}

export default RegistrationForm
