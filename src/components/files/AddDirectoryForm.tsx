'use client'

import { useFSStore } from '@/stores/fsStore'
import { useRouter } from 'next/navigation'

const AddDirectoryForm = () => {
  const router = useRouter()
  const { currVault, currVolume, path, mkdir } = useFSStore()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const dirName = formData.get('dirName') as string

    if (!dirName) {
      alert('Directory name cannot be empty')
      return
    }

    if (!currVault || !currVolume) {
      alert('Please select a vault and volume first')
      return
    }

    try {
      await mkdir({ vault_id: currVault?.id, volume_id: currVolume?.id, path: `${path}/${dirName}` })
      e.currentTarget.reset()
    } catch (error) {
      console.error('Failed to create directory:', error)
      alert('Failed to create directory. Please try again.')
    }
  }
}

export default AddDirectoryForm
