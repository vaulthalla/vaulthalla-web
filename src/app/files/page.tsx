import FilesClientPage from '@/app/files/page.client'
import VaultBreadcrumbs from '@/components/files/VaultBreadcrumbs'

const FilesPage = () => {
  return (
    <div className="mx-8 h-full w-full">
      <VaultBreadcrumbs className="mb-3" />
      <FilesClientPage />
    </div>
  )
}

export default FilesPage
