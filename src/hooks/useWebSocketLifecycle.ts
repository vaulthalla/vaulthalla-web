'use client'

import { useEffect } from 'react'
import { useWebSocketStore } from '@/stores/useWebSocket'

export const useWebSocketLifecycle = () => {
  const connect = useWebSocketStore(state => state.connect)
  const disconnect = useWebSocketStore(state => state.disconnect)

  useEffect(() => {
    connect()
    return () => disconnect()
  }, [connect, disconnect])
}
