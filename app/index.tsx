import { useState } from "react";
import { Platform, SafeAreaView, StatusBar, StyleSheet, Text, View } from "react-native";
import AddButton from "../components/AddButton";
import BudgetOverview from "../components/home/BudgetOverview";
import ExpenseCard from "../components/home/ExpenseCard";
import ExpenseModal from "../components/home/ExpenseModal";

export default function Home() {
  const [modalVisible, setModalVisible] = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <View>
        <BudgetOverview />
      </View>
      <View style={styles.moreActionBar}></View>
      <View style={styles.transactions}>
        <Text style={styles.label}>Today's Expense</Text>
        <ExpenseCard />
      </View>
      <AddButton setModalVisible={setModalVisible} />
      <ExpenseModal modalVisible={modalVisible} setModalVisible={setModalVisible} />
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
    fontSize: 20,
    fontWeight: "bold",
    color: "#4CAF83",
  },
});
