'use client'

import { Volume } from '@/models/volumes'

const VolumeCard = (volume: Volume) => {
  return (
    <div className="card-glass rounded-lg p-4 shadow-md transition-shadow hover:shadow-lg">
      <h3 className="text-lg font-semibold text-white">{volume.name}</h3>
      <div className="text-md text-gray-100">
        <p>
          <span className="text-gray-300">Created:</span> {new Date(volume.created_at).toLocaleString()}
        </p>
        <p>
          <span className="text-gray-300">Path Prefix:</span> {volume.path_prefix || 'N/A'}
        </p>
        <p>
          <span className="text-gray-300">Quota:</span>{' '}
          {volume.quota_bytes ? `${(volume.quota_bytes / 1024 / 1024).toFixed(2)} MB` : 'Unlimited'}
        </p>
      </div>
    </div>
  )
}

export default VolumeCard
