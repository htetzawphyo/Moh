import calculateDailyBudget from "@/utils/calculateDailyBudget";
import useCalculateSpentToday from "@/utils/useCalculateSpentToday";
import useCalculateTotalRemainingBudget from "@/utils/useCalculateTotalRemainingBudget";
import { useCallback, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";

const BudgetOverview = ({ refreshKey }) => {
  const fetchRemainingBudget = useCalculateTotalRemainingBudget();
  const calculateSpentToday = useCalculateSpentToday();

  const [totalBudget, setTotalBudget] = useState(0);
  const [totalRemainingBudget, setTotalRemainingBudget] = useState(0);
  const [dailyBudget, setDailyBudget] = useState(0);
  const [dailyRemain, setDailyRemain] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [todaySpent, setTodaySpent] = useState(0);


  const loadBudgetData = useCallback(async () => {
    try {
      setIsLoading(true);

      const result = await fetchRemainingBudget();

      const fetchedTotalBudget = result?.totalBudget || 0;
      const fetchedRemainingBudget = result?.totalRemainingBudget || 0;
      const startDate = result?.startDate
        ? new Date(result.startDate)
        : new Date();
      const endDate = result?.endDate ? new Date(result.endDate) : new Date();

      const computedDailyBudget = calculateDailyBudget(
        fetchedTotalBudget,
        startDate,
        endDate
      );

      const todaySpent = await calculateSpentToday();
      setTodaySpent(todaySpent);
      const computedDailyRemain = computedDailyBudget - todaySpent;
      setDailyRemain(Math.max(0, computedDailyRemain));

      setTotalBudget(fetchedTotalBudget);
      setTotalRemainingBudget(fetchedRemainingBudget);
      setDailyBudget(computedDailyBudget);
      console.log("daily remain: ", computedDailyRemain);

    } catch (error) {
      console.error("BudgetOverview error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchRemainingBudget, calculateSpentToday]);

  useEffect(() => {
    loadBudgetData();
  }, [loadBudgetData, refreshKey]);

  const displayDate = new Date().toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const formatNumberWithCommas = (amount) =>
    new Intl.NumberFormat("en-US").format(amount);

  if (isLoading) {
    return (
      <View>
        <Text>Loading budget...</Text>
      </View>
    );
  }

  return (
    <View>
      <View style={styles.banner}>
        <Text style={styles.date_label}>{displayDate}</Text>
        <View style={styles.balance}>
          <Text style={styles.label.total}>စုစုပေါင်း အသုံးစရိတ်</Text>
          <Text style={styles.amount}>
            {formatNumberWithCommas(totalBudget)}
          </Text>
        </View>
        <View style={styles.balance}>
          <Text style={styles.label.remain}>စုစုပေါင်း အသုံးစရိတ်ကျန်ငွေ</Text>
          <Text style={styles.amount}>
            {formatNumberWithCommas(totalRemainingBudget)}
          </Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel.total}>ယနေ့ အသုံး စရိတ်</Text>
          <Text style={styles.cardAmount}>
            {formatNumberWithCommas(dailyBudget)}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel.spent}>ယနေ့ အသုံးပြုပြီး စရိတ်</Text>
          <Text style={styles.cardAmount}>
            {formatNumberWithCommas(todaySpent)}
          </Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardLabel.remain}>ယနေ့ အသုံး စရိတ် ကျန်ငွေ</Text>
          <Text style={styles.cardAmount}>
            {formatNumberWithCommas(dailyRemain)}
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
      lineHeight: 26,
      fontSize: 16,
      fontWeight: "600",
      color: "#FFFACD",
    },
    remain: {
      lineHeight: 26,
      fontSize: 16,
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
      lineHeight: 20,
      fontSize: 12,
      fontWeight: "600",
      color: "#1E3A8A",
    },
    spent: {
      lineHeight: 20,
      fontSize: 12,
      fontWeight: "600",
      color: "#DC2626",
    },
    remain: {
      lineHeight: 20,
      fontSize: 12,
      fontWeight: "600",
      color: "#065F46",
    },
  },
  cardAmount: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1E293B",
    marginTop: 5,
  },
});
