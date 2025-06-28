'use client'

import { useEffect, useState } from 'react'
import { useVolumeStore } from '@/stores/volumeStore'
import { Volume } from '@/models/volumes'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'
import VolumeCard from '@/components/volumes/VolumeCard'
import Link from 'next/link'

const VaultClientPage = ({ id }: { id: number }) => {
  const [volumes, setVolumes] = useState<Volume[] | null>(null)

  useEffect(() => {
    const fetchVolumes = async () => {
      try {
        const vols = await useVolumeStore.getState().getVaultVolumes({ vault_id: id })
        if (!vols) {
          console.error('No volumes found for this vault.')
          return
        }
        setVolumes(vols)
      } catch (error) {
        console.error('Error fetching volumes:', error)
      }
    }

    fetchVolumes()
  }, [])

  if (!volumes) return <CircleNotchLoader />

  return volumes.map(volume => (
    <Link
      href="/dashboard/files/vault/[vault_id]/volume/[volume_id]"
      key={volume.id}
      as={`/dashboard/files/vault/${id}/volume/${volume.id}`}>
      <VolumeCard {...volume} key={volume.id} />
    </Link>
  ))
}

export default VaultClientPage
