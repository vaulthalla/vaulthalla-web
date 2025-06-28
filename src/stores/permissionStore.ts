import { create } from 'zustand'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { persist } from 'zustand/middleware'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { Role } from '@/models/role'
import { Permission } from '@/models/permission'

interface PermissionStore {
  roles: Role[]
  permissions: Permission[]
  fetchRoles: () => Promise<void>
  fetchPermissions: () => Promise<void>
  addRole: (vaultPayload: WSCommandPayload<'role.add'>) => Promise<void>
  removeRole: (payload: WSCommandPayload<'role.delete'>) => Promise<void>
  updateRole: (payload: WSCommandPayload<'role.update'>) => Promise<void>
  getRole: (payload: WSCommandPayload<'role.get'>) => Promise<Role | null | undefined>
  getRoleByName: (payload: WSCommandPayload<'role.get.byName'>) => Promise<Role | null | undefined>
  getPermission: (payload: WSCommandPayload<'permission.get'>) => Promise<Permission | null | undefined>
  getPermissionByName: (payload: WSCommandPayload<'permission.get.byName'>) => Promise<Permission | null | undefined>
  getPermissions: () => Promise<Permission[]>
  getRoles: () => Promise<Role[]>
}

export const usePermsStore = create<PermissionStore>()(
  persist(
    (set, get) => ({
      roles: [],
      permissions: [],

      async fetchRoles() {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()
        const response = await ws.sendCommand('roles.list', null)
        console.log('response', response.roles)
        set({ roles: response.roles.map(Role.fromData) })
      },

      async fetchPermissions() {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()
        const response = await ws.sendCommand('permissions.list', null)
        set({ permissions: response.permissions.map(Permission.fromData) })
      },

      async addRole(vaultPayload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('role.add', vaultPayload)
        set(state => ({ roles: [...state.roles, Role.fromData(response.role)] }))
      },

      async removeRole({ id }) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        await sendCommand('role.delete', { id })
        set(state => ({ roles: state.roles.filter(r => r.id !== id) }))
      },

      async updateRole(payload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('role.update', payload)
        set(state => ({ roles: state.roles.map(r => (r.id === response.role.id ? Role.fromData(response.role) : r)) }))
      },

      async getRole({ id }) {
        return get().roles.find(r => r.id === id) || null
      },

      async getRoleByName({ name }) {
        return get().roles.find(r => r.name === name) || null
      },

      async getPermission({ id }) {
        return get().permissions.find(p => p.id === id) || null
      },

      async getPermissionByName({ name }) {
        return get().permissions.find(p => p.name === name) || null
      },

      async getRoles() {
        await get().fetchRoles()
        return get().roles
      },

      async getPermissions() {
        return get().permissions
      },
    }),
    {
      name: 'vaulthalla-permissions',
      partialize: state => ({ roles: state.roles, permissions: state.permissions }),
      onRehydrateStorage: state => {
        console.log('[PermissionStore] Rehydrating...')
        return async storedState => {
          try {
            console.log('[PermissionStore] Waiting for WebSocket connection...')
            await useWebSocketStore.getState().waitForConnection()
            console.log('[PermissionStore] WebSocket connected. Re-fetching roles and permissions...')

            await state?.fetchRoles?.()
            await state?.fetchPermissions?.()

            console.log('[PermissionStore] Roles and permissions fetch complete')
          } catch (err) {
            console.error('[PermissionStore] Rehydrate fetch failed:', err)
          }
        }
      },
    },
  ),
)
