"use client"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView, ScrollView } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { useGameLogic } from "@/hooks/useGameLogic"
import { GameHeader } from "@/components/GameHeader"
import { ObjectsList } from "@/components/ObjectsList"
import { ProgressBar } from "@/components/ProgressBar"
import { OBJECTS_PER_GAME } from "@/constants/objects"
import { Colors } from "@/constants/colors"
import { useEffect } from "react"
import type { GameObject } from "@/types/game"

export default function GameScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const {
    gameObjects,
    currentScore,
    timeLeft,
    gameStarted,
    gameEnded,
    resetGame,
    updateGameFromCamera,
  } = useGameLogic()

  // Aplicar actualización desde cámara si hay parámetros
  useEffect(() => {
    if (params.updatedObjects && params.updatedScore) {
      try {
        const updatedObjects: GameObject[] = JSON.parse(params.updatedObjects as string)
        const updatedScore = Number.parseInt(params.updatedScore as string)
        updateGameFromCamera(updatedObjects, updatedScore)
      } catch (error) {
        console.warn("Error al aplicar datos desde cámara:", error)
      }
    }
  }, [params.updatedObjects, params.updatedScore])

  const openCamera = () => {
    router.push({
      pathname: "/camera",
      params: {
        gameObjects: JSON.stringify(gameObjects),
        currentScore: currentScore.toString(),
        timeLeft: timeLeft.toString(),
      },
    })
  }

  if (!gameStarted) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.welcomeContainer}>
          <View style={styles.welcomeHeader}>
            <Ionicons name="game-controller" size={64} color={Colors.primary} />
            <Text style={styles.welcomeTitle}>¡Listo para jugar!</Text>
            <Text style={styles.welcomeSubtitle}>
              Tienes tiempo limitado para encontrar {OBJECTS_PER_GAME} objetos usando tu cámara
            </Text>
          </View>
          <TouchableOpacity style={styles.startButton} onPress={resetGame}>
            {/* 👆 Ahora usa resetGame para inicializar una nueva sesión */}
            <Ionicons name="play" size={24} color="white" />
            <Text style={styles.startButtonText}>Comenzar Partida</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <GameHeader score={currentScore} timeLeft={timeLeft} />
        <ObjectsList objects={gameObjects} />

        {/* Sección de Cámara */}
        <View style={styles.cameraSection}>
          <Text style={styles.sectionTitle}>Capturar Objeto</Text>
          <View style={styles.cameraPlaceholder}>
            <Ionicons name="camera" size={48} color={Colors.gray[400]} />
            <Text style={styles.cameraText}>Toca el botón para capturar</Text>
          </View>
          <TouchableOpacity style={styles.cameraButton} onPress={openCamera}>
            <Ionicons name="camera" size={24} color="white" />
            <Text style={styles.cameraButtonText}>Tomar Foto</Text>
          </TouchableOpacity>
        </View>

        <ProgressBar objects={gameObjects} />
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  scrollView: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  welcomeContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  welcomeHeader: {
    alignItems: "center",
    marginBottom: 40,
  },
  welcomeTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: Colors.gray[800],
    marginTop: 20,
    marginBottom: 10,
    textAlign: "center",
  },
  welcomeSubtitle: {
    fontSize: 16,
    color: Colors.gray[500],
    textAlign: "center",
    lineHeight: 24,
  },
  startButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
  },
  startButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  cameraSection: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 16,
  },
  cameraPlaceholder: {
    height: 200,
    backgroundColor: Colors.gray[100],
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.gray[300],
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  cameraText: {
    color: Colors.gray[500],
    marginTop: 8,
  },
  cameraButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 8,
  },
  cameraButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    marginLeft: 8,
  },
})