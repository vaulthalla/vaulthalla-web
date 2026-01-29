'use client'

import { usePathname, useRouter } from 'next/navigation'
import { useEffect, useRef, useState } from 'react'
import CircleNotchLoader from '@/components/loading/CircleNotchLoader'
import { useAuthStore } from '@/stores/authStore'

const PUBLIC_ROUTES = new Set<string>(['/login']) // add '/dashboard' here if it's meant to be public

export default function RequireAuth({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const pathname = usePathname()
  const [checked, setChecked] = useState(false)
  const running = useRef(false)

  useEffect(() => {
    // Let public routes render without gating
    if (PUBLIC_ROUTES.has(pathname)) {
      setChecked(true)
      return
    }

    let cancelled = false

    const checkAuth = async () => {
      if (running.current) return
      running.current = true
      setChecked(false)

      try {
        const store = useAuthStore.getState()

        // 1) Load default-password flag (freshly)
        await store.fetchAdminPasswordIsDefault()
        const { adminPasswordIsDefault } = useAuthStore.getState()

        // 2) Check auth (freshly)
        let authed = await useAuthStore.getState().isUserAuthenticated()

        // 3) If not authed, try refresh once
        if (!authed) {
          await useAuthStore.getState().refreshToken()
          authed = await useAuthStore.getState().isUserAuthenticated()
        }

        if (cancelled) return

        // 4) Not authed => kick out
        if (!authed) {
          router.replace('/login')
          return
        }

        // 5) Authed but default admin password => force change
        if (!process.env.NEXT_PUBLIC_VAULTHALLA_DEV_MODE && adminPasswordIsDefault) {
          // avoid redirect loop
          if (pathname !== '/dashboard/users/admin/change-password') {
            router.replace('/dashboard/users/admin/change-password')
          }
          return
        }

        // 6) All good
        setChecked(true)
      } finally {
        running.current = false
      }
    }

    checkAuth()

    return () => {
      cancelled = true
    }
  }, [pathname, router])

  if (!checked) return <CircleNotchLoader />
  return <>{children}</>
}
