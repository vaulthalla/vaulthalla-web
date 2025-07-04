import Link from 'next/link'
import { Button } from '@/components/Button'
import RoleCard from '@/components/roles/RoleCard'
import { Role, UserRole } from '@/models/role'
import { usePathname } from 'next/navigation'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'

const RolesComponent = ({ roles }: { roles: Role[] | UserRole[] }) => {
  const path = usePathname()
  const isUserRole = path.endsWith('/user')

  const title = isUserRole ? 'Manage User Roles' : 'Manage Vault Roles'

  if (!roles) return <CircleNotchLoader />

  return (
    <div className="h-full w-full px-6 py-8">
      <h1 className="text-center text-3xl font-bold text-white">{title}</h1>
      <Link href="/dashboard/roles/add">
        <Button type="button" className="my-6">
          + Add Role
        </Button>
      </Link>

      {roles.length > 0 ?
        <div className="3xl:grid-cols-3 grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {roles.map(role => (
            <Link href="/dashboard/roles/[role_id]" as={`/dashboard/roles/${role.id}`} key={role.id}>
              <RoleCard {...role} key={role.id} />
            </Link>
          ))}
        </div>
      : <p className="text-center text-white/60">No roles found.</p>}
    </div>
  )
}

export default RolesComponent
