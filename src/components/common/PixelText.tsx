import { type HTMLAttributes } from 'react'
import clsx from 'clsx'

interface PixelTextProps extends HTMLAttributes<HTMLDivElement> {
  variant?: 'h1' | 'h2' | 'h3' | 'body' | 'small'
  shadow?: boolean
  blink?: boolean
}

export const PixelText = ({
  children,
  variant = 'body',
  shadow = false,
  blink = false,
  className,
  ...props
}: PixelTextProps) => {
  const variants = {
    h1: 'text-xl-pixel',
    h2: 'text-lg-pixel',
    h3: 'text-md-pixel',
    body: 'text-sm-pixel',
    small: 'text-xs-pixel',
  }

  return (
    <div
      className={clsx(
        'font-pixel',
        variants[variant],
        shadow && 'text-pixel-shadow',
        blink && 'animate-blink',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}
