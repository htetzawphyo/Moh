import { useFilterStore } from "@/store/filterStore";
import { MaterialIcons } from "@expo/vector-icons";
import {
  Alert,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

const CategoryModal = ({ modalVisible, setModalVisible }) => {
  const setFilter = useFilterStore((state) => state.setFilter);

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

  const handleCategorySelect = (category) => {
    setModalVisible(false);
    setFilter("CATEGORY", category);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => {
        Alert.alert("Modal has been closed.");
        setModalVisible(!modalVisible);
      }}
    >
      <TouchableOpacity
        style={styles.overlay}
        onPress={() => setModalVisible(false)}
        activeOpacity={1}
      >
        <View style={styles.modalView}>
          <Text style={styles.modalTitle}>Filter Category</Text>
          <ScrollView style={styles.categoriesContainer}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category.id}
                style={styles.categoryItem}
                onPress={() => handleCategorySelect(category.name)}
              >
                <MaterialIcons name={category.icon} size={24} color="#4CAF83" />
                <Text style={styles.categoryText}>{category.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    margin: 20,
    width: "80%",
    maxWidth: "80%",
    maxHeight: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 20,
    paddingVertical: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#4CAF83",
    marginBottom: 20,
  },
  // filter_box: {
  //     display: "flex",
  //     flexDirection: "row",
  //     alignItems: "center",
  //     justifyContent: "flex-start",
  //     gap: 2,
  //     paddingHorizontal: 15,
  //     paddingVertical: 5,
  //     backgroundColor: "#fff",
  //     borderRadius: 10,
  //     elevation: 2,
  //     shadowColor: "#000",
  //     shadowOpacity: 0.1,
  //     shadowRadius: 4,
  //     alignSelf: 'flex-start',
  // },
  categoriesContainer: {
    width: "100%",
  },
  categoryItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  categoryText: {
    fontSize: 16,
    marginLeft: 10,
    color: "#333",
  },
});

export default CategoryModal;
