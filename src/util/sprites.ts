const GLADIATOR_SPRITES = [
  '/sprites/gladiator_gold.png',
  '/sprites/gladiator_green_v2.png',
  '/sprites/gladiator_pink.png',
  '/sprites/gladiator_white.png',
]

export function getGladiatorSprite(agentIndex: number): string {
  return GLADIATOR_SPRITES[agentIndex % GLADIATOR_SPRITES.length]
}

export function getGladiatorSpriteByAgentId(agentId: string, allAgentIds: string[]): string {
  const index = allAgentIds.indexOf(agentId)
  return index >= 0 ? getGladiatorSprite(index) : GLADIATOR_SPRITES[0]
}
