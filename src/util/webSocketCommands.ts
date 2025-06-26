import { Vault } from '@/models/vaults'
import { Volume } from '@/models/volumes'
import { APIKey } from '@/models/apiKey'
import { User } from '@/models/user'
import { Role } from '@/models/role'
import { Permission } from '@/models/permission'
import { Settings } from '@/models/settings'
import { Group } from '@/models/group'

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

  // Roles and Permissions

  'role.add': { payload: Partial<Role>; response: { role: Role } }

  'role.delete': { payload: { id: number }; response: null }

  'role.update': { payload: Partial<Role>; response: { role: Role } }

  'role.get': { payload: { id: number }; response: { role: Role } }

  'role.get.byName': { payload: { name: string }; response: { role: Role } }

  'roles.list': { payload: null; response: { roles: Role[] } }

  'permission.get': { payload: { id: number }; response: { permission: Permission } }

  'permission.get.byName': { payload: { name: string }; response: { permission: Permission } }

  'permissions.list': { payload: null; response: { permissions: Permission[] } }

  // Settings
  'settings.get': { payload: null; response: { settings: Settings } }

  'settings.update': { payload: Partial<Settings>; response: { settings: Settings } }

  // Group commands

  'group.add': { payload: { name: string; description?: string }; response: { group: Group } }

  'group.remove': { payload: { id: number }; response: null }

  'group.update': { payload: Partial<Group>; response: { group: Group } }

  'group.get': { payload: { id: number }; response: { group: Group } }

  'groups.list': { payload: null; response: { groups: Group[] } }

  'group.member.add': { payload: { group_id: number; user_id: number }; response: { group: Group } }

  'group.member.remove': { payload: { group_id: number; user_id: number }; response: { group: Group } }

  'group.get.byName': { payload: { name: string }; response: { group: Group } }

  'group.get.byVolume': { payload: { volume_id: number }; response: { group: Group } }

  'group.volume.add': { payload: { group_id: number; volume_id: number }; response: { group: Group } }

  'group.volume.remove': { payload: { group_id: number; volume_id: number }; response: { group: Group } }

  'groups.list.byUser': { payload: { user_id: number }; response: { groups: Group[] } }

  'groups.list.byVolume': { payload: { volume_id: number }; response: { groups: Group[] } }
}

export type WSCommandPayload<K extends keyof WebSocketCommandMap> = WebSocketCommandMap[K]['payload']
export type WSCommandResponse<K extends keyof WebSocketCommandMap> = WebSocketCommandMap[K]['response']
export type JSONParsed<T> = T extends string ? any : T
