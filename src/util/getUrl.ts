export const getWebsocketUrl = (): string => {
  // const protocol = Boolean(process.env.NEXT_PUBLIC_WEBSOCKET_HTTPS) ? 'wss:' : 'ws:'
  // const host = process.env.NEXT_PUBLIC_WEBSOCKET_HOST || '127.0.0.1'
  // const port = process.env.NEXT_PUBLIC_WEBSOCKET_PORT || 9001
  // return `${protocol}//${host}:${port}`
  return 'ws://127.0.0.1:36969'
}
