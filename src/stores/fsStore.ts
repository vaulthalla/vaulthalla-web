import { create } from 'zustand'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { File as DBFile } from '@/models/file'
import { LocalDiskStorage, S3Storage, Vault } from '@/models/vaults'
import { Volume } from '@/models/volumes'
import { persist } from 'zustand/middleware'
import { useVaultStore } from '@/stores/vaultStore'
import { useVolumeStore } from '@/stores/volumeStore'

interface FsStore {
  currVault: Vault | LocalDiskStorage | S3Storage | null
  currVolume: Volume | null
  path: string
  uploading: boolean
  uploadProgress: number
  files: DBFile[]
  fetchFiles: () => Promise<void>
  uploadFile: ({ file, targetPath }: { file: File; targetPath?: string }) => Promise<void>
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
      uploading: false,
      uploadProgress: 0,
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

        const { currVault, currVolume } = get()
        if (!currVault || !currVolume) {
          throw new Error('No current vault or volume selected')
        }

        set({ uploading: true, uploadProgress: 0 })

        try {
          // 1️⃣ Start upload
          const startResp = await ws.sendCommand('fs.upload.start', {
            vault_id: currVault.id,
            volume_id: currVolume.id,
            path: targetPath,
            size: file.size,
          })

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
          await ws.sendCommand('fs.upload.finish', {
            vault_id: currVault.id,
            volume_id: currVolume.id,
            path: targetPath,
          })

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
