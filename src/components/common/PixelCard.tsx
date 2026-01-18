import { motion } from 'framer-motion'
import { type ReactNode } from 'react'
import clsx from 'clsx'

interface PixelCardProps {
  children: ReactNode
  className?: string
  animate?: boolean
}

export const PixelCard = ({
  children,
  className,
  animate = false,
}: PixelCardProps) => {
  if (animate) {
    return (
      <motion.div
        className={clsx('pixel-card', className)}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
      >
        {children}
      </motion.div>
    )
  }

  return (
    <div className={clsx('pixel-card', className)}>
      {children}
    </div>
  )
}
