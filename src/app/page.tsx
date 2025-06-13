import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'

const Home = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (!token) redirect(`/login`)
  else redirect(`/dashboard`)
}

export default Home
