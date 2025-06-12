import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import DashboardPage from '@/app/dashboard/page'

const Home = async () => {
  const cookieStore = await cookies()
  const token = cookieStore.get('token')

  if (token) return <DashboardPage />
  else return redirect('/login')
}

export default Home
