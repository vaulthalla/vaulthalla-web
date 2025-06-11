'use client'

import {useWebSocketLifecycle} from '@/hooks/useWebSocketLifecycle'

export const WebSocketProvider = () => {
  useWebSocketLifecycle()
  return null
}
