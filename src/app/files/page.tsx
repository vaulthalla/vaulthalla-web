import FilesClientPage from '@/app/files/page.client'
import VaultBreadcrumbs from '@/components/files/VaultBreadcrumbs'
import CopiedItemIndicator from '@/components/files/CopiedItemIndicator'

const FilesPage = () => {
  return (
    <div className="mx-8 h-full w-full">
      <CopiedItemIndicator />
      <VaultBreadcrumbs className="mb-3" />
      <FilesClientPage />
    </div>
  )
}

export default FilesPage
