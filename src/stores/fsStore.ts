import { create } from 'zustand'
import { useWebSocketStore } from '@/stores/useWebSocket'
import { WSCommandPayload } from '@/util/webSocketCommands'
import { File } from '@/models/file'

interface FsStore {
  writeFile: (vaultPayload: WSCommandPayload<'fs.file.write'>) => Promise<void>
  listDirectory: (vaultPayload: WSCommandPayload<'fs.dir.list'>) => Promise<File[]>
}

export const useFSStore = create<FsStore>()(() => ({
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
}))
