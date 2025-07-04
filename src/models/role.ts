interface Permission {
  id: number
  name: string
  description?: string
  category: string
  bit_position: number
  created_at: Date // ISO string from backend
  updated_at: Date // ISO string from backend
}

interface PermissionOverride {
  permission: Permission
  is_file: boolean
  enabled: boolean
  regex: string
}

interface IUserRole {
  id: number
  name: string
  description: string
  permissions: Record<string, boolean>
  created_at: Date
}

export class UserRole {
  constructor(
    public id: number,
    public name: string,
    public description: string = '',
    public permissions: Record<string, boolean> = {},
    public created_at: Date = new Date(),
  ) {}

  static fromData(data: IUserRole): UserRole {
    return new UserRole(data.id, data.name, data.description || '', data.permissions || {}, new Date(data.created_at))
  }
}

interface IRole {
  id: number
  role_id: number
  subject_id: number
  name: string
  description: string
  simple_permissions: boolean
  file_permissions: Record<string, boolean>
  directory_permissions: Record<string, boolean>
  created_at: Date // ISO string from backend
  assigned_at: Date
  permission_overrides: PermissionOverride[]
  permissions: string[]
}

export class Role {
  constructor(
    public id: number,
    public role_id: number,
    public subject_id: number,
    public name: string,
    public description: string = '',
    public simple_permissions: boolean = false,
    public file_permissions: Record<string, boolean> = {},
    public directory_permissions: Record<string, boolean> = {},
    public created_at: Date = new Date(),
    public assigned_at: Date = new Date(),
    public permission_overrides: PermissionOverride[] = [],
    public permissions: string[] = [], // decoded permissions
  ) {}

  static fromData(data: IRole): Role {
    const combinedPerms = [
      ...Object.keys(data.file_permissions || {}).filter(k => data.file_permissions[k]),
      ...Object.keys(data.directory_permissions || {}).filter(k => data.directory_permissions[k]),
    ]

    return new Role(
      data.id,
      data.role_id,
      data.subject_id,
      data.name,
      data.description || '',
      data.simple_permissions || false,
      data.file_permissions || {},
      data.directory_permissions || {},
      new Date(data.created_at),
      new Date(data.assigned_at),
      data.permission_overrides || [],
      combinedPerms,
    )
  }
}
