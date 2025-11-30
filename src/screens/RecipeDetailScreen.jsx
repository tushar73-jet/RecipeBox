import React, { useState, useEffect } from "react";
import { ScrollView, Text, Image, StyleSheet, ActivityIndicator, View } from "react-native";

export default function RecipeDetailScreen({ route }) {
  const { meal: initialMeal, idMeal } = route.params || {};
  const [meal, setMeal] = useState(initialMeal || null);
  const [loading, setLoading] = useState(!initialMeal);


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

    // If we don't have instructions yet, fetch them
    if (!meal || !meal.strInstructions) {
      fetchFullDetails();
    } else {
      setLoading(false);
    }
  }, [idMeal, initialMeal]);

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
  image: { width: "100%", height: 200, borderRadius: 12, marginBottom: 16 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 8 },
  category: { fontSize: 16, fontStyle: "italic", marginBottom: 12 },
  section: { fontSize: 18, fontWeight: "bold", marginTop: 12 },
  ingredient: { fontSize: 15, marginLeft: 8 },
  instructions: { fontSize: 15, lineHeight: 22, marginTop: 6 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
