// import AddCategoryButton from "@/components/settings/AddCategoryButton";
import { MaterialIcons } from "@expo/vector-icons";
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from "react-native";
import useFetchCategories from "@/utils/useFetchCategories";

const Category = () => {
  const { categoryList, isLoadingCategories, errorCategories } = useFetchCategories();

  if (isLoadingCategories) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading categories...</Text>
      </View>
    );
  }

  if (errorCategories) {
    return (
      <View style={styles.center}>
        <Text style={styles.errorText}>
          Error loading categories: {errorCategories.message}
        </Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1 }}>
      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.grid}>
          {categoryList.map((category, index) => (
            <View key={index} style={styles.item}>
              <MaterialIcons
                name={category.icon || "category"}
                size={24}
                color="black"
              />
              <Text>{category.name}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
      {/* <AddCategoryButton /> */}
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
});

export default Category;
