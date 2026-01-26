export interface ICapacityStats {
  capacity: number
  logical_size: number
  physical_size: number
  cache_size: number
  free_space: number
  file_count: number
  directory_count: number
  average_file_size: number
  largest_file_size: number
  top_file_extensions: Record<string, number>
}

export interface IVaultStats {
  capacity: ICapacityStats
}

export class CapacityStats implements ICapacityStats {
  capacity: number = 0
  logical_size: number = 0
  physical_size: number = 0
  cache_size: number = 0
  free_space: number = 0
  file_count: number = 0
  directory_count: number = 0
  average_file_size: number = 0
  largest_file_size: number = 0
  top_file_extensions: Record<string, number> = {}

  constructor(data?: Partial<ICapacityStats>) {
    if (data) Object.assign(this, data)
  }
}

export class VaultStats implements IVaultStats {
  capacity: ICapacityStats

  constructor(capacity: ICapacityStats) {
    this.capacity = capacity
  }
}
