import Link from 'next/link'

const AddAPIKeyPage = () => {
  const supportAPITypes = [
    {
      name: 'AWS S3 Compatible Storage',
      description: 'Add an API key for AWS S3 compatible storage services.',
      icon: '/icons/openai.svg',
      link: '/dashboard/api-keys/add/s3',
    },
  ]

  return (
    <div className="flex h-full flex-col items-center justify-center p-4">
      <h1 className="mb-4 text-2xl font-bold">Add API Key</h1>
      <p className="mb-6 text-gray-600">Select the type of API key you want to add:</p>
      <div className="grid w-full max-w-md grid-cols-1 gap-4 sm:grid-cols-2">
        {supportAPITypes.map(apiType => (
          <Link
            href={apiType.link}
            key={apiType.name}
            className="flex flex-col items-center rounded-lg border p-4 transition-colors hover:bg-gray-100">
            <img src={apiType.icon} alt={apiType.name} className="mb-2 h-12 w-12" />
            <h2 className="text-lg font-semibold">{apiType.name}</h2>
            <p className="text-sm text-gray-500">{apiType.description}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default AddAPIKeyPage
