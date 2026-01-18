import { motion, MotionProps } from 'framer-motion'
import { getJudgeSprite } from '../../util/sprites'

interface JudgeAvatarProps {
  personality: string
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl'
  className?: string
  animate?: MotionProps['animate']
  transition?: MotionProps['transition']
}

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
  '2xl': 'w-24 h-24',
  '3xl': 'w-32 h-32',
  '4xl': 'w-40 h-40',
}

export function JudgeAvatar({
  personality,
  size = 'md',
  className = '',
  animate,
  transition,
}: JudgeAvatarProps) {
  const spriteSrc = getJudgeSprite(personality)
  const sizeClass = sizeClasses[size]

  return (
    <motion.img
      src={spriteSrc}
      alt={`${personality} judge`}
      className={`${sizeClass} object-contain ${className}`}
      animate={animate}
      transition={transition}
    />
  )
}
