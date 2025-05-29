import type { GameObject } from "@/types/game"
import { AVAILABLE_OBJECTS, OBJECTS_PER_GAME } from "@/constants/objects"

export const generateObjectList = (): GameObject[] => {
  const shuffled = [...AVAILABLE_OBJECTS].sort(() => 0.5 - Math.random())
  return shuffled.slice(0, OBJECTS_PER_GAME).map((name, index) => ({
    id: index + 1,
    name,
    found: false,
    points: Math.floor(Math.random() * 50) + 50,
  }))
}

export const formatTime = (seconds: number): string => {
  const mins = Math.floor(seconds / 60)
  const secs = seconds % 60
  return `${mins}:${secs.toString().padStart(2, "0")}`
}

export const calculateProgress = (objects: GameObject[]): number => {
  const foundCount = objects.filter((obj) => obj.found).length
  return (foundCount / objects.length) * 100
}