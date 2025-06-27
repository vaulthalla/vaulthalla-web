import React from 'react'

interface TableCellProps {
  className?: string
  children: React.ReactNode
}

export const TableCell: React.FC<TableCellProps> = ({ className = '', children }) => (
  <td className={`p-2 text-sm text-gray-300 ${className}`}>{children}</td>
)
