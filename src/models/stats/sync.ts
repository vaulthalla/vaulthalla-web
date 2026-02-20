import { IFile } from '@/models/file'

/** -------------------------
 *  Shared literal unions
 *  ------------------------- */
export type ArtifactSide = 'local' | 'upstream'

export type ConflictType = 'mismatch' | 'encryption' | 'both'
export type ConflictResolution =
  | 'unresolved'
  | 'kept_local'
  | 'kept_remote'
  | 'kept_both'
  | 'overwritten'
  | 'fixed_remote_encryption'

export type ThroughputMetricType = 'upload' | 'download' | 'rename' | 'delete' | 'copy'

export type EventStatus = 'pending' | 'running' | 'success' | 'stalled' | 'error' | 'canceled'
export type EventTrigger = 'schedule' | 'manual' | 'startup' | 'webhook' | 'retry'

/** -------------------------
 *  Interfaces (as you had)
 *  ------------------------- */
export interface IArtifact {
  id: number
  conflict_id: number
  file: IFile
  side: ArtifactSide
}

export interface IConflictArtifact {
  local: IArtifact
  upstream: IArtifact
}

export interface IConflictReason {
  id: number
  conflict_id: number
  code: string
  message: string
}

export interface IConflict {
  id: number
  event_id: number
  file_id: number
  resolved_at: string | null
  created_at: string
  artifacts: IConflictArtifact
  reasons: IConflictReason[]
  type: ConflictType
  resolution: ConflictResolution
  failed_to_decrypted_upstream: boolean
}

export interface IThroughput {
  id: number
  run_uuid: string
  metric_type: ThroughputMetricType
  num_ops: number
  failed_ops: number
  size_bytes: number
  duration_ms: number
}

export interface IEvent {
  id: number
  vault_id: number
  run_uuid: string

  timestamp_begin: string
  timestamp_end: string | null
  heartbeat_at: string | null

  status: EventStatus
  trigger: EventTrigger
  retry_attempt: number

  stall_reason: string | null
  error_message: string | null
  error_code: string | null

  throughputs: IThroughput[]
  conflicts: IConflict[]

  num_ops_total: number
  num_failed_ops: number
  num_conflicts: number
  bytes_up: number
  bytes_down: number

  divergence_detected: boolean
  local_state_hash: string | null
  remote_state_hash: string | null
  config_hash: string | null
}

/** -------------------------
 *  Tiny runtime helpers
 *  ------------------------- */
function asArray<T>(v: unknown, map: (x: any) => T): T[] {
  return Array.isArray(v) ? v.map(map) : []
}

function asStringOrNull(v: unknown): string | null {
  return typeof v === 'string' ? v : null
}

function asBoolean(v: unknown, fallback = false): boolean {
  return typeof v === 'boolean' ? v : fallback
}

function asNumber(v: unknown, fallback = 0): number {
  return typeof v === 'number' && Number.isFinite(v) ? v : fallback
}

function asString(v: unknown, fallback = ''): string {
  return typeof v === 'string' ? v : fallback
}

/** -------------------------
 *  Classes (runtime-safe)
 *  ------------------------- */

export class Artifact implements IArtifact {
  id: number
  conflict_id: number
  file: IFile
  side: ArtifactSide

  constructor(raw: IArtifact) {
    this.id = raw.id
    this.conflict_id = raw.conflict_id
    this.file = raw.file
    this.side = raw.side
  }

  static from(raw: any): Artifact {
    // If file parsing needs to be stronger, wrap it here too.
    return new Artifact({
      id: asNumber(raw?.id),
      conflict_id: asNumber(raw?.conflict_id),
      file: raw?.file as IFile,
      side: raw?.side === 'local' || raw?.side === 'upstream' ? raw.side : 'local',
    })
  }
}

export class ConflictReason implements IConflictReason {
  id: number
  conflict_id: number
  code: string
  message: string

