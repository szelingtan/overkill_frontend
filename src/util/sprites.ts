const GLADIATOR_SPRITES = [
  '/sprites/gladiator_gold.png',
  '/sprites/gladiator_green_v2.png',
  '/sprites/gladiator_pink.png',
  '/sprites/gladiator_white.png',
]

const JUDGE_SPRITES: Record<string, string> = {
  funny: '/sprites/judge_happy_gavel.png',
  sarcastic: '/sprites/judge_sarcastic_gray.png',
  nerd: '/sprites/judge_nerdy_glasses.png',
  serious: '/sprites/judge_serious_girl_v2.png',
  custom: '/sprites/judge_happy_gavel.png', // Default to happy for custom
}

export function getGladiatorSprite(agentIndex: number): string {
  return GLADIATOR_SPRITES[agentIndex % GLADIATOR_SPRITES.length]
}

export function getGladiatorSpriteByAgentId(agentId: string, allAgentIds: string[]): string {
  const index = allAgentIds.indexOf(agentId)
  return index >= 0 ? getGladiatorSprite(index) : GLADIATOR_SPRITES[0]
}

export function getJudgeSprite(personality: string): string {
  return JUDGE_SPRITES[personality.toLowerCase()] || JUDGE_SPRITES.custom
}
