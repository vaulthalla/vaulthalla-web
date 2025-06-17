export interface VolumeType {
  id: number
  vault_id: number
  name: string
  path_prefix?: string
  quota_bytes?: number
  created_at: string
}

export class Volume implements VolumeType {
  id: number
  vault_id: number
  name: string
  path_prefix?: string
  quota_bytes?: number
  created_at: string

  constructor(
    id: number,
    vault_id: number,
    name: string,
    path_prefix?: string,
    quota_bytes?: number,
    created_at: string = new Date().toISOString(),
  ) {
    this.id = id
    this.vault_id = vault_id
    this.name = name
    this.path_prefix = path_prefix
    this.quota_bytes = quota_bytes
    this.created_at = created_at
  }
}

export const toVolumeArray = (volumes: any[]): Volume[] => {
  return volumes.map(v => {
    const createdAt = v.created_at ?? v.createdAt ?? new Date().toISOString()
    return new Volume(v.id, v.vault_id, v.name, v.path_prefix, v.quota_bytes, createdAt)
  })
}
