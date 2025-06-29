import { StyleSheet, Text, View } from "react-native";

const BudgetOverview = () => {
  const date = new Date();
  const displayDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View style={{ flex: 1 }}>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.date_label}>{displayDate}</Text>
        <View style={styles.balance}>
          <Text style={styles.label}>Total Budget</Text>
          <Text style={styles.amount}>300,000</Text>
        </View>
        <View style={styles.balance}>
          <Text style={styles.label}>Total Remaining Budget</Text>
          <Text style={styles.amount}>300,000</Text>
        </View>
      </View>

      {/* Small Cards */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Daily Budget</Text>
          <Text style={styles.cardAmount}>10,000</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Spent Today</Text>
          <Text style={styles.cardAmount}>6,000</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel}>Remaining</Text>
          <Text style={styles.cardAmount}>4,000</Text>
        </View>
      </View>
    </View>
  );
};

export default BudgetOverview;

const styles = StyleSheet.create({
  banner: {
    padding: 30,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: "#2E865F",
  },
  balance: {
    marginTop: 12,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  date_label: {
    fontSize: 17,
    fontWeight: "600",
    color: "#FFFACD",
    textAlign: "center",
  },
  label: {
    fontWeight: "600",
    color: "#E0F2F1", 
  },
  amount: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#FFFFFF", 
  },
  cardRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginTop: 20,
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: "#FFFFFF",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLabel: {
    fontSize: 12,
    fontWeight: "600",
    color: "#00897B",
  },
  cardAmount: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 5,
  },
});


// balanceGrowth: {
//   alignItems: "flex-end",
//   paddingTop: 10,
// },
// growth: {
//   color: "#6f6",
// },
// <View style={styles.balanceGrowth}>
//   <Text style={styles.growth}>+520 Today</Text>
// </View>;
