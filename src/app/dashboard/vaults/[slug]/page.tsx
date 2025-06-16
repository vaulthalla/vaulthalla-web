import ClientVaultPage from './VaultPage'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return <ClientVaultPage slug={slug} />
}
