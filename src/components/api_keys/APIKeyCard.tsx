'use client'

import { APIKey } from '@/models/apiKey'
import { motion } from 'framer-motion'

const APIKeyCard = (key: APIKey) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className="group rounded-2xl border border-white/10 bg-white/10 p-5 shadow-md backdrop-blur-md transition duration-300 hover:bg-white/20 hover:shadow-lg hover:backdrop-blur-xl">
      <h3 className="text-xl font-semibold text-white transition-colors duration-200 group-hover:text-cyan-300">
        {key.name}
      </h3>
      <div className="mt-2 text-sm text-gray-300">
        <p>
          <span className="font-medium text-gray-400">Type:</span> {key.type}
        </p>
        <p>
          <span className="font-medium text-gray-400">Provider:</span> {key.provider}
        </p>
        <p>
          <span className="font-medium text-gray-400">Created:</span> {new Date(key.created_at).toLocaleDateString()}
        </p>
        <p className="truncate">
          <span className="font-medium text-gray-400">ID:</span> {key.id}
        </p>
      </div>
    </motion.div>
  )
}

export default APIKeyCard
