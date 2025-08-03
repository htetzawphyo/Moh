import { useFilterStore } from "@/store/filterStore";
import useFetchCategories from "@/utils/useFetchCategories";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
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
  const { categoryList, isLoadingCategories, errorCategories } = useFetchCategories();

  const handleCategorySelect = (category) => {
    setModalVisible(false);
    setFilter("CATEGORY", category);
  };

  if (isLoadingCategories) {
    return <ActivityIndicator />;
  }

  if (errorCategories) {
    return <Text>Error loading categories</Text>;
  }


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
            {categoryList.map((category) => (
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
