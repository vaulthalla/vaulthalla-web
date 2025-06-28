interface IRole {
  id: number
  role_id: number
  subject_id: number
  name: string
  display_name: string
  description: string
  scope: string
  scope_id?: number
  admin_permissions: Record<string, boolean>
  vault_permissions: Record<string, boolean>
  file_permissions: Record<string, boolean>
  directory_permissions: Record<string, boolean>
  created_at: Date // ISO string from backend
  assigned_at: Date
  inherited: boolean

  permissions: string[] // decoded permissions
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
    public admin_permissions: Record<string, boolean> = {},
    public vault_permissions: Record<string, boolean> = {},
    public file_permissions: Record<string, boolean> = {},
    public directory_permissions: Record<string, boolean> = {},
    public created_at: Date = new Date(),
    public assigned_at: Date = new Date(),
    public inherited: boolean = false,
    public permissions: string[] = [], // decoded permissions
  ) {}

  static fromData(data: IRole): Role {
    const combinedPerms = [
      ...Object.keys(data.admin_permissions || {}).filter(k => data.admin_permissions[k]),
      ...Object.keys(data.vault_permissions || {}).filter(k => data.vault_permissions[k]),
      ...Object.keys(data.file_permissions || {}).filter(k => data.file_permissions[k]),
      ...Object.keys(data.directory_permissions || {}).filter(k => data.directory_permissions[k]),
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
      data.admin_permissions || {},
      data.vault_permissions || {},
      data.file_permissions || {},
      data.directory_permissions || {},
      new Date(data.created_at),
      new Date(data.assigned_at),
      data.inherited,
      combinedPerms,
    )
  }
}
