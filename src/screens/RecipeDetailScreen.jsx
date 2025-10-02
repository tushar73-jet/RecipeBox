import React from "react";
import { ScrollView, Text, Image, StyleSheet } from "react-native";

export default function RecipeDetailScreen({ route }) {
  const { meal } = route.params;

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
});
