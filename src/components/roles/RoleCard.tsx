'use client'

import { Role } from '@/models/role'
import { motion } from 'framer-motion'
import { permissionCategoryMap, permissionIconMap, permissionNameMap } from '@/util/icons/permissionIconMap'

const RoleCard = (role: Role) => {
  // Categorize permissions based on the hard map
  const categorizedPerms: Record<string, string[]> = { Admin: [], Vault: [], File: [], Directory: [] }

  for (const perm of role.permissions) {
    const key = permissionNameMap[perm] || perm
    const category = permissionCategoryMap[key]
    if (category) {
      categorizedPerms[category].push(perm)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="mb-4 rounded-2xl border border-white/10 bg-white/10 p-5 shadow-xl backdrop-blur-md transition hover:scale-[1.01]">
      <h3 className="mb-1 text-xl font-semibold text-white">{role.display_name}</h3>
      <p className="mb-4 text-sm text-white/70">{role.description || 'No description provided'}</p>

      <div className="space-y-4">
        {Object.entries(categorizedPerms).map(([category, perms]) =>
          perms.length > 0 ?
            <div key={category}>
              <h4 className="mb-1 text-sm font-bold tracking-wide text-white/60 uppercase">{category}</h4>
              <div className="flex flex-wrap items-center gap-2 rounded-lg bg-black/20 p-3 sm:gap-3">
                {perms.map((perm, index) => {
                  const mappedKey = permissionNameMap[perm] || perm
                  const Icon = permissionIconMap[mappedKey]
                  return Icon ?
                      <Icon
                        key={index}
                        className="text-glow-orange fill-current text-xl transition-transform hover:scale-110"
                        aria-label={perm}
                      />
                    : <div key={index} className="text-xl text-white/30" title={perm}>
                        •
                      </div>
                })}
              </div>
            </div>
          : null,
        )}
      </div>
    </motion.div>
  )
}

export default RoleCard
