interface IPermission {
  id: number
  name: string
  display_name: string
  description?: string
  bit_position: number
  created_at: Date
  updated_at: Date
}

export class Permission {
  constructor(
    public id: number,
    public name: string,
    public display_name: string,
    public description: string = '',
    public bit_position: number = 0,
    public created_at: Date = new Date(),
    public updated_at: Date = new Date(),
  ) {}

  static fromData(data: IPermission): Permission {
    return new Permission(
      data.id,
      data.name,
      data.display_name,
      data.description,
      data.bit_position,
      new Date(data.created_at),
      new Date(data.updated_at),
    )
  }
}
