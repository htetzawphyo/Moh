import { useDbStore } from "@/store/dbStore";
import useCalculateSpentToday from "@/utils/useCalculateSpentToday";
import useCalculateTotalBudgetInfo from "@/utils/useCalculateTotalBudgetInfo";
import dayjs from "dayjs";
import { useCallback, useEffect, useState } from "react";
import { ActivityIndicator, StyleSheet, Text, View } from "react-native";

const BudgetOverview = ({ refreshKey }) => {
  const fetchTotalBudgetInfo = useCalculateTotalBudgetInfo();
  const calculateSpentToday = useCalculateSpentToday();

  const [totalBudget, setTotalBudget] = useState(0);
  const [totalSpentBudget, setTotalSpentBudget] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [todaySpent, setTodaySpent] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const loadBudgetData = useCallback(async () => {
    try {
      setIsLoading(true);

      const result = await fetchTotalBudgetInfo();

      const fetchedTotalBudget = result?.totalBudget || 0;
      const fetchedSpentBudget = result?.totalSpent || 0;

      const startDate = result?.startDate || "";
      const endDate = result?.endDate || "";
      const formattedStartDate = dayjs(startDate).isValid()
        ? dayjs(startDate).format("DD-MM-YYYY")
        : "";
      const formattedEndDate = dayjs(endDate).isValid()
        ? dayjs(endDate).format("DD-MM-YYYY")
        : "";
      setStartDate(formattedStartDate);
      setEndDate(formattedEndDate);

      const todaySpent = await calculateSpentToday();
      setTodaySpent(todaySpent);

      setTotalBudget(fetchedTotalBudget);
      setTotalSpentBudget(fetchedSpentBudget);
    } catch (error) {
      console.error("BudgetOverview error:", error);
    } finally {
      setIsLoading(false);
    }
  }, [fetchTotalBudgetInfo, calculateSpentToday]);

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
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator size="large" color="#4CAF83" />
      </View>
    );
  }

  return (
    <View>
      <View style={styles.banner}>
        <Text style={styles.date_label}>{displayDate}</Text>

        <View style={styles.dateRangeContainer}>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>📅 Start Date</Text>
            <Text style={styles.dateValue}>{startDate}</Text>
          </View>
          <View style={styles.dateItem}>
            <Text style={styles.dateLabel}>📅 End Date</Text>
            <Text style={styles.dateValue}>{endDate}</Text>
          </View>
        </View>

        <View style={styles.balance}>
          <Text style={styles.label.total}>💰 စုစုပေါင်း အသုံးစရိတ်</Text>
          <Text style={styles.amount}>
            {formatNumberWithCommas(totalBudget)}
          </Text>
        </View>
        <View style={styles.balance}>
          <Text style={styles.label.remain}>💸 အသုံးပြုပြီး စုစုပေါင်း</Text>
          <Text style={styles.amount}>
            {formatNumberWithCommas(totalSpentBudget)}
          </Text>
        </View>
      </View>

      <View style={styles.cardRow}>
        <View style={styles.card}>
          <Text style={styles.cardLabel.spent}>ယနေ့ အသုံးပြုပြီး စရိတ်</Text>
          <Text style={styles.cardAmount}>
            {formatNumberWithCommas(todaySpent)}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default BudgetOverview;

const styles = StyleSheet.create({
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
  banner: {
    padding: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
    backgroundColor: "#2E865F",
  },
  date_label: {
    fontSize: 22,
    fontWeight: "700",
    color: "#FFFACD",
    textAlign: "center",
    marginBottom: 16,
  },
  dateRangeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "rgba(255,255,255,0.1)",
    padding: 12,
    borderRadius: 12,
    marginBottom: 20,
  },
  dateItem: {
    // flex: 1,
  },
  dateLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#FFF",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFACD",
  },
  balance: {
    marginBottom: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    total: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFF",
    },
    remain: {
      fontSize: 16,
      fontWeight: "600",
      color: "#FFF",
    },
  },
  amount: {
    fontWeight: "bold",
    fontSize: 20,
    color: "#FFFFFF",
  },
});
