import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { useFileDrop } from '@/hooks/useFileDrop'

interface FileDropOverlayProps {
  onFiles: (files: File[]) => void
  children: React.ReactNode
}

export const FileDropOverlay: React.FC<FileDropOverlayProps> = ({ onFiles, children }) => {
  const [isDragging, setIsDragging] = useState(false)
  const dropRef = useFileDrop({
    onFiles: files => {
      setIsDragging(false)
      onFiles(files)
    },
  })

  return (
    <div
      ref={dropRef}
      onDragEnter={() => setIsDragging(true)}
      onDragLeave={() => setIsDragging(false)}
      className="relative">
      {children}
      {isDragging && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-10 border-4 border-dashed border-blue-400 bg-gray-700">
          <div className="flex h-full items-center justify-center text-lg text-white">Drop files to upload</div>
        </motion.div>
      )}
    </div>
  )
}
