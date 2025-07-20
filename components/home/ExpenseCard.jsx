import useFetchCategories from "@/utils/useFetchCategories";
import useTodayExpenses from "@/utils/useTodayExpense";
import { MaterialIcons } from "@expo/vector-icons";
import {
  ActivityIndicator,
  FlatList,
  StyleSheet,
  Text,
  View,
} from "react-native";

const ExpenseCard = ({ refreshKey }) => {
  const { todayExpenses, isLoading, error } = useTodayExpenses(refreshKey);
  const { categoryList } = useFetchCategories();

  const getCategoryInfo = (categoryId) =>
    categoryList.find((cat) => cat.id === categoryId) || {};

  const renderItem = ({ item }) => {
    const { name: categoryName, icon } = getCategoryInfo(item.categoryId);

    return (
      <View style={styles.card}>
        <View
          style={{
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 15,
          }}
        >
          <MaterialIcons name={icon || "category"} size={24} />
          <View>
            <Text style={{ fontSize: 16, lineHeight: 26 }}>{item.title}</Text>
            <Text style={{ fontSize: 14, color: "#888" }}>
              {categoryName || "Unknown"}
            </Text>
          </View>
        </View>
        <View>
          <Text style={{ fontSize: 16, color: "#DC2626" }}>{item.amount}</Text>
        </View>
      </View>
    );
  };

  if (!isLoading && todayExpenses.length === 0) {
    return (
      <View style={{ alignItems: "center", marginTop: 40 }}>
        <Text style={styles.emptyText}>ယနေ့အတွက် အသုံးပြုမှုမရှိသေးပါ။</Text>
        <Text style={{ color: "#888", marginTop: 10, lineHeight: 26 }}>
          {`အသစ်တစ်ခုထည့်ရန် "+" ခလုတ်ကိုနှိပ်ပါ။`}
        </Text>
      </View>
    );
  }

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

  if (error) {
    return <Text>Error loading expenses.</Text>;
  }

  return (
    <View style={{ flex: 1 }}>
      <FlatList
        data={todayExpenses}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default ExpenseCard;

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 5,
    display: "flex",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: 10,
  },
  emptyText: {
    lineHeight: 26,
    fontSize: 16,
    color: "#4CAF83",
    textAlign: "center",
    fontWeight: "600",
  },
});
// card: {
//     backgroundColor: '#fff',
//     borderRadius: 10,
//     padding: 15,
//     flexDirection: 'row',
//     justifyContent: 'space-between',
//     alignItems: 'center',
//     marginBottom: 10,
//     elevation: 2,
//     shadowColor: '#000',
//     shadowOpacity: 0.1,
//     shadowRadius: 4,
// }
