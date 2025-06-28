'use client'

import { FileSystem } from '@/components/files/FileSystem'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'
import { useFSStore } from '@/stores/fsStore'
import { FileDropOverlay } from '@/components/files/FileDropOverlay'

const FilesClientPage = () => {
  const { files } = useFSStore()

  if (!files) return <CircleNotchLoader />

  const processFiles = (files: File[]) => {
    const { uploadFile } = useFSStore.getState()
    ;(async () => {
      for (const file of files) await uploadFile({ file })
    })()
  }

  return (
    <FileDropOverlay onFiles={processFiles}>
      <FileSystem files={files} onNavigate={() => {}} />
    </FileDropOverlay>
  )
}

export default FilesClientPage
