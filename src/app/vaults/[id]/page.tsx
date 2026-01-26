import VaultPage from '@/app/vaults/[id]/page.client'

export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  return (
    <div className="w-full p-6">
      <VaultPage id={Number(id)} />
    </div>
  )
}
