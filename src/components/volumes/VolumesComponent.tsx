'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/Button'
import { useVolumeStore } from '@/stores/volumeStore'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { getErrorMessage } from '@/util/handleErrors'
import { Volume } from '@/models/volumes'
import Link from 'next/link'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'
import VolumeCard from '@/components/volumes/VolumeCard'

interface VolumesComponentProps {
  vault_id: number
}

export default function VolumesComponent({ vault_id }: VolumesComponentProps) {
  const [volumes, setVolumes] = useState<Volume[] | null>(null)
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

        setVolumes(await useVolumeStore.getState().getVaultVolumes({ vault_id }))
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
  }, [vault_id])

  if (!volumes) return <CircleNotchLoader />

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

      {!loading && volumes.map(volume => <VolumeCard {...volume} key={volume.id} />)}

      <Link href="/dashboard/vaults/[slug]/add-volume" as={`/dashboard/vaults/${vault_id}/add-volume`}>
        <Button className="mt-4 cursor-pointer">Add New Volume</Button>
      </Link>
    </motion.div>
  )
}
