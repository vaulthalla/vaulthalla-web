export type VaultType = 'local' | 's3'

export class Vault {
  id: number
  name: string
  type: VaultType
  isActive: boolean
  createdAt: string

  constructor(
    id: number,
    name: string,
    type: VaultType,
    isActive: boolean = true,
    createdAt: string = new Date().toISOString(),
  ) {
    this.id = id
    this.name = name
    this.type = type
    this.isActive = isActive
    this.createdAt = createdAt
  }
}

export class LocalDiskStorage extends Vault {
  vault_id: number
  mount_point: string

  constructor(id: number, name: string, mount_point: string, isActive: boolean = true, createdAt?: string) {
    super(id, name, 'local', isActive, createdAt)
    this.vault_id = id
    this.mount_point = mount_point
  }
}

export class S3Storage extends Vault {
  vault_id: number
  bucket: string
  region: string
  accessKey: string
  secretAccessKey: string
  endpoint: string

  constructor(
    id: number,
    name: string,
    bucket: string,
    region: string,
    accessKey: string,
    secretAccessKey: string,
    endpoint: string,
    isActive: boolean = true,
    createdAt?: string,
  ) {
    super(id, name, 's3', isActive, createdAt)
    this.vault_id = id
    this.bucket = bucket
    this.region = region
    this.accessKey = accessKey
    this.secretAccessKey = secretAccessKey
    this.endpoint = endpoint
  }
}

export const toVaultArray = (vaults: any[]): Vault[] => {
  return vaults.map(v => {
    const isActive = v.is_active ?? v.isActive ?? true
    const createdAt = v.created_at ?? v.createdAt ?? new Date().toISOString()

    if (v.type === 'local') {
      return new LocalDiskStorage(v.id, v.name, v.mount_point, isActive, createdAt)
    }

    if (v.type === 's3') {
      return new S3Storage(
        v.id,
        v.name,
        v.bucket,
        v.region,
        v.accessKey,
        v.secretAccessKey,
        v.endpoint,
        isActive,
        createdAt,
      )
    }

    throw new Error(`Unknown vault type: ${v.type}`)
  })
}
