import { Tabs } from "expo-router"
import { StatusBar } from "expo-status-bar"
import { Ionicons } from "@expo/vector-icons"
import { Colors } from "@/constants/colors"

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Tabs
        screenOptions={{
          headerShown: false,
          tabBarActiveTintColor: Colors.primary,
          tabBarInactiveTintColor: Colors.gray[400],
          tabBarStyle: {
            backgroundColor: "white",
            borderTopWidth: 1,
            borderTopColor: Colors.gray[200],
          },
        }}
      >
        <Tabs.Screen
          name="index"
          options={{
            title: "Inicio",
            tabBarIcon: ({ color, size }) => <Ionicons name="home" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="game"
          options={{
            title: "Juego",
            tabBarIcon: ({ color, size }) => <Ionicons name="game-controller" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="leaderboard"
          options={{
            title: "Ranking",
            tabBarIcon: ({ color, size }) => <Ionicons name="trophy" size={size} color={color} />,
          }}
        />
        <Tabs.Screen
          name="camera"
          options={{
            href: null,
          }}
        />
      </Tabs>
    </>
  )
}