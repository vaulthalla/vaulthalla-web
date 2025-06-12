'use client'

import { redirect } from 'next/navigation'

const S3MountsPage = () => {
  const availableBackends = [
    {
      name: 'Local Disk',
      description: 'Store vaults on the local filesystem.',
      icon: '@/public/',
      route: '/vaults/mounts/local',
    },
    {
      name: 'S3 Compatible',
      description: 'Use S3-compatible storage for vaults.',
      icon: '@/public/',
      route: '/vaults/mounts/s3',
    },
  ]

  return (
    <main className="flex h-screen flex-col items-center justify-center space-y-4 text-center">
      <h1 className="text-2xl font-bold">Vault Mounts</h1>
      <p className="text-gray-500">Manage your vault storage mounts.</p>

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
