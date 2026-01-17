import { motion } from 'framer-motion'

// Fixed star positions that won't change
const STARS = Array.from({ length: 100 }, (_, i) => ({
  id: i,
  x: Math.random() * 100,
  y: Math.random() * 100,
  size: Math.random() * 12 + 8,
  delay: Math.random() * 5,
  duration: Math.random() * 3 + 2,
  color: i % 3 === 0 ? '#d4b5ff' : i % 3 === 1 ? '#ffb3d9' : '#7eb3ff',
  rotation: Math.random() * 360,
}))

export const StarField = () => {
  const stars = STARS

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-[5]">
      {stars.map((star) => (
        <motion.div
          key={star.id}
          className="absolute"
          style={{
            left: `${star.x}%`,
            top: `${star.y}%`,
            width: `${star.size}px`,
            height: `${star.size}px`,
            rotate: star.rotation,
          }}
          animate={{
            opacity: [0.4, 1, 0.4],
            scale: [0.8, 1.3, 0.8],
            rotate: [star.rotation, star.rotation + 180, star.rotation],
          }}
          transition={{
            duration: star.duration,
            repeat: Infinity,
            delay: star.delay,
            ease: 'easeInOut',
          }}
        >
          {/* 4-pointed star using CSS */}
          <svg
            width={star.size}
            height={star.size}
            viewBox="0 0 24 24"
            fill={star.color}
            style={{
              filter: `drop-shadow(0 0 ${star.size / 2}px ${star.color})`,
            }}
          >
            <path d="M12 0 L14.4 9.6 L24 12 L14.4 14.4 L12 24 L9.6 14.4 L0 12 L9.6 9.6 Z" />
          </svg>
        </motion.div>
      ))}
    </div>
  )
}
