import UsersList from '@/components/users/UsersList'
import { Button } from '@/components/Button'
import Link from 'next/link'

const UsersPage = () => {
  return (
    <div className="text-center">
      <UsersList />
      <Link href="/dashboard/users/add">
        <Button type="button" variant="default">
          + Add New User
        </Button>
      </Link>
    </div>
  )
}

export default UsersPage
