import { motion, MotionProps } from 'framer-motion'
import { getGladiatorSprite, getGladiatorSpriteByAgentId } from '../../util/sprites'

interface AgentAvatarPropsWithIndex {
  index: number
  agentId?: never
  allAgentIds?: never
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  className?: string
  animate?: MotionProps['animate']
  transition?: MotionProps['transition']
  grayscale?: boolean
}

interface AgentAvatarPropsWithId {
  agentId: string
  allAgentIds: string[]
  index?: never
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl' | '4xl' | '5xl' | '6xl'
  className?: string
  animate?: MotionProps['animate']
  transition?: MotionProps['transition']
  grayscale?: boolean
}

type AgentAvatarProps = AgentAvatarPropsWithIndex | AgentAvatarPropsWithId

const sizeClasses = {
  sm: 'w-8 h-8',
  md: 'w-12 h-12',
  lg: 'w-16 h-16',
  xl: 'w-20 h-20',
  '2xl': 'w-24 h-24',
  '3xl': 'w-32 h-32',
  '4xl': 'w-40 h-40',
  '5xl': 'w-48 h-48',
  '6xl': 'w-56 h-56',
}

export function AgentAvatar({
  size = 'md',
  className = '',
  animate,
  transition,
  grayscale = false,
  ...props
}: AgentAvatarProps) {
  const spriteSrc = 'index' in props && props.index !== undefined
    ? getGladiatorSprite(props.index)
    : 'agentId' in props
    ? getGladiatorSpriteByAgentId(props.agentId, props.allAgentIds)
    : ''

  const sizeClass = sizeClasses[size]
  const filterClass = grayscale ? 'grayscale' : ''

  return (
    <motion.img
      src={spriteSrc}
      alt="Gladiator"
      className={`${sizeClass} ${filterClass} object-contain ${className}`}
      animate={animate}
      transition={transition}
    />
  )
}
