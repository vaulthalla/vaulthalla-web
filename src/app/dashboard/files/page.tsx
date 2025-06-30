import FilesClientPage from '@/app/dashboard/files/page.client'

const FilesPage = () => {
  return (
    <div className="mx-8 h-full w-full">
      <h1 className="mb-4 text-center text-4xl">File Manager</h1>
      <FilesClientPage />
    </div>
  )
}

export default FilesPage
