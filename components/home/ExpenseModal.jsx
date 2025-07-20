import useAddExpense from "@/utils/useAddExpense";
import useFetchCategories from "@/utils/useFetchCategories";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ExpenseModal = ({ modalVisible, setModalVisible, onExpenseAdded }) => {
  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

  const { categoryList, isLoadingCategories, errorCategories } =
    useFetchCategories();
  const { addExpense, addError, addSuccess, resetStatus } = useAddExpense();

  useEffect(() => {
    if (addSuccess) {
      Alert.alert("Success", "Expense added successfully!");
      setModalVisible(false);
      setTitle("");
      setAmount("");
      setSelectedCategory(null);
      resetStatus();
      onExpenseAdded?.();
    }
    if (addError) {
      Alert.alert("Error", `Failed to add expense: ${addError.message}`);
      resetStatus();
    }
  }, [addSuccess, addError]);

  const handleSubmit = async () => {
    if (!title || !amount || !selectedCategory) {
      Alert.alert(
        "Missing Information",
        "Please fill in all fields and select a category."
      );
      return;
    }

    const parsedAmount = parseFloat(amount);
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      Alert.alert("Invalid Amount", "Please enter a valid positive amount.");
      return;
    }

    setModalVisible(false);

    const expenseData = {
      title: title,
      categoryId: selectedCategory.id,
      amount: amount,
    };

    await addExpense(expenseData);
  };

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={modalVisible}
      onRequestClose={() => setModalVisible(false)}
    >
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          <View style={styles.dragHandle} />

          {/* Title */}
          <Text style={styles.label}>Title</Text>
          <TextInput
            value={title}
            onChangeText={setTitle}
            placeholder="Enter title"
            placeholderTextColor={"#666666"}
            style={styles.input}
          />

          {/* Amount */}
          <Text style={styles.label}>Amount</Text>
          <TextInput
            value={amount}
            onChangeText={setAmount}
            placeholder="Enter amount"
            placeholderTextColor={"#666666"}
            keyboardType="numeric"
            style={styles.input}
          />

          {/* Category */}
          <Text style={styles.label}>Category</Text>
          <TouchableOpacity
            style={styles.picker}
            onPress={() => setCategoryModalVisible(true)}
          >
            <Text style={styles.pickerText}>
              {selectedCategory ? selectedCategory.name : "Select category"}
            </Text>
            <MaterialIcons name="arrow-drop-down" size={24} color="#333" />
          </TouchableOpacity>

          {/* Action Buttons */}
          <View style={styles.actions}>
            <Pressable onPress={() => setModalVisible(false)}>
              <Text style={styles.cancelText}>Cancel</Text>
            </Pressable>
            <Pressable onPress={handleSubmit}>
              <Text style={styles.saveText}>Save</Text>
            </Pressable>
          </View>
        </View>
      </View>

      {/* Category Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={categoryModalVisible}
        onRequestClose={() => setCategoryModalVisible(false)}
      >
        <TouchableOpacity
          style={styles.categoryOverlay}
          activeOpacity={1}
          onPress={() => setCategoryModalVisible(false)}
        >
          <View style={styles.categorySheet}>
            <Text style={styles.categoryTitle}>Select Category</Text>
            {isLoadingCategories ? (
              <ActivityIndicator size="large" />
            ) : errorCategories ? (
              <Text style={styles.errorText}>Error loading categories</Text>
            ) : (
              <FlatList
                data={categoryList}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.categoryOption}
                    onPress={() => {
                      setSelectedCategory(item);
                      setCategoryModalVisible(false);
                    }}
                  >
                    <MaterialIcons
                      name={item.icon || "category"}
                      size={20}
                      color="#555"
                      style={styles.categoryIcon}
                    />
                    <Text style={styles.categoryName}>{item.name}</Text>
                  </TouchableOpacity>
                )}
              />
            )}
          </View>
        </TouchableOpacity>
      </Modal>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "flex-end",
  },
  sheet: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
    elevation: 10,
    gap: 15,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#ccc",
    alignSelf: "center",
    marginBottom: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#444",
  },
  input: {
    // height: 45,
    lineHeight: 26,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    fontSize: 16,
  },
  picker: {
    height: 45,
    backgroundColor: "#f5f5f5",
    borderRadius: 10,
    paddingHorizontal: 12,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  pickerText: {
    fontSize: 16,
    color: "#333",
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cancelText: {
    fontSize: 16,
    color: "#999",
    fontWeight: "600",
  },
  saveText: {
    fontSize: 16,
    color: "#4CAF50",
    fontWeight: "600",
  },
  categoryOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    justifyContent: "flex-end",
  },
  categorySheet: {
    backgroundColor: "#fff",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: "60%",
  },
  categoryTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomColor: "#eee",
    borderBottomWidth: 1,
  },
  categoryIcon: {
    marginRight: 10,
  },
  categoryName: {
    fontSize: 16,
    color: "#333",
  },
  errorText: {
    textAlign: "center",
    color: "red",
    marginTop: 10,
  },
});

export default ExpenseModal;
