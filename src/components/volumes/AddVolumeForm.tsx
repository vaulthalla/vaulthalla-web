'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { motion } from 'framer-motion'
import { useState } from 'react'
import { useVolumeStore } from '@/stores/volumeStore'
import { useAuthStore } from '@/stores/authStore'

const volumeSchema = z.object({
  name: z.string().min(1, 'Name is required').max(150),
  path_prefix: z.string().default('/').optional(),
  quota_bytes: z.union([z.number().nonnegative(), z.null()]).optional(),
})

type VolumeFormData = z.infer<typeof volumeSchema>

export default function AddVolumeForm({ slug }: { slug: string }) {
  const [submitted, setSubmitted] = useState(false)
  const [sliderVal, setSliderVal] = useState(10) // range from 0–100
  const scaleToGB = (val: number) => Math.round(2 ** (val / 10)) // 1 to ~1024 GB

  const vault_id = Number(slug)
  if (Number.isNaN(vault_id)) throw new Error('Invalid vault ID')

  const user_id = useAuthStore.getState().user?.id

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<VolumeFormData>({
    resolver: zodResolver(volumeSchema),
    defaultValues: { name: '', path_prefix: '/', quota_bytes: 1_073_741_824 }, // default 1GB in bytes
  })

  const onSubmit = (data: VolumeFormData) => {
    if (!user_id) {
      console.error('User ID is not available')
      return
    }

    const finalData = { ...data, vault_id, user_id }
    useVolumeStore.getState().addVolume(finalData)
    console.log('[Volume Submitted]', finalData)
    setSubmitted(true)
    setTimeout(() => {
      reset()
      setSubmitted(false)
    }, 2000)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-md rounded-lg border border-gray-700 bg-gray-800 p-6 shadow-lg">
      <h2 className="mb-4 text-xl font-bold text-white">Add New Volume</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-white">Name</label>
          <input
            {...register('name')}
            className="mt-1 w-full rounded-md bg-gray-900 p-2 text-white outline-none focus:ring focus:ring-blue-500"
            placeholder="e.g. Backup Volume"
          />
          {errors.name && <p className="text-sm text-red-400">{errors.name.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Path Prefix</label>
          <input
            {...register('path_prefix')}
            className="mt-1 w-full rounded-md bg-gray-900 p-2 text-white outline-none focus:ring focus:ring-blue-500"
            placeholder="/media/backup"
          />
          {errors.path_prefix && <p className="text-sm text-red-400">{errors.path_prefix.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-white">Quota</label>
          <div className="flex items-center space-x-4">
            <input
              type="range"
              min={0}
              max={100}
              step={1}
              value={sliderVal}
              onChange={e => {
                const raw = Number(e.target.value)
                setSliderVal(raw)
                const gb = scaleToGB(raw)
                setValue('quota_bytes', gb === 0 ? null : gb * 1_073_741_824)
              }}
              className="flex-1 accent-blue-500"
            />
            <span className="w-24 text-right text-white">{scaleToGB(sliderVal)} GB</span>
          </div>
          {errors.quota_bytes && <p className="text-sm text-red-400">{errors.quota_bytes.message}</p>}
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.95 }}
          className="w-full rounded-md bg-blue-600 px-4 py-2 font-bold text-white hover:bg-blue-700">
          {submitted ? 'Saved 🎉' : 'Add Volume'}
        </motion.button>
      </form>
    </motion.div>
  )
}
