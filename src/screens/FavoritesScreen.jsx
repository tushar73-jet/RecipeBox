import React, { useState, useCallback } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useFocusEffect } from "@react-navigation/native";
import RecipeCard from "../components/RecipeCard";

export default function FavoritesScreen({ navigation }) {
  const [favorites, setFavorites] = useState([]);

  useFocusEffect(
    useCallback(() => {
      const loadFavorites = async () => {
        try {
          const storedData = await AsyncStorage.getItem("favorites");
          if (storedData) {
            setFavorites(JSON.parse(storedData));
          }
        } catch (error) {
          console.error("Failed to load favorites", error);
        }
      };
      loadFavorites();
    }, [])
  );

  return (
    <View style={styles.container}>
      {favorites.length === 0 ? (
        <View style={styles.center}>
          <Text style={styles.emptyText}>No favorites saved yet.</Text>
        </View>
      ) : (
        <FlatList
          data={favorites}
          keyExtractor={(item) => item.idMeal}
          renderItem={({ item }) => <RecipeCard meal={item} />}
          contentContainerStyle={{ padding: 16 }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff" },
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  emptyText: { fontSize: 18, color: "#888" },
});