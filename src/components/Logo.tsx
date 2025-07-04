import NextImage from 'next/image'
import VaulthallaLogo from '@/public/vaulthalla-logo.png'

const Logo = () => {
  return (
    <NextImage
      src={VaulthallaLogo}
      alt="Vaulthalla Logo"
      width={100}
      height={100}
      priority
      className="mx-auto mb-4 h-auto w-auto"
    />
  )
}

export default Logo
