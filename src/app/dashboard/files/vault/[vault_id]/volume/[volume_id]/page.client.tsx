'use client'

import { FileSystem } from '@/components/files/Filesystem'
import { useEffect, useState } from 'react'
import { File } from '@/models/file'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'
import { useFSStore } from '@/stores/fsStore'

interface VolumeClientProps {
  vault_id: number
  volume_id: number
}

const VolumeClientPage = ({ vault_id, volume_id }: VolumeClientProps) => {
  const [files, setFiles] = useState<File[] | null>(null)

  useEffect(() => {
    const fetchFiles = async () => {
      try {
        const fs = await useFSStore.getState().listDirectory({ vault_id, volume_id })
        if (!fs) {
          console.error('No files found or error fetching files')
          setFiles([])
          return
        }
        setFiles(fs)
      } catch (error) {
        console.error('Error fetching files:', error)
        setFiles([])
      }
    }

    fetchFiles()
  }, [])

  if (!files) return <CircleNotchLoader />

  return <FileSystem files={files} onNavigate={() => {}} />
}

export default VolumeClientPage
