"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Alert,
  ActivityIndicator,
  Image,
  Platform,
} from "react-native"
import { CameraView, type CameraType, useCameraPermissions } from "expo-camera"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import type { GameObject } from "@/types/game"
import { analyzeImageWithAI, findMatchingObject } from "@/utils/aiUtils"
import { formatTime } from "@/utils/gameUtils"
import { Colors } from "@/constants/colors"
import { useFocusEffect } from "@react-navigation/native"

export default function CameraScreen() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const [permission, requestPermission] = useCameraPermissions()
  const [facing, setFacing] = useState<CameraType>("back")
  const [isProcessing, setIsProcessing] = useState(false)
  const [capturedImage, setCapturedImage] = useState<string | null>(null)

  // Este estado controla si se muestra la cámara o la foto
  const [shouldShowCamera, setShouldShowCamera] = useState(true)

  // Nuevo estado para forzar remonte del componente CameraView usando la key
  const [cameraKey, setCameraKey] = useState(0)

  const cameraRef = useRef<CameraView>(null)

  const gameObjects: GameObject[] = params.gameObjects ? JSON.parse(params.gameObjects as string) : []
  const currentScore = Number.parseInt(params.currentScore as string) || 0
  const timeLeft = Number.parseInt(params.timeLeft as string) || 0

  const resetCamera = () => {
    setCapturedImage(null)
    setIsProcessing(false)
    setShouldShowCamera(true)

    // Forzar remonte cambiando la key
    setCameraKey((prev) => prev + 1)

    // Limpiar ref para evitar referencias colgadas
    cameraRef.current = null
  }

  // Pedir permiso y resetear cámara al montar
  useEffect(() => {
    requestCameraPermission()
    resetCamera()
  }, [])

  // Resetear estado cuando la pantalla entra en foco
  useFocusEffect(
    useCallback(() => {
      resetCamera()
      return () => {
        resetCamera()
      }
    }, [])
  )

  const requestCameraPermission = async () => {
    if (Platform.OS === "web") return

    if (!permission?.granted) {
      const result = await requestPermission()
      if (!result.granted) {
        Alert.alert(
          "Permisos requeridos",
          "Esta aplicación necesita acceso a la cámara para funcionar correctamente.",
          [
            { text: "Cancelar", onPress: () => router.back() },
            { text: "Configurar", onPress: () => requestPermission() },
          ],
        )
      }
    }
  }

  const takePicture = async () => {
    if (cameraRef.current && !isProcessing) {
      setIsProcessing(true)
      try {
        const photo = await cameraRef.current.takePictureAsync({
          quality: 0.8,
          base64: true,
          skipProcessing: false,
        })

        if (!photo?.uri || !photo.base64) {
          throw new Error("No se pudo capturar la imagen o no tiene base64")
        }

        setCapturedImage(photo.uri)
        setShouldShowCamera(false) // Ocultar cámara para mostrar la foto

        await analyzeImage(photo.base64)
      } catch (error) {
        console.error("Error taking picture:", error)
        Alert.alert("Error", "No se pudo tomar la foto. Inténtalo de nuevo.")
        resetCamera()
      } finally {
        // Siempre aseguramos que isProcessing se desactive si algo falla
        setIsProcessing(false)
      }
    }
  }

  const analyzeImage = async (base64Image: string) => {
  try {
    const detectedLabels = await analyzeImageWithAI(base64Image)
    console.log("Detected labels:", detectedLabels)

    const foundObject = findMatchingObject(detectedLabels, gameObjects)

    if (foundObject) {
      if (foundObject.found) {
        Alert.alert("¡Ya encontrado!", `Ya habías encontrado: ${foundObject.name}\nNo se suman puntos adicionales.`, [
          { text: "OK", onPress: () => resetCamera() },
        ])
      } else {
        const newScore = currentScore + foundObject.points
        const updatedObjects = gameObjects.map((obj) =>
          obj.id === foundObject.id ? { ...obj, found: true } : obj
        )
        const allFound = updatedObjects.every((obj) => obj.found)

        if (allFound) {
          // ✅ Redirigir automáticamente a /game sin mostrar alert
          router.replace({
            pathname: "/game",
            params: {
              updatedObjects: JSON.stringify(updatedObjects),
              updatedScore: newScore.toString(),
              timeLeft: timeLeft.toString(),
              completed: "true",
            },
          })
        } else {
          // Solo mostramos alerta si aún quedan objetos
          Alert.alert("¡Excelente!", `Encontraste: ${foundObject.name}\n+${foundObject.points} puntos`, [
            {
              text: "Continuar",
              onPress: () => {
                router.replace({
                  pathname: "/game",
                  params: {
                    updatedObjects: JSON.stringify(updatedObjects),
                    updatedScore: newScore.toString(),
                    timeLeft: timeLeft.toString(),
                  },
                })
              },
            },
          ])
        }
      }
    } else {
      Alert.alert("No hay coincidencias", "La IA no pudo identificar ningún objeto de la lista. ¡Inténtalo de nuevo!", [
        { text: "OK", onPress: () => resetCamera() },
      ])
    }
  } catch (error) {
    console.error("Error analyzing image:", error)
    Alert.alert("Error", "Error al analizar la imagen. Verifica tu conexión.")
    resetCamera()
  }
}

  const toggleCameraFacing = () => {
    setFacing((current) => (current === "back" ? "front" : "back"))
    // También forzamos remonte para evitar problema similar al cambiar cámara
    setCameraKey((prev) => prev + 1)
  }

  if (!permission) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={Colors.primary} />
        <Text style={{ marginTop: 10, fontSize: 16, color: Colors.primary }}>
          Solicitando permisos...
        </Text>
      </View>
    )
  }

  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <View style={styles.permissionContainer}>
          <Ionicons name="camera-outline" size={64} color={Colors.gray[400]} />
          <Text style={styles.permissionTitle}>Acceso a la Cámara</Text>
          <Text style={styles.permissionMessage}>Necesitamos acceso a tu cámara para tomar fotos de los objetos</Text>
          <TouchableOpacity style={styles.permissionButton} onPress={requestPermission}>
            <Text style={styles.permissionButtonText}>Conceder Permiso</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.backButtonAlt} onPress={() => router.back()}>
            <Text style={styles.backButtonAltText}>Volver al Juego</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.cameraContainer}>
        {shouldShowCamera ? (
          // Usamos cameraKey para forzar remonte del componente CameraView
          <CameraView key={cameraKey} style={styles.camera} facing={facing} ref={cameraRef} />
        ) : (
          capturedImage && <Image source={{ uri: capturedImage }} style={styles.capturedImage} />
        )}

        <View style={styles.overlay}>
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.topButton} onPress={() => router.back()} disabled={isProcessing}>
              <Ionicons name="arrow-back" size={24} color="white" />
            </TouchableOpacity>
            <View style={styles.topCenter}>
              <Text style={styles.topText}>Busca un objeto de la lista</Text>
            </View>
            <TouchableOpacity style={styles.topButton} onPress={toggleCameraFacing} disabled={isProcessing}>
              <Ionicons name="camera-reverse" size={24} color="white" />
            </TouchableOpacity>
          </View>

          <View style={styles.bottomBar}>
            <View style={styles.captureButtonContainer}>
              <TouchableOpacity
                style={[styles.captureButton, isProcessing && styles.captureButtonDisabled]}
                onPress={takePicture}
                disabled={isProcessing}
                activeOpacity={0.7}
              >
                <View style={styles.captureButtonInner}>
                  {isProcessing ? (
                    <ActivityIndicator size="small" color="white" />
                  ) : (
                    <Ionicons name="camera" size={24} color="white" />
                  )}
                </View>
              </TouchableOpacity>
            </View>
          </View>

          {isProcessing && (
            <View style={styles.processingOverlay}>
              <ActivityIndicator size="large" color={Colors.primary} />
              <Text style={styles.processingText}>La IA está analizando tu foto...</Text>
              <Text style={styles.processingSubtext}>Esto puede tomar unos segundos</Text>
            </View>
          )}
        </View>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "black",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.gray[50],
  },
  cameraContainer: {
    flex: 1,
    position: "relative",
  },
  camera: {
    flex: 1,
  },
  capturedImage: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "space-between",
  },
  topBar: {
    marginTop: 10,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  topButton: {
    padding: 8,
  },
  topCenter: {
    flex: 1,
    alignItems: "center",
  },
  topText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  bottomBar: {
    paddingBottom: 20,
    alignItems: "center",
  },
  captureButtonContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  captureButton: {
    backgroundColor: Colors.primary,
    borderRadius: 50,
    padding: 15,
    borderWidth: 4,
    borderColor: "white",
  },
  captureButtonDisabled: {
    backgroundColor: Colors.gray[400],
    borderColor: Colors.gray[300],
  },
  captureButtonInner: {
    alignItems: "center",
    justifyContent: "center",
  },
  processingOverlay: {
    position: "absolute",
    top: "40%",
    left: 0,
    right: 0,
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.7)",
    paddingVertical: 20,
    borderRadius: 10,
    marginHorizontal: 40,
  },
  processingText: {
    color: "white",
    fontSize: 16,
    marginTop: 10,
  },
  processingSubtext: {
    color: Colors.gray[300],
    fontSize: 14,
    marginTop: 5,
  },
  permissionContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  permissionTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 20,
    color: Colors.gray[800],
  },
  permissionMessage: {
    fontSize: 16,
    marginTop: 10,
    textAlign: "center",
    color: Colors.gray[600],
  },
  permissionButton: {
    marginTop: 20,
    backgroundColor: Colors.primary,
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
  },
  permissionButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
  },
  backButtonAlt: {
    marginTop: 15,
  },
  backButtonAltText: {
    color: Colors.primary,
    fontSize: 16,
    textDecorationLine: "underline",
  },
})