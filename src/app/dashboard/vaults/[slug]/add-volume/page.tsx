import AddVolumeForm from '@/components/volumes/AddVolumeForm'

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  return <AddVolumeForm slug={slug} />
}
