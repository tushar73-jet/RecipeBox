import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, Image, TouchableOpacity, StyleSheet } from "react-native";
import RecipeCard from "../components/RecipeCard";

export default function HomeScreen({ navigation }) {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState([]);
  const [searchMode, setSearchMode] = useState("name");

  const searchRecipes = async () => {
    if (!query) return;
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/search.php?s=${query}`);
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch (err) {
      console.error(err);
    }
  };

  const searchByIngredient = async () => {
    if (!query) return;
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?i=${query}`);
      const data = await res.json();
      setRecipes(data.meals || []);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSearch = () => {
    if (searchMode === "name") {
      searchRecipes();
    } else {
      searchByIngredient();
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Search a recipe..."
        value={query}
        onChangeText={setQuery}
      />

      //toggle search
      <View style={styles.toggleContainer}>
        <TouchableOpacity 
          style={[styles.toggleBtn, searchMode === "name" && styles.activeBtn]}
          onPress={() => setSearchMode("name")}
        >
          <Text style={[styles.toggleText, searchMode === "name" && styles.activeText]}>By Name</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={[styles.toggleBtn, searchMode === "ingredient" && styles.activeBtn]}
          onPress={() => setSearchMode("ingredient")}
        >
          <Text style={[styles.toggleText, searchMode === "ingredient" && styles.activeText]}>By Ingredient</Text>
        </TouchableOpacity>
      </View>



      <Button title="Search" onPress={handleSearch} />

      <FlatList
        data={recipes}
        keyExtractor={(item) => item.idMeal}
        contentContainerStyle={{ paddingBottom: 20, paddingTop: 10 }}
        renderItem={({ item }) => (
          <RecipeCard meal={item} />
        
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  input: { borderWidth: 1, padding: 8, marginBottom: 10, borderRadius: 6 },
  toggleContainer: { flexDirection: 'row', marginBottom: 10 },
  toggleBtn: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#eee', marginHorizontal: 2, borderRadius: 5 },
  activeBtn: { backgroundColor: '#007AFF' },
  toggleText: { color: '#333' },
  activeText: { color: '#fff', fontWeight: 'bold' },
});
