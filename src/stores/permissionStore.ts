import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { useWebSocketStore } from '@/stores/useWebSocket'
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
  getRole: (payload: WSCommandPayload<'role.get'>) => Promise<Role | undefined>
  getRoleByName: (payload: WSCommandPayload<'role.get.byName'>) => Promise<Role | undefined>
  getPermission: (payload: WSCommandPayload<'permission.get'>) => Promise<Permission | undefined>
  getPermissionByName: (payload: WSCommandPayload<'permission.get.byName'>) => Promise<Permission | undefined>
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
        const roles = response.roles.map(Role.fromData)

        set({ roles })
      },

      async fetchPermissions() {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        const response = await ws.sendCommand('permissions.list', null)
        const permissions = response.permissions.map(Permission.fromData)

        set({ permissions })
      },

      async addRole(vaultPayload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('role.add', vaultPayload)
        const newRole = Role.fromData(response.role)

        set(state => ({ roles: [...state.roles, newRole] }))
      },

      async removeRole({ id }) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        await sendCommand('role.delete', { id })

        set(state => ({ roles: state.roles.filter(role => role.id !== id) }))
      },

      async updateRole(payload) {
        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('role.update', payload)
        const updatedRole = Role.fromData(response.role)

        set(state => ({ roles: state.roles.map(role => (role.id === updatedRole.id ? updatedRole : role)) }))
      },

      async getRole({ id }) {
        const role = get().roles.find(r => r.id === id)
        if (role) return role

        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('role.get', { id })
        return Role.fromData(response.role)
      },

      async getRoleByName({ name }) {
        const role = get().roles.find(r => r.name === name)
        if (role) return role

        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('role.get.byName', { name })
        return Role.fromData(response.role)
      },

      async getPermission({ id }) {
        const permission = get().permissions.find(p => p.id === id)
        if (permission) return permission

        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('permission.get', { id })
        return Permission.fromData(response.permission)
      },

      async getPermissionByName({ name }) {
        const permission = get().permissions.find(p => p.name === name)
        if (permission) return permission

        const sendCommand = useWebSocketStore.getState().sendCommand
        const response = await sendCommand('permission.get.byName', { name })
        return Permission.fromData(response.permission)
      },

      async getPermissions() {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        const response = await ws.sendCommand('permissions.list', null)
        return response.permissions.map(Permission.fromData)
      },

      async getRoles() {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        const response = await ws.sendCommand('roles.list', null)
        return response.roles.map(Role.fromData)
      },
    }),
    {
      name: 'permission-store',
      partialize: state => ({ roles: state.roles, permissions: state.permissions }),
      onRehydrateStorage: () => state => {
        if (state) {
          ;(async () => {
            try {
              await (await import('@/stores/useWebSocket')).useWebSocketStore.getState().waitForConnection()
              await state.fetchRoles()
              await state.fetchPermissions()
            } catch (err) {
              console.error('[PermissionStore] Rehydration failed:', err)
            }
          })()
        }
      },
    },
  ),
)
