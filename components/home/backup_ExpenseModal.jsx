import useFetchCategories from "@/utils/useFetchCategories";
import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
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

const ExpenseModal = ({ modalVisible, setModalVisible }) => {
  console.log("ExpenseModal rendered");
  const [selectedCategory, setSelectCategory] = useState(null);
  const { categoryList, isLoadingCategories, errorCategories } = useFetchCategories();
  const [categoryModalVisible, setCategoryModalVisible] = useState(false);

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
        // onPress={() => setModalVisible(false)}
        activeOpacity={1}
      >
        <View style={styles.modalView}>
          <View style={styles.childContainer}>
            <Text style={styles.label}>Title</Text>
            <View style={styles.inputContainer}>
              <TextInput placeholder="Title" style={styles.input} />
            </View>
          </View>

          <View style={styles.childContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder="Amount"
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.childContainer}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.inputContainer}>
              {/* <TouchableOpacity
                style={styles.pickerButton}
                onPress={() => setCategoryModalVisible(true)}
              >
                <Text style={styles.pickerButtonText}>
                  {selectedCategory ? selectedCategory.name : "Select Category"}
                </Text>
                <MaterialIcons name="arrow-drop-down" size={24} color="#333" />
              </TouchableOpacity> */}
              {isLoadingCategories ? (
                <View style={styles.pickerLoadingContainer}>
                  {" "}
                  {/* Style အသစ်ထည့် */}
                  <ActivityIndicator size="small" color="#666" />
                  <Text style={{ marginLeft: 5, fontSize: 14, color: "#666" }}>
                    Loading...
                  </Text>
                </View>
              ) : errorCategories ? (
                <View style={styles.pickerErrorContainer}>
                  {" "}
                  {/* Style အသစ်ထည့် */}
                  <MaterialIcons name="error-outline" size={18} color="red" />
                  <Text style={{ marginLeft: 5, fontSize: 14, color: "red" }}>
                    Error loading categories
                  </Text>
                </View>
              ) : (
                <TouchableOpacity
                  style={styles.pickerButton}
                  onPress={() => setCategoryModalVisible(true)}
                >
                  <Text style={styles.pickerButtonText}>
                    {selectedCategory
                      ? selectedCategory.name
                      : "Select Category"}
                  </Text>
                  <MaterialIcons
                    name="arrow-drop-down"
                    size={24}
                    color="#333"
                  />
                </TouchableOpacity>
              )}

              {/* Category ရွေးတဲ့ Modal */}
              <Modal
                animationType="slide"
                transparent={true}
                visible={categoryModalVisible} // categoryModalVisible ကို သုံးပါ
                onRequestClose={() => setCategoryModalVisible(false)}
              >
                {/* Category Modal အတွက် သီးသန့် Overlay */}
                <TouchableOpacity
                  style={styles.categoryModalOverlay} // <--- ဒီမှာ Style အသစ်
                  activeOpacity={1}
                  onPress={() => setCategoryModalVisible(false)} // Overlay ကို နှိပ်ရင် ပိတ်ဖို့
                >
                  <View style={styles.categoryModalContent}>
                    {" "}
                    {/* <--- ဒီမှာ Style အသစ် */}
                    <Text style={styles.modalTitle}>Select a Category</Text>
                    {isLoadingCategories ? ( // Category Modal ထဲမှာ Loading ပြဖို့
                      <View style={styles.center}>
                        <ActivityIndicator size="large" color="#0000ff" />
                        <Text>Loading categories...</Text>
                      </View>
                    ) : errorCategories ? ( // Category Modal ထဲမှာ Error ပြဖို့
                      <View style={styles.center}>
                        <Text style={styles.errorText}>
                          Error: {errorCategories.message}
                        </Text>
                      </View>
                    ) : (
                      <FlatList
                        data={categoryList}
                        keyExtractor={(item) => item.id.toString()}
                        renderItem={({ item }) => (
                          <TouchableOpacity
                            style={styles.categoryOption}
                            onPress={() => {
                              setSelectCategory(item);
                              setCategoryModalVisible(false);
                            }}
                          >
                            <MaterialIcons
                              name={item.icon || "category"}
                              size={20}
                              color="#555"
                              style={styles.categoryIcon}
                            />
                            <Text style={styles.categoryOptionText}>
                              {item.name}
                            </Text>
                          </TouchableOpacity>
                        )}
                      />
                    )}
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => setCategoryModalVisible(false)}
                    >
                      <Text style={styles.closeButtonText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>{" "}
                {/* Category Modal Overlay ရဲ့ အပိတ် */}
              </Modal>
            </View>
          </View>

          <View
            style={{
              flexDirection: "row",
              justifyContent: "flex-end",
              gap: 50,
              width: "100%",
            }}
          >
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyleCancel}>Cancel</Text>
            </Pressable>
            <Pressable onPress={() => setModalVisible(!modalVisible)}>
              <Text style={styles.textStyleSave}>Save</Text>
            </Pressable>
          </View>
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
    backgroundColor: "white",
    borderRadius: 10,
    paddingHorizontal: 25,
    paddingVertical: 20,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  // button: {
  //   borderRadius: 10,
  //   padding: 10,
  //   elevation: 2,
  // },
  // cancleButton: {
  //   backgroundColor: "#FFC107",
  // },
  // saveButton: {
  //   backgroundColor: "#4CAF50",
  // },
  textStyleSave: {
    color: "#4CAF83",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  textStyleCancel: {
    color: "#A47378",
    fontWeight: "bold",
    textAlign: "center",
    fontSize: 18,
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },

  childContainer: {
    // flex: 1,
    marginBottom: 15,
    width: "100%",
  },
  label: {
    fontSize: 14,
    color: "#666",
    height: 30,
    fontWeight: "bold",
  },
  inputContainer: {
    backgroundColor: "#edf1f4",
    borderColor: "#ccc",
    // border: "none",
    borderWidth: 0,
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    height: 40,
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: "100%",
    // height: 65,
    paddingHorizontal: 10,
  },
  picker: {
    height: 60,
    width: "100%",
  },
  pickerItem: {
    height: 65,
    color: "#333",
  },

  pickerLoadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center", // Center content in the button area
    height: "100%",
    width: "100%",
  },
  pickerErrorContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    width: "100%",
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 10, // Adjust padding to match TextInput
    height: "100%", // Take full height of inputContainer
    width: "100%",
    // No borderWidth or borderRadius here, as it's provided by inputContainer
  },
  pickerButtonText: {
    fontSize: 16, // Adjust font size as needed
    color: "#333",
  },

  categoryModalOverlay: {
    // Category ရွေးတဲ့ modal ရဲ့ background overlay
    flex: 1,
    justifyContent: "flex-end", // <--- bottom ကနေ ပေါ်လာအောင်
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  categoryModalContent: {
    // Category ရွေးတဲ့ modal ရဲ့ content
    backgroundColor: "white",
    borderTopLeftRadius: 20, // <--- အပေါ်ဘက် ဘေးထောင့်တွေကို ဝိုင်းဖို့
    borderTopRightRadius: 20,
    padding: 20,
    width: "100%", // <--- ဖုန်းမျက်နှာပြင် အပြည့်နီးပါးယူဖို့
    maxHeight: "60%", // <--- မျက်နှာပြင်ရဲ့ 60% လောက်ယူဖို့
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center", // <--- Title ကို အလယ်ပို့ဖို့
  },
  categoryOption: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },
  categoryIcon: {
    marginRight: 10,
  },
  categoryOptionText: {
    fontSize: 16,
  },
  closeButton: {
    marginTop: 15,
    padding: 10,
    backgroundColor: "#007AFF", // ဒါကို သင့် app ရဲ့ primary color နဲ့ ပြောင်းနိုင်ပါတယ်
    borderRadius: 5,
    alignItems: "center",
  },
  closeButtonText: {
    color: "white",
    fontSize: 16,
  },
});

export default ExpenseModal;
