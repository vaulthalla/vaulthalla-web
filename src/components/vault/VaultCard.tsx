import { Vault } from '@/models/vaults'

const VaultCard = (vault: Vault) => {
  return (
    <div className="mb-4 rounded-lg bg-white p-4 shadow-md">
      <h2 className="text-xl font-semibold">{vault.name}</h2>
      <p className="text-gray-600">Type: {vault.type}</p>
      <p className="text-gray-600">Created At: {new Date(vault.createdAt).toLocaleDateString()}</p>
      <p className={`text-sm ${vault.isActive ? 'text-green-500' : 'text-red-500'}`}>
        Status: {vault.isActive ? 'Active' : 'Inactive'}
      </p>
    </div>
  )
}

export default VaultCard
