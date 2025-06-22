'use client'

import { User } from '@/models/user'
import UserCard from '@/components/users/UserCard'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([])

  useEffect(() => {
    const fetchUsers = async () => await useAuthStore.getState().getUsers()
    if (users.length === 0)
      fetchUsers()
        .then(fetchedUsers => {
          setUsers(fetchedUsers)
        })
        .catch(err => {
          console.error('Failed to fetch users:', err)
        })
  }, [users.length])

  return (
    <div>
      <h1>Users</h1>
      {users.map(user => (
        <UserCard {...user} key={user.id} />
      ))}
    </div>
  )
}

export default UsersList
