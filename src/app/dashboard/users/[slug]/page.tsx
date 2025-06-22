import UserForm from '@/components/users/UserForm'

const UserPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const id = Number(slug)

  return <UserForm id={id} />
}

export default UserPage
