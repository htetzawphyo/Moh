import { useFocusEffect } from "expo-router";
import { useCallback, useState } from "react";
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
import { registerForPushNotificationsAsync } from "@/utils/notificationHelper";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);

  const handleExpenseAdded = () => {
    setRefreshKey((prev) => prev + 1);
    console.log("key change...");
  };
  useFocusEffect(
    useCallback(() => {
      handleExpenseAdded();
      registerForPushNotificationsAsync();
      return () => {};
    }, [])
  );

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <BudgetOverview refreshKey={refreshKey} />
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
});
