export interface WebSocketCommandMap {
  // Auth

  'auth.login': {
    payload: { email: string; password: string }
    response: { token: string; user: { id: string; name: string; email: string; lastLogin: string } }
  }

  'auth.register': {
    payload: { name: string; email: string; password: string }
    response: { token: string; user: { id: string; name: string; email: string; lastLogin: string } }
  }

  'auth.isAuthenticated': {
    payload: null
    response: { isAuthenticated: boolean; user?: { id: string; name: string; email: string; lastLogin: string } }
  }

  'auth.refresh': {
    payload: {}
    response: { token: string; user: { id: string; name: string; email: string; lastLogin: string } }
  }

  'auth.logout': { payload: null; response: { success: boolean } }

  'auth.me': { payload: null; response: { user: { id: string; name: string; email: string; lastLogin: string } } }

  // Vault commands

  'storage.vault.list': { payload: {}; response: { vaults: string } }

  'storage.vault.add': {
    payload:
      | { name: string; type: 'local'; mountPoint: string }
      | { name: string; type: 's3'; apiKeyID: number; bucket: string }
    response: { data: { id: number; name: string; type: string; isActive: boolean; createdAt: number } }
  }

  'storage.vault.remove': { payload: { id: number }; response: {} }

  'storage.vault.get': { payload: { id: number }; response: { data: any /* Vault JSON object */ } }

  // Volume commands

  'storage.volume.list': { payload: { userId: number }; response: { data: string /* JSON stringified Volume[] */ } }

  'storage.volume.add': {
    payload: { userID: number; vaultID: number; name: string; pathPrefix?: string; quotaBytes?: number }
    response: {}
  }

  'storage.volume.remove': { payload: { volumeId: number }; response: {} }

  'storage.volume.get': { payload: { volumeId: number }; response: { data: any /* Volume JSON object */ } }

  // API Key commands

  'storage.apiKey.list': { payload: { userId: number }; response: { data: string /* JSON stringified APIKey[] */ } }

  'storage.apiKey.add': {
    payload: {
      userID: number
      name: string
      type: string // right now only "s3"
      accessKey: string
      secretKey: string
      region: string
      endpoint: string
    }
    response: {}
  }

  'storage.apiKey.remove': { payload: { keyId: number }; response: {} }

  'storage.apiKey.get': { payload: { keyId: number }; response: { data: any /* APIKey JSON object */ } }
}

export type WSCommandPayload<K extends keyof WebSocketCommandMap> = WebSocketCommandMap[K]['payload']
export type WSCommandResponse<K extends keyof WebSocketCommandMap> = WebSocketCommandMap[K]['response']
export type JSONParsed<T> = T extends string ? any : T
