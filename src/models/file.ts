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

  constructor(init?: Partial<IFile>) {
    if (init) {
      Object.assign(this, init)
    }
  }

  public toString(): string {
    return `${this.isDirectory ? 'DIR' : 'FILE'}: ${this.fullPath ?? this.name}`
  }
}
