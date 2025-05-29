import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import type { GameObject } from "@/types/game"
import { calculateProgress } from "@/utils/gameUtils"
import { Colors } from "@/constants/colors"

interface ProgressBarProps {
  objects: GameObject[]
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ objects }) => {
  const foundCount = objects.filter((obj) => obj.found).length
  const progress = calculateProgress(objects)

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.label}>Progreso</Text>
        <Text style={styles.text}>
          {foundCount}/{objects.length}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View style={[styles.progressFill, { width: `${progress}%` }]} />
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  label: {
    fontSize: 14,
    color: Colors.gray[500],
  },
  text: {
    fontSize: 14,
    fontWeight: "500",
    color: Colors.gray[700],
  },
  progressBar: {
    height: 8,
    backgroundColor: Colors.gray[200],
    borderRadius: 4,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: Colors.primary,
    borderRadius: 4,
  },
})