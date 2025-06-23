'use client'

import { User } from '@/models/user'
import UserCard from '@/components/users/UserCard'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/authStore'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'
import Link from 'next/link'
import { Button } from '@/components/Button'

const UsersList = () => {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchUsers = async () => await useAuthStore.getState().getUsers()
    if (users.length === 0)
      fetchUsers()
        .then(fetchedUsers => {
          setUsers(fetchedUsers)
          setLoading(false)
        })
        .catch(err => {
          console.error('Failed to fetch users:', err)
        })
  }, [users.length])

  if (loading) return <CircleNotchLoader />

  return (
    <div>
      <div>
        <h1 className="text-4xl">Users</h1>
        {users.map(user => (
          <Link href="/dashboard/users/[id]" as={`/dashboard/users/${user.id}`} key={user.id}>
            <UserCard {...user} />
          </Link>
        ))}
      </div>
      <Link href="/dashboard/users/add">
        <Button type="button" variant="default">
          + Add New User
        </Button>
      </Link>
    </div>
  )
}

export default UsersList
