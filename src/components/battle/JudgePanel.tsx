import { motion, AnimatePresence } from 'framer-motion'
import { PixelCard, PixelText } from '../common'
import type { JudgeVote } from '../../store/types'

interface JudgePanelProps {
  votes: JudgeVote[]
}

export const JudgePanel = ({ votes }: JudgePanelProps) => {
  return (
    <div className="space-y-4">
      <PixelText variant="h3" className="text-pixel-pink text-center">
        JUDGE REACTIONS
      </PixelText>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <AnimatePresence>
          {votes.map((vote, index) => (
            <motion.div
              key={vote.judgeId}
              initial={{ opacity: 0, scale: 0.8, rotateY: -90 }}
              animate={{ opacity: 1, scale: 1, rotateY: 0 }}
              transition={{
                delay: index * 0.3,
                type: 'spring',
                stiffness: 200,
              }}
            >
              <PixelCard className="border-pixel-pink">
                <div className="space-y-2">
                  {/* Judge Name */}
                  <div className="flex items-center justify-between">
                    <span className="text-sm-pixel text-pixel-pink">
                      {vote.judgeName}
                    </span>
                    <motion.span
                      className="text-lg-pixel"
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 0.5, delay: index * 0.3 }}
                    >
                      ⚖️
                    </motion.span>
                  </div>

                  {/* Reaction */}
                  <div className="text-xs-pixel text-pixel-cream bg-pixel-darker p-2 border border-pixel-light-purple">
                    {vote.reaction}
                  </div>

                  {/* Reasoning */}
                  <div className="text-xs-pixel text-pixel-gray leading-relaxed">
                    {vote.reasoning}
                  </div>

                  {/* Vote */}
                  <motion.div
                    className="text-sm-pixel text-center p-2 border-2 border-pixel-green bg-pixel-green/20 text-pixel-green"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: index * 0.3 + 0.5, type: 'spring' }}
                  >
                    VOTES FOR: {vote.votedForName}
                  </motion.div>
                </div>
              </PixelCard>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </div>
  )
}
