'use client'

import { useEffect } from 'react'
import { useWebSocketStore } from '@/stores/useWebSocket'

export const useWebSocketLifecycle = () => {
  const { connect, disconnect } = useWebSocketStore()

  useEffect(() => {
    const tryConnect = () => {
      connect()
    }

    if (document.readyState === 'complete') {
      tryConnect()
    } else {
      window.addEventListener('load', tryConnect, { once: true })
    }

    return () => disconnect()
  }, [connect, disconnect])
}
