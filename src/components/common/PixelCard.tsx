import { motion } from 'framer-motion'
import { type HTMLAttributes, type ReactNode } from 'react'
import clsx from 'clsx'

interface PixelCardProps extends HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  animate?: boolean
}

export const PixelCard = ({
  children,
  className,
  animate = false,
  ...props
}: PixelCardProps) => {
  const Component = animate ? motion.div : 'div'

  return (
    <Component
      className={clsx('pixel-card', className)}
      {...(animate && {
        initial: { opacity: 0, y: 20 },
        animate: { opacity: 1, y: 0 },
        exit: { opacity: 0, y: -20 },
      })}
      {...props}
    >
      {children}
    </Component>
  )
}
