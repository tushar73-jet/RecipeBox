import React, { useState, useEffect } from "react";
import { ScrollView, Text, Image, StyleSheet, ActivityIndicator, View, Alert , Button} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RecipeDetailScreen({ route }) {
  const { meal: initialMeal, idMeal } = route.params || {};
  const [meal, setMeal] = useState(initialMeal || null);
  const [loading, setLoading] = useState(!initialMeal);
  const [isFavorite, setIsFavorite] = useState(false);


  useEffect(() => {
    const fetchFullDetails = async () => {
      try {
        const id = idMeal || initialMeal?.idMeal;
        if (!id) return;

        const res = await fetch(`https://www.themealdb.com/api/json/v1/1/lookup.php?i=${id}`);
        const data = await res.json();
        if (data.meals && data.meals.length > 0) {
          setMeal(data.meals[0]);
        }
      } catch (error) {
        console.error("Error fetching details:", error);
      } finally {
        setLoading(false);
      }
    };

    const checkFavoriteStatus = async () => {
      try {
        const id = idMeal || initialMeal?.idMeal;
        const storedData = await AsyncStorage.getItem("favorites");
        let favorites = storedData ? JSON.parse(storedData) : [];
        const exists = favorites.some((item) => item.idMeal === id);
        setIsFavorite(exists);
      } catch (error) {
        console.log(error);
      }
    };

    checkFavoriteStatus();

    // If we don't have instructions yet, fetch them
    if (!meal || !meal.strInstructions) {
      fetchFullDetails();
    } else {
      setLoading(false);
    }
  }, [idMeal, initialMeal]);


  const toggleFavorite = async () => {
    try {
      const storedData = await AsyncStorage.getItem("favorites");
      let favorites = storedData ? JSON.parse(storedData) : [];

      if (isFavorite) {
        // Remove
        favorites = favorites.filter((item) => item.idMeal !== meal.idMeal);
        setIsFavorite(false);
        Alert.alert("Removed", "Recipe removed from favorites.");
      } else {
        // Add
        favorites.push(meal);
        setIsFavorite(true);
        Alert.alert("Saved", "Recipe saved to favorites!");
      }
      await AsyncStorage.setItem("favorites", JSON.stringify(favorites));
    } catch (error) {
      console.error("Error updating favorites", error);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" color="#0000ff" /></View>;
  }

  if (!meal) {
    return <View style={styles.center}><Text>Recipe not found.</Text></View>;
  }


  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: meal.strMealThumb }} style={styles.image} />
      <Text style={styles.title}>{meal.strMeal}</Text>
      <Text style={styles.category}>{meal.strCategory} - {meal.strArea}</Text>

      <View style={{ marginBottom: 20 }}>
        <Button 
          title={isFavorite ? "Remove from Favorites" : "Save to Favorites"} 
          color={isFavorite ? "#d9534f" : "#007AFF"}
          onPress={toggleFavorite} 
        />
      </View>

      <Text style={styles.section}>Ingredients:</Text>
      {Array.from({ length: 20 }).map((_, i) => {
        const ingredient = meal[`strIngredient${i + 1}`];
        const measure = meal[`strMeasure${i + 1}`];
        if (ingredient && ingredient.trim() !== "") {
          return <Text key={i} style={styles.ingredient}>• {ingredient} - {measure}</Text>;
        }
        return null;
      })}

      <Text style={styles.section}>Instructions:</Text>
      <Text style={styles.instructions}>{meal.strInstructions}</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: "#fff" },
  image: { width: "100%", height: 250, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  category: { fontSize: 16, fontStyle: "italic", marginBottom: 12, color: '#666' },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 12, marginBottom: 6 },
  ingredient: { fontSize: 15, marginLeft: 8, marginBottom: 4 },
  instructions: { fontSize: 15, lineHeight: 24, marginTop: 6, marginBottom: 30 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
