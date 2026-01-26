import type { File as FileModel } from '@/models/file'
import { Directory } from '@/models/directory'
import React from 'react'

export interface FileSystemProps {
  files: (FileModel | Directory)[]
  onNavigate: (path: string) => void
}

export interface RowInfo {
  key: string
  icon: React.ReactNode
  size: string
  modified: string
  previewUrl?: string | null
}

export type RowProps = {
  r: RowModel
  onNavigate: (path: string) => void
  onOpenFile: (f: FileModel) => void
  onContextMenu: (e: React.MouseEvent, r: RowModel) => void
}

export type RowModel = RowInfo & (FileModel | Directory)
