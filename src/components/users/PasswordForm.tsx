'use client'

import { useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useEffect, useState } from 'react'
import { User } from '@/models/user'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/Button'

const schema = z
  .object({
    old_password: z.string().min(6, 'Old password is required'),
    new_password: z.string().min(8, 'New password must be at least 8 characters'),
    confirm_password: z.string(),
  })
  .refine(data => data.new_password === data.confirm_password, {
    message: 'Passwords do not match',
    path: ['confirm_password'],
  })

type PasswordFormInputs = z.infer<typeof schema>

const PasswordForm = ({ id }: { id: number }) => {
  const router = useRouter()
  const { changePassword, getUser } = useAuthStore()
  const [user, setUser] = useState<User | null>(null)

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<PasswordFormInputs>({ resolver: zodResolver(schema) })

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const fetchedUser = await getUser(id)
        setUser(fetchedUser)
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }

    fetchUser()
  }, [id, getUser])

  const onSubmit = async (data: PasswordFormInputs) => {
    try {
      await changePassword(id, data.old_password, data.new_password)
      router.push('/dashboard/users')
    } catch (err) {
      console.error('Failed to change password:', err)
      // TODO: Add toast/alert here if needed
    }
  }

  if (!user) return <CircleNotchLoader />

  return (
    <div className="mx-auto mt-12 max-w-sm space-y-4 rounded-3xl bg-white p-6 shadow dark:bg-gray-800">
      <h2 className="text-2xl font-semibold">Change Password for User</h2>
      <div className="text-gray-300">
        <h3>
          Name: <span className="text-gray-50">{user.name}</span>
        </h3>
        <h3>
          Email: <span className="text-gray-50">{user.email}</span>
        </h3>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="mt-4 flex max-w-md flex-col gap-4 text-sm">
        <div>
          <label className="block font-medium text-gray-200">Old Password</label>
          <input
            type="password"
            {...register('old_password')}
            className="focus:ring-primary w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:outline-none"
          />
          {errors.old_password && <p className="mt-1 text-red-400">{errors.old_password.message}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-200">New Password</label>
          <input
            type="password"
            {...register('new_password')}
            className="focus:ring-primary w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:outline-none"
          />
          {errors.new_password && <p className="mt-1 text-red-400">{errors.new_password.message}</p>}
        </div>

        <div>
          <label className="block font-medium text-gray-200">Confirm New Password</label>
          <input
            type="password"
            {...register('confirm_password')}
            className="focus:ring-primary w-full rounded-lg border border-gray-600 bg-gray-800 px-3 py-2 text-white focus:ring-2 focus:outline-none"
          />
          {errors.confirm_password && <p className="mt-1 text-red-400">{errors.confirm_password.message}</p>}
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Updating...' : 'Change Password'}
        </Button>
      </form>
    </div>
  )
}

export default PasswordForm
