import React from 'react'

interface TableCellProps {
  className?: string
  children: React.ReactNode
  onClick?: () => void
}

export const TableCell: React.FC<TableCellProps> = ({ className = '', children, onClick }) => (
  <td className={`text-md p-2 text-gray-300 ${className}`} onClick={onClick}>
    {children}
  </td>
)
