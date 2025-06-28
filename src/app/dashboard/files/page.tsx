import FilesClientPage from '@/app/dashboard/files/page.client'

const FilesPage = () => {
  return (
    <div className="flex h-full flex-col items-center justify-center">
      <h1 className="mb-4 text-2xl font-bold">Vaults</h1>
      <p className="text-gray-600">Select a Vault to navigate to a list of its Volumes.</p>
      <FilesClientPage />
    </div>
  )
}

export default FilesPage
