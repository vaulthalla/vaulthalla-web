'use client'

import { Role } from '@/models/role'
import { motion } from 'framer-motion'

// FA Pro Icons
import UsersGear from '@/fa-duotone/users-gear.svg'
import UserShield from '@/fa-duotone/user-shield.svg'
import Database from '@/fa-duotone/database.svg'
import FolderTree from '@/fa-duotone/folder-tree.svg'
import ClipboardList from '@/fa-duotone/clipboard-list.svg'
import CloudUpload from '@/fa-duotone/cloud-arrow-up.svg'
import CloudDownload from '@/fa-duotone/cloud-arrow-down.svg'
import TrashCan from '@/fa-duotone/trash-can.svg'
import ShareNodes from '@/fa-duotone/share-nodes.svg'
import Lock from '@/fa-duotone/lock.svg'

const permissionIconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  'MANAGE USERS': UsersGear,
  'MANAGE ROLES': UserShield,
  'MANAGE STORAGE': Database,
  'MANAGE FILES': FolderTree,
  'VIEW AUDIT LOG': ClipboardList,
  'UPLOAD FILE': CloudUpload,
  'DOWNLOAD FILE': CloudDownload,
  'DELETE FILE': TrashCan,
  'SHARE FILE': ShareNodes,
  'LOCK FILE': Lock,
}

const RoleCard = (role: Role) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mb-4 rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-md transition hover:scale-[1.01]">
      <h3 className="mb-1 text-xl font-semibold text-white">{role.display_name}</h3>
      <p className="mb-4 text-sm text-white/70">{role.description || 'No description provided'}</p>

      {role.permissions.length > 0 ?
        <div className="flex flex-wrap gap-3 rounded-lg bg-black/20 p-3">
          {role.permissions.map((perm, index) => {
            const label = perm.replaceAll('_', ' ').toUpperCase()
            const Icon = permissionIconMap[label]
            return Icon ?
                <Icon
                  key={index}
                  className="text-glow-orange h-5 w-5 fill-current transition-transform hover:scale-110"
                  aria-label={label}
                />
              : <div key={index} className="h-5 w-5 text-white/30" title={label}>
                  •
                </div>
          })}
        </div>
      : <p className="text-sm text-white">No permissions assigned</p>}
    </motion.div>
  )
}

export default RoleCard
