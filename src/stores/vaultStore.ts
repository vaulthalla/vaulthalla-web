import { create } from 'zustand'
import { StorageBackend } from '@/models/storageBackend.model'
import { useWebSocketStore } from '@/stores/useWebSocket'

interface VaultStore {
  backends: StorageBackend[]

  // Core actions
  setBackends: (backends: StorageBackend[]) => void
  addBackend: (backend: StorageBackend) => void
  updateBackend: (backend: StorageBackend) => void
  removeBackend: (id: string) => void

  // Queries
  getBackendsByType: (type: StorageBackend['type']) => StorageBackend[]
  getBackendById: (id: string) => StorageBackend | undefined

  // Remote actions
  sendCreateBackendCommand: (backend: StorageBackend) => void
  sendDeleteBackendCommand: (id: string) => void
}

export const useVaultStore = create<VaultStore>((set, get) => ({
  backends: [],

  setBackends: backends => set({ backends }),

  addBackend: backend => set(state => ({ backends: [...state.backends, backend] })),

  updateBackend: backend => set(state => ({ backends: state.backends.map(b => (b.id === backend.id ? backend : b)) })),

  removeBackend: id => set(state => ({ backends: state.backends.filter(b => b.id !== id) })),

  getBackendsByType: type => get().backends.filter(b => b.type === type),

  getBackendById: id => get().backends.find(b => b.id === id),

  sendCreateBackendCommand: backend => {
    const sendCommand = useWebSocketStore.getState().sendCommand
    sendCommand({ command: 'createBackend', payload: backend })
  },

  sendDeleteBackendCommand: id => {
    const sendCommand = useWebSocketStore.getState().sendCommand
    sendCommand({ command: 'deleteBackend', payload: { id } })
  },
}))
