// FileSystem.tsx — minor polish, added Owner & Perm columns and refined Tailwind spacing
'use client'

import React, { useMemo, useState, memo } from 'react'
import { motion } from 'framer-motion'
import ArrowRight from '@/fa-duotone/arrow-right.svg'
import Folder from '@/fa-duotone/folder.svg'
import FileIcon from '@/fa-duotone/file.svg'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/table'
import { ScrollArea } from '@/components/ScrollArea'
import { CardContent } from '@/components/card/CardContent'
import { Card } from '@/components/card/Card'
import type { File as FileModel } from '@/models/file'

const formatSize = (bytes: number, isDir: boolean): string => {
  if (isDir) return '-'
  if (!bytes) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB']
  const exp = Math.min(Math.floor(Math.log(bytes) / Math.log(1024)), units.length - 1)
  const val = bytes / 1024 ** exp
  return `${val.toFixed(val < 10 ? 1 : 0)} ${units[exp]}`
}

interface FileSystemProps {
  files: FileModel[]
  onNavigate: (path: string) => void
}

export const FileSystem: React.FC<FileSystemProps> = memo(({ files, onNavigate }) => {
  const [hovered, setHovered] = useState<string | null>(null)

  const rows = useMemo(
    () =>
      files.map(f => ({
        key: f.fullPath ?? f.name,
        icon:
          f.isDirectory ?
            <Folder className="text-primary fill-current" />
          : <FileIcon className="text-primary fill-current" />,
        size: formatSize(f.currentVersionSizeBytes, f.isDirectory),
        modified: new Date(f.updatedAt).toLocaleString(),
        perms: f.mode,
        owner: f.uid,
        ...f,
      })),
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
                <TableHead className="w-1/10 text-gray-300">Owner</TableHead>
                <TableHead className="w-1/10 text-gray-300">Perms</TableHead>
                <TableHead className="w-1/3 text-gray-300">Modified</TableHead>
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
                    onClick={() => r.isDirectory && onNavigate(r.fullPath ?? r.name)}>
                    {r.icon}
                    <span className="max-w-[260px] truncate select-none">{r.name}</span>
                    {r.isDirectory && hovered === r.key && <ArrowRight className="text-primary ml-1 h-4 w-4" />}
                  </TableCell>
                  <TableCell className="text-gray-200">{r.size}</TableCell>
                  <TableCell className="text-gray-200">{r.owner}</TableCell>
                  <TableCell className="font-mono text-red-400">{r.perms}</TableCell>
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
