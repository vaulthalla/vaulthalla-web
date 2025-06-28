'use client'

import { usePermsStore } from '@/stores/permissionStore'
import RoleForm, { RoleFormData } from '@/components/roles/RoleForm'
import { useRouter } from 'next/navigation'

const AddRoleClientPage = () => {
  const router = useRouter()

  const onSubmit = async (data: RoleFormData) => {
    try {
      const response = await usePermsStore.getState().addRole(data)
      console.log('Role created successfully:', response)
      await usePermsStore.getState().fetchRoles()
      router.push('/dashboard/roles')
    } catch (error) {
      console.error('Error creating role:', error)
    }
  }

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="mb-4 text-2xl font-bold">Add New Role</h1>
      <RoleForm action={onSubmit} />
    </div>
  )
}

export default AddRoleClientPage
