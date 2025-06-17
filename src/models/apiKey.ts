export interface APIKeyType {
  id: number
  user_id: number
  type: string // 's3', 'vault', etc.
  name: string
  created_at: string
  provider?: string // Optional for S3APIKey
}

export class APIKey implements APIKeyType {
  id: number
  user_id: number
  type: string
  name: string
  created_at: string
  provider?: string // Optional for generic APIKey

  constructor(
    id: number,
    user_id: number,
    type: string,
    name: string,
    created_at: string = new Date().toISOString(),
    provider: string = '', // Default to empty string if not provided
  ) {
    this.id = id
    this.user_id = user_id
    this.type = type
    this.name = name
    this.created_at = created_at
    this.provider = provider
  }
}

export class S3APIKey extends APIKey {
  provider: string
  access_key: string
  secret_access_key: string
  region: string
  endpoint: string

  constructor(
    id: number,
    user_id: number,
    name: string,
    created_at: string,
    provider: string,
    access_key: string,
    secret_access_key: string,
    region: string,
    endpoint: string,
  ) {
    super(id, user_id, 's3', name, created_at)
    this.provider = provider
    this.access_key = access_key
    this.secret_access_key = secret_access_key
    this.region = region
    this.endpoint = endpoint
  }
}

export const toAPIKeyArray = (keys: any[]): APIKey[] => {
  return keys.map(k => {
    const createdAt = k.created_at ?? k.createdAt ?? new Date().toISOString()
    return new APIKey(k.id, k.user_id, k.type, k.name, createdAt, k.provider ?? '')
  })
}
