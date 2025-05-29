"use client"
import { View, Text, TouchableOpacity, StyleSheet, SafeAreaView } from "react-native"
import { useRouter } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/colors"

export default function HomeScreen() {
  const router = useRouter()

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <Ionicons name="camera" size={40} color={Colors.primary} />
          </View>
          <Text style={styles.title}>Busqueda de Objetos con IA</Text>
          <Text style={styles.subtitle}>Encuentra objetos, toma fotos y deja que la IA evalúe tus capturas</Text>
        </View>

        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.primaryButton} onPress={() => router.push("/game")}>
            <Ionicons name="play" size={24} color="white" />
            <Text style={styles.primaryButtonText}>Iniciar Juego</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.secondaryButton} onPress={() => router.push("/leaderboard")}>
            <Ionicons name="trophy" size={24} color={Colors.primary} />
            <Text style={styles.secondaryButtonText}>Ver Ranking</Text>
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray[50],
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 60,
  },
  iconContainer: {
    width: 80,
    height: 80,
    backgroundColor: "#DBEAFE",
    borderRadius: 40,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: Colors.gray[800],
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: Colors.gray[500],
    textAlign: "center",
    lineHeight: 24,
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: "100%",
    maxWidth: 300,
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  primaryButtonText: {
    color: "white",
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
  secondaryButton: {
    backgroundColor: "white",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  secondaryButtonText: {
    color: Colors.primary,
    fontSize: 18,
    fontWeight: "600",
    marginLeft: 8,
  },
})
