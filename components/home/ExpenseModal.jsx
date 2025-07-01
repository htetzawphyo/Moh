import { Picker } from "@react-native-picker/picker";
import { useState } from "react";
import {
  Alert,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

const ExpenseModal = ({ modalVisible, setModalVisible }) => {
  const [selectedCategory, setSelectCategory] = useState(null);
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
              <TextInput placeholder="" style={styles.input} />
            </View>
          </View>

          <View style={styles.childContainer}>
            <Text style={styles.label}>Amount</Text>
            <View style={styles.inputContainer}>
              <TextInput
                placeholder=""
                keyboardType="numeric"
                style={styles.input}
              />
            </View>
          </View>

          <View style={styles.childContainer}>
            <Text style={styles.label}>Category</Text>
            <View style={styles.inputContainer}>
              <Picker style={styles.picker} itemStyle={styles.pickerItem}>
                <Picker.Item label="Select Category" value={null} />
                <Picker.Item label="Shopping" value="shopping" />
                <Picker.Item label="Transport" value="transport" />
                <Picker.Item label="Entertainment" value="entertainment" />
              </Picker>
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
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle.cancel}>Cancel</Text>
            </Pressable>
            <Pressable
              onPress={() => setModalVisible(!modalVisible)}
            >
              <Text style={styles.textStyle.save}>Save</Text>
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
  textStyle: {
    save: {
      color: "#4CAF83",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 18,
    },
    cancel: {
      color: "#A47378",
      fontWeight: "bold",
      textAlign: "center",
      fontSize: 18,
    },
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
    fontSize: 16,
    height: 30,
    fontWeight: "bold",
  },
  inputContainer: {
    backgroundColor: "#edf1f4",
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 8,
    overflow: "hidden",
    width: "100%",
    height: 40,
    justifyContent: "center",
  },
  input: {
    width: "100%",
    height: 65,
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
});

export default ExpenseModal;
