import React from 'react'
import * as motion from 'motion/react-client'

interface CardProps {
  className?: string
  children: React.ReactNode
}

export const Card: React.FC<CardProps> = ({ className = '', children }) => (
  <motion.div
    initial={{ opacity: 0, y: 5 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: 5 }}
    className={`rounded-2xl border border-gray-700 bg-gray-900 p-4 shadow-lg ${className}`}>
    {children}
  </motion.div>
)
