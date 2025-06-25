interface IRole {
  id: number
  name: string
  display_name: string
  description?: string
  permissions: string[]
  created_at: Date

  // carryover from user_roles
  scope?: string
  scope_id?: number
  assigned_at?: string
}

export class Role {
  constructor(
    public id: number,
    public name: string,
    public display_name: string,
    public description: string = '',
    public permissions: string[] = [],
    public created_at: Date = new Date(),
    public scope?: string,
    public scope_id?: number,
    public assigned_at?: string,
  ) {}

  static fromData(data: IRole): Role {
    return new Role(
      data.id,
      data.name,
      data.display_name,
      data.description,
      data.permissions,
      new Date(data.created_at),
      data.scope ?? undefined,
      data.scope_id ?? undefined,
      data.assigned_at ?? undefined,
    )
  }
}
