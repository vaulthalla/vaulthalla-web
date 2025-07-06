'use client'

import { FileSystem } from '@/components/files/FileSystem'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'
import { useFSStore } from '@/stores/fsStore'
import { FileDropOverlay } from '@/components/files/FileDropOverlay'
import { FileWithRelativePath } from '@/models/systemFile'

const FilesClientPage = () => {
  const { files, path, uploadFile, setPath } = useFSStore()

  if (!files) return <CircleNotchLoader />

  const processFiles = (files: FileWithRelativePath[]) => {
    ;(async () => {
      for (const file of files) {
        await uploadFile({ file, targetPath: path + '/' + file.relativePath })
      }
    })()
  }

  return (
    <FileDropOverlay onFiles={processFiles}>
      <FileSystem files={files} onNavigate={setPath} />
    </FileDropOverlay>
  )
}

export default FilesClientPage
