import { Vault } from '@/models/vaults'
import { Volume } from '@/models/volumes'
import { APIKey } from '@/models/apiKey'
import { User } from '@/models/user'

export interface WebSocketCommandMap {
  // Auth
  'auth.login': { payload: { email: string; password: string }; response: { token: string; user: User } }

  'auth.register': {
    payload: { name: string; email: string; password: string; is_active?: boolean; role?: string }
    response: { token: string; user: User }
  }

  'auth.user.update': {
    payload: { id: number; name?: string; email?: string; password?: string; role?: string; is_active?: boolean }
    response: { user: User }
  }

  'auth.user.change_password': {
    payload: { id: number; old_password: string; new_password: string }
    response: { user: User }
  }

  'auth.isAuthenticated': { payload: null; response: { isAuthenticated: boolean; user?: User } }

  'auth.refresh': { payload: null; response: { token: string; user: User } }

  'auth.logout': { payload: null; response: { success: boolean } }

  'auth.me': { payload: null; response: { user: User } }

  'auth.users.list': { payload: null; response: { users: User[] } }

  'auth.user.get': { payload: { id: number }; response: { user: User } }

  // Vault commands

  'storage.vault.list': { payload: null; response: { vaults: string } }

  'storage.vault.add': {
    payload:
      | { name: string; type: 'local'; mount_point: string }
      | { name: string; type: 's3'; api_key_id: number; bucket: string }
    response: { data: { id: number; name: string; type: string; is_active: boolean; created_at: number } }
  }

  'storage.vault.remove': { payload: { id: number }; response: null }

  'storage.vault.get': { payload: { id: number }; response: { vault: Vault } }

  // Volume commands

  'storage.volume.list': { payload: { vault_id: number }; response: { volumes: Promise<string> } }

  'storage.volume.list.user': { payload: { user_id: number }; response: { volumes: Promise<string> } }

  'storage.volume.list.vault': { payload: { vault_id: number }; response: { volumes: Promise<string> } }

  'storage.volume.add': {
    payload: { user_id: number; vault_id: number; name: string; path_prefix?: string; quota_bytes?: number | null }
    response: null
  }

  'storage.volume.remove': { payload: { volume_id: number }; response: null }

  'storage.volume.get': { payload: { volume_id: number }; response: { volume: Volume } }

  // API Key commands

  'storage.apiKey.list': { payload: null; response: { keys: string } }

  'storage.apiKey.list.user': { payload: null; response: { keys: string /* JSON string of API keys */ } }

  'storage.apiKey.add': {
    payload: {
      user_id: number
      name: string
      type: string // right now only "s3"
      access_key: string
      secret_access_key: string
      region: string
      endpoint: string
    }
    response: null
  }

  'storage.apiKey.remove': { payload: { id: number }; response: null }

  'storage.apiKey.get': { payload: { id: number }; response: { key: APIKey } }
}

export type WSCommandPayload<K extends keyof WebSocketCommandMap> = WebSocketCommandMap[K]['payload']
export type WSCommandResponse<K extends keyof WebSocketCommandMap> = WebSocketCommandMap[K]['response']
export type JSONParsed<T> = T extends string ? any : T
