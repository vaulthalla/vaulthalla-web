import UsersGear from '@/fa-duotone/users-gear.svg'
import UserShield from '@/fa-duotone/user-shield.svg'
import UserSlash from '@/fa-regular/user-slash.svg'
import KeyReset from '@/fa-light/key.svg'
import UserGroup from '@/fa-regular/user-group.svg'
import Sliders from '@/fa-light/sliders.svg'
import FileClipboardList from '@/fa-regular/clipboard-list.svg'
import KeyIcon from '@/fa-regular/key.svg'

import Database from '@/fa-duotone/database.svg'
import Cloud from '@/fa-regular/cloud.svg'
import TrashAlt from '@/fa-regular/trash.svg'
import Wrench from '@/fa-light/wrench.svg'
import Migrate from '@/fa-regular/cloud-bolt.svg'
import HardDrive from '@/fa-regular/hard-drive.svg'
import CompressAlt from '@/fa-regular/compress.svg'
import ArrowsAltH from '@/fa-regular/arrows-left-right.svg'
import ObjectGroup from '@/fa-regular/object-group.svg'

import CloudUpload from '@/fa-regular/cloud-arrow-up.svg'
import CloudDownload from '@/fa-regular/cloud-arrow-down.svg'
import TrashCan from '@/fa-regular/trash-can.svg'
import ShareSquare from '@/fa-regular/share-from-square.svg'
import Share from '@/fa-regular/share.svg'
import Lock from '@/fa-regular/lock.svg'
import Edit from '@/fa-regular/pen-to-square.svg'
import ArrowRightArrowLeft from '@/fa-regular/arrow-right-arrow-left.svg'

import FolderPlus from '@/fa-regular/folder-plus.svg'
import FolderMinus from '@/fa-regular/folder-minus.svg'
import FolderArrowRight from '@/fa-regular/truck-arrow-right.svg'
import ListUl from '@/fa-regular/list-ul.svg'

export const permissionCategoryMap: Record<string, 'Admin' | 'Vault' | 'File' | 'Directory'> = {
  // Admin
  create_user: 'Admin',
  create_admin_user: 'Admin',
  deactivate_user: 'Admin',
  reset_user_password: 'Admin',
  manage_roles: 'Admin',
  manage_settings: 'Admin',
  view_audit_log: 'Admin',
  manage_api_keys: 'Admin',

  // Vault
  create_local_vault: 'Vault',
  create_cloud_vault: 'Vault',
  delete_vault: 'Vault',
  adjust_vault_settings: 'Vault',
  migrate_vault_data: 'Vault',
  create_volume: 'Vault',
  delete_volume: 'Vault',
  resize_volume: 'Vault',
  move_volume: 'Vault',
  assign_volume_to_group: 'Vault',

  // File
  upload_file: 'File',
  download_file: 'File',
  delete_file: 'File',
  share_file_publicly: 'File',
  share_file_with_group: 'File',
  lock_file: 'File',
  rename_file: 'File',
  move_file: 'File',

  // Directory
  create_directory: 'Directory',
  delete_directory: 'Directory',
  rename_directory: 'Directory',
  move_directory: 'Directory',
  list_directory: 'Directory',
}

export const permissionIconMap: Record<string, React.FC<React.SVGProps<SVGSVGElement>>> = {
  // Admin perms
  create_user: UsersGear,
  create_admin_user: UserShield,
  deactivate_user: UserSlash,
  reset_user_password: KeyReset,
  manage_roles: UserGroup,
  manage_settings: Sliders,
  view_audit_log: FileClipboardList,
  manage_api_keys: KeyIcon,

  // Vault perms
  create_local_vault: Database,
  create_cloud_vault: Cloud,
  delete_vault: TrashAlt,
  adjust_vault_settings: Wrench,
  migrate_vault_data: Migrate,
  create_volume: HardDrive,
  delete_volume: TrashCan,
  resize_volume: CompressAlt,
  move_volume: ArrowsAltH,
  assign_volume_to_group: ObjectGroup,

  // File perms
  upload_file: CloudUpload,
  download_file: CloudDownload,
  delete_file: TrashCan,
  share_file_publicly: ShareSquare,
  share_file_with_group: Share,
  lock_file: Lock,
  rename_file: Edit,
  move_file: ArrowRightArrowLeft,

  // Directory perms
  create_directory: FolderPlus,
  delete_directory: FolderMinus,
  rename_directory: Edit,
  move_directory: FolderArrowRight,
  list_directory: ListUl,
}
