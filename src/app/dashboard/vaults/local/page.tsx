'use client'

import { useForm } from 'react-hook-form'

const LocalDiskPage = () => {
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
      <h1 className="mb-12 text-4xl font-semibold">Local Disk Vault Configuration</h1>
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
          <label htmlFor="mount">Mount Location:</label>
          <input id="mount" className={inputStyles} {...register('mount', { required: 'Mount is required' })} />
          {errors.mount && <span>{errors.mount.message}</span>}
        </div>
        <button
          type="submit"
          className="transform cursor-pointer rounded-lg bg-cyan-700 py-2.5 font-semibold text-white transition-transform duration-200 hover:scale-105 hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50">
          Update Vault
        </button>
      </form>
    </div>
  )
}

export default LocalDiskPage
