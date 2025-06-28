import { create } from 'zustand'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { File } from '@/models/file'
import { LocalDiskStorage, S3Storage, Vault } from '@/models/vaults'
import { Volume } from '@/models/volumes'
import { persist } from 'zustand/middleware'
import { useVaultStore } from '@/stores/vaultStore'
import { useVolumeStore } from '@/stores/volumeStore'

interface FsStore {
  currVault: Vault | LocalDiskStorage | S3Storage | null
  currVolume: Volume | null
  path: string
  files: File[]
  fetchFiles: () => Promise<void>
  setCurrVault: (vault: Vault) => void
  setCurrVolume: (volume: Volume) => void
  setPath: (dir: string) => void
  writeFile: (vaultPayload: WSCommandPayload<'fs.file.write'>) => Promise<void>
  listDirectory: (vaultPayload: WSCommandPayload<'fs.dir.list'>) => Promise<File[]>
}

export const useFSStore = create<FsStore>()(
  persist(
    (set, get) => ({
      currVault: null,
      currVolume: null,
      path: '',
      files: [],

      async fetchFiles() {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        const { currVault, currVolume } = get()
        if (!currVault || !currVolume) {
          console.warn('[FsStore] No current vault or volume set')
          return
        }

        try {
          const response = await ws.sendCommand('fs.dir.list', {
            vault_id: currVault.id,
            volume_id: currVolume.id,
            path: get().path,
          })

          const files = response.files.map(file => new File(file))
          set({ files })
        } catch (error) {
          console.error('Error fetching files:', error)
          throw error
        }
      },

      setCurrVault: vault => {
        set({ currVault: vault })
        useVolumeStore.getState().fetchVaultVolumes({ vault_id: vault.id })
      },

      setCurrVolume: volume => {
        set({ currVolume: volume })
      },

      setPath: (dir: string) => {
        set({ path: dir })
      },

      async writeFile(vaultPayload) {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        try {
          await ws.sendCommand('fs.file.write', vaultPayload)
        } catch (error) {
          console.error('Error writing file:', error)
          throw error
        }
      },

      async listDirectory(vaultPayload) {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        try {
          const response = await ws.sendCommand('fs.dir.list', vaultPayload)
          return response.files
        } catch (error) {
          console.error('Error listing directory:', error)
          throw error
        }
      },
    }),
    {
      name: 'vaulthalla-fs',
      partialize: state => ({ currVault: state.currVault, currVolume: state.currVolume }),
      onRehydrateStorage: state => {
        console.log('[FsStore] Rehydrated from storage')
        ;(async () => {
          try {
            await useWebSocketStore.getState().waitForConnection()

            const vaultStore = useVaultStore.getState()
            if (!state.currVault) {
              const localVault = await vaultStore.getLocalVault()
              if (localVault) state.setCurrVault(localVault)
              else console.warn('[FsStore] No local vault found during rehydration')
            }
          } catch (err) {
            console.error('[FsStore] Rehydrate fetch failed:', err)
          }
        })()
      },
    },
  ),
)
