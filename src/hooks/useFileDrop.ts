import { useEffect, useRef } from 'react'

interface UseFileDropOptions {
  onFiles: (files: File[]) => void
}

export function useFileDrop({ onFiles }: UseFileDropOptions) {
  const dropRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const node = dropRef.current
    if (!node) return

    const handleDragOver = (e: DragEvent) => {
      e.preventDefault()
      e.dataTransfer!.dropEffect = 'copy'
    }

    const handleDrop = (e: DragEvent) => {
      e.preventDefault()
      if (e.dataTransfer?.files?.length) {
        const filesArray = Array.from(e.dataTransfer.files)
        onFiles(filesArray)
      }
    }

    node.addEventListener('dragover', handleDragOver)
    node.addEventListener('drop', handleDrop)

    return () => {
      node.removeEventListener('dragover', handleDragOver)
      node.removeEventListener('drop', handleDrop)
    }
  }, [onFiles])

  return dropRef
}
