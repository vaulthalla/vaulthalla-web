'use client'

import { Vault } from '@/models/vaults'
import ShieldCheck from '@/fa-regular/shield-check.svg'
import AlertTriangle from '@/fa-regular/triangle-exclamation.svg'
import HardDrive from '@/fa-regular/hard-drive.svg'
import * as motion from 'motion/react-client'

const VaultCard = (vault: Vault) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className="relative mb-6 rounded-xl border border-gray-200 bg-gradient-to-br from-gray-50 to-white p-6 shadow-md transition-transform">
      <div className="absolute top-2.5 right-2.5">
        {vault.isActive ?
          <ShieldCheck className="h-5 w-5 fill-current text-green-600" />
        : <AlertTriangle className="h-5 w-5 fill-current text-red-600" />}
      </div>

      <div className="mb-3 flex items-center space-x-2">
        <HardDrive className="h-6 w-6 fill-current text-cyan-600" />
        <h2 className="text-2xl font-bold tracking-tight text-gray-800">{vault.name}</h2>
      </div>

      <div className="text-sm text-gray-600">
        <p>
          <span className="font-medium text-gray-700">Type:</span> {vault.type}
        </p>
        <p>
          <span className="font-medium text-gray-700">Created:</span>{' '}
          <span className="font-mono text-gray-800">{vault.createdAt}</span>
        </p>
        <p>
          <span className="font-medium text-gray-700">Status:</span>{' '}
          <span className={vault.isActive ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
            {vault.isActive ? 'Active' : 'Inactive'}
          </span>
        </p>
      </div>
    </motion.div>
  )
}

export default VaultCard
