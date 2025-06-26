import { Role } from '@/models/role'

export interface IUser {
  id: number
  name: string
  email: string
  created_at: string
  last_login: string
  is_active: boolean
  global_role: Role
  scoped_roles: Role[]
}

export class User {
  id: number
  name: string
  email: string
  created_at: string
  last_login: string
  is_active: boolean
  global_role: Role
  scopedRoles: Role[]

  constructor(data: IUser) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.created_at = data.created_at
    this.last_login = data.last_login
    this.is_active = data.is_active
    this.global_role = Role.fromData(data.global_role)
    this.scopedRoles = data.scoped_roles.map(role => Role.fromData(role))
  }

  static fromJSON(data: IUser): User {
    return new User(data)
  }
}
