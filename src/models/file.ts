export interface IFile {
  id: number
  storageVolumeId: number
  parentId?: number
  name: string
  isDirectory: boolean
  mode: number
  uid: number
  gid: number
  createdBy: number
  createdAt: number // Unix timestamp
  updatedAt: number // Unix timestamp
  currentVersionSizeBytes: number
  isTrashed: boolean
  trashedAt: number
  trashedBy: number
  fullPath?: string
}

export class File implements IFile {
  id: number = 0
  storageVolumeId: number = 0
  parentId?: number
  name: string = ''
  isDirectory: boolean = false
  mode: number = 0
  uid: number = 0
  gid: number = 0
  createdBy: number = 0
  createdAt: number = 0
  updatedAt: number = 0
  currentVersionSizeBytes: number = 0
  isTrashed: boolean = false
  trashedAt: number = 0
  trashedBy: number = 0
  fullPath?: string

  constructor(init?: any) {
    if (init) {
      this.id = init.id
      this.storageVolumeId = init.storage_volume_id
      this.parentId = init.parent_id
      this.name = init.name
      this.isDirectory = init.is_directory
      this.mode = init.mode
      this.uid = init.uid
      this.gid = init.gid
      this.createdBy = init.created_by
      this.createdAt = init.created_at
      this.updatedAt = init.updated_at
      this.currentVersionSizeBytes = init.current_version_size_bytes
      this.isTrashed = init.is_trashed
      this.trashedAt = init.trashed_at
      this.trashedBy = init.trashed_by
      this.fullPath = init.full_path
    }
  }

  public toString(): string {
    return `${this.isDirectory ? 'DIR' : 'FILE'}: ${this.fullPath ?? this.name}`
  }
}

export interface IFileUpload {
  vault_id: number
  volume_id: number
  path: string
  size?: number
}
