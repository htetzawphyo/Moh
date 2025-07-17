import { budgets, todayExpenses, userBudgets } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import DateTimePicker from "@react-native-community/datetimepicker";
import { count, eq, not } from "drizzle-orm";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
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
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [newBudgetAmount, setNewBudgetAmount] = useState("");

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [loadingData, setLoadingData] = useState(true);

  const fetchBudgets = useCallback(async () => {
    setLoadingData(true);
    try {
      if (db) {
        const result = await db.select().from(budgets).all();
        setBudgetList(result);
        // console.log("Fetched budgets:", result);
      }
    } catch (err: any) {
      console.error("Error fetching budgets:", err);
      Alert.alert(
        "Error",
        "Failed to fetch budgets: " + (err.message || "Unknown error.")
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
      fetchBudgets();
    }
  }, [dbLoaded, db, dbError, fetchBudgets]);

  const formatDateForDb = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
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

  const addBudget = async () => {
    if (!db) {
      Alert.alert("Error", "Database not connected. Please retry.");
      useDbStore.setState({
        dbError: new Error(
          "Database not connected for adding budget. Please retry."
        ),
      });
      return;
    }
    if (!newBudgetAmount) {
      Alert.alert("Validation Error", "Budget amount is required.");
      return;
    }

    const result = await db
      .select({
        totalCount: count(),
      })
      .from(budgets)
      .get();

    if (result && result.totalCount >= 3) {
      Alert.alert("Limit Exceeded", "You can only store a total of 3 budgets.");
      return;
    }

    try {
      const parsedAmount = parseFloat(newBudgetAmount);
      if (isNaN(parsedAmount)) {
        alert("Please enter a valid number for budget amount.");
        return;
      }

      const formattedStartDate = formatDateForDb(startDate);
      const formattedEndDate = formatDateForDb(endDate);

      const inserted = await db
        .insert(budgets)
        .values({
          totalBudget: parsedAmount,
          startDate: formattedStartDate,
          endDate: formattedEndDate,
          isActive: false,
        })
        .returning();

      console.log("Added budget:", inserted);
      setNewBudgetAmount("");
      setStartDate(new Date());
      setEndDate(new Date());
      fetchBudgets();
    } catch (err: any) {
      alert("Failed to add budget: " + err.message);
      useDbStore.setState({
        dbError: new Error(
          "Failed to add budget due to database issue. Please retry."
        ),
      });
    }
  };

  const deleteBudget = async (id: number) => {
    if (!db) {
      Alert.alert(
        "Error",
        "Database is not ready. Please try again or restart the app."
      );
      useDbStore.setState({
        dbError: new Error(
          "Database not connected for deleting budget. Please retry."
        ),
      });
      return;
    }
    Alert.alert(
      "ဤ Budget ကို ဖျက်မည်",
      'အကယ်၍ သင်က ဤ Budget ကို အသုံးပြုနေပြီးတော့ ဖျက်လိုက်လျှင် "ယနေ့ ကုန်ကျငွေစာရင်း" တွင် သင် ထည့်သွင်းမှတ်သားထားသည့် စာရင်းများရှိပါက ပျက်သွားပါမည်။ ဖျက်ချင်တာ သေချာပါသလား?',
      [
        {
          text: "မဖျက်တော့ပါ",
          style: "cancel",
        },
        {
          text: "ဖျက်မည်",
          onPress: async () => {
            try {
              await db.delete(budgets).where(eq(budgets.id, id)).run();
              await db.delete(todayExpenses);
              console.log("Deleted budget with ID:", id);
              fetchBudgets();
            } catch (err: any) {
              console.error("Error deleting budget:", err);
              Alert.alert(
                "Error",
                "Failed to delete budget: " + (err.message || "Unknown error.")
              );
              useDbStore.setState({
                dbError: new Error(
                  "Failed to delete budget due to database issue. Please retry."
                ),
              });
            }
          },
          style: "destructive",
        },
      ]
    );
  };

  const toggleBudgetActiveStatus = async (
    id: number,
    currentStatus: boolean
  ) => {
    if (!db) {
      Alert.alert(
        "Error",
        "Database is not ready. Please try again or restart the app."
      );
      console.error("Attempted to toggle budget status when DB not available.");
      useDbStore.setState({
        dbError: new Error(
          "Database not connected for toggling status. Please retry."
        ),
      });
      return;
    }

    console.log('budget id: ', id);
    
    try {
      if (currentStatus) {
        Alert.alert(
          "ပိတ်သိမ်းမည်",
          'ဤ Budget ကို ပိတ်သိမ်းလိုက်ပါက "ယနေ့ ကုန်ကျငွေစာရင်း" တွင် သင် ထည့်သွင်းမှတ်သားထားသည့် စာရင်းများရှိပါက ပျက်သွားပါမည်။',
          [
            {
              text: "မပြုလုပ်တော့ပါ",
              style: "cancel",
            },
            {
              text: "ပိတ်သိမ်းမည်",
              onPress: async () => {
                await db
                  .update(budgets)
                  .set({ isActive: false })
                  .where(eq(budgets.id, id))
                  .run();

                await db
                  .update(userBudgets)
                  .set({ isActive: false })
                  .where(eq(userBudgets.budgetId, id))
                  .run();

                await db.delete(todayExpenses).run();

                fetchBudgets();
              },
            },
          ]
        );
      } else {
        Alert.alert(
          "ဖွင့်မည်",
          'ဤ Budget ကို ဖွင့်လျှင် အခြား ဖွင့်ထားသော Budget Setting များရှိလာပါက အလိုအလျှောက် ပိတ်သွားမည်ဖြစ်သည်။ System မှ အလိုအလျှောက် သတ်မှတ်ထားသော Budget Setting များလည်း ယခု သင်ဖွင့်လိုက်သော Budget Setting အတိုင်း ပြောင်းလဲသွားမည်ဖြစ်ပြီး "ယနေ့ ကုန်ကျငွေစာရင်း" တွင် သင်ထည့်သွင်း သတ်မှတ်ထားသော စားရင်များရှိပါက ပျက်သွားပါမည်။',
          [
            {
              text: "မပြုလုပ်တော့ပါ",
              style: "cancel",
            },
            {
              text: "ဖွင့်မည်",
              onPress: async () => {
                await db
                  .update(budgets)
                  .set({ isActive: false })
                  .where(not(eq(budgets.id, id)))
                  .run();

                await db
                  .update(userBudgets)
                  .set({ isActive: false })
                  .where(not(eq(userBudgets.budgetId, id)))
                  .run();

                const activeBudget = await db
                  .update(budgets)
                  .set({ isActive: true })
                  .where(eq(budgets.id, id))
                  .run();

                await db.delete(todayExpenses).run();

                const activeUser = await db.insert(userBudgets).values({
                  budgetId: id,
                  isActive: true
                });

                console.log('start active info===============');
                console.log('active budget: ', activeBudget);
                console.log('active user: ', activeUser);                
                console.log('end active info===============');

                fetchBudgets();
              },
            },
          ]
        );
      }
    } catch (err: any) {
      console.error("Error toggling budget status:", err);
      Alert.alert(
        "Error",
        "Failed to change budget status: " + (err.message || "Unknown error.")
      );
      useDbStore.setState({
        dbError: new Error(
          "Failed to toggle budget status due to database issue. Please retry."
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
        <Text>Loading database and budgets...</Text>
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

  // Main UI when DB is loaded and no errors
  return (
    <View style={styles.container}>
      <View style={styles.inputContainer}>
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
            <Text style={styles.icon}>📅</Text>
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
            <Text style={styles.icon}>📅</Text>
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

        <TouchableOpacity style={styles.submitButton} onPress={addBudget}>
          <Text style={styles.submitButtonText}>သိမ်းမည်</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeader}>Your Budgets:</Text>
      <FlatList
        data={budgetList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.budgetItem}>
            <Text style={styles.budgetItemText}>
              Amount: {item.totalBudget.toFixed(2)}
            </Text>
            <Text style={styles.budgetItemText}>
              Period: {item.startDate} to {item.endDate}
            </Text>
            <Text style={styles.budgetItemText}>
              Status: {item.isActive ? "Active" : "Inactive"}
            </Text>
            <View style={styles.buttonRow}>
              {/* Active/Inactive Button */}
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  item.isActive ? styles.activeButton : styles.inactiveButton,
                ]}
                onPress={() => toggleBudgetActiveStatus(item.id, item.isActive)}
              >
                <Text style={styles.actionButtonText}>
                  {item.isActive ? "Deactivate" : "Activate"}
                </Text>
              </TouchableOpacity>

              {/* Delete Button */}
              <TouchableOpacity
                style={[styles.actionButton, styles.deleteButton]}
                onPress={() => deleteBudget(item.id)}
              >
                <Text style={styles.actionButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
        ListEmptyComponent={<Text>No budgets found. Add one above!</Text>}
      />
    </View>
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
  subHeader: {
    fontSize: 18,
    fontWeight: "600",
    marginTop: 20,
    marginBottom: 10,
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
    color: '#666666',
  },
  fieldWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 8,
    color: "#333",
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
  budgetItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
    // flexDirection: 'column',
    // gap: 5,
  },
  budgetItemText: {
    fontSize: 16,
    marginBottom: 5, // Space between text lines
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around", // Distribute buttons evenly
    marginTop: 10, // Space above buttons
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 100, // Ensure buttons have a minimum width
    alignItems: "center",
  },
  activeButton: {
    backgroundColor: "#4CAF50", // Green for active/activate
  },
  inactiveButton: {
    backgroundColor: "#FFC107", // Orange for inactive/deactivate
  },
  deleteButton: {
    backgroundColor: "#F44336", // Red for delete
    marginLeft: 10, // Space between buttons
  },
  actionButtonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: "#388e3c",
    padding: 15,
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
    backgroundColor: "#007AFF", // Blue color for retry button
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
});

export default BudgetScreen;
