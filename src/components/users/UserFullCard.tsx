'use client'

import { User } from '@/models/user'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'
import { motion } from 'framer-motion'
import { getUserIcon } from '@/util/getUserIcon'
import Link from 'next/link'
import { Button } from '@/components/Button'

const UserFullCard = ({ id }: { id: number }) => {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const fetchUser = async () => {
      if (user) return
      try {
        const fetchedUser = await useAuthStore.getState().getUser(id)
        setUser(fetchedUser)
      } catch (err) {
        console.error('Failed to fetch user:', err)
      }
    }

    fetchUser()
  }, [id])

  if (!user) return <CircleNotchLoader />

  const Icon = getUserIcon(user.global_role.display_name)

  return (
    <motion.div
      initial={{ opacity: 0, y: -20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="card-glass my-4 h-fit w-128 rounded-2xl border border-white/10 p-6 text-left shadow-xl backdrop-blur-md transition-transform duration-300 hover:shadow-2xl">
      <div className="mb-4 flex items-center justify-between text-2xl">
        <h3 className="font-semibold tracking-tight text-white">{user.name}</h3>
        <Icon className="text-primary fill-current" />
      </div>
      <div className="text-md space-y-1 text-gray-300">
        <div className="flex w-full items-center justify-between">
          <p>
            <span className="font-medium text-gray-400">Email:</span> {user.email}
          </p>
          <p>
            <span className="font-medium text-gray-400">Role:</span> {user.global_role.display_name}
          </p>
        </div>

        <div className="flex w-full items-center justify-between">
          <p>
            <span className="font-medium text-gray-400">Last Login:</span> {new Date(user.last_login).toLocaleString()}
          </p>
          <p>
            <span className="font-medium text-gray-400">Created:</span> {new Date(user.created_at).toLocaleDateString()}
          </p>
        </div>
      </div>
      <Link href="/dashboard/users/[slug]/edit" as={`/dashboard/users/${user.id}/edit`}>
        <Button variant="default">Edit</Button>
      </Link>
      <Link href="/dashboard/users/[slug]/change-password" as={`/dashboard/users/${user.id}/change-password`}>
        <Button variant="glass" className="mt-2">
          Change Password
        </Button>
      </Link>
    </motion.div>
  )
}

export default UserFullCard
