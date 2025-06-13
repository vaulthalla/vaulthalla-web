'use client'

import { redirect } from 'next/navigation'

const S3Page = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">S3 Vault</h1>
      <button
        className="cursor-pointer rounded-lg bg-green-600 px-4 py-2.5 font-semibold"
        onClick={() => redirect('/vaults/mounts/s3/create')}>
        + Create New Vault
      </button>
    </div>
  )
}

export default S3Page
