'use client'

import React, { useMemo, useState, memo, useRef } from 'react'
import * as motion from 'motion/react-client'
import ArrowRight from '@/fa-duotone/arrow-right.svg'
import Folder from '@/fa-duotone/folder.svg'
import FileIcon from '@/fa-duotone/file.svg'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/table'
import { ScrollArea } from '@/components/ScrollArea'
import { CardContent } from '@/components/card/CardContent'
import { Card } from '@/components/card/Card'
import type { File as FileModel } from '@/models/file'
import { Directory } from '@/models/directory'
import { getPreviewUrl } from '@/util/getUrl'
import { FilePreviewModal } from './FilePreviewModal'
import Image from 'next/image'
import { useFSStore } from '@/stores/fsStore'
import { ContextMenu } from '@/components/files/ContextMenu' // Assumes this exists in same folder

const isDirectory = (file: FileModel | Directory): file is Directory => (file as Directory).file_count !== undefined

const formatSize = (item: FileModel | Directory): string => {
  const bytes = item.size_bytes
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const val = bytes / 1024 ** i
  return `${val.toFixed(val < 10 ? 1 : 0)} ${units[i]}`
}

interface FileSystemProps {
  files: (FileModel | Directory)[]
  onNavigate: (path: string) => void
}

interface RowInfo {
  key: string
  icon: React.ReactNode
  size: string
  modified: string
  previewUrl?: string | null
}

type RowModel = RowInfo & (FileModel | Directory)

export const FileSystem: React.FC<FileSystemProps> = memo(({ files, onNavigate }) => {
  const [hovered, setHovered] = useState<string | null>(null)
  const [selectedFile, setSelectedFile] = useState<FileModel | null>(null)
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; row: RowModel } | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const { setCopiedItem, copiedItem, pasteCopiedItem } = useFSStore()

  const handleDelete = (entryName: string) => {
    useFSStore
      .getState()
      .delete(entryName)
      .then(() => {
        useFSStore.getState().fetchFiles()
      })
      .catch(err => console.error('Error deleting file:', err))
  }

  const rows: RowModel[] = useMemo(
    () =>
      files.map(f => {
        const key = f.path || f.name
        const previewUrl =
          !isDirectory(f) ?
            `${getPreviewUrl()}?vault_id=${f.vault_id}&path=${encodeURIComponent(f.path || f.name)}&size=64`
          : null

        return {
          key,
          icon:
            isDirectory(f) ?
              <Folder className="text-primary fill-current" />
            : <FileIcon className="text-primary fill-current" />,
          size: formatSize(f),
          modified: new Date(f.updated_at).toLocaleString(),
          previewUrl,
          ...f,
        }
      }),
    [files],
  )

  const Header = () => (
    <TableHeader>
      <TableRow className="bg-gray-800/50">
        <TableHead className="w-1/2 pl-6 text-gray-300">Name</TableHead>
        <TableHead className="w-1/10 text-gray-300">Size</TableHead>
        <TableHead className="w-1/4 text-gray-300">Last Modified</TableHead>
      </TableRow>
    </TableHeader>
  )

  const Body = () => (
    <TableBody>
      {rows.map(r => (
        <motion.tr
          key={r.key}
          initial={{ opacity: 0, x: -6 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: 6 }}
          whileHover={{ scale: 1.01 }}
          className="cursor-pointer border-b border-gray-800/60 transition-colors hover:bg-gray-800/70"
          onContextMenu={e => {
            e.preventDefault()
            setContextMenu({ mouseX: e.clientX, mouseY: e.clientY, row: r })
          }}>
          <TableCell
            className="flex items-center gap-2 pl-2 text-white"
            onClick={() => (isDirectory(r) ? onNavigate(r.path ?? r.name) : setSelectedFile(r as FileModel))}>
            {!isDirectory(r) && r.previewUrl ?
              <Image src={r.previewUrl} alt={r.name} height={30} width={30} className="rounded" />
            : r.icon}
            <span className="max-w-[260px] truncate select-none">{r.name}</span>
            {isDirectory(r) && hovered === r.key && <ArrowRight className="text-primary ml-1 h-4 w-4" />}
          </TableCell>
          <TableCell className="text-gray-200">{r.size}</TableCell>
          <TableCell className="text-gray-300">{r.modified}</TableCell>
        </motion.tr>
      ))}
    </TableBody>
  )

  const RenderContextMenu = () =>
    contextMenu && (
      <ContextMenu
        data={contextMenu.row}
        position={{ x: contextMenu.mouseX, y: contextMenu.mouseY }}
        onClose={() => setContextMenu(null)}
        onDelete={row => handleDelete(row.name)}
        onCopy={row => setCopiedItem(row)}
      />
    )

  const handleTableClick = async (e: React.MouseEvent) => {
    if (!copiedItem) return

    const target = e.target as HTMLElement
    const isRow = target.closest('tr')

    if (!isRow) await pasteCopiedItem()
  }

  return (
    <>
      <Card
        className="min-h-[90vh] rounded-xl border border-gray-700 bg-gray-900/90 shadow-lg"
        onClick={() => setContextMenu(null)}>
        <CardContent className="p-0">
          <ScrollArea className="h-full">
            <div ref={tableRef} onClick={handleTableClick}>
              <Table>
                <Header />
                <Body />
              </Table>
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <FilePreviewModal file={selectedFile} onClose={() => setSelectedFile(null)} />
      <RenderContextMenu />
    </>
  )
})

FileSystem.displayName = 'FileSystem'
