'use client'

import React, { useMemo, useState, memo, useRef } from 'react'
import Folder from '@/fa-duotone/folder.svg'
import FileIcon from '@/fa-duotone/file.svg'
import { Table, TableHeader, TableBody, TableRow, TableHead } from '@/components/table'
import { ScrollArea } from '@/components/ScrollArea'
import { CardContent } from '@/components/card/CardContent'
import { Card } from '@/components/card/Card'
import type { File as FileModel } from '@/models/file'
import { Directory } from '@/models/directory'
import { getPreviewUrl } from '@/util/getUrl'
import { FilePreviewModal } from './FilePreviewModal'
import { useFSStore } from '@/stores/fsStore'
import { ContextMenu } from '@/components/files/ContextMenu'
import { formatSize } from '@/util/formatSize'
import { FileSystemProps, RowModel } from '@/components/files/types'
import Row from '@/components/files/Row' // Assumes this exists in same folder

const isDirectory = (file: FileModel | Directory): file is Directory => (file as Directory).file_count !== undefined

export const FileSystem: React.FC<FileSystemProps> = memo(({ files, onNavigate }) => {
  const [selectedFile, setSelectedFile] = useState<FileModel | null>(null)
  const [contextMenu, setContextMenu] = useState<{ mouseX: number; mouseY: number; row: RowModel } | null>(null)
  const tableRef = useRef<HTMLDivElement>(null)

  const { setCopiedItem, copiedItem, pasteCopiedItem } = useFSStore()

  const handleOpenFile = React.useCallback((f: FileModel) => setSelectedFile(f), [])
  const handleRowContextMenu = React.useCallback((e: React.MouseEvent, row: RowModel) => {
    setContextMenu({ mouseX: e.clientX, mouseY: e.clientY, row })
  }, [])

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
        const key = `${f.vault_id}:${f.path ?? f.name}`
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
        <Row
          key={r.key}
          r={r}
          onNavigate={onNavigate}
          onOpenFile={handleOpenFile}
          onContextMenu={handleRowContextMenu}
        />
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
