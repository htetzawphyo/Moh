import CategoryFilter from "@/components/history/CategoryFilter";
import DateFilter from "@/components/history/DateFilter";
import Expenses from "@/components/history/Expenses";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function History() {
  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.filter_container}>
        <Text style={styles.title_label}>Filter</Text>
        <View style={styles.filter_row}>
          <DateFilter />
          <CategoryFilter />
        </View>
      </View>

      <View style={styles.expenses_container}>
        <Text style={styles.title_label}>Past Expenses</Text>
        <Expenses />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 25 : StatusBar.currentHeight,
    backgroundColor: "#f1f1f1"
  },
  filter_container: {
    padding: 20,
  },
  expenses_container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
  },
  title_label: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#4CAF83",
  },
  filter_row: {
    flexDirection: 'row',
    gap: 10,
  }
});
