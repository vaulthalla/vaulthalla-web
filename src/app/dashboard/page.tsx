import { Sidebar } from '@/components/Sidebar'

const DashboardPage = () => {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center">
      <Sidebar />
      <h1 className="text-2xl font-bold">Dashboard</h1>
      <p className="mt-4">Welcome to the dashboard!</p>
    </main>
  )
}

export default DashboardPage
