const envTrue = (v?: string) => (v ?? '').toLowerCase() === 'true'

export const getWebsocketUrl = (): string => {
  const protocol = envTrue(process.env.NEXT_PUBLIC_WEBSOCKET_HTTPS) ? 'wss:' : 'ws:'
  const host = process.env.NEXT_PUBLIC_WEBSOCKET_HOST || '127.0.0.1'
  const port = process.env.NEXT_PUBLIC_WEBSOCKET_PORT || '9001'
  return `${protocol}//${host}:${port}`
}

export const getPreviewUrl = () => {
  const origin = process.env.NEXT_PUBLIC_PREVIEW_ORIGIN
  if (!origin) throw new Error('NEXT_PUBLIC_PREVIEW_ORIGIN is not set')
  return `${origin}/preview`
}
