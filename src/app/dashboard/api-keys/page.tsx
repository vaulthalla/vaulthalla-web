'use client'

import { redirect } from 'next/navigation'

const APIKeysPage = () => {
  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-2xl font-bold">API Keys</h1>
      <p className="text-gray-200">
        Manage your API keys for cloud mounts here. You can create, edit, and delete keys as needed.
      </p>
      <button
        className="rounded-lg bg-blue-600 px-4 py-2.5 font-semibold text-white transition-colors duration-200 hover:bg-blue-700"
        onClick={() => redirect('/vaults/mounts/s3/api-keys/add')}>
        + Create New API Key
      </button>
    </div>
  )
}

export default APIKeysPage
