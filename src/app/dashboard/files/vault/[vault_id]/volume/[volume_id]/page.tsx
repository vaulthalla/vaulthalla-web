import VolumeClientPage from './page.client'

const VolumePage = async ({ params }: { params: Promise<{ vault_id: number; volume_id: number }> }) => {
  const props = await params

  props.vault_id = Number(props.vault_id)
  props.volume_id = Number(props.volume_id)

  return (
    <div>
      <h1>File Manager</h1>
      <VolumeClientPage {...props} />
    </div>
  )
}

export default VolumePage
