"use client"

import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView, ActivityIndicator } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { useLeaderboard } from "@/hooks/useLeaderboard"
import { OBJECTS_PER_GAME } from "@/constants/objects"
import { Colors } from "@/constants/colors"
import { useFocusEffect } from "expo-router"
import { useCallback } from "react"

export default function LeaderboardScreen() {
  const { leaderboard, loading, loadLeaderboard, clearLeaderboard } = useLeaderboard()

  useFocusEffect(
    useCallback(() => {
      loadLeaderboard()
    }, []),
  )

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={Colors.primary} />
          <Text style={styles.loadingText}>Cargando ranking...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.titleContainer}>
          <Ionicons name="trophy" size={24} color={Colors.warning} />
          <Text style={styles.title}>Ranking de Jugadores</Text>
        </View>
        {leaderboard.length > 0 && (
          <TouchableOpacity style={styles.clearButton} onPress={clearLeaderboard}>
            <Ionicons name="trash" size={20} color={Colors.danger} />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {leaderboard.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Ionicons name="trophy-outline" size={64} color={Colors.gray[300]} />
            <Text style={styles.emptyTitle}>No hay puntuaciones aún</Text>
            <Text style={styles.emptyText}>¡Juega tu primera partida para aparecer en el ranking!</Text>
          </View>
        ) : (
          <View style={styles.scoresContainer}>
            {leaderboard.map((score, index) => (
              <View key={score.id} style={styles.scoreItem}>
                <View style={styles.scoreLeft}>
                  <View style={[styles.rankContainer, score.completed ? styles.rankCompleted : styles.rankIncomplete]}>
                    <Text
                      style={[styles.rankText, score.completed ? styles.rankTextCompleted : styles.rankTextIncomplete]}
                    >
                      {index + 1}
                    </Text>
                  </View>
                  <View style={styles.scoreInfo}>
                    <Text style={styles.playerName}>{score.playerName}</Text>
                    <View style={styles.scoreDetails}>
                      <Text style={styles.detailText}>{score.objectsFound}/{OBJECTS_PER_GAME} objetos</Text>
                      <Text style={styles.detailSeparator}>•</Text>
                      <View style={styles.timeContainer}>
                        <Ionicons name="time" size={12} color={Colors.gray[500]} />
                        <Text style={styles.detailText}>{score.timeUsed}</Text>
                      </View>
                      <Text style={styles.detailSeparator}>•</Text>
                      <Text style={styles.detailText}>{score.date}</Text>
                    </View>
                    {score.completed && (
                      <View style={styles.completedBadge}>
                        <Text style={styles.completedBadgeText}>Completado</Text>
                      </View>
                    )}
                  </View>
                </View>
                <View style={styles.scoreRight}>
                  <Text style={styles.scoreValue}>{score.score}</Text>
                  <Text style={styles.scoreLabel}>puntos</Text>
                </View>
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}

// ... estilos sin cambios ...
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderBottomColor: Colors.gray[200],
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray[800],
    marginLeft: 8,
  },
  clearButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.error[50],
    justifyContent: "center",
    alignItems: "center",
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 16,
    fontSize: 16,
    color: Colors.gray[500],
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 80,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: Colors.gray[700],
    marginTop: 16,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: Colors.gray[500],
    textAlign: "center",
    lineHeight: 24,
  },
  scoresContainer: {
    paddingVertical: 16,
  },
  scoreItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "white",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
  },
  scoreLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  rankContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  rankCompleted: {
    backgroundColor: Colors.success[100],
  },
  rankIncomplete: {
    backgroundColor: Colors.error[100],
  },
  rankText: {
    fontSize: 14,
    fontWeight: "bold",
  },
  rankTextCompleted: {
    color: Colors.success[700],
  },
  rankTextIncomplete: {
    color: Colors.error[700],
  },
  scoreInfo: {
    flex: 1,
  },
  playerName: {
    fontSize: 16,
    fontWeight: "500",
    color: Colors.gray[800],
    marginBottom: 4,
  },
  scoreDetails: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
  },
  detailText: {
    fontSize: 12,
    color: Colors.gray[500],
  },
  detailSeparator: {
    fontSize: 12,
    color: Colors.gray[500],
    marginHorizontal: 6,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  completedBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
    alignSelf: "flex-start",
    marginTop: 4,
  },
  completedBadgeText: {
    fontSize: 10,
    color: "white",
    fontWeight: "500",
  },
  scoreRight: {
    alignItems: "flex-end",
  },
  scoreValue: {
    fontSize: 18,
    fontWeight: "bold",
    color: Colors.gray[800],
  },
  scoreLabel: {
    fontSize: 12,
    color: Colors.gray[500],
  },
})