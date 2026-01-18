import clsx from 'clsx'

export interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
  className?: string
}

export const LoadingSpinner = ({ size = 'md', text, className }: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div className={clsx('flex flex-col items-center gap-4', className)}>
      <div className={clsx('pixel-spinner', sizes[size])} />
      {text && (
        <p className="text-sm-pixel text-pixel-white animate-blink">{text}</p>
      )}
    </div>
  )
}
