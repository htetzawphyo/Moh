import { budgets } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import DateTimePicker from "@react-native-community/datetimepicker";
import { eq } from "drizzle-orm";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

interface Budget {
  id: number;
  totalBudget: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const BudgetScreen: React.FC = () => {
  const { db, dbLoaded, dbError, initializeDb, resetDbState } = useDbStore();
  const [currentBudget, setCurrentBudget] = useState<Budget | null>(null);
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [loadingData, setLoadingData] = useState(true);

  const fetchBudget = useCallback(async () => {
    setLoadingData(true);
    try {
      if (db) {
        const result = await db.select().from(budgets).all();
        if (result.length > 0) {
          setCurrentBudget(result[0]);
          setNewBudgetAmount(result[0].totalBudget.toString());
          setStartDate(new Date(result[0].startDate));
          setEndDate(new Date(result[0].endDate));
        } else {
          setCurrentBudget(null);
          setNewBudgetAmount("");
          setStartDate(new Date());
          setEndDate(new Date());
        }
      }
    } catch (err: any) {
      console.error("Error fetching budget:", err);
      Alert.alert(
        "Error",
        "Failed to fetch budget: " + (err.message || "Unknown error.")
      );

      useDbStore.setState({
        dbError: new Error(
          "Database connection lost during fetch. Please retry."
        ),
      });
    } finally {
      setLoadingData(false);
    }
  }, [db]);

  // Initial DB load
  useEffect(() => {
    if (!dbLoaded && !dbError) {
      console.log("Triggering database initialization...");
      initializeDb();
    }
  }, [dbLoaded, dbError]);

  // Fetch data once DB is loaded
  useEffect(() => {
    if (dbLoaded && db && !dbError) {
      fetchBudget();
    }
  }, [dbLoaded, db, dbError, fetchBudget]);

  const formatDateForDb = (
    date: Date,
    type: "start" | "end" = "start"
  ): string => {
    const clonedDate = new Date(date);

    if (type === "start") {
      clonedDate.setHours(0, 0, 0, 0);
    } else if (type === "end") {
      clonedDate.setHours(23, 59, 59, 999);
    }

    const year = clonedDate.getFullYear();
    const month = (clonedDate.getMonth() + 1).toString().padStart(2, "0");
    const day = clonedDate.getDate().toString().padStart(2, "0");
    const hours = clonedDate.getHours().toString().padStart(2, "0");
    const minutes = clonedDate.getMinutes().toString().padStart(2, "0");
    const seconds = clonedDate.getSeconds().toString().padStart(2, "0");

    return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  };

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    setDateState: React.Dispatch<React.SetStateAction<Date>>,
    setShowPickerState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setShowPickerState(Platform.OS === "ios");

    if (selectedDate) {
      setDateState(selectedDate);
    }

    if (Platform.OS === "android") {
      setShowPickerState(false);
    }
  };

  const saveBudget = async () => {
    if (!db) {
      Alert.alert("Error", "Database not connected. Please retry.");
      useDbStore.setState({
        dbError: new Error(
          "Database not connected for saving budget. Please retry."
        ),
      });
      return;
    }
    if (!newBudgetAmount) {
      Alert.alert("Validation Error", "Budget amount is required.");
      return;
    }
    if (parseFloat(newBudgetAmount) === 0) {
      Alert.alert("Validation Error", "Budget amount should not be 0.");
      return;
    }

    try {
      const parsedAmount = parseFloat(newBudgetAmount);
      if (isNaN(parsedAmount)) {
        alert("Please enter a valid number for budget amount.");
        return;
      }

      const formattedStartDate = formatDateForDb(new Date(startDate), "start");

      const formattedEndDate = formatDateForDb(new Date(endDate), "end");

      if (currentBudget) {
        // Update existing budget
        Alert.alert(
          "Budget ကို ပြင်ဆင်မည်",
          "သင်၏ Budget အချက်အလက်များကို ပြင်ဆင်လိုပါသလား?",
          [
            {
              text: "မပြင်ဆင်တော့ပါ",
              style: "cancel",
            },
            {
              text: "ပြင်ဆင်မည်",
              onPress: async () => {
                try {
                  await db
                    .update(budgets)
                    .set({
                      totalBudget: parsedAmount,
                      startDate: formattedStartDate,
                      endDate: formattedEndDate,
                    })
                    .where(eq(budgets.id, currentBudget.id))
                    .run();
                  console.log("Updated budget:", currentBudget.id);
                  fetchBudget();
                } catch (err: any) {
                  Alert.alert(
                    "Error",
                    "Failed to update budget: " +
                      (err.message || "Unknown error.")
                  );
                  useDbStore.setState({
                    dbError: new Error(
                      "Failed to update budget due to database issue. Please retry."
                    ),
                  });
                }
              },
            },
          ]
        );
      } else {
        // Insert new budget
        const inserted = await db
          .insert(budgets)
          .values({
            totalBudget: parsedAmount,
            startDate: formattedStartDate,
            endDate: formattedEndDate,
            isActive: true, // Automatically activate the first and only budget
          })
          .returning();
        console.log("Added budget:", inserted);
      }
      fetchBudget();
    } catch (err: any) {
      alert("Failed to save budget: " + err.message);
      useDbStore.setState({
        dbError: new Error(
          "Failed to save budget due to database issue. Please retry."
        ),
      });
    }
  };

