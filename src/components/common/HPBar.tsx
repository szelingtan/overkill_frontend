import { motion } from 'framer-motion'
import clsx from 'clsx'

interface HPBarProps {
  current: number
  max: number
  label?: string
  showNumbers?: boolean
  size?: 'sm' | 'md' | 'lg'
  animated?: boolean
}

export const HPBar = ({
  current,
  max,
  label = 'HP',
  showNumbers = true,
  size = 'md',
  animated = true,
}: HPBarProps) => {
  const percentage = Math.max(0, Math.min(100, (current / max) * 100))

  const getHealthLevel = () => {
    if (percentage > 60) return 'high'
    if (percentage > 30) return 'medium'
    return 'low'
  }

  const sizes = {
    sm: 'h-3',
    md: 'h-4',
    lg: 'h-6',
  }

  const textSizes = {
    sm: 'text-xs-pixel',
    md: 'text-sm-pixel',
    lg: 'text-md-pixel',
  }

  return (
    <div className="w-full">
      {showNumbers && (
        <div className={clsx('flex justify-between mb-1', textSizes[size])}>
          <span className="text-pixel-white">{label}</span>
          <span className="text-pixel-yellow">
            {Math.max(0, Math.floor(current))}/{max}
          </span>
        </div>
      )}
      <div className={clsx('hp-bar-container', sizes[size])}>
        <motion.div
          className={clsx('hp-bar-fill', getHealthLevel())}
          initial={animated ? { width: '100%' } : { width: `${percentage}%` }}
          animate={{ width: `${percentage}%` }}
          transition={{
            duration: animated ? 0.5 : 0,
            ease: 'easeOut',
          }}
        />
      </div>
    </div>
  )
}
