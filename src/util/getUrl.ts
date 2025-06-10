export const getWebsocketUrl = (): string => {
  const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:'
  const host = process.env.WEBSOCKET_HOST || '127.0.0.1'
  const port = process.env.WEBSOCKET_PORT || 9001
  return `${protocol}//${host}:${port}`
}