  // --- UI Rendering Logic ---

  // Show loading indicator if DB is not loaded or data is being fetched
  if (!dbLoaded || loadingData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading database and budget...</Text>
      </View>
    );
  }

  // Show error screen if dbError occurred during initialization
  if (dbError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Database Initialization Error: {dbError.message || "Unknown error"}
        </Text>
        <Text style={styles.errorText}>
          Please ensure your database setup is correct and try again.
        </Text>

        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            console.log("Retrying DB initialization...");
            resetDbState();
            initializeDb();
          }}
        >
          <Text style={styles.retryButtonText}>Retry Initialization</Text>
        </TouchableOpacity>
      </View>
    );
  }
  return (
    <ScrollView style={styles.container}>
      <View style={styles.inputContainer}>
        <Text style={styles.inputLabel}>Total Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="Total Budget"
          placeholderTextColor={"#666666"}
          keyboardType="numeric"
          value={newBudgetAmount}
          onChangeText={setNewBudgetAmount}
        />

        {/* Start Date Picker */}
        <View style={styles.fieldWrapper}>
          <Text style={styles.inputLabel}>Start Date</Text>
          <TouchableOpacity
            style={styles.inputWithIcon}
            onPress={() => setShowStartDatePicker(true)}
          >
            <Text style={styles.inputText}>{startDate.toDateString()}</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) =>
                handleDateChange(
                  event,
                  selectedDate,
                  setStartDate,
                  setShowStartDatePicker
                )
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
            <Text style={styles.inputText}>{endDate.toDateString()}</Text>
          </TouchableOpacity>
          {showEndDatePicker && (
            <DateTimePicker
              value={endDate}
              mode="date"
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(event, selectedDate) =>
                handleDateChange(
                  event,
                  selectedDate,
                  setEndDate,
                  setShowEndDatePicker
                )
              }
            />
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={saveBudget}>
          <Text style={styles.submitButtonText}>
            {currentBudget ? "Update" : "Add"} Budget
          </Text>
        </TouchableOpacity>
      </View>

      {currentBudget && (
        <View style={styles.currentBudgetCard}>
          <View style={styles.headerContainer}>
            <MaterialCommunityIcons
              name="wallet-outline"
              size={24}
              color="#4A90E2"
              style={styles.headerIcon}
            />
            <Text style={styles.cardHeader}>Your Current Budget</Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.budgetItemLabel}>Amount:</Text>
            <Text style={styles.budgetItemValue}>
              {currentBudget.totalBudget.toFixed(2)} MMK
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.budgetItemLabel}>Start Date:</Text>
            <Text style={styles.budgetItemValue}>
              {currentBudget.startDate}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text style={styles.budgetItemLabel}>End Date:</Text>
            <Text style={styles.budgetItemValue}>{currentBudget.endDate}</Text>
          </View>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginBottom: 20,
    backgroundColor: "transparent",
    color: "#666666",
    lineHeight: 26,
  },
  fieldWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
    lineHeight: 26,
  },
  inputWithIcon: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  icon: {
    fontSize: 20,
    marginLeft: 10,
    color: "#888",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#388e3c",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 30,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    lineHeight: 25,
  },
  retryButton: {
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 20,
    alignSelf: "center",
  },
  retryButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },

  currentBudgetCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 20,
    marginTop: 25,
    // marginHorizontal: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 8,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  headerIcon: {
    marginRight: 10,
  },
  cardHeader: {
    fontSize: 22,
    fontWeight: "700",
    color: "#333333",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F7F7F7",
  },
  budgetItemLabel: {
    fontSize: 16,
    color: "#666666",
    fontWeight: "500",
  },
  budgetItemValue: {
    fontSize: 17,
    color: "#333333",
    fontWeight: "600",
  },
  lastDetailRow: {
    borderBottomWidth: 0,
  },
});

export default BudgetScreen;
