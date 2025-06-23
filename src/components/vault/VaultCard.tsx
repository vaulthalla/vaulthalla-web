'use client'

import { Vault } from '@/models/vaults'
import ShieldCheck from '@/fa-regular/shield-check.svg'
import AlertTriangle from '@/fa-regular/triangle-exclamation.svg'
import HardDrive from '@/fa-regular/hard-drive.svg'
import * as motion from 'motion/react-client'

const VaultCard = (vault: Vault) => {
  const getType = (type: string) => {
    switch (type) {
      case 'local':
        return 'Local Disk Vault'
      case 's3':
        return 'S3 Compatible Vault'
      default:
        return 'Unknown Type'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35, ease: 'easeOut' }}
      whileHover={{ scale: 1.015 }}
      whileTap={{ scale: 0.985 }}
      className="card-glass relative my-4 w-96 rounded-xl border p-6 shadow-md transition-transform">
      <div className="absolute top-2.5 right-2.5 text-2xl">
        {vault.isActive ?
          <ShieldCheck className="fill-current text-green-600" />
        : <AlertTriangle className="fill-current text-red-600" />}
      </div>

      <div className="flex items-center space-x-2 text-2xl">
        <HardDrive className="text-primary fill-current" />
        <h2 className="font-bold tracking-tight text-white">{vault.name}</h2>
      </div>

      <div className="text-md mt-4 text-gray-50">
        <p>
          <span className="font-medium text-gray-300">Type:</span> {getType(vault.type)}
        </p>
        <p>
          <span className="font-medium text-gray-300">Created:</span>{' '}
          <span>{new Date(vault.createdAt).toLocaleString()}</span>
        </p>
        <p>
          <span className="font-medium text-gray-300">Status:</span>{' '}
          <span className={vault.isActive ? 'font-semibold text-green-600' : 'font-semibold text-red-600'}>
            {vault.isActive ? 'Active' : 'Inactive'}
          </span>
        </p>
      </div>
    </motion.div>
  )
}

export default VaultCard
