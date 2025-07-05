import UsersGear from '@/fa-duotone/users-gear.svg'
import UserShield from '@/fa-duotone/user-shield.svg'
import UserGroup from '@/fa-regular/user-group.svg'
import Sliders from '@/fa-light/sliders.svg'
import FileClipboardList from '@/fa-regular/clipboard-list.svg'
import KeyIcon from '@/fa-regular/key.svg'
import Cloud from '@/fa-regular/cloud.svg'
import Wrench from '@/fa-light/wrench.svg'
import Migrate from '@/fa-regular/cloud-bolt.svg'
import CompressAlt from '@/fa-regular/compress.svg'
import ObjectGroup from '@/fa-regular/object-group.svg'
import CloudUpload from '@/fa-regular/cloud-arrow-up.svg'
import CloudDownload from '@/fa-regular/cloud-arrow-down.svg'
import TrashCan from '@/fa-regular/trash-can.svg'
import ShareSquare from '@/fa-regular/share-from-square.svg'
import Lock from '@/fa-regular/lock.svg'
import Edit from '@/fa-regular/pen-to-square.svg'
import ArrowRightArrowLeft from '@/fa-regular/arrow-right-arrow-left.svg'
import ListUl from '@/fa-regular/list-ul.svg'

export const permissionIconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  // Admin perms (user category)
  manage_admins: UserShield,
  manage_users: UsersGear,
  manage_roles: UserGroup,
  manage_settings: Sliders,
  manage_vaults: Wrench,
  audit_log_access: FileClipboardList,
  full_api_key_access: KeyIcon,

  // Vault perms (vault category)
  migrate_data: Migrate,
  manage_access: UserShield,
  manage_tags: ObjectGroup,
  manage_metadata: Edit,
  manage_versions: CompressAlt,
  manage_file_locks: Lock,
  share: ShareSquare,
  sync: Cloud,
  create: CloudUpload,
  download: CloudDownload,
  delete: TrashCan,
  rename: Edit,
  move: ArrowRightArrowLeft,
  list: ListUl,
}
