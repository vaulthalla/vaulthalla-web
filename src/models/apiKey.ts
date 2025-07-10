export interface APIKeyType {
  api_key_id: number
  user_id: number
  type: string // 's3', 'vault', etc.
  name: string
  created_at: string
  provider?: string // Optional for S3APIKey
}

interface S3APIKeyType extends APIKeyType {
  access_key: string
  secret_access_key: string
  region: string
  endpoint: string
}

export class APIKey implements APIKeyType {
  api_key_id: number
  user_id: number
  type: string
  name: string
  created_at: string
  provider?: string // Optional for generic APIKey

  constructor(data: APIKeyType) {
    this.api_key_id = data.api_key_id
    this.user_id = data.user_id
    this.type = data.type
    this.name = data.name
    this.created_at = data.created_at
    this.provider = data.provider ?? ''
  }
}

export class S3APIKey extends APIKey {
  provider: string
  access_key: string
  secret_access_key: string
  region: string
  endpoint: string

  constructor(data: APIKeyType & S3APIKeyType) {
    super(data)
    this.provider = data.provider ?? 's3'
    this.access_key = data.access_key
    this.secret_access_key = data.secret_access_key
    this.region = data.region
    this.endpoint = data.endpoint
  }
}

export const toAPIKeyArray = (keys: any[]): APIKey[] => {
  return keys.map(k => {
    const createdAt = k.created_at ?? k.createdAt ?? new Date().toISOString()
    return new APIKey({
      api_key_id: k.api_key_id ?? k.id,
      user_id: k.user_id ?? k.owner_id,
      type: k.type ?? 'generic',
      name: k.name ?? 'Unnamed API Key',
      created_at: createdAt,
      provider: k.provider ?? '',
    })
  })
}
