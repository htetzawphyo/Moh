import { budgetLimits } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
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
  Vibration, 
} from "react-native";
import { eq } from "drizzle-orm";
import * as Haptics from 'expo-haptics';

const BudgetLimitSettingsScreen: React.FC = () => {
  const { db, dbLoaded, dbError, initializeDb, resetDbState } = useDbStore();

  const [isBudgetLimitEnabled, setIsBudgetLimitEnabled] = useState(false);
  const [totalBudgetLimitAmount, setTotalBudgetLimitAmount] = useState(""); 
  const [showVibrateOnThreshold, setShowVibrateOnThreshold] = useState(false); 

  const [loadingData, setLoadingData] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const fetchBudgetLimitSettings = useCallback(async () => {
    setLoadingData(true);
    try {
      if (db) {
        const result = await db.select().from(budgetLimits).all();
        if (result.length > 0) {
          const settings = result[0];
          setIsBudgetLimitEnabled(settings.isBudgetLimitEnabled ?? false);
          setTotalBudgetLimitAmount(
            (settings.totalBudgetLimitAmount ?? "").toString()
          ); 
          setShowVibrateOnThreshold(settings.vibrateOnPhoneSystem ?? false);
        } else {
          setIsBudgetLimitEnabled(false);
          setTotalBudgetLimitAmount("");
          setShowVibrateOnThreshold(false);
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

  // Function to save/update settings
  const saveSettings = useCallback(async () => {
    if (!db || !dbLoaded || dbError) {
      console.warn("DB not ready, skipping save.");
      return;
    }

    setIsSaving(true);
    try {
      // Convert totalBudgetLimitAmount from string (TextInput) to number (for DB)
      const amountToSave = totalBudgetLimitAmount
        ? parseFloat(totalBudgetLimitAmount)
        : null;

      // Fetch existing settings to determine if we should insert or update
      const existingSettings = await db.select().from(budgetLimits).all();

      if (existingSettings.length > 0) {
        await db
          .update(budgetLimits)
          .set({
            isBudgetLimitEnabled: isBudgetLimitEnabled,
            totalBudgetLimitAmount: amountToSave, 
            vibrateOnPhoneSystem: showVibrateOnThreshold, 
          })
          .where(eq(budgetLimits.id, existingSettings[0].id));
        console.log("Budget limit settings updated successfully.");
      } else {
        await db.insert(budgetLimits).values({
          isBudgetLimitEnabled: isBudgetLimitEnabled,
          totalBudgetLimitAmount: amountToSave, 
          vibrateOnPhoneSystem: showVibrateOnThreshold, 
        });
        console.log("New budget limit settings inserted successfully.");
      }
    } catch (err: any) {
      console.error("Error saving budget limit settings:", err);
      Alert.alert(
        "Save Error",
        "Failed to save settings: " + (err.message || "Unknown error.")
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    db,
    dbLoaded,
    dbError,
    isBudgetLimitEnabled,
    totalBudgetLimitAmount,
    showVibrateOnThreshold,
  ]);

  // Initial DB load
  useEffect(() => {
    if (!dbLoaded && !dbError) {
      console.log("Triggering database initialization...");
      initializeDb();
    }
  }, [dbLoaded, dbError, initializeDb]);

  // Fetch data once DB is loaded
  useEffect(() => {
    if (dbLoaded && db && !dbError) {
      fetchBudgetLimitSettings();
    }
  }, [dbLoaded, db, dbError, fetchBudgetLimitSettings]);

  // Save settings whenever any relevant state changes (debounced for TextInput)
  // Use a debounce to prevent excessive writes for TextInput
  useEffect(() => {
    if (!dbLoaded || !db || dbError || loadingData) return; // Don't save if DB not ready or still loading initial data

    const handler = setTimeout(() => {
      saveSettings();
    }, 500); 

    return () => {
      clearTimeout(handler);
    };
  }, [
    isBudgetLimitEnabled,
    totalBudgetLimitAmount,
    showVibrateOnThreshold,
    dbLoaded,
    db,
    dbError,
    loadingData,
    saveSettings, 
  ]);

  const handleTotalBudgetLimitChange = (text: string) => {
    if (text === '') {
      setTotalBudgetLimitAmount('');
      return;
    }

    const cleanedText = text.replace(/[^0-9.]/g, '');

    const parts = cleanedText.split('.');
    if (parts.length > 2) {
      setTotalBudgetLimitAmount(`${parts[0]}.${parts[1]}`);
      return;
    }

    const numericValue = parseFloat(cleanedText);

    if (isNaN(numericValue) && cleanedText !== '.' && cleanedText !== '') {
      return;
    }

    // Limit to 0-100 for percentage
    if (numericValue > 100) {
      setTotalBudgetLimitAmount("100");
    } else if (numericValue < 0 && cleanedText !== '-') { 
        setTotalBudgetLimitAmount("0");
    } else {
        setTotalBudgetLimitAmount(cleanedText); 
    }
  };

  const handleVibrateSwitchChange = (newValue: boolean) => {
    setShowVibrateOnThreshold(newValue);
    if (newValue) {
      // Vibration.vibrate();
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
    }
  };

  // --- UI Rendering Logic ---
  if (!dbLoaded || loadingData) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="large" color="#4A90E2" />
        <Text style={styles.loadingText}>Loading budget limit settings...</Text>
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
        <Text style={styles.inputLabel}>Enable Budget Limit</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#7BC9FF" }} // Adjusted track colors for better look
          thumbColor={isBudgetLimitEnabled ? "#4A90E2" : "#f4f3f4"} // Adjusted thumb colors
          ios_backgroundColor="#3e3e3e"
          onValueChange={setIsBudgetLimitEnabled}
          value={isBudgetLimitEnabled}
        />
      </View>

      {/* Vibration on Threshold */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.inputLabel}>Vibrate on Threshold</Text>
        <Switch
          trackColor={{ false: "#767577", true: "#7BC9FF" }}
          thumbColor={showVibrateOnThreshold ? "#4A90E2" : "#f4f3f4"}
          ios_backgroundColor="#3e3e3e"
          onValueChange={handleVibrateSwitchChange} // Use the new handler
          value={showVibrateOnThreshold}
          disabled={!isBudgetLimitEnabled}
        />
      </View>

      {/* Total Amount Budget Limit */}
      <View style={styles.fieldWrapper}>
        <Text style={styles.inputLabel}>Total Amount Limit ( % )</Text>
        <TextInput
          style={[styles.input, !isBudgetLimitEnabled && styles.disabledInput]} // Apply disabled style
          placeholder="ဥပမာ: 50 (50% အတွက်)"
          placeholderTextColor={"#999999"} // Adjusted placeholder color
          keyboardType="numeric"
          value={totalBudgetLimitAmount}
          onChangeText={handleTotalBudgetLimitChange}
          editable={isBudgetLimitEnabled}
          maxLength={6} // Allow for decimals, e.g., "99.99"
        />
      </View>

      {isSaving && (
        <View style={styles.savingIndicator}>
          <ActivityIndicator size="small" color="#4A90E2" />
          <Text style={styles.savingText}>Saving settings...</Text>
        </View>
      )}

      {/* Removed "Current Settings" section as it's implied by controls now */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#F9F9F9", // Lighter background for better contrast
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: '#333',
  },
  fieldWrapper: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 20,
    paddingVertical: 10, // Keep vertical padding for spacing
    // Removed backgroundColor, borderRadius, shadow, and elevation
    borderBottomWidth: 1, // Changed from 'border' to 'borderBottomWidth'
    borderBottomColor: "#E0E0E0", // Lighter border for better contrast
    paddingHorizontal: 0, // Reset paddingHorizontal if you want it to stretch fully or have external padding
    // If you want padding from the sides, ensure the parent container (e.g., `container`) has it.
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  input: {
    borderBottomWidth: 0, // No bottom border
    paddingVertical: 8, // Adjusted padding
    paddingHorizontal: 10,
    backgroundColor: "transparent",
    color: "#333333", // Darker text for input
    flex: 1,
    marginLeft: 10,
    fontSize: 12,
    lineHeight: 26,
    textAlign: 'right', // Align input text to the right
  },
  disabledInput: {
    color: "#999999",
    backgroundColor: '#F0F0F0', // Slightly different background for disabled
  },
  submitButton: {
    backgroundColor: "#4A90E2", // Brighter blue
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 30,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  submitButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
  errorText: {
    color: "red",
    textAlign: "center",
    marginBottom: 10,
    fontSize: 16,
  },
  retryButton: {
    backgroundColor: "#4A90E2",
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
  savingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    padding: 10,
    backgroundColor: '#E6F0F8', // Light blue background
    borderRadius: 8,
  },
  savingText: {
    marginLeft: 10,
    color: '#4A90E2',
    fontSize: 14,
  }
});

export default BudgetLimitSettingsScreen;