'use client'

import { FileSystem } from '@/components/files/Filesystem'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'
import { useFSStore } from '@/stores/fsStore'

const FilesClientPage = () => {
  const { files } = useFSStore()

  if (!files) return <CircleNotchLoader />

  return <FileSystem files={files} onNavigate={() => {}} />
}

export default FilesClientPage
