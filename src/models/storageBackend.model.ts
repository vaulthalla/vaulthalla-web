export interface StorageBackend {
  id: string
  name: string
  type: 'local' | 's3'
  isActive: boolean
  createdAt: string
}

export interface LocalDiskBackend extends StorageBackend {
  mount_point: string
}

export interface S3CompatibleBackend extends StorageBackend {
  bucket: string
  region: string
  accessKey: string
  secretAccessKey: string
  endpoint: string
}

export class LocalDiskStorage implements LocalDiskBackend {
  id: string
  name: string
  type: 'local'
  isActive: boolean
  createdAt: string
  mount_point: string

  constructor(id: string, name: string, mount_point: string) {
    this.id = id
    this.name = name
    this.type = 'local'
    this.isActive = false
    this.createdAt = new Date().toISOString()
    this.mount_point = mount_point
  }
}

export class S3Storage implements S3CompatibleBackend {
  id: string
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
    id: string,
    name: string,
    bucket: string,
    region: string,
    accessKey: string,
    secretAccessKey: string,
    endpoint: string,
  ) {
    this.id = id
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
