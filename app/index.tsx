import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";
import AddButton from "../components/AddButton";
import BudgetOverview from "../components/home/BudgetOverview.jsx";
import ExpenseCard from "../components/home/ExpenseCard";
import ExpenseModal from "../components/home/ExpenseModal";
import * as Haptics from 'expo-haptics';

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const [showWarning, setShowWarning] = useState(false);

  const handleLimitExceeded = useCallback(() => {
    setShowWarning(true);
    Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
    setTimeout(() => setShowWarning(false), 5000);
  }, []);

  const handleExpenseAdded = () => {
    setRefreshKey((prev) => prev + 1);
  };
  useFocusEffect(
    useCallback(() => {
      handleExpenseAdded();
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
       {showWarning && (
        <View style={styles.warningBanner}>
          <Text style={styles.warningText}>
            သင် သတ်မှတ်ထားသော Limit ကျော်နေပါပြီ။
          </Text>
        </View>
      )}
      <View>
        <BudgetOverview refreshKey={refreshKey}/>
      </View>
      <View style={styles.moreActionBar}></View>
      <View style={styles.transactions}>
        <Text style={styles.label}>ယနေ့ ကုန်ကျငွေစာရင်း</Text>
        <ExpenseCard refreshKey={refreshKey} />
      </View>
      <AddButton setModalVisible={setModalVisible} />
      <ExpenseModal
        modalVisible={modalVisible}
        setModalVisible={setModalVisible}
        onExpenseAdded={handleExpenseAdded}
        onLimitExceeded={handleLimitExceeded}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    // paddingTop: Platform.OS === "ios" ? 25 : 0
    paddingTop: Platform.OS === "ios" ? 25 : StatusBar.currentHeight,
    backgroundColor: "#4CAF83",
    flex: 1,
  },
  moreActionBar: {
    width: 100,
    height: 4,
    backgroundColor: "#ddd",
    borderRadius: 50,
    alignSelf: "center",
    marginBottom: 10,
    marginTop: 10,
  },
  transactions: {
    flex: 1,
    padding: 20,
    gap: 10,
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    backgroundColor: "#f1f1f1",
  },
  label: {
    lineHeight: 28,
    fontSize: 18,
    fontWeight: "bold",
    color: "#4CAF83",
  },

  warningBanner: {
    position: "absolute",
    top: 10,
    alignSelf: "center",
    backgroundColor: "#fff3cd",
    marginTop: 40,
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000", 
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    zIndex: 999, 
  },
  warningText: {
    color: "#856404", 
    fontWeight: "500",
    fontSize: 13,
    lineHeight: 20,
  },
  
});
