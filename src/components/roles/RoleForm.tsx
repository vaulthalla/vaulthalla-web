'use client'

import { useForm, SubmitHandler } from 'react-hook-form'
import { motion } from 'framer-motion'
import { Button } from '@/components/Button'

const sectionVariants = { hidden: { opacity: 0, y: 10 }, visible: { opacity: 1, y: 0 } }

const ADMIN_PERMS = [
  { key: 'create_user', label: 'Create User' },
  { key: 'create_admin_user', label: 'Create Admin User' },
  { key: 'deactivate_user', label: 'Deactivate User' },
  { key: 'reset_user_password', label: 'Reset User Password' },
  { key: 'manage_roles', label: 'Manage Roles' },
  { key: 'manage_settings', label: 'Manage Settings' },
  { key: 'view_audit_log', label: 'View Audit Log' },
  { key: 'manage_api_keys', label: 'Manage API Keys' },
]

const VAULT_PERMS = [
  { key: 'create_local_vault', label: 'Create Local Vault' },
  { key: 'create_cloud_vault', label: 'Create Cloud Vault' },
  { key: 'delete_vault', label: 'Delete Vault' },
  { key: 'adjust_vault_settings', label: 'Adjust Vault Settings' },
  { key: 'migrate_vault_data', label: 'Migrate Vault Data' },
  { key: 'create_volume', label: 'Create Volume' },
  { key: 'delete_volume', label: 'Delete Volume' },
  { key: 'resize_volume', label: 'Resize Volume' },
  { key: 'move_volume', label: 'Move Volume' },
  { key: 'assign_volume_to_group', label: 'Assign Volume to Group' },
]

const FILE_PERMS = [
  { key: 'upload_file', label: 'Upload File' },
  { key: 'download_file', label: 'Download File' },
  { key: 'delete_file', label: 'Delete File' },
  { key: 'share_file_publicly', label: 'Share File Publicly' },
  { key: 'share_file_with_group', label: 'Share File With Group' },
  { key: 'lock_file', label: 'Lock File' },
  { key: 'rename_file', label: 'Rename File' },
  { key: 'move_file', label: 'Move File' },
]

const DIR_PERMS = [
  { key: 'create_directory', label: 'Create Directory' },
  { key: 'delete_directory', label: 'Delete Directory' },
  { key: 'rename_directory', label: 'Rename Directory' },
  { key: 'move_directory', label: 'Move Directory' },
  { key: 'list_directory', label: 'List Directory' },
]

export type RoleFormData = {
  name: string
  description: string
  admin_permissions: Record<string, boolean>
  vault_permissions: Record<string, boolean>
  file_permissions: Record<string, boolean>
  directory_permissions: Record<string, boolean>
}

export default function RoleForm({
  defaultValues,
  action,
}: {
  defaultValues?: RoleFormData
  action: SubmitHandler<RoleFormData>
}) {
  const { register, handleSubmit } = useForm<RoleFormData>({
    defaultValues: defaultValues ?? {
      name: '',
      description: '',
      admin_permissions: {},
      vault_permissions: {},
      file_permissions: {},
      directory_permissions: {},
    },
  })

  const renderCheckboxGroup = (
    title: string,
    perms: { key: string; label: string }[],
    path: 'admin_permissions' | 'vault_permissions' | 'file_permissions' | 'directory_permissions',
  ) => (
    <motion.div
      key={title}
      variants={sectionVariants}
      initial="hidden"
      animate="visible"
      transition={{ duration: 0.2 }}
      className="rounded-xl border border-white/10 bg-white/5 p-4 shadow">
      <h3 className="mb-2 text-sm font-bold tracking-wide text-white/70 uppercase">{title}</h3>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        {perms.map(p => (
          <label key={p.key} className="flex items-center gap-2 text-sm text-white/90">
            <input type="checkbox" {...register(`${path}.${p.key}`)} className="form-checkbox" />
            {p.label}
          </label>
        ))}
      </div>
    </motion.div>
  )

  return (
    <form onSubmit={handleSubmit(action)} className="space-y-6">
      <motion.div variants={sectionVariants} initial="hidden" animate="visible" transition={{ duration: 0.2 }}>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Role Name</label>
          <input {...register('name')} className="w-full rounded border border-white/20 bg-black/20 p-2 text-white" />
        </div>
        <div className="space-y-2">
          <label className="block text-sm font-medium text-white">Description</label>
          <textarea
            {...register('description')}
            className="w-full rounded border border-white/20 bg-black/20 p-2 text-white"
            rows={2}
          />
        </div>
      </motion.div>

      {renderCheckboxGroup('Admin', ADMIN_PERMS, 'admin_permissions')}
      {renderCheckboxGroup('Vault', VAULT_PERMS, 'vault_permissions')}
      {renderCheckboxGroup('File', FILE_PERMS, 'file_permissions')}
      {renderCheckboxGroup('Directory', DIR_PERMS, 'directory_permissions')}

      <div className="text-right">
        <Button type="submit">Save Role</Button>
      </div>
    </form>
  )
}
