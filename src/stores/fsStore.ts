import { create } from 'zustand'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { File as DBFile } from '@/models/file'
import { LocalDiskVault, S3Vault, Vault } from '@/models/vaults'
import { persist } from 'zustand/middleware'
import { useVaultStore } from '@/stores/vaultStore'

interface FsStore {
  currVault: Vault | LocalDiskVault | S3Vault | null
  path: string
  uploading: boolean
  uploadProgress: number
  files: DBFile[]
  fetchFiles: () => Promise<void>
  uploadFile: ({ file, targetPath }: { file: File; targetPath?: string }) => Promise<void>
  mkdir: (payload: WSCommandPayload<'fs.dir.create'>) => Promise<void>
  setCurrVault: (vault: Vault) => void
  setPath: (dir: string) => void
  listDirectory: (payload: WSCommandPayload<'fs.dir.list'>) => Promise<DBFile[]>
}

export const useFSStore = create<FsStore>()(
  persist(
    (set, get) => ({
      currVault: null,
      path: '',
      uploading: false,
      uploadProgress: 0,
      files: [],

      async fetchFiles() {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        const { currVault } = get()
        if (!currVault) {
          console.warn('[FsStore] No current vault to set')
          return
        }

        try {
          const response = await ws.sendCommand('fs.dir.list', { vault_id: currVault.id, path: get().path })

          console.log(response.files)
          const files = response.files.map(file => new DBFile(file))
          set({ files })
        } catch (error) {
          console.error('Error fetching files:', error)
          throw error
        }
      },

      async uploadFile({ file, targetPath = get().path }) {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        const { currVault } = get()
        if (!currVault) {
          throw new Error('No current vault selected')
        }

        set({ uploading: true, uploadProgress: 0 })

        try {
          // 1️⃣ Start upload
          const startResp = await ws.sendCommand('fs.upload.start', {
            vault_id: currVault.id,
            path: targetPath,
            size: file.size,
          })

          console.log(startResp)

          const uploadId = startResp.upload_id
          if (!uploadId) throw new Error('Server did not return an upload_id')

          // 2️⃣ Send binary frames
          const wsInstance = ws.socket
          if (!wsInstance || wsInstance.readyState !== WebSocket.OPEN) throw new Error('WebSocket is not connected')
          const chunkSize = 64 * 1024 // 64KB per frame
          let offset = 0

          while (offset < file.size) {
            const slice = file.slice(offset, offset + chunkSize)
            const arrayBuffer = await slice.arrayBuffer()
            wsInstance.send(arrayBuffer)

            offset += chunkSize
            set({ uploadProgress: (offset / file.size) * 100 })
          }

          // 3️⃣ Finish upload
          const res = await ws.sendCommand('fs.upload.finish', { vault_id: currVault.id, path: targetPath })

          console.log(res)

          console.log('[FsStore] Upload finished successfully')
          set({ uploading: false, uploadProgress: 100 })

          // Optionally refresh directory listing
          await get().fetchFiles()
        } catch (err) {
          console.error('[FsStore] Upload error:', err)
          set({ uploading: false, uploadProgress: 0 })
          throw err
        }
      },

      async mkdir({ vault_id, path }) {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        try {
          const response = await ws.sendCommand('fs.dir.create', { vault_id, path })
          console.log('[FsStore] Directory created:', response.path)
          await get().fetchFiles()
        } catch (error) {
          console.error('Error creating directory:', error)
          throw error
        }
      },

      async setCurrVault(vault) {
        set({ currVault: vault })
        await get().fetchFiles()
      },

      async setPath(dir) {
        set({ path: dir })
        await get().fetchFiles()
      },

      async listDirectory({ vault_id, path = get().path }) {
        const ws = useWebSocketStore.getState()
        await ws.waitForConnection()

        try {
          const response = await ws.sendCommand('fs.dir.list', { vault_id, path })
          return response.files
        } catch (error) {
          console.error('Error listing directory:', error)
          throw error
        }
      },
    }),
    {
      name: 'vaulthalla-fs',
      partialize: state => ({ currVault: state.currVault, path: state.path }),
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

            if (!state.files || state.files.length === 0) await state.fetchFiles()
          } catch (err) {
            console.error('[FsStore] Rehydrate fetch failed:', err)
          }
        })()
      },
    },
  ),
)
