export interface Vault {
  id: number
  name: string
  type: 'local' | 's3'
  isActive: boolean
  createdAt: string
}

export interface LocalDiskBackend extends Vault {
  vault_id: number
  mount_point: string
}

export interface S3CompatibleBackend extends Vault {
  vault_id: number
  bucket: string
  region: string
  accessKey: string
  secretAccessKey: string
  endpoint: string
}

export class LocalDiskStorage implements LocalDiskBackend {
  id: number
  vault_id: number
  name: string
  type: 'local'
  isActive: boolean
  createdAt: string
  mount_point: string

  constructor(id: number, name: string, mount_point: string) {
    this.id = id
    this.vault_id = id
    this.name = name
    this.type = 'local'
    this.isActive = false
    this.createdAt = new Date().toISOString()
    this.mount_point = mount_point
  }
}

export class S3Storage implements S3CompatibleBackend {
  id: number
  vault_id: number
  name: string
  type: 's3'
  isActive: boolean
  createdAt: string
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
  ) {
    this.id = id
    this.vault_id = id
    this.name = name
    this.type = 's3'
    this.isActive = false
    this.createdAt = new Date().toISOString()
    this.bucket = bucket
    this.region = region
    this.accessKey = accessKey
    this.secretAccessKey = secretAccessKey
    this.endpoint = endpoint
  }
}

export const toVaultArray = (vaults: { data: any[] }): Vault[] => {
  return vaults.data.map(v => {
    if (v.type === 'local') {
      return new LocalDiskStorage(v.id, v.name, v.mount_point)
    }
    if (v.type === 's3') {
      return new S3Storage(v.id, v.name, v.bucket, v.region, v.accessKey, v.secretAccessKey, v.endpoint)
    }
    throw new Error(`Unknown vault type: ${v.type}`)
  })
}
