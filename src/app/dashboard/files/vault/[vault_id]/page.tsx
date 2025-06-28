import VaultClientPage from '@/app/dashboard/files/vault/[vault_id]/page.client'

const VaultPage = async ({ params }: { params: Promise<{ vault_id: number }> }) => {
  const { vault_id } = await params

  return (
    <div>
      <div className="mb-2 text-center">
        <h1 className="my-2 text-4xl">Vault Page</h1>
        <p className="text-gray-300">Select a Volume to view its filesystem.</p>
      </div>
      <div className="">
        <VaultClientPage id={Number(vault_id)} />
      </div>
    </div>
  )
}

export default VaultPage
