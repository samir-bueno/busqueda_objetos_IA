import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { formatTime } from "@/utils/gameUtils"
import { Colors } from "@/constants/colors"

interface GameHeaderProps {
  score: number
  timeLeft: number
}

export const GameHeader: React.FC<GameHeaderProps> = ({ score, timeLeft }) => {
  return (
    <View style={styles.container}>
      <View style={styles.scoreContainer}>
        <Text style={styles.label}>Puntuación</Text>
        <Text style={styles.scoreValue}>{score}</Text>
      </View>
      <View style={styles.timeContainer}>
        <Text style={styles.label}>Tiempo</Text>
        <Text style={styles.timeValue}>{formatTime(timeLeft)}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  scoreContainer: {
    alignItems: "flex-start",
  },
  timeContainer: {
    alignItems: "flex-end",
  },
  label: {
    fontSize: 14,
    color: Colors.gray[500],
    marginBottom: 4,
  },
  scoreValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.primary,
  },
  timeValue: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.danger,
  },
})