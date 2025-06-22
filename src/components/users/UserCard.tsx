'use client'

import { User } from '@/models/user'

const UserCard = (user: User) => {
  return (
    <div className="user-card">
      <h3>{user.name}</h3>
      <p>Email: {user.email}</p>
      <p>Created At: {new Date(user.created_at).toLocaleDateString()}</p>
      <p>Last Login: {new Date(user.last_login).toLocaleDateString()}</p>
      <p>Status: {user.is_active ? 'Active' : 'Inactive'}</p>
    </div>
  )
}

export default UserCard
