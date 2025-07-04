import { create } from 'zustand'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { persist } from 'zustand/middleware'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { Role, UserRole } from '@/models/role'
import { Permission } from '@/models/permission'

interface PermissionStore {
  roles: Role[]
  userRoles: UserRole[]
  permissions: Permission[]
  setRoles: (roles: Role[]) => void
  setUserRoles: (userRoles: UserRole[]) => void
  fetchRoles: () => Promise<void>
  fetchUserRoles: () => Promise<void>
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
      userRoles: [],
      permissions: [],

      setRoles: roles => set({ roles }),

      setUserRoles: userRoles => set({ userRoles }),

      async fetchRoles() {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()
        const response = await ws.sendCommand('roles.list.vault', null)
        set({ roles: response.roles })
      },

      async fetchUserRoles() {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()
        const response = await ws.sendCommand('roles.list.user', null)
        set({ userRoles: response.roles.map(role => UserRole.fromData(role)) })
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
      partialize: state => ({ roles: state.roles, userRoles: state.userRoles, permissions: state.permissions }),
      onRehydrateStorage: state => {
        console.log('[PermissionStore] Rehydrating...')
        return async storedState => {
          try {
            console.log('[PermissionStore] Waiting for WebSocket connection...')
            await useWebSocketStore.getState().waitForConnection()
            console.log('[PermissionStore] WebSocket connected. Re-fetching roles and permissions...')

            await state?.fetchRoles?.()
            await state?.fetchUserRoles?.()
            await state?.fetchPermissions?.()

            // Force normalization
            if (storedState?.userRoles)
              state.setUserRoles(
                Array.isArray(storedState.userRoles) ? storedState.userRoles : Object.values(storedState.userRoles),
              )

            if (storedState?.roles)
              state.setRoles(Array.isArray(storedState.roles) ? storedState.roles : Object.values(storedState.roles))

            console.log('[PermissionStore] Roles and permissions fetch complete')
          } catch (err) {
            console.error('[PermissionStore] Rehydrate fetch failed:', err)
          }
        }
      },
    },
  ),
)
