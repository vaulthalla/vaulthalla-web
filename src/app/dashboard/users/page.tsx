import { Button } from '@/components/Button'
import Link from 'next/link'

const UsersPage = () => {
  return (
    <div className="text-center">
      <h1 className="text-4xl font-semibold">Vaulthalla Users</h1>
      <p>Manage and Add Users.</p>
      <Link href="/dashboard/users/add">
        <Button variant="default" className="mt-4">
          + Add New User
        </Button>
      </Link>
    </div>
  )
}

export default UsersPage
