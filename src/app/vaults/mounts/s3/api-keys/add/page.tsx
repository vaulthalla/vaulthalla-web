'use client'

import { FieldError, FieldErrorsImpl, Merge, useForm } from 'react-hook-form'

type FormData = { name: string; accessKey: string; secretAccessKey: string; region: string; endpoint: string }

const APIKeysAddPage = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = (data: FormData) => {
    console.log(data)
    // Handle form submission logic here
  }

  const inputStyles = 'border border-gray-300 rounded-md p-2 w-full focus:outline-none focus:ring-2 focus:ring-cyan-500'

  // Helper to safely render error messages
  const renderError = (error: string | FieldError | Merge<FieldError, FieldErrorsImpl<any>> | undefined) =>
    typeof error === 'string' ? <span>{error}</span> : null

  return (
    <div className="flex h-screen flex-col items-center justify-center space-y-2">
      <h1 className="mb-12 text-4xl font-semibold">Add S3-Compatible API Key</h1>
      <form onSubmit={handleSubmit(onSubmit)} className="flex w-full max-w-md flex-col space-y-4">
        <div>
          <label htmlFor="name">Name:</label>
          <input id="name" className={inputStyles} {...register('name', { required: 'Name is required' })} />
          {renderError(errors.name?.message)}
        </div>
        <div>
          <label htmlFor="accessKey">Access Key:</label>
          <input
            id="accessKey"
            className={inputStyles}
            {...register('accessKey', { required: 'Access key is required' })}
          />
          {renderError(errors.accessKey?.message)}
        </div>
        <div>
          <label htmlFor="secretAccessKey">Secret Access Key:</label>
          <input
            id="secretAccessKey"
            type="password"
            className={inputStyles}
            {...register('secretAccessKey', { required: 'Secret access key is required' })}
          />
          {renderError(errors.secretAccessKey?.message)}
        </div>
        <div>
          <label htmlFor="region">Region:</label>
          <input id="region" className={inputStyles} {...register('region', { required: 'Region is required' })} />
          {renderError(errors.region?.message)}
        </div>
        <div>
          <label htmlFor="endpoint">Endpoint:</label>
          <input
            id="endpoint"
            className={inputStyles}
            {...register('endpoint', { required: 'Endpoint is required' })}
          />
          {renderError(errors.endpoint?.message)}
        </div>
        <button
          type="submit"
          className="transform cursor-pointer rounded-lg bg-cyan-700 py-2.5 font-semibold text-white transition-transform duration-200 hover:scale-105 hover:bg-cyan-800 disabled:cursor-not-allowed disabled:opacity-50">
          Add API Key
        </button>
      </form>
    </div>
  )
}

export default APIKeysAddPage
