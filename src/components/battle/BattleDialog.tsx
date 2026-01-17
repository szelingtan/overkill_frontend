import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

interface BattleDialogProps {
  text: string
  speaker?: string
  onComplete?: () => void
  speed?: number
}

export const BattleDialog = ({
  text,
  speaker,
  onComplete,
  speed = 30,
}: BattleDialogProps) => {
  const [displayedText, setDisplayedText] = useState('')
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    setDisplayedText('')
    setIsComplete(false)
    let currentIndex = 0

    const interval = setInterval(() => {
      if (currentIndex < text.length) {
        setDisplayedText(text.slice(0, currentIndex + 1))
        currentIndex++
      } else {
        setIsComplete(true)
        clearInterval(interval)
        onComplete?.()
      }
    }, speed)

    return () => clearInterval(interval)
  }, [text, speed, onComplete])

  return (
    <motion.div
      className="dialog-box"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {speaker && (
        <div className="text-sm-pixel text-pixel-blue font-bold mb-2">
          {speaker}
        </div>
      )}
      <div className="text-sm-pixel text-pixel-dark leading-relaxed whitespace-pre-wrap">
        {displayedText}
        {!isComplete && (
          <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 0.5, repeat: Infinity }}
          >
            ▼
          </motion.span>
        )}
      </div>
    </motion.div>
  )
}
