import { StyleSheet, Text, View } from "react-native";

const BudgetOverview = () => {
  const date = new Date();
  const displayDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <View>
      {/* Banner */}
      <View style={styles.banner}>
        <Text style={styles.date_label}>{displayDate}</Text>
        <View style={styles.balance}>
          <Text style={styles.label.total}>Total Budget</Text>
          <Text style={styles.amount}>300,000</Text>
        </View>
        <View style={styles.balance}>
          <Text style={styles.label.remain}>Total Remaining Budget</Text>
          <Text style={styles.amount}>300,000</Text>
        </View>
      </View>

      {/* Small Cards */}
      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel.total}>Daily Budget</Text>
          <Text
            style={styles.cardAmount}
            numberOfLines={1}
            adjustsFontSizeToFit>
            10,000
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel.spent}>Spent Today</Text>
          <Text
            style={styles.cardAmount}
            numberOfLines={1}
            adjustsFontSizeToFit>
            6,000
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel.remain}>Remaining</Text>
          <Text
            style={styles.cardAmount}
            numberOfLines={1}
            adjustsFontSizeToFit>
            4,000
          </Text>
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
    fontSize: 20,
    fontWeight: "600",
    color: "#FFFACD",
    textAlign: "center",
  },
  label: {
    total: {
      fontSize: 18,
      fontWeight: "600",
      color: "#FFFACD",
    },
    remain: {
      fontSize: 18,
      fontWeight: "600",
      color: "#FFFACD",
    },
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
    backgroundColor: "#f1f1f1",
    borderRadius: 10,
    padding: 15,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  cardLabel: {
    total: {
      fontSize: 12,
      fontWeight: "600",
      color: "#1E3A8A",
    },
    spent: {
      fontSize: 12,
      fontWeight: "600",
      color: "#DC2626",
    },
    remain: {
      fontSize: 12,
      fontWeight: "600",
      color: "#065F46",
    }
  },
  cardAmount: {
    fontSize: 14,
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
