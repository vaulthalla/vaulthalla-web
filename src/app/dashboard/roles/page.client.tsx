'use client'

import { usePermsStore } from '@/stores/permissionStore'
import RoleCard from '@/components/roles/RoleCard'

const RolesClientPage = () => {
  const { roles } = usePermsStore()

  return (
    <div className="h-full w-full px-6 py-8">
      <h1 className="mb-6 text-center text-3xl font-bold text-white">Manage Roles</h1>

      {roles.length > 0 ?
        <div className="3xl:grid-cols-3 grid gap-6 sm:grid-cols-1 md:grid-cols-2">
          {roles.map(role => (
            <RoleCard {...role} key={role.id} />
          ))}
        </div>
      : <p className="text-center text-white/60">No roles found.</p>}
    </div>
  )
}

export default RolesClientPage
