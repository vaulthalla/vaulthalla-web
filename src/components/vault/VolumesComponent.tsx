'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/Button'
import { useVolumeStore } from '@/stores/volumeStore'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { getErrorMessage } from '@/util/handleErrors'
import { Volume } from '@/models/volumes'
import Link from 'next/link'

interface VolumesComponentProps {
  vaultId: number
}

export default function VolumesComponent({ vaultId }: VolumesComponentProps) {
  const [volumes, setVolumes] = useState<Volume[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let timeout: NodeJS.Timeout | null = null

    const loadVolumes = async () => {
      try {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        // If fetch is *too* fast, delay setting loading to true at all
        timeout = setTimeout(() => setLoading(true), 50)

        setVolumes(useVolumeStore.getState().getVolumes({ vaultId }))
      } catch (err) {
        setError(getErrorMessage(err) || 'Failed to load volumes')
      } finally {
        if (timeout) clearTimeout(timeout)
        setLoading(false)
      }
    }

    loadVolumes()

    return () => {
      if (timeout) clearTimeout(timeout)
    }
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

      {!loading
        && volumes.map(volume => (
          <motion.div
            key={volume.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * volume.id }}
            className="mb-4 rounded border border-gray-700 bg-gray-800 p-4 text-sm">
            <p>
              <span className="font-semibold text-white">Name:</span> {volume.name}
            </p>
            <p>
              <span className="font-semibold text-white">Path:</span> {volume.path_prefix}
            </p>
            <p>
              <span className="font-semibold text-white">Quota:</span>{' '}
              {volume.quota_bytes ? `${(volume.quota_bytes / 1_073_741_824).toFixed(2)} GB` : 'Unlimited'}
            </p>
            <p className="text-gray-400">Created: {new Date(volume.created_at).toLocaleString()}</p>
          </motion.div>
        ))}

      <Link href="/dashboard/vaults/[slug]/add-volume" as={`/dashboard/vaults/${vaultId}/add-volume`}>
        <Button className="mt-4 cursor-pointer">Add New Volume</Button>
      </Link>
    </motion.div>
  )
}
