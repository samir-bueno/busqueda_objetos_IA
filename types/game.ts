export interface GameObject {
  id: number
  name: string
  found: boolean
  points: number
}

export interface GameScore {
  id: number
  playerName: string
  score: number
  objectsFound: number
  timeUsed: string
  completed: boolean
  date: string
}

export interface GameState {
  objects: GameObject[]
  score: number
  timeLeft: number
  isStarted: boolean
  isEnded: boolean
}