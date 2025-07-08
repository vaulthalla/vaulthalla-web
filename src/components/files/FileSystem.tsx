'use client'

import React, { useMemo, useState, memo } from 'react'
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

const isDirectory = (file: FileModel | Directory): file is Directory => {
  return (file as Directory).stats !== undefined
}

const formatSize = (item: FileModel | Directory): string => {
  const isDir = isDirectory(item)
  const bytes = isDir ? item.stats?.size_bytes : item.size_bytes

  if (isDir) return '-'
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const val = bytes / 1024 ** exp
  return `${val.toFixed(val < 10 ? 1 : 0)} ${units[exp]}`
}

interface FileSystemProps {
  files: (FileModel | Directory)[]
  onNavigate: (path: string) => void
}

export const FileSystem: React.FC<FileSystemProps> = memo(({ files, onNavigate }) => {
  const [hovered, setHovered] = useState<string | null>(null)

  const rows = useMemo(
    () =>
      files.map(f => {
        const key = f.path ?? f.name
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

  return (
    <Card className="min-h-[90vh] rounded-xl border border-gray-700 bg-gray-900/90 shadow-lg">
      <CardContent className="p-0">
        <ScrollArea className="h-full">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-800/50">
                <TableHead className="w-1/2 pl-6 text-gray-300">Name</TableHead>
                <TableHead className="w-1/10 text-gray-300">Size</TableHead>
                <TableHead className="w-1/4 text-gray-300">Owner</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows.map(r => (
                <motion.tr
                  key={r.key}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 6 }}
                  whileHover={{ scale: 1.01 }}
                  onMouseEnter={() => setHovered(r.key)}
                  onMouseLeave={() => setHovered(null)}
                  className="cursor-pointer border-b border-gray-800/60 transition-colors hover:bg-gray-800/70">
                  <TableCell
                    className="flex items-center gap-2 pl-2 text-white"
                    onClick={() => isDirectory(r) && onNavigate(r.path ?? r.name)}>
                    {!isDirectory(r) && r.previewUrl ?
                      <img src={r.previewUrl} alt={r.name} className="h-6 w-6 rounded" />
                    : r.icon}
                    <span className="max-w-[260px] truncate select-none">{r.name}</span>
                    {isDirectory(r) && hovered === r.key && <ArrowRight className="text-primary ml-1 h-4 w-4" />}
                  </TableCell>
                  <TableCell className="text-gray-200">{r.size}</TableCell>
                  <TableCell className="text-gray-300">{r.modified}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
})

FileSystem.displayName = 'FileSystem'
