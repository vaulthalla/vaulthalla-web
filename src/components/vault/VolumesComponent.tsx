'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/Button'

interface Volume {
  id: number
  vault_id: number
  name: string
  path_prefix: string
  quota_bytes?: number
  created_at: number
}

interface VolumesComponentProps {
  vaultId: number
}

export default function VolumesComponent({ vaultId }: VolumesComponentProps) {
  const [volumes, setVolumes] = useState<Volume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchVolumes = async () => {
      try {
        // Replace with actual fetch command to your WebSocket or REST API
        const mockData: Volume[] = [
          {
            id: 1,
            vault_id: vaultId,
            name: 'Primary Volume',
            path_prefix: '/mnt/storage/primary',
            quota_bytes: 10737418240,
            created_at: Date.now(),
          },
        ]
        setVolumes(mockData)
      } catch (err: any) {
        setError(err?.message || 'Failed to load volumes')
      } finally {
        setLoading(false)
      }
    }

    fetchVolumes()
  }, [vaultId])

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="mt-8">
      <h2 className="mb-4 text-2xl font-semibold">Volumes</h2>

      {loading && <p className="text-gray-400">Loading volumes...</p>}

      {error && <p className="font-mono text-red-500">{error}</p>}

      {!loading && volumes.length === 0 && <p className="text-gray-500 italic">No volumes found for this vault.</p>}

      {volumes.map(volume => (
        <motion.div
          key={volume.id}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.1 * volume.id }}
          className="mb-4 rounded border border-gray-700 bg-gray-800 p-4 text-sm">
          <p>
            <span className="font-semibold text-white">Name:</span> {volume.name}
          </p>
          <p>
            <span className="font-semibold text-white">Path:</span> {volume.path_prefix}
          </p>
          {volume.quota_bytes && (
            <p>
              <span className="font-semibold text-white">Quota:</span> {(volume.quota_bytes / 1_073_741_824).toFixed(2)}{' '}
              GB
            </p>
          )}
          <p className="text-gray-400">Created: {new Date(volume.created_at).toLocaleString()}</p>
        </motion.div>
      ))}

      <Button className="mt-4">Add New Volume</Button>
    </motion.div>
  )
}
