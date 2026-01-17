import { useEffect, useRef } from 'react'
import { WebSocketService } from '../services/websocket'
import { useGameStore } from '../store/gameStore'
import type {
  GameStartedData,
  AgentMovedData,
  AgentSpawnedData,
  EncounterStartedData,
  BattleTurnData,
  BattleDamageData,
  BattleEndedData,
  AgentEliminatedData,
  GameFinishedData,
} from '../store/types'

export const useWebSocket = (sessionId: string | null) => {
  const wsRef = useRef<WebSocketService | null>(null)
  const {
    setConnected,
    setAgents,
    updateAgent,
    addEncounter,
    startBattle,
    updateBattle,
    endBattle,
    setWinner,
    setRankings,
    setError,
  } = useGameStore()

  useEffect(() => {
    if (!sessionId) return

    const wsUrl = `ws://localhost:8000/ws/game/${sessionId}`
    const ws = new WebSocketService(wsUrl)
    wsRef.current = ws

    // Connect to WebSocket
    ws.connect()
      .then(() => {
        setConnected(true)
      })
      .catch((error) => {
        console.error('Failed to connect to WebSocket:', error)
        setError('Failed to connect to server')
        setConnected(false)
      })

    // Register event handlers
    ws.on('game:started', (data) => {
      const gameData = data as GameStartedData
      setAgents(gameData.agents)
      console.log('Game started with agents:', gameData.agents)
    })

    ws.on('agent:moved', (data) => {
      const moveData = data as AgentMovedData
      updateAgent(moveData.agentId, { position: moveData.to })
    })

    ws.on('agent:spawned', (data) => {
      const spawnData = data as AgentSpawnedData
      setAgents(useGameStore.getState().agents.concat(spawnData.agent))
    })

    ws.on('encounter:started', (data) => {
      const encounterData = data as EncounterStartedData
      addEncounter(encounterData.encounter)

      // Update agents to battling status
      updateAgent(encounterData.agent1.id, { status: 'battling' })
      updateAgent(encounterData.agent2.id, { status: 'battling' })

      // Start battle
      startBattle({
        id: encounterData.encounter.id,
        agent1: encounterData.agent1,
        agent2: encounterData.agent2,
        turns: [],
        currentTurn: 0,
        status: 'in_progress',
      })
    })

    ws.on('battle:turn', (data) => {
      const turnData = data as BattleTurnData
      const currentBattle = useGameStore.getState().currentBattle

      if (currentBattle && currentBattle.id === turnData.battleId) {
        updateBattle({
          turns: [...currentBattle.turns, turnData.turn],
          currentTurn: turnData.turn.turnNumber,
        })
      }
    })

    ws.on('battle:damage', (data) => {
      const damageData = data as BattleDamageData
      updateAgent(damageData.agentId, { hp: damageData.newHp })
    })

    ws.on('battle:ended', (data) => {
      const endData = data as BattleEndedData

      // Update agent statuses
      updateAgent(endData.winner.id, { status: 'active', globalHp: endData.winner.globalHp })
      updateAgent(endData.loser.id, {
        status: endData.loser.globalHp <= 0 ? 'eliminated' : 'active',
        globalHp: endData.loser.globalHp,
      })

      endBattle(endData.winner, endData.loser)
    })

    ws.on('agent:eliminated', (data) => {
      const elimData = data as AgentEliminatedData
      updateAgent(elimData.agentId, { status: 'eliminated', hp: 0, globalHp: 0 })
    })

    ws.on('game:finished', (data) => {
      const finishData = data as GameFinishedData
      setWinner(finishData.winner)
      setRankings(finishData.rankings)
    })

    ws.on('error', (data) => {
      const errorData = data as { message: string }
      setError(errorData.message)
    })

    // Cleanup on unmount
    return () => {
      ws.disconnect()
      setConnected(false)
    }
  }, [sessionId, setConnected, setAgents, updateAgent, addEncounter, startBattle, updateBattle, endBattle, setWinner, setRankings, setError])

  const sendMessage = <T,>(type: string, data: T) => {
    if (wsRef.current) {
      wsRef.current.send(type, data)
    }
  }

  const isConnected = () => {
    return wsRef.current?.isConnected() ?? false
  }

  return { sendMessage, isConnected }
}
