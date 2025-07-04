'use client'

import { usePermsStore } from '@/stores/permissionStore'
import RolesComponent from '@/components/roles/RolesComponent'

const VaultRolesClientPage = () => {
  const { roles } = usePermsStore()
  return <RolesComponent roles={roles} />
}

export default VaultRolesClientPage
