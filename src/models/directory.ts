import { FSEntry } from '@/models/fsEntry'

interface DirectoryStats {
  size_bytes: number
  file_count: number
  subdirectory_count: number
  last_modified: Date
}

interface IDirectory extends FSEntry {
  stats?: DirectoryStats
}

export class Directory implements IDirectory {
  id: number = 0
  vault_id: number = 0
  parent_id?: number
  name: string = ''
  created_by: number = 0
  created_at: number = 0
  updated_at: number = 0
  last_modified_by?: number
  path?: string
  stats?: DirectoryStats

  constructor(data?: Partial<IDirectory>) {
    if (data) Object.assign(this, data)
    if (data?.stats) this.stats = { ...data.stats }
  }
}
