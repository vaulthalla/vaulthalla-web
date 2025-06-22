'use client'

import { User } from '@/models/user'
import { motion } from 'framer-motion'
import ShieldHalved from '@/fa-duotone/shield-halved.svg'
import UserIcon from '@/fa-duotone/user.svg'
import UserSecret from '@/fa-duotone/user-secret.svg'
import Gavel from '@/fa-duotone/gavel.svg'
import Crown from '@/fa-duotone/crown.svg'

const UserCard = (user: User) => {
  const getIcon = (role: string) => {
    if (role === 'Super Administrator') return Crown
    else if (role === 'Administrator') return ShieldHalved
    else if (role === 'Moderator') return Gavel
    else if (role === 'User') return UserIcon
    else if (role === 'Guest') return UserSecret
    else return UserIcon
  }

  const Icon = getIcon(user.role)

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      whileHover={{ scale: 1.02 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="card-glass my-4 w-128 rounded-2xl border border-white/10 p-6 text-left shadow-xl backdrop-blur-md transition-transform duration-300 hover:shadow-2xl">
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
            <span className="font-medium text-gray-400">Role:</span> {user.role}
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
    </motion.div>
  )
}

export default UserCard
