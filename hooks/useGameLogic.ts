import { useState, useEffect } from "react"
import type { GameObject, GameScore } from "@/types/game"
import { generateObjectList, formatTime } from "@/utils/gameUtils"
import { GAME_DURATION } from "@/constants/objects"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

export const useGameLogic = () => {
  const [gameObjects, setGameObjects] = useState<GameObject[]>([])
  const [currentScore, setCurrentScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION)
  const [gameStarted, setGameStarted] = useState(false)
  const [gameEnded, setGameEnded] = useState(false)
  const [sessionId, setSessionId] = useState<number | null>(null)

  const router = useRouter()

  useEffect(() => {
    if (gameStarted && timeLeft > 0 && !gameEnded) {
      const timer = setTimeout(() => setTimeLeft((prev) => prev - 1), 1000)
      return () => clearTimeout(timer)
    } else if (timeLeft === 0 && !gameEnded) {
      endGame(false)
    }
  }, [gameStarted, timeLeft, gameEnded])

  useEffect(() => {
    if (sessionId !== null) {
      startNewGame()
    }
  }, [sessionId])

  const startNewGame = () => {
    const newObjects = generateObjectList().map((obj, index) => ({
      ...obj,
      id: index + 1,
      found: false,
    }))

    setGameObjects(newObjects)
    setCurrentScore(0)
    setTimeLeft(GAME_DURATION)
    setGameStarted(true)
    setGameEnded(false)
  }

  const resetGame = () => {
    setSessionId(Date.now())
  }

  const updateObjectFound = (objectId: number, points: number) => {
    if (gameEnded) return

    setGameObjects((prev) => {
      const updated = prev.map((obj) =>
        obj.id === objectId ? { ...obj, found: true } : obj
      )

      const allFound = updated.every((obj) => obj.found)

      const newScore = currentScore + points
      setCurrentScore(newScore)

      if (allFound) {
        setTimeout(() => endGame(true, newScore), 100)
      }

      return updated
    })
  }

  const updateGameFromCamera = (updatedObjects: GameObject[], newScore: number) => {
    if (gameEnded) return

    setGameObjects(updatedObjects)
    setCurrentScore(newScore)

    const allFound = updatedObjects.every((obj) => obj.found)
    if (allFound) {
      setTimeout(() => endGame(true, newScore), 100)
    }
  }

  const endGame = async (won = false, finalScore?: number) => {
    if (gameEnded) return

    setGameEnded(true)
    setGameStarted(false)

    const objectsFound = gameObjects.filter((obj) => obj.found).length
    const scoreToUse = finalScore ?? currentScore
    const completed = won || objectsFound === gameObjects.length
    const timeUsed = completed
      ? formatTime(GAME_DURATION - timeLeft)
      : formatTime(GAME_DURATION)

    const gameResult = {
      score: scoreToUse,
      objectsFound: completed ? gameObjects.length : objectsFound,
      timeUsed,
      completed,
      date: new Date().toLocaleDateString(),
    }

    await saveGameResult(gameResult)

    // Redirigir a la tabla de clasificación, siempre
    router.replace("/leaderboard")

    return gameResult
  }

  const saveGameResult = async (gameResult: Omit<GameScore, "id" | "playerName">) => {
    try {
      const existingScores = await AsyncStorage.getItem("leaderboard")
      const scores = existingScores ? JSON.parse(existingScores) : []

      const newScore: GameScore = {
        id: Date.now(),
        playerName: "Jugador",
        ...gameResult,
      }

      scores.push(newScore)
      scores.sort((a: GameScore, b: GameScore) => {
        if (a.completed !== b.completed) {
          return a.completed ? -1 : 1
        }
        return b.score - a.score
      })

      await AsyncStorage.setItem("leaderboard", JSON.stringify(scores.slice(0, 10)))
    } catch (error) {
      console.error("Error saving score:", error)
    }
  }

  return {
    gameObjects,
    currentScore,
    timeLeft,
    gameStarted,
    gameEnded,
    startNewGame,
    updateObjectFound,
    updateGameFromCamera,
    endGame,
    resetGame,
  }
}