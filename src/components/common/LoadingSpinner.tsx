import clsx from 'clsx'

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  text?: string
}

export const LoadingSpinner = ({ size = 'md', text }: LoadingSpinnerProps) => {
  const sizes = {
    sm: 'w-6 h-6 border-2',
    md: 'w-8 h-8 border-4',
    lg: 'w-12 h-12 border-4',
  }

  return (
    <div className="flex flex-col items-center gap-4">
      <div className={clsx('pixel-spinner', sizes[size])} />
      {text && (
        <p className="text-sm-pixel text-pixel-white animate-blink">{text}</p>
      )}
    </div>
  )
}
