import CategoryFilter from "@/components/history/CategoryFilter";
import DateFilter from "@/components/history/DateFilter";
import Expenses from "@/components/history/Expenses";
import { budgets } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { useFilterStore } from "@/store/filterStore";
import { MaterialIcons } from "@expo/vector-icons";
import { useEffect, useState } from "react";
import {
  Platform,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function History() {
  const {db, dbLoaded} = useDbStore();
  const [totalBudget, setTotalBudget] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchBudget() {
      console.log('hello');
      
      if (dbLoaded && db) { // Database load ပြီးပြီဆိုတာ သေချာမှ query လုပ်ပါ။
        try {
          // ဥပမာ: Budget Table ထဲက ပထမဆုံး Budget ရဲ့ totalBudget ကို ယူတာ
          const result = await db.select().from(budgets).limit(1);
          if (result.length > 0) {
            setTotalBudget(result[0].totalBudget);
          } else {
            setTotalBudget(0); // No budgets found
          }
        } catch (error) {
          console.error('Error fetching budget:', error);
          setTotalBudget(null);
        } finally {
          setLoading(false);
        }
      }
    }

    setLoading(true); // Fetching မစခင် loading ကို true ထား
    fetchBudget();
  }, [dbLoaded, db])

  const filterType = useFilterStore((state) => state.filterType);
  const filterValue = useFilterStore((state) => state.filterValue);

  if (loading) {
    return <Text>Loading budget...</Text>;
  }

  return (
    <SafeAreaView style={styles.container}>

      <View style={styles.filter_container}>
        <Text style={styles.title_label}>Filter</Text>
        <View style={styles.filter_row}>
          <DateFilter />
          <CategoryFilter />
        </View>
      </View>

      <View style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        gap: 10,
        marginBottom: 25
      }}>
        <MaterialIcons name="filter-list" size={24} color="#4CAF83" />
        {filterType && filterValue && (
          <Text style={styles.filter_label}>{filterType} : {filterValue}</Text>
        )}
      </View>

      <View style={styles.expenses_container}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
          <Text style={styles.title_label}>Past Expenses</Text>
        </View>
        <Expenses />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 25 : StatusBar.currentHeight,
    backgroundColor: "#f1f1f1",
    marginTop: 10
  },
  filter_container: {
    paddingHorizontal: 20,
    marginBottom: 10
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
  },
  filter_label: {
    fontSize: 12,
  }
});