import CategoryModal from "@/components/history/CategoryModal";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, Text, TouchableOpacity } from "react-native";

const CategoryFilter = () => {
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    setModalVisible(true);
  };
  
  return (
    <TouchableOpacity style={styles.container} onPress={showModal}>
      <MaterialIcons name="list" size={24} />
      <Text style={{ fontSize: 16 }}>Category</Text>
      <CategoryModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
      />
    </TouchableOpacity>
  );
};

export default CategoryFilter;

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    gap: 2,
    paddingHorizontal: 15,
    paddingVertical: 5,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
});
