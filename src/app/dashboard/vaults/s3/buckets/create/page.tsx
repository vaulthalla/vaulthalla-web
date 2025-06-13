'use client'

import { useForm } from 'react-hook-form'
import { redirect } from 'next/navigation'

const CreateS3VaultPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm()

  const onSubmit = data => {
    console.log(data)
    // Handle form submission logic here
  }

  const inputStyles = 'border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500'

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-2">
      <button
        className="absolute top-4 left-4 text-gray-500 hover:text-gray-700"
        onClick={() => redirect('/vaults/mounts/s3')}>
        Back to S3 Vaults
      </button>
      <h1 className="mb-12 text-4xl font-semibold">S3 Vault Configuration</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col space-y-4">
        <div>
          <label htmlFor="vaultName">Vault Name:</label>
          <input
            id="vaultName"
            className={inputStyles}
            {...register('vaultName', { required: 'Vault name is required' })}
          />
          {errors.vaultName && <span>{errors.vaultName.message}</span>}
        </div>
        <div>
          <label htmlFor="bucket">Bucket Name:</label>
          <input id="bucket" className={inputStyles} {...register('bucket', { required: 'Bucket name is required' })} />
          {errors.bucket && <span>{errors.bucket.message}</span>}
        </div>
        <button
          type="submit"
          className="transform cursor-pointer rounded-lg bg-cyan-700 py-2.5 font-semibold text-white transition-transform duration-200 hover:scale-105 hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50">
          Create Vault
        </button>
      </form>
    </div>
  )
}

export default CreateS3VaultPage
