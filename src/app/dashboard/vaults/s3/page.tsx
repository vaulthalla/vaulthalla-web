'use client'

import { redirect } from 'next/navigation'

const S3MountsPage = () => {
  const availableBackends = [
    { name: 'S3 Buckets', description: 'Manage your S3 buckets.', route: '/vaults/mounts/s3/buckets' },
    { name: 'S3 API Keys', description: 'Manage your S3 API keys.', route: '/vaults/mounts/s3/api-keys' },
  ]

  return (
    <main className="flex h-screen flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-2xl font-bold">S3 Vaults</h1>
      <p className="text-gray-500">Manage your S3-compatible buckets and reusable API keys.</p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {availableBackends.map((mount, index) => (
          <div
            key={index}
            className="cursor-pointer rounded-lg border p-4 text-left shadow transition-shadow duration-200 hover:shadow-lg"
            onClick={() => redirect(mount.route)}>
            <h2 className="text-xl font-semibold">{mount.name}</h2>
            <p className="text-gray-600">{mount.description}</p>
          </div>
        ))}
      </div>
    </main>
  )
}

export default S3MountsPage
