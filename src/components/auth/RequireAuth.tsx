'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '@/stores/authStore'
import { useEffect, useState } from 'react'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const { adminPasswordIsDefault, fetchAdminPasswordIsDefault, isUserAuthenticated } = useAuthStore()
  const [checked, setChecked] = useState(false)

  useEffect(() => {
    const check = async () => {
      await fetchAdminPasswordIsDefault()
      let authed = await isUserAuthenticated()

      if (!process.env.NEXT_PUBLIC_VAULTHALLA_DEV_MODE && adminPasswordIsDefault && authed)
        router.replace('/dashboard/users/admin/change-password')

      if (!authed) await useAuthStore.getState().refreshToken()

      authed = await isUserAuthenticated()
      if (!authed) router.replace('/login')

      setChecked(true)
    }

    check()
  }, [adminPasswordIsDefault, fetchAdminPasswordIsDefault, isUserAuthenticated, router, pathname])

  if (!checked) return <CircleNotchLoader />

  return <>{children}</>
}
