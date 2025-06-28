'use client'

import * as motion from 'motion/react-client'
import { Vault, LocalDiskStorage, S3Storage } from '@/models/vaults'
import { useState } from 'react'
import VolumesComponent from '@/components/volumes/VolumesComponent'
import { Button } from '@/components/Button'

interface VaultComponentProps {
  vault: Vault | LocalDiskStorage | S3Storage
}

export default function VaultComponent({ vault }: VaultComponentProps) {
  const [showJson, setShowJson] = useState(false)

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mx-auto max-w-4xl p-6">
      <div className="mb-6">
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1, duration: 0.4 }}
          className="text-4xl font-bold">
          {vault.name}
        </motion.h1>
        <p className="mt-2 text-sm text-gray-500">Vault ID: {vault.id}</p>
      </div>

      <div className="mb-4">
        <p className="text-lg font-medium text-gray-300">
          Type: <span className="text-white">{vault.type}</span>
        </p>
        {vault.type === 'local' && (
          <p className="mt-1 text-sm text-gray-400">
            Mount Point: <span className="text-white">{(vault as LocalDiskStorage).mount_point}</span>
          </p>
        )}
        {vault.type === 's3' && (
          <div className="mt-1 text-sm text-gray-400">
            <p>
              Bucket: <span className="text-white">{(vault as S3Storage).bucket}</span>
            </p>
            <p>
              Region: <span className="text-white">{(vault as S3Storage).region}</span>
            </p>
          </div>
        )}
        <p className="mt-1 text-sm text-gray-500">Created: {new Date(vault.createdAt).toLocaleString()}</p>
      </div>

      <Button variant="outline" className="mb-4" onClick={() => setShowJson(prev => !prev)}>
        {showJson ? 'Hide Raw JSON' : 'Show Raw JSON'}
      </Button>

      {showJson && (
        <motion.pre
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mb-6 overflow-x-auto rounded bg-gray-900 p-4 text-green-300">
          {JSON.stringify(vault, null, 2)}
        </motion.pre>
      )}

      <VolumesComponent vault_id={vault.id} />
    </motion.div>
  )
}
