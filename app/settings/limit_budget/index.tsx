// screens/BudgetLimitSettingsScreen.tsx
import { budgetLimits } from "@/database/schema"; // Ensure this path is correct
import { useDbStore } from "@/store/dbStore"; // Ensure this path is correct
import { eq } from "drizzle-orm";
import React, { useCallback, useEffect, useState } from "react";
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

// Define the interface for the budget data, including new limit fields
interface BudgetLimit {
  id: number;
  isBudgetLimitEnabled: boolean;
  totalBudgetLimitAmount: number | null;
  dailyBudgetLimitAmount: number | null;
  showAlertOnPhoneSystem: boolean;
}

const BudgetLimitSettingsScreen: React.FC = () => {
  const { db, dbLoaded, dbError, initializeDb, resetDbState } = useDbStore();
  const [currentBudgetLimit, setCurrentBudgetLimit] =
    useState<BudgetLimit | null>(null);

  // States for the new form inputs
  const [isBudgetLimitEnabled, setIsBudgetLimitEnabled] = useState(false);
  const [totalBudgetLimitAmount, setTotalBudgetLimitAmount] = useState("");
  const [dailyBudgetLimitAmount, setDailyBudgetLimitAmount] = useState("");
  const [showAlertOnPhoneSystem, setShowAlertOnPhoneSystem] = useState(false);

  const [loadingData, setLoadingData] = useState(true);

  // Fetch budget data (specifically for the limit settings)
  const fetchBudgetLimitSettings = useCallback(async () => {
    setLoadingData(true);
    try {
      if (db) {
        const result = await db.select().from(budgetLimits).all();
        if (result.length > 0) {
          setCurrentBudgetLimit({
            ...result[0],
            isBudgetLimitEnabled: result[0].isBudgetLimitEnabled ?? false,
            totalBudgetLimitAmount: result[0].totalBudgetLimitAmount ?? null,
            dailyBudgetLimitAmount: result[0].dailyBudgetLimitAmount ?? null,
            showAlertOnPhoneSystem: result[0].showAlertOnPhoneSystem ?? false,
          });
          setIsBudgetLimitEnabled(result[0].isBudgetLimitEnabled ?? false);
          setTotalBudgetLimitAmount(
            result[0].totalBudgetLimitAmount?.toString() || ""
          );
          setDailyBudgetLimitAmount(
            result[0].dailyBudgetLimitAmount?.toString() || ""
          );
          setShowAlertOnPhoneSystem(result[0].showAlertOnPhoneSystem ?? false);
        } else {
          setCurrentBudgetLimit(null);
          setIsBudgetLimitEnabled(false);
          setTotalBudgetLimitAmount("");
          setDailyBudgetLimitAmount("");
          setShowAlertOnPhoneSystem(false);
        }
      }
    } catch (err: any) {
      console.error("Error fetching budget limit settings:", err);
      Alert.alert(
        "Error",
        "Failed to fetch budget limit settings: " +
          (err.message || "Unknown error.")
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

  // Initial DB load and data fetch
  useEffect(() => {
    if (!dbLoaded && !dbError) {
      console.log("Triggering database initialization...");
      initializeDb();
    }
  }, [dbLoaded, dbError, initializeDb]);

  useEffect(() => {
    if (dbLoaded && db && !dbError) {
      fetchBudgetLimitSettings();
    }
  }, [dbLoaded, db, dbError, fetchBudgetLimitSettings]);

  // Save the budget limit settings
  const saveBudgetLimitSettings = async () => {
    if (!db) {
      Alert.alert("Error", "Database not connected. Please retry.");
      useDbStore.setState({
        dbError: new Error(
          "Database not connected for saving budget limit settings. Please retry."
        ),
      });
      return;
    }

    // Basic validation for limit amounts if enabled
    let parsedTotalLimit: number | null = null;
    let parsedDailyLimit: number | null = null;

    if (isBudgetLimitEnabled) {
      if (totalBudgetLimitAmount) {
        parsedTotalLimit = parseFloat(totalBudgetLimitAmount);
        if (isNaN(parsedTotalLimit) || parsedTotalLimit < 0) {
          Alert.alert(
            "Validation Error",
            "Total Budget Limit amount must be a valid positive number."
          );
          return;
        }
      }

      if (dailyBudgetLimitAmount) {
        parsedDailyLimit = parseFloat(dailyBudgetLimitAmount);
        if (isNaN(parsedDailyLimit) || parsedDailyLimit < 0) {
          Alert.alert(
            "Validation Error",
            "Daily Budget Limit amount must be a valid positive number."
          );
          return;
        }
      }

      if (!totalBudgetLimitAmount && !dailyBudgetLimitAmount) {
        Alert.alert(
          "Validation Error",
          "Please set at least one limit (Total or Daily) if Budget Limit is enabled."
        );
        return;
      }
    }

    try {
      if (currentBudgetLimit) {
        Alert.alert(
          "Budget Limit ကို ပြင်ဆင်မည်",
          "သင်၏ Budget Limit အချက်အလက်များကို ပြင်ဆင်လိုပါသလား?",
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
                    .update(budgetLimits)
                    .set({
                      isBudgetLimitEnabled: isBudgetLimitEnabled,
                      totalBudgetLimitAmount: parsedTotalLimit,
                      dailyBudgetLimitAmount: parsedDailyLimit,
                      showAlertOnPhoneSystem: showAlertOnPhoneSystem,
                    })
                    .where(eq(budgetLimits.id, currentBudgetLimit.id))
                    .run();
                  console.log(
                    "Updated budget limit settings for budget limit ID:",
                    currentBudgetLimit.id
                  );
                  Alert.alert("Success", "Budget Limit Settings Updated!");
                  fetchBudgetLimitSettings(); 
                } catch (err: any) {
                  // error handling
                }
              },
            },
          ]
        );
      } else {
        try {
          await db
            .insert(budgetLimits)
            .values({
              isBudgetLimitEnabled: isBudgetLimitEnabled,
              totalBudgetLimitAmount: parsedTotalLimit,
              dailyBudgetLimitAmount: parsedDailyLimit,
              showAlertOnPhoneSystem: showAlertOnPhoneSystem,
            })
            .run();
          console.log("Added new budget limit settings.");
          Alert.alert("Success", "Budget Limit Settings Added!");
          fetchBudgetLimitSettings();
        } catch (err: any) {
          Alert.alert(
            "Error",
            "Failed to add new budget limit settings: " +
              (err.message || "Unknown error.")
          );
          useDbStore.setState({
            dbError: new Error(
              "Failed to add new budget limit settings due to database issue. Please retry."
            ),
          });
        }
      }
    } catch (err: any) {
      Alert.alert("Failed to save budget limit settings: " + err.message);
      useDbStore.setState({
        dbError: new Error(
          "Failed to save budget limit settings due to database issue. Please retry."
        ),
      });
    }
  };

  // --- UI Rendering Logic ---
  if (!dbLoaded || loadingData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading budget limit settings...</Text>
      </View>
    );
  }

  if (dbError) {
    return (
      <View style={styles.container}>
        <Text style={styles.errorText}>
          Database Error: {dbError.message || "Unknown error"}
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
    <View style={styles.container}>
      {/* Enable/Disable Limit */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.inputLabel}>Enable Budget Limits</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={isBudgetLimitEnabled ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsBudgetLimitEnabled}
          value={isBudgetLimitEnabled}
        />
      </View>

      {/* Total Amount Budget Limit */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.inputLabel}>Total Budget Limit Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="ဥပမာ: 0.8 (for 80%) or 50000 (fixed amount)"
          placeholderTextColor={"#666666"}
          keyboardType="numeric"
          value={totalBudgetLimitAmount}
          onChangeText={setTotalBudgetLimitAmount}
          editable={isBudgetLimitEnabled} // Only editable if enabled
        />
      </View>

      {/* Daily Amount Budget Limit */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.inputLabel}>Daily Budget Limit Amount</Text>
        <TextInput
          style={styles.input}
          placeholder="နေ့စဉ်သုံးငွေ ကန့်သတ်ချက် ထည့်ပါ"
          placeholderTextColor={"#666666"}
          keyboardType="numeric"
          value={dailyBudgetLimitAmount}
          onChangeText={setDailyBudgetLimitAmount}
          editable={isBudgetLimitEnabled} // Only editable if enabled
        />
      </View>

      {/* Alert for Phone System Notification */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.inputLabel}>
          Budget Limit ပြည့်ပါက ဖုန်း Notification ပို့ရန်
        </Text>
        <Switch
          trackColor={{ false: "#767577", true: "#81b0ff" }}
          thumbColor={showAlertOnPhoneSystem ? "#f5dd4b" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={setShowAlertOnPhoneSystem}
          value={showAlertOnPhoneSystem}
          disabled={!isBudgetLimitEnabled} // Only enabled if budget limits are enabled
        />
      </View>

      <TouchableOpacity
        style={styles.submitButton}
        onPress={saveBudgetLimitSettings}
      >
        <Text style={styles.submitButtonText}>Save Limit Settings</Text>
      </TouchableOpacity>

      {currentBudgetLimit && (
        <View style={styles.currentSettingsSection}>
          <Text style={styles.subHeader}>Current Budget Limit Settings:</Text>
          <View style={styles.settingItem}>
            <Text style={styles.settingItemText}>
              Limit Enabled: {currentBudgetLimit.isBudgetLimitEnabled ? "Yes" : "No"}
            </Text>
            {currentBudgetLimit.totalBudgetLimitAmount !== null && (
              <Text style={styles.settingItemText}>
                Total Limit: {currentBudgetLimit.totalBudgetLimitAmount}
              </Text>
            )}
            {currentBudgetLimit.dailyBudgetLimitAmount !== null && (
              <Text style={styles.settingItemText}>
                Daily Limit: {currentBudgetLimit.dailyBudgetLimitAmount}
              </Text>
            )}
            <Text style={styles.settingItemText}>
              Phone Alert: {currentBudgetLimit.showAlertOnPhoneSystem ? "On" : "Off"}
            </Text>
          </View>
        </View>
      )}
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
  fieldWrapper: {
    flexDirection: "row", // For Switch and text on same line
    alignItems: "center",
    justifyContent: "space-between", // Pushes text and switch to ends
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1, // Allow label to take up space
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
    color: "#666666",
    flex: 1, // Allow input to take up space
    marginLeft: 10, // Add some margin
    lineHeight: 26
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
  currentSettingsSection: {
    marginTop: 30,
    borderTopWidth: 1,
    borderTopColor: "#eee",
    paddingTop: 20,
  },
  settingItem: {
    backgroundColor: "#fff",
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#eee",
  },
  settingItemText: {
    fontSize: 16,
    marginBottom: 5,
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
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
});

export default BudgetLimitSettingsScreen;
