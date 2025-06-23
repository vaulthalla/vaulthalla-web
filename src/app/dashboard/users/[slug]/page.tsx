import UserFullCard from '@/components/users/UserFullCard'

const UserPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const id = Number(slug)

  return <UserFullCard id={id} />
}

export default UserPage
