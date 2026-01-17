import { motion, AnimatePresence } from 'framer-motion'
import { PixelButton, PixelCard } from '../common'
import type { Choice } from '../../store/types'

interface ChoiceInputProps {
  choices: Choice[]
  onAdd: (choice: Choice) => void
  onRemove: (id: string) => void
  onUpdate: (id: string, data: Partial<Choice>) => void
}

export const ChoiceInput = ({
  choices,
  onAdd,
  onRemove,
  onUpdate,
}: ChoiceInputProps) => {
  const handleAddChoice = () => {
    const newChoice: Choice = {
      id: `choice-${Date.now()}`,
      description: '',
    }
    onAdd(newChoice)
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-md-pixel text-pixel-yellow">
          Your Choices ({choices.length})
        </h3>
        <PixelButton onClick={handleAddChoice} size="sm" variant="secondary">
          + Add Choice
        </PixelButton>
      </div>

      <AnimatePresence>
        {choices.map((choice, index) => (
          <motion.div
            key={choice.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
          >
            <PixelCard>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-sm-pixel text-pixel-white">
                    Choice #{index + 1}
                  </label>
                  <button
                    onClick={() => onRemove(choice.id)}
                    className="text-pixel-red hover:text-pixel-yellow text-sm-pixel"
                  >
                    [X]
                  </button>
                </div>

                <input
                  type="text"
                  value={choice.name || ''}
                  onChange={(e) => onUpdate(choice.id, { name: e.target.value })}
                  placeholder="Name (optional)"
                  className="w-full bg-pixel-darker text-pixel-white border-2 border-pixel-blue p-2 text-sm-pixel font-pixel focus:border-pixel-light-blue outline-none"
                />

                <textarea
                  value={choice.description}
                  onChange={(e) =>
                    onUpdate(choice.id, { description: e.target.value })
                  }
                  placeholder="Describe this choice..."
                  rows={3}
                  className="w-full bg-pixel-darker text-pixel-white border-2 border-pixel-blue p-2 text-sm-pixel font-pixel resize-none focus:border-pixel-light-blue outline-none"
                />
              </div>
            </PixelCard>
          </motion.div>
        ))}
      </AnimatePresence>

      {choices.length === 0 && (
        <PixelCard>
          <p className="text-sm-pixel text-pixel-gray text-center py-4">
            No choices yet. Add at least 2 to start!
          </p>
        </PixelCard>
      )}
    </div>
  )
}
