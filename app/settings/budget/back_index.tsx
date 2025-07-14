import { useDbStore } from "@/store/dbStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useNavigation } from "@react-navigation/native";
import React, { useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from "react-native";

interface Budget {
  id: number;
  totalBudget: number;
  startDate: string;
  endDate: string;
}

const Budget = () => {
  const { db, dbLoaded, initializeDb } = useDbStore();
  const [totalBudget, setTotalBudget] = useState<string>("");
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [endDate, setEndDate] = useState<Date>(new Date());
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const navigation = useNavigation();

  useEffect(() => {
    if (!dbLoaded && !db) {
      initializeDb();
    }
  }, [dbLoaded, db, initializeDb]);

  useEffect(() => {
    if (dbLoaded && db) {
      // fetchBudgets();
    }
  }, [dbLoaded, db]);

  const handleDateChange = (
    selectedDate: Date | undefined,
    setter: React.Dispatch<React.SetStateAction<Date>>,
    setPickerVisible: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setPickerVisible(false);
    if (selectedDate) {
      setter(selectedDate);
    }
  };

  const handleSubmit = () => {
    // console.log("Total Budget:", totalBudget);
    console.log("Start Date:", startDate.toISOString());
    console.log("End Date:", endDate.toISOString());
    alert("Budget Submitted!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
        {/* Total Budget Input */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.inputLabel}>Total Budget</Text>
          <TextInput
            style={styles.input}
            placeholder="Total Budget"
            keyboardType="numeric"
            value={totalBudget}
            onChangeText={setTotalBudget}
          />
        </View>

        {/* Start Date Picker */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.inputLabel}>Start Date</Text>
          <TouchableOpacity
            style={styles.inputWithIcon}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.inputText}>
              {startDate.toDateString()}
            </Text>
            <Text style={styles.icon}>📅</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display="default"
              onChange={(_, selectedDate) =>
                handleDateChange(selectedDate, setStartDate, setShowStartDatePicker)
              }
            />
          )}
        </View>

        {/* End Date Picker */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.inputLabel}>End Date</Text>
          <TouchableOpacity
            style={styles.inputWithIcon}
            onPress={() => setShowEndDatePicker(true)}
          >
            <Text style={styles.inputText}>
              {endDate.toDateString()}
            </Text>
            <Text style={styles.icon}>📅</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display="default"
              onChange={(_, selectedDate) =>
                handleDateChange(selectedDate, setEndDate, setShowEndDatePicker)
              }
            />
          )}
        </View>
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
        <Text style={styles.submitButtonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    justifyContent: "space-between",
  },
  inputContainer: {
    flex: 1,
    justifyContent: "flex-start",
  },
  fieldWrapper: {
    marginBottom: 15,
  },
  input: {
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
    fontSize: 16,
    color: "#333",
  },
  inputLabel: {
    fontSize: 14,
    color: "#666",
    marginBottom: 5,
    fontWeight: "bold",
  },
  inputWithIcon: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 10,
    padding: 15,
  },
  inputText: {
    fontSize: 16,
    color: "#333",
    flex: 1,
  },
  icon: {
    fontSize: 16,
    color: "#888",
  },
  submitButton: {
    backgroundColor: "#2E865F",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    marginBottom: 10,
  },
  submitButtonText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
  },
});

export default Budget;
