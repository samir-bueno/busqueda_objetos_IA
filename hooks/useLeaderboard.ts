"use client"

import { useState, useEffect } from "react"
import type { GameScore } from "@/types/game"
import AsyncStorage from "@react-native-async-storage/async-storage"

export const useLeaderboard = () => {
  const [leaderboard, setLeaderboard] = useState<GameScore[]>([])
  const [loading, setLoading] = useState(true)

  const loadLeaderboard = async () => {
    try {
      setLoading(true)
      const scores = await AsyncStorage.getItem("leaderboard")
      if (scores) {
        setLeaderboard(JSON.parse(scores))
      }
    } catch (error) {
      console.error("Error loading leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const clearLeaderboard = async () => {
    try {
      await AsyncStorage.removeItem("leaderboard")
      setLeaderboard([])
    } catch (error) {
      console.error("Error clearing leaderboard:", error)
    }
  }

  useEffect(() => {
    loadLeaderboard()
  }, [])

  return {
    leaderboard,
    loading,
    loadLeaderboard,
    clearLeaderboard,
  }
}
