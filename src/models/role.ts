interface IRole {
  id: number
  role_id: number
  subject_id: number
  name: string
  display_name: string
  description: string
  scope: string
  scope_id?: number
  admin_permissions: string[]
  vault_permissions: string[]
  file_permissions: string[]
  directory_permissions: string[]
  created_at: Date // ISO string from backend
  assigned_at: Date
  inherited: boolean

  permissions?: string[] // populated client-side after bitmask decode
}

export class Role {
  constructor(
    public id: number,
    public role_id: number,
    public subject_id: number,
    public name: string,
    public display_name: string,
    public description: string = '',
    public scope: string = '',
    public scope_id?: number,
    public admin_permissions: string[] = [],
    public vault_permissions: string[] = [],
    public file_permissions: string[] = [],
    public directory_permissions: string[] = [],
    public created_at: Date = new Date(),
    public assigned_at: Date = new Date(),
    public inherited: boolean = false,
    public permissions: string[] = [], // decoded permissions
  ) {}

  static fromData(data: IRole): Role {
    // Combine all permission categories into one flat array
    const combinedPerms = [
      ...(data.admin_permissions || []),
      ...(data.vault_permissions || []),
      ...(data.file_permissions || []),
      ...(data.directory_permissions || []),
    ]

    return new Role(
      data.id,
      data.role_id,
      data.subject_id,
      data.name,
      data.display_name,
      data.description || '',
      data.scope || '',
      data.scope_id ?? undefined,
      data.admin_permissions || [],
      data.vault_permissions || [],
      data.file_permissions || [],
      data.directory_permissions || [],
      new Date(data.created_at),
      new Date(data.assigned_at),
      data.inherited,
      combinedPerms,
    )
  }
}
