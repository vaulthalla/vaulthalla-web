export interface WebSocketCommandMap {
  'auth.login': {
    payload: { email: string; password: string }
    response: { token: string; user: { id: string; name: string; email: string } }
  }

  'auth.register': {
    payload: { name: string; email: string; password: string }
    response: { token: string; user: { id: string; name: string; email: string } }
  }

  'auth.logout': {
    payload: null
    response: { success: boolean }
  }

  'auth.me': {
    payload: null
    response: { user: { id: string; name: string; email: string } }
  }

  'fs.listDir': {
    payload: { path: string }
    response: { files: Array<{ name: string; size: number; isDir: boolean }> }
  }

  // Add all other commands here ⬇️
  'storage.mount': {
    payload: { bucket: string }
    response: { success: boolean }
  }
}
