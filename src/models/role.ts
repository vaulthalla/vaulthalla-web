// Permission definition (as returned from API / DB)
export interface Permission {
  id: number
  name: string
  description: string
  category: 'user' | 'vault'
  bit_position: number
  created_at: string
  updated_at: string
}

// Permission override on a vault role
export interface PermissionOverride {
  permission: Permission
  enabled: boolean
  regex: string
}

// Base role structure (used for both user + vault roles)
export interface IRole {
  role_id: number
  name: string
  description: string
  type: 'user' | 'vault'
  permissions: Record<string, boolean> // decoded mask
  created_at: string
}

// User role assignment
export interface IUserRole extends IRole {
  assignment_id: number
  user_id: number
  assigned_at: string
}

// Vault role assignment
export interface IVaultRole extends IRole {
  assignment_id: number
  vault_id: number
  subject_type: 'user' | 'group'
  subject_id: number
  assigned_at: string
  permission_overrides: PermissionOverride[]
}

// UserRole class
export class UserRole {
  constructor(
    public role_id: number,
    public name: string,
    public description: string,
    public permissions: Record<string, boolean>,
    public created_at: Date,
    public assignment_id: number,
    public user_id: number,
    public assigned_at: Date,
    public type: 'user' = 'user',
  ) {}

  static fromData(data: IUserRole): UserRole {
    return new UserRole(
      data.role_id,
      data.name,
      data.description,
      data.permissions,
      new Date(data.created_at),
      data.assignment_id,
      data.user_id,
      new Date(data.assigned_at),
    )
  }
}

// VaultRole class
export class VaultRole {
  constructor(
    public role_id: number,
    public name: string,
    public description: string,
    public permissions: Record<string, boolean>,
    public created_at: Date,
    public assignment_id: number,
    public vault_id: number,
    public subject_type: 'user' | 'group',
    public subject_id: number,
    public assigned_at: Date,
    public permission_overrides: PermissionOverride[],
    public type: 'vault' = 'vault',
  ) {}

  static fromData(data: IVaultRole): VaultRole {
    return new VaultRole(
      data.role_id,
      data.name,
      data.description,
      data.permissions,
      new Date(data.created_at),
      data.assignment_id,
      data.vault_id,
      data.subject_type,
      data.subject_id,
      new Date(data.assigned_at),
      data.permission_overrides || [],
    )
  }
}
