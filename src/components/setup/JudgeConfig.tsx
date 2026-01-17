import { motion } from 'framer-motion'
import { PixelCard } from '../common'
import type { Judge, JudgePersonality } from '../../store/types'

interface JudgeConfigProps {
  judges: Judge[]
  onAdd: (judge: Judge) => void
  onRemove: (id: string) => void
}

const JUDGE_TEMPLATES: Array<{
  personality: JudgePersonality
  name: string
  description: string
}> = [
  {
    personality: 'funny',
    name: 'The Comedian',
    description: 'Judges with humor and wit',
  },
  {
    personality: 'sarcastic',
    name: 'The Roaster',
    description: 'Sharp and sarcastic commentary',
  },
  {
    personality: 'nerd',
    name: 'The Professor',
    description: 'Analytical and detail-oriented',
  },
  {
    personality: 'serious',
    name: 'The Judge',
    description: 'No-nonsense and fair',
  },
]

export const JudgeConfig = ({ judges, onAdd, onRemove }: JudgeConfigProps) => {
  const handleSelectJudge = (personality: JudgePersonality, name: string) => {
    // Check if this personality already exists
    const exists = judges.some((j) => j.personality === personality)
    if (exists) {
      // Remove it
      const judge = judges.find((j) => j.personality === personality)
      if (judge) onRemove(judge.id)
    } else {
      // Add it
      const newJudge: Judge = {
        id: `judge-${Date.now()}`,
        name,
        personality,
      }
      onAdd(newJudge)
    }
  }

  const isSelected = (personality: JudgePersonality) => {
    return judges.some((j) => j.personality === personality)
  }

  return (
    <div className="space-y-4">
      <h3 className="text-md-pixel text-pixel-yellow">
        Select Judges ({judges.length})
      </h3>

      <div className="grid grid-cols-2 gap-3">
        {JUDGE_TEMPLATES.map((template, index) => {
          const selected = isSelected(template.personality)

          return (
            <motion.button
              key={template.personality}
              onClick={() =>
                handleSelectJudge(template.personality, template.name)
              }
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <PixelCard
                className={`text-left cursor-pointer transition-all ${
                  selected
                    ? 'border-pixel-yellow bg-pixel-blue/30'
                    : 'hover:border-pixel-light-blue'
                }`}
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm-pixel text-pixel-white">
                      {template.name}
                    </h4>
                    {selected && (
                      <span className="text-pixel-yellow text-sm-pixel">✓</span>
                    )}
                  </div>
                  <p className="text-xs-pixel text-pixel-gray">
                    {template.description}
                  </p>
                </div>
              </PixelCard>
            </motion.button>
          )
        })}
      </div>

      {judges.length === 0 && (
        <p className="text-xs-pixel text-pixel-gray text-center py-2">
          Select at least 1 judge to moderate the battles!
        </p>
      )}
    </div>
  )
}
