'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { useAuthStore } from '@/stores/authStore'
import { getErrorMessage } from '@/util/handleErrors'
import { useEffect, useState } from 'react'
import { Button } from '@/components/Button'
import { motion } from 'framer-motion'
import { User } from '@/models/user'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'

type FormData = User & { password: string }

const roleOptions = ['Administrator', 'User', 'Guest', 'Moderator', 'Super Administrator']

const UserForm = ({ id }: { id?: number }) => {
  const router = useRouter()
  const { registerUser, updateUser, getUser } = useAuthStore()
  const [error, setError] = useState('')
  const [user, setUser] = useState<User | null>(null)
  const isEdit = !!id

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<FormData>()

  // Fetch user if editing
  useEffect(() => {
    if (isEdit && id) {
      getUser(id)
        .then(fetchedUser => {
          setUser(fetchedUser)
          reset({ ...fetchedUser, password: '' })
        })
        .catch(err => {
          setError(getErrorMessage(err) || 'Failed to fetch user')
        })
    }
  }, [id, isEdit, getUser, reset])

  const onSubmit = async (data: FormData) => {
    setError('')
    try {
      if (isEdit && user) {
        await updateUser(user.id, data)
      } else {
        await registerUser(data.name, data.email, data.password, Boolean(data.is_active), data.role)
      }
      router.push('/dashboard/users')
    } catch (err) {
      setError(getErrorMessage(err) || 'Failed to save user')
    }
  }

  if (isEdit && !user) return <CircleNotchLoader />

  return (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit(onSubmit)}
      className="mx-auto mt-12 max-w-sm space-y-4 rounded-3xl bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="text-center text-2xl font-bold">{isEdit ? 'Edit User' : 'Add New User'}</h2>

      <input
        type="text"
        placeholder="Enter name"
        {...register('name', { required: 'Name is required' })}
        className="w-full rounded border px-3 py-2 dark:bg-gray-700"
      />
      {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}

      <input
        type="email"
        placeholder="Enter email"
        {...register('email', { required: 'Email is required' })}
        className="w-full rounded border px-3 py-2 dark:bg-gray-700"
      />
      {errors.email && <p className="text-sm text-red-500">{errors.email.message}</p>}

      {!isEdit && (
        <>
          <input
            type="password"
            placeholder="Set password"
            {...register('password', {
              required: 'Password is required',
              minLength: { value: 6, message: 'Min 6 characters' },
            })}
            className="w-full rounded border px-3 py-2 dark:bg-gray-700"
          />
          {errors.password && <p className="text-sm text-red-500">{errors.password.message}</p>}
        </>
      )}

      <select
        {...register('role', { required: 'Role is required' })}
        className="w-full rounded border px-3 py-2 dark:bg-gray-700">
        {roleOptions.map(role => (
          <option key={role} value={role}>
            {role}
          </option>
        ))}
      </select>
      {errors.role && <p className="text-sm text-red-500">{errors.role.message}</p>}

      <select {...register('is_active')} className="w-full rounded border px-3 py-2 dark:bg-gray-700">
        <option value="true">Active</option>
        <option value="false">Inactive</option>
      </select>

      {error && <p className="text-sm text-red-500">{error}</p>}

      <Button type="submit" variant="default" disabled={isSubmitting} className="w-full">
        {isSubmitting ?
          isEdit ?
            'Saving...'
          : 'Registering...'
        : isEdit ?
          'Save Changes'
        : 'Add User'}
      </Button>
    </motion.form>
  )
}

export default UserForm
