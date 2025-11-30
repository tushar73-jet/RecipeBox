import React, { useState } from "react";
import { View, TextInput, Button, FlatList, Text, Image, TouchableOpacity, StyleSheet, ScrollView} from "react-native";
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

  const filterByCategory = async (category) => {
    try {
      const res = await fetch(`https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`);
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
      <View style={styles.header}>
        <Text style={styles.headerTitle}>RecipeBox</Text>
        <TouchableOpacity onPress={() => navigation.navigate("Favorites")}>
          <Text style={styles.favLink}>♥ Favorites</Text>
        </TouchableOpacity>
      </View>
      <TextInput
        style={styles.input}
        placeholder={searchMode === "name" ? "Search recipe..." : "Enter ingredient..."}
        value={query}
        onChangeText={setQuery}
      />

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

      <View style={styles.filterContainer}>
        <Text style={styles.filterLabel}>Quick Filters:</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {["Vegetarian", "Dessert", "Chicken", "Pasta"].map((cat) => (
            <TouchableOpacity key={cat} style={styles.chip} onPress={() => filterByCategory(cat)}>
              <Text style={styles.chipText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

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


  // toggle styles
  toggleContainer: { flexDirection: 'row', marginBottom: 10 },
  toggleBtn: { flex: 1, padding: 10, alignItems: 'center', backgroundColor: '#eee', marginHorizontal: 2, borderRadius: 5 },
  activeBtn: { backgroundColor: '#007AFF' },
  toggleText: { color: '#333' },
  activeText: { color: '#fff', fontWeight: 'bold' },

  // header styles

  header: { flexDirection: "row", justifyContent: "space-between", marginBottom: 15, alignItems: "center" },
  headerTitle: { fontSize: 22, fontWeight: "bold" },
  favLink: { color: '#e91e63', fontWeight: 'bold', fontSize: 16 },

  // filter styles
  filterChip: { backgroundColor: "#FF6F61", padding: 8, borderRadius: 15, marginRight: 8 },
  filterLabel: { fontSize: 14, fontWeight: '600', marginBottom: 5, color: '#555' },
  chip: { backgroundColor: '#FF6F61', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 20, marginRight: 8 },
  chipText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
});
