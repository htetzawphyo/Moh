import { todayExpenses } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { sum } from "drizzle-orm";

const useCalculateSpentToday = () => {
  const { db } = useDbStore();

  const calculateSpentToday = async () => {
    try {
      const result = await db
        .select({
          spentToday: sum(todayExpenses.amount),
        })
        .from(todayExpenses)
        .get();

      return result ? Number(result.spentToday) || 0 : 0;
    } catch (error) {
      console.error("Error calculating spentToday:", error);
      return 0;
    }
  };

  return calculateSpentToday;
};

export default useCalculateSpentToday;
