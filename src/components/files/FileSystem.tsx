'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { File } from '@/models/file'
import ArrowRight from '@/fa-duotone/arrow-right.svg'
import Folder from '@/fa-duotone/folder.svg'
import FileIcon from '@/fa-duotone/file.svg'
import { Table, TableHeader, TableBody, TableRow, TableCell, TableHead } from '@/components/table'
import { ScrollArea } from '@/components/ScrollArea'
import { CardContent } from '@/components/card/CardContent'
import { Card } from '@/components/card/Card'

interface FileSystemProps {
  files: File[]
  onNavigate: (path: string) => void
}

export const FileSystem: React.FC<FileSystemProps> = ({ files, onNavigate }) => {
  const [hoveredRow, setHoveredRow] = useState<string | null>(null)

  return (
    <Card className="rounded-2xl border border-gray-700 bg-gray-900 shadow-lg">
      <CardContent className="p-0">
        <ScrollArea className="h-[400px]">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-gray-400">Name</TableHead>
                <TableHead className="text-gray-400">Size</TableHead>
                <TableHead className="text-gray-400">Modified</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {files.map(file => (
                <motion.tr
                  key={file.fullPath ?? file.name}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 10 }}
                  whileHover={{ scale: 1.02 }}
                  onMouseEnter={() => setHoveredRow(file.fullPath ?? file.name)}
                  onMouseLeave={() => setHoveredRow(null)}
                  className="cursor-pointer transition-colors hover:bg-gray-800"
                  onClick={() => file.isDirectory && onNavigate(file.fullPath ?? file.name)}>
                  <TableCell className="flex items-center gap-2 text-white">
                    {file.isDirectory ?
                      <Folder size={16} />
                    : <FileIcon size={16} />}
                    {file.name}
                    {file.isDirectory && hoveredRow === (file.fullPath ?? file.name) && <ArrowRight size={16} />}
                  </TableCell>
                  <TableCell className="text-gray-300">
                    {file.isDirectory ? '-' : `${(file.currentVersionSizeBytes / 1024).toFixed(1)} KB`}
                  </TableCell>
                  <TableCell className="text-gray-300">{new Date(file.updatedAt * 1000).toLocaleString()}</TableCell>
                </motion.tr>
              ))}
            </TableBody>
          </Table>
        </ScrollArea>
      </CardContent>
    </Card>
  )
}
