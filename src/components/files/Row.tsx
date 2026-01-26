import { Directory } from '@/models/directory'
import { File as FileModel } from '@/models/file'
import Thumb from '@/components/files/Thumb'
import ArrowRight from '@/fa-duotone/arrow-right.svg'
import React from 'react'
import * as motion from 'motion/react-client'
import { RowProps } from '@/components/files/types'

const isDirectory = (x: FileModel | Directory): x is Directory => (x as Directory).file_count !== undefined

const Row = React.memo(function Row({ r, onNavigate, onOpenFile, onContextMenu }: RowProps) {
  const click = React.useCallback(() => {
    if (isDirectory(r)) onNavigate(r.path ?? r.name)
    else onOpenFile(r as FileModel)
  }, [r, onNavigate, onOpenFile])

  const handleCtx = React.useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault()
      onContextMenu(e, r)
    },
    [onContextMenu, r],
  )

  return (
    <motion.tr
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 6 }}
      // don’t scale table rows; it compresses columns visually
      whileHover={{ y: -1 }}
      transition={{ duration: 0.12 }}
      className="group border-b border-gray-800/60 hover:bg-gray-800/70"
      onContextMenu={handleCtx}
      onClick={click}>
      {/* Name */}
      <td className="px-4 py-2.5 align-middle text-white">
        <div className="flex min-w-0 items-center gap-2">
          <div className="shrink-0">
            {!isDirectory(r) && r.previewUrl ?
              <Thumb src={r.previewUrl} alt={r.name} />
            : r.icon}
          </div>

          <span className="min-w-0 flex-1 truncate select-none">{r.name}</span>

          {isDirectory(r) && (
            <ArrowRight className="text-primary h-4 w-4 shrink-0 opacity-0 transition-opacity group-hover:opacity-100" />
          )}
        </div>
      </td>

      {/* Size */}
      <td className="px-4 py-2.5 align-middle whitespace-nowrap text-gray-200">{r.size}</td>

      {/* Last Modified */}
      <td className="px-4 py-2.5 align-middle whitespace-nowrap text-gray-300">{r.modified}</td>
    </motion.tr>
  )
})

export default Row
