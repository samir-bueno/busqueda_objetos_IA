import type React from "react"
import { View, Text, StyleSheet } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import type { GameObject } from "@/types/game"
import { Colors } from "@/constants/colors"

interface ObjectsListProps {
  objects: GameObject[]
}

export const ObjectsList: React.FC<ObjectsListProps> = ({ objects }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Objetos a Encontrar</Text>
      <View style={styles.grid}>
        {objects.map((obj) => (
          <View key={obj.id} style={[styles.item, obj.found ? styles.itemFound : styles.itemNotFound]}>
            <View style={styles.itemHeader}>
              <Text style={[styles.itemName, obj.found ? styles.itemNameFound : styles.itemNameNotFound]}>
                {obj.name}
              </Text>
              <Ionicons
                name={obj.found ? "checkmark-circle" : "close-circle"}
                size={20}
                color={obj.found ? Colors.secondary : Colors.gray[300]}
              />
            </View>
            <View style={[styles.pointsBadge, obj.found ? styles.pointsBadgeFound : styles.pointsBadgeNotFound]}>
              <Text style={[styles.pointsText, obj.found ? styles.pointsTextFound : styles.pointsTextNotFound]}>
                {obj.points} pts
              </Text>
            </View>
          </View>
        ))}
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
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: Colors.gray[800],
    marginBottom: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    width: "48%",
    padding: 12,
    borderRadius: 8,
    borderWidth: 2,
    marginBottom: 8,
  },
  itemFound: {
    backgroundColor: Colors.success[50],
    borderColor: Colors.success[100],
  },
  itemNotFound: {
    backgroundColor: "white",
    borderColor: Colors.gray[200],
  },
  itemHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  itemName: {
    fontSize: 14,
    fontWeight: "500",
    flex: 1,
  },
  itemNameFound: {
    color: Colors.success[700],
  },
  itemNameNotFound: {
    color: Colors.gray[700],
  },
  pointsBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    alignSelf: "flex-start",
  },
  pointsBadgeFound: {
    backgroundColor: Colors.primary,
  },
  pointsBadgeNotFound: {
    backgroundColor: Colors.gray[200],
  },
  pointsText: {
    fontSize: 12,
    fontWeight: "500",
  },
  pointsTextFound: {
    color: "white",
  },
  pointsTextNotFound: {
    color: Colors.gray[500],
  },
})