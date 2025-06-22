export interface IUser {
  id: number
  name: string
  email: string
  created_at: string
  last_login: string
  is_active: boolean
}

export class User {
  id: number
  name: string
  email: string
  created_at: string
  last_login: string
  is_active: boolean

  constructor(data: IUser) {
    this.id = data.id
    this.name = data.name
    this.email = data.email
    this.created_at = data.created_at
    this.last_login = data.last_login
    this.is_active = data.is_active
  }

  static fromJSON(data: IUser): User {
    return new User(data)
  }
}

export function parseUsersArray(data: string): User[] {
  try {
    const parsed = JSON.parse(data) as IUser[]
    return parsed.map(user => User.fromJSON(user))
  } catch (error) {
    console.error('Failed to parse users array:', error)
    return []
  }
}
