// src/screens/BudgetScreen.tsx
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useCallback, useEffect, useState } from 'react'; // useCallback ကို ထပ်ထည့်ပါ
import {
  ActivityIndicator,
  Alert,
  FlatList,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View
} from 'react-native';

import { budgets } from '@/database/schema';
import { useDbStore } from '@/store/dbStore';
import { eq, not } from 'drizzle-orm';

interface Budget {
  id: number;
  totalBudget: number;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

const BudgetScreen: React.FC = () => {
  const { db, dbLoaded, dbError, initializeDb } = useDbStore(); // dbError နဲ့ resetDbState ကို ရယူပါ
  const [budgetList, setBudgetList] = useState<Budget[]>([]);
  const [newBudgetAmount, setNewBudgetAmount] = useState('');

  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  const [loadingData, setLoadingData] = useState(true); // Renamed to avoid conflict with dbLoaded

  // Use useCallback for functions that depend on `db` to prevent unnecessary re-renders/re-creations
  const fetchBudgets = useCallback(async () => {
    setLoadingData(true);
    // setError(null); // Managed by dbError now for initial load, but keep for other operations
    try {
      if (db) {
        const result = await db.select().from(budgets).all();
        setBudgetList(result);
        console.log('Fetched budgets:', result);
      }
    } catch (err: any) {
      console.error('Error fetching budgets:', err);
      Alert.alert('Error', 'Failed to fetch budgets: ' + (err.message || 'Unknown error.'));
      // setError('Failed to fetch budgets: ' + err.message); // Set local error if fetching fails AFTER db is loaded
      // Maybe also set dbError here if you want it to trigger the main error screen
      // useDbStore.setState({ dbError: err }); // You could do this, but usually dbError is for initialization
    } finally {
      setLoadingData(false);
    }
  }, [db]); // Depend on db

  // Initial DB load
  useEffect(() => {
    if (!dbLoaded && !dbError) { // Only initialize if not loaded and no error
      console.log('Triggering database initialization...');
      initializeDb();
    }
  }, [dbLoaded, dbError, initializeDb]); // Add dbError to dependency array

  // Fetch data once DB is loaded
  useEffect(() => {
    if (dbLoaded && db && !dbError) { // Only fetch if db is loaded and no initialization error
      fetchBudgets();
    }
  }, [dbLoaded, db, dbError, fetchBudgets]); // Add dbError and fetchBudgets to dependency array

  const formatDateForDb = (date: Date): string => {
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const handleDateChange = (
    event: any,
    selectedDate: Date | undefined,
    setDateState: React.Dispatch<React.SetStateAction<Date>>,
    setShowPickerState: React.Dispatch<React.SetStateAction<boolean>>
  ) => {
    setShowPickerState(Platform.OS === 'ios'); // Hide picker immediately on iOS

    if (selectedDate) {
      setDateState(selectedDate);
    }

    if (Platform.OS === 'android') {
      setShowPickerState(false);
    }
  };

  const addBudget = async () => {
    if (!db) {
      // Use dbError from store or a local error for user feedback
      // setError('Database not loaded yet.'); // This is covered by the main loading/error state
      console.error('Attempted to add budget when DB not available.');
      return;
    }
    if (!newBudgetAmount) {
      // Use a local state for input validation errors
      alert('Budget amount is required.'); // Simple alert for immediate feedback
      return;
    }

    try {
      const parsedAmount = parseFloat(newBudgetAmount);
      if (isNaN(parsedAmount)) {
        alert('Please enter a valid number for budget amount.');
        return;
      }

      const formattedStartDate = formatDateForDb(startDate);
      const formattedEndDate = formatDateForDb(endDate);

      const inserted = await db.insert(budgets).values({
        totalBudget: parsedAmount,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        isActive: false,
      }).returning();

      console.log('Added budget:', inserted);
      setNewBudgetAmount('');
      setStartDate(new Date());
      setEndDate(new Date());
      fetchBudgets(); // Refresh the list after adding
    } catch (err: any) {
      console.error('Error adding budget:', err);
      alert('Failed to add budget: ' + err.message); // Show error to user
    }
  };

  const deleteBudget = async (id: number) => {
    if (!db) {
      Alert.alert('Error', 'Database is not ready. Please try again or restart the app.');
      console.error('Attempted to delete budget when DB not available.');
      return;
    }
    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this budget?",
      [
        {
          text: "Cancel",
          style: "cancel"
        },
        {
          text: "Delete",
          onPress: async () => {
            try {
              await db.delete(budgets).where(eq(budgets.id, id)).run();
              console.log('Deleted budget with ID:', id);
              fetchBudgets();
            } catch (err: any) {
              console.error('Error deleting budget:', err);
              Alert.alert('Error', 'Failed to delete budget: ' + (err.message || 'Unknown error.'));
            }
          },
          style: "destructive"
        }
      ]
    );
  };

  const toggleBudgetActiveStatus = async (id: number, currentStatus: boolean) => {
    if (!db) {
      Alert.alert('Error', 'Database is not ready. Please try again or restart the app.');
      console.error('Attempted to toggle budget status when DB not available.');
      return;
    }

    try {
      if (currentStatus) {
        // If current budget is already active and we want to deactivate it,
        // we can simply toggle it. But usually you want at least one active budget.
        // For the requirement "only one active", if this is the active one,
        // and you want to deactivate it, you should probably disallow it
        // or force activation of another budget.
        // For simplicity, if you press 'Deactivate', it just deactivates this one.
        await db.update(budgets)
          .set({ isActive: false })
          .where(eq(budgets.id, id))
          .run();
        console.log(`Deactivated budget ID: ${id}`);
      } else {
        // If the current budget is inactive and we want to activate it:
        // 1. Deactivate all other budgets
        await db.update(budgets)
          .set({ isActive: false })
          .where(not(eq(budgets.id, id))) // NOT the current budget's ID
          .run();

        // 2. Activate the selected budget
        await db.update(budgets)
          .set({ isActive: true })
          .where(eq(budgets.id, id))
          .run();

        console.log(`Activated budget ID: ${id} and deactivated others.`);
      }

      fetchBudgets(); // Refresh the list after changes
    } catch (err: any) {
      console.error('Error toggling budget status:', err);
      Alert.alert('Error', 'Failed to change budget status: ' + (err.message || 'Unknown error.'));
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
          Database Initialization Error: {dbError.message || 'Unknown error'}
        </Text>
        <Text style={styles.errorText}>
          Please ensure your database setup is correct and try again.
        </Text>
        {/* <Button title="Retry Initialization" onPress={resetDbState} /> Allow user to retry */}
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
            <Text style={styles.inputText}>
              {startDate.toDateString()}
            </Text>
            <Text style={styles.icon}>📅</Text>
          </TouchableOpacity>
          {showStartDatePicker && (
            <DateTimePicker
              value={startDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) =>
                handleDateChange(event, selectedDate, setStartDate, setShowStartDatePicker)
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
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={(event, selectedDate) =>
                handleDateChange(event, selectedDate, setEndDate, setShowEndDatePicker)
              }
            />
          )}
        </View>

        <TouchableOpacity style={styles.submitButton} onPress={addBudget}>
          <Text style={styles.submitButtonText}>Submit</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.subHeader}>Your Budgets:</Text>
      <FlatList
        data={budgetList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.budgetItem}>
            {/* ID ကို ဖြုတ်လိုက်ပါပြီ */}
            <Text style={styles.budgetItemText}>Amount: ${item.totalBudget.toFixed(2)}</Text>
            <Text style={styles.budgetItemText}>Period: {item.startDate} to {item.endDate}</Text>
            <Text style={styles.budgetItemText}>Status: {item.isActive ? 'Active' : 'Inactive'}</Text>
            <View style={styles.buttonRow}>
              {/* Active/Inactive Button */}
              <TouchableOpacity
                style={[styles.actionButton, item.isActive ? styles.activeButton : styles.inactiveButton]}
                onPress={() => toggleBudgetActiveStatus(item.id, item.isActive)}
              >
                <Text style={styles.actionButtonText}>
                  {item.isActive ? 'Deactivate' : 'Activate'}
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
    backgroundColor: '#fff',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  subHeader: {
    fontSize: 18,
    fontWeight: '600',
    marginTop: 20,
    marginBottom: 10,
  },
  inputContainer: {
    marginBottom: 20,
  },
  input: {
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 0,
    marginBottom: 20,
    backgroundColor: 'transparent',
  },
  fieldWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 8,
    color: '#333',
  },
  inputWithIcon: {
    flexDirection: 'row',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    paddingVertical: 10,
    paddingHorizontal: 0,
    backgroundColor: 'transparent',
  },
  inputText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  icon: {
    fontSize: 20,
    marginLeft: 10,
    color: '#888',
  },
  budgetItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#eee',
    // flexDirection: 'column',
    // gap: 5,
  },
  budgetItemText: {
    fontSize: 16,
    marginBottom: 5, // Space between text lines
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-around', // Distribute buttons evenly
    marginTop: 10, // Space above buttons
  },
  actionButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 5,
    minWidth: 100, // Ensure buttons have a minimum width
    alignItems: 'center',
  },
  activeButton: {
    backgroundColor: '#4CAF50', // Green for active/activate
  },
  inactiveButton: {
    backgroundColor: '#FFC107', // Orange for inactive/deactivate
  },
  deleteButton: {
    backgroundColor: '#F44336', // Red for delete
    marginLeft: 10, // Space between buttons
  },
  actionButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 14,
  },
  errorText: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 10,
  },
  submitButton: {
    backgroundColor: '#388e3c',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default BudgetScreen;