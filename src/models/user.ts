import { Role, UserRole } from '@/models/role'

export interface IUser {
  id: number
  name: string
  email: string
  permissions: Record<string, boolean>
  created_at: string
  last_login: string
  is_active: boolean
  role: UserRole
  roles: Role[]
}

export class User {
  id: number
  name: string
  email: string
  permissions: Record<string, boolean>
  created_at: string
  last_login: string
  is_active: boolean
  role: UserRole
  roles: Role[]

  constructor(data: IUser) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.permissions = data.permissions || {}
    this.created_at = data.created_at
    this.last_login = data.last_login
    this.is_active = data.is_active
    this.role = UserRole.fromData(data.role)
    this.roles = data.roles.map(role => Role.fromData(role))
  }

  static fromJSON(data: IUser): User {
    return new User(data)
  }
}
