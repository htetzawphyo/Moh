import AddCategoryButton from "@/components/settings/AddCategoryButton";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";

const Category = () => {
  const categories = [
    { id: 1, name: "Starbucks", icon: "coffee" },
    { id: 2, name: "Amazon", icon: "shopping-cart" },
    { id: 3, name: "Uber", icon: "directions-car" },
    { id: 4, name: "Netflix", icon: "tv" },
    { id: 5, name: "Groceries", icon: "local-grocery-store" },
    { id: 6, name: "Gym", icon: "fitness-center" },
    { id: 7, name: "Dining Out", icon: "restaurant" },
    { id: 8, name: "Spotify", icon: "music-note" },
    { id: 9, name: "Electricity Bill", icon: "flash-on" },
    { id: 10, name: "Water Bill", icon: "water" },
    { id: 11, name: "Internet Bill", icon: "wifi" },
    { id: 12, name: "Phone Bill", icon: "phone" },
    { id: 13, name: "Clothing", icon: "checkroom" },
    { id: 14, name: "Books", icon: "book" },
    { id: 15, name: "Travel", icon: "flight" },
    { id: 16, name: "Insurance", icon: "shield" },
    { id: 17, name: "Charity", icon: "favorite" },
    { id: 18, name: "Pet Care", icon: "pets" },
    { id: 19, name: "Subscriptions", icon: "subscriptions" },
    { id: 20, name: "Miscellaneous", icon: "more-horiz" },
  ];

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.grid}>
          {categories.map((category, index) => (
            <View key={index} style={styles.item}>
              <MaterialIcons name={category.icon as any} size={24} color="black" />
              <Text>{category.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      <AddCategoryButton />
    </View>
  );
};

const styles = StyleSheet.create({
  scrollViewContent: {
    padding: 16,
  },
  grid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  item: {
    width: "48%",
    marginBottom: 16,
    padding: 12,
    backgroundColor: "#f2f2f2",
    borderRadius: 8,
    alignItems: "center",
  },
})

export default Category;
