import PasswordForm from '@/components/users/PasswordForm'

const ChangePasswordPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params
  const id = Number(slug)

  return <PasswordForm id={id} />
}

export default ChangePasswordPage
