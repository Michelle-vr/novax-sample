import type React from 'react'
import { motion } from 'framer-motion'

interface NovaXLogoProps {
  size?: number
  animate?: boolean
}

const NovaXLogo: React.FC<NovaXLogoProps> = ({ size = 120, animate = true }) => {
  // Using the NovaX logo image directly
  // The logo should be placed in /public/novax-logo.png
  const logoUrl = 'https://imgur.com/a/CpU6ujC' // You'll replace this with your actual logo URL

  return (
    <motion.div
      className="relative"
      style={{ width: size, height: size }}
      initial={animate ? { opacity: 0, scale: 0.8 } : undefined}
      animate={animate ? { opacity: 1, scale: 1 } : undefined}
      whileHover={animate ? { scale: 1.05 } : undefined}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Direct logo image with glow effect */}
      <img
        src="/novax-logo.svg"
        alt="NovaX Logo"
        className="w-full h-full object-contain"
        style={{
          filter: 'drop-shadow(0 0 20px rgba(212, 175, 55, 0.5))'
        }}
      />
    </motion.div>
  )
}

export default NovaXLogo
