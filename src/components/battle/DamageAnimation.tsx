import { motion } from 'framer-motion'

interface DamageAnimationProps {
  damage: number
  onComplete?: () => void
}

export const DamageAnimation = ({
  damage,
  onComplete,
}: DamageAnimationProps) => {
  return (
    <motion.div
      className="damage-number"
      initial={{ opacity: 0, y: 0, scale: 0.5 }}
      animate={{
        opacity: [0, 1, 1, 0],
        y: [0, -30, -60],
        scale: [0.5, 1.5, 1.2, 0.8],
      }}
      transition={{
        duration: 1.5,
        times: [0, 0.2, 0.8, 1],
        ease: 'easeOut',
      }}
      onAnimationComplete={onComplete}
    >
      -{Math.floor(damage)}
    </motion.div>
  )
}