  constructor(raw: IConflictReason) {
    this.id = raw.id
    this.conflict_id = raw.conflict_id
    this.code = raw.code
    this.message = raw.message
  }

  static from(raw: any): ConflictReason {
    return new ConflictReason({
      id: asNumber(raw?.id),
      conflict_id: asNumber(raw?.conflict_id),
      code: asString(raw?.code),
      message: asString(raw?.message),
    })
  }
}

export class ConflictArtifact implements IConflictArtifact {
  local: Artifact
  upstream: Artifact

  constructor(raw: IConflictArtifact) {
    this.local = new Artifact(raw.local)
    this.upstream = new Artifact(raw.upstream)
  }

  static from(raw: any): ConflictArtifact {
    return new ConflictArtifact({ local: Artifact.from(raw?.local), upstream: Artifact.from(raw?.upstream) } as any)
  }
}

export class Conflict implements IConflict {
  id: number
  event_id: number
  file_id: number
  resolved_at: string | null
  created_at: string
  artifacts: ConflictArtifact
  reasons: ConflictReason[]
  type: ConflictType
  resolution: ConflictResolution
  failed_to_decrypted_upstream: boolean

  constructor(raw: IConflict) {
    this.id = raw.id
    this.event_id = raw.event_id
    this.file_id = raw.file_id
    this.resolved_at = raw.resolved_at
    this.created_at = raw.created_at
    this.artifacts = new ConflictArtifact(raw.artifacts)
    this.reasons = (raw.reasons ?? []).map(r => new ConflictReason(r))
    this.type = raw.type
    this.resolution = raw.resolution
    this.failed_to_decrypted_upstream = raw.failed_to_decrypted_upstream
  }

  static from(raw: any): Conflict {
    const type: ConflictType =
      raw?.type === 'mismatch' || raw?.type === 'encryption' || raw?.type === 'both' ? raw.type : 'mismatch'

    const resolution: ConflictResolution =
      (
        raw?.resolution === 'unresolved'
        || raw?.resolution === 'kept_local'
        || raw?.resolution === 'kept_remote'
        || raw?.resolution === 'kept_both'
        || raw?.resolution === 'overwritten'
        || raw?.resolution === 'fixed_remote_encryption'
      ) ?
        raw.resolution
      : 'unresolved'

    return new Conflict({
      id: asNumber(raw?.id),
      event_id: asNumber(raw?.event_id),
      file_id: asNumber(raw?.file_id),
      resolved_at: asStringOrNull(raw?.resolved_at),
      created_at: asString(raw?.created_at),
      artifacts: ConflictArtifact.from(raw?.artifacts) as any,
      reasons: asArray(raw?.reasons, ConflictReason.from),
      type,
      resolution,
      failed_to_decrypted_upstream: asBoolean(raw?.failed_to_decrypted_upstream),
    } as any)
  }
}

export class Throughput implements IThroughput {
  id: number
  run_uuid: string
  metric_type: ThroughputMetricType
  num_ops: number
  failed_ops: number
  size_bytes: number
  duration_ms: number

  constructor(raw: IThroughput) {
    this.id = raw.id
    this.run_uuid = raw.run_uuid
    this.metric_type = raw.metric_type
    this.num_ops = raw.num_ops
    this.failed_ops = raw.failed_ops
    this.size_bytes = raw.size_bytes
    this.duration_ms = raw.duration_ms
  }

  static from(raw: any): Throughput {
    const metric_type: ThroughputMetricType =
      (
        raw?.metric_type === 'upload'
        || raw?.metric_type === 'download'
        || raw?.metric_type === 'rename'
        || raw?.metric_type === 'delete'
        || raw?.metric_type === 'copy'
      ) ?
        raw.metric_type
      : 'download'

    return new Throughput({
      id: asNumber(raw?.id),
      run_uuid: asString(raw?.run_uuid),
      metric_type,
      num_ops: asNumber(raw?.num_ops),
      failed_ops: asNumber(raw?.failed_ops),
      size_bytes: asNumber(raw?.size_bytes),
      duration_ms: asNumber(raw?.duration_ms),
    })
  }
}

