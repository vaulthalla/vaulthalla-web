import { User } from '@/models/user'
import { Volume } from '@/models/volumes'

interface IGroupMember {
  user: User
  joined_at: string
}

interface IGroupVolume {
  volume: Volume
  assigned_at: string
}

interface IGroup {
  id: number
  name: string
  description?: string
  created_at: string
  updated_at: string
  members: IGroupMember[]
  volumes: IGroupVolume[]
}

export class Group {
  constructor(
    public id: number,
    public name: string,
    public description: string = '',
    public created_at: Date = new Date(),
    public updated_at: Date = new Date(),
    public members: User[] = [],
    public volumes: Volume[] = [],
  ) {}

  static fromData(data: IGroup): Group {
    return new Group(
      data.id,
      data.name,
      data.description ?? '',
      new Date(data.created_at),
      new Date(data.updated_at),
      data.members.map(member => member.user),
      data.volumes.map(volume => volume.volume),
    )
  }
}
