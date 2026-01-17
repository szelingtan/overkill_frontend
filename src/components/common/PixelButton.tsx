import { motion } from 'framer-motion'
import { type ButtonHTMLAttributes } from 'react'
import clsx from 'clsx'

interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

export const PixelButton = ({
  children,
  variant = 'primary',
  size = 'md',
  className,
  disabled,
  ...props
}: PixelButtonProps) => {
  const variants = {
    primary: 'bg-pixel-blue border-pixel-light-blue hover:bg-pixel-light-blue',
    secondary: 'bg-pixel-gray border-pixel-white hover:bg-pixel-white hover:text-pixel-dark',
    danger: 'bg-pixel-red border-pixel-yellow hover:bg-pixel-yellow hover:text-pixel-dark',
  }

  const sizes = {
    sm: 'px-4 py-2 text-xs-pixel',
    md: 'px-6 py-3 text-sm-pixel',
    lg: 'px-8 py-4 text-md-pixel',
  }

  return (
    <motion.button
      className={clsx(
        'pixel-btn',
        variants[variant],
        sizes[size],
        disabled && 'opacity-50 cursor-not-allowed',
        className
      )}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      disabled={disabled}
      {...props}
    >
      {children}
    </motion.button>
  )
}