export class SyncEvent implements IEvent {
  id: number
  vault_id: number
  run_uuid: string

  timestamp_begin: string
  timestamp_end: string | null
  heartbeat_at: string | null

  status: EventStatus
  trigger: EventTrigger
  retry_attempt: number

  stall_reason: string | null
  error_message: string | null
  error_code: string | null

  throughputs: Throughput[]
  conflicts: Conflict[]

  num_ops_total: number
  num_failed_ops: number
  num_conflicts: number
  bytes_up: number
  bytes_down: number

  divergence_detected: boolean
  local_state_hash: string | null
  remote_state_hash: string | null
  config_hash: string | null

  constructor(raw: IEvent) {
    this.id = raw.id
    this.vault_id = raw.vault_id
    this.run_uuid = raw.run_uuid

    this.timestamp_begin = raw.timestamp_begin
    this.timestamp_end = raw.timestamp_end
    this.heartbeat_at = raw.heartbeat_at

    this.status = raw.status
    this.trigger = raw.trigger
    this.retry_attempt = raw.retry_attempt

    this.stall_reason = raw.stall_reason
    this.error_message = raw.error_message
    this.error_code = raw.error_code

    this.throughputs = (raw.throughputs ?? []).map(t => new Throughput(t))
    this.conflicts = (raw.conflicts ?? []).map(c => new Conflict(c))

    this.num_ops_total = raw.num_ops_total
    this.num_failed_ops = raw.num_failed_ops
    this.num_conflicts = raw.num_conflicts
    this.bytes_up = raw.bytes_up
    this.bytes_down = raw.bytes_down

    this.divergence_detected = raw.divergence_detected
    this.local_state_hash = raw.local_state_hash
    this.remote_state_hash = raw.remote_state_hash
    this.config_hash = raw.config_hash
  }

  static from(raw: any): SyncEvent {
    const status: EventStatus =
      (
        raw?.status === 'pending'
        || raw?.status === 'running'
        || raw?.status === 'success'
        || raw?.status === 'stalled'
        || raw?.status === 'error'
        || raw?.status === 'canceled'
      ) ?
        raw.status
      : 'pending'

    const trigger: EventTrigger =
      (
        raw?.trigger === 'schedule'
        || raw?.trigger === 'manual'
        || raw?.trigger === 'startup'
        || raw?.trigger === 'webhook'
        || raw?.trigger === 'retry'
      ) ?
        raw.trigger
      : 'manual'

    return new SyncEvent({
      id: asNumber(raw?.id),
      vault_id: asNumber(raw?.vault_id),
      run_uuid: asString(raw?.run_uuid),

      timestamp_begin: asString(raw?.timestamp_begin),
      timestamp_end: asStringOrNull(raw?.timestamp_end),
      heartbeat_at: asStringOrNull(raw?.heartbeat_at),

      status,
      trigger,
      retry_attempt: asNumber(raw?.retry_attempt),

      stall_reason: asStringOrNull(raw?.stall_reason),
      error_message: asStringOrNull(raw?.error_message),
      error_code: asStringOrNull(raw?.error_code),

      throughputs: asArray(raw?.throughputs, Throughput.from),
      conflicts: asArray(raw?.conflicts, Conflict.from),

      num_ops_total: asNumber(raw?.num_ops_total),
      num_failed_ops: asNumber(raw?.num_failed_ops),
      num_conflicts: asNumber(raw?.num_conflicts),
      bytes_up: asNumber(raw?.bytes_up),
      bytes_down: asNumber(raw?.bytes_down),

      divergence_detected: asBoolean(raw?.divergence_detected),
      local_state_hash: asStringOrNull(raw?.local_state_hash),
      remote_state_hash: asStringOrNull(raw?.remote_state_hash),
      config_hash: asStringOrNull(raw?.config_hash),
    } as any)
  }
}
