import { useGameStore } from '../../store/gameStore'
import { BattleFocusView } from './BattleFocusView'

// BattleScreen now delegates to BattleFocusView for the new multi-battle system
export const BattleScreen = () => {
  const { focusedBattleId, activeBattles } = useGameStore()

  // If we have a focused battle in the new system, use BattleFocusView
  if (focusedBattleId && activeBattles.length > 0) {
    return <BattleFocusView />
  }

  // Fallback for legacy single battle mode
  return <BattleFocusView />
}
