import { expenses } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { and, gte, lte, sum } from "drizzle-orm";

const getCurrentMyanmarDateRange = () => {
  const offset = 6.5 * 60 * 60 * 1000;
  const now = new Date(Date.now() + offset);

  const start = new Date(now);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setUTCHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

const useCalculateSpentToday = () => {
  const { db, dbLoaded } = useDbStore();

  const calculateSpentToday = async () => {
    if (!dbLoaded || !db) {
      return;
    }

    const { start, end } = getCurrentMyanmarDateRange();
    try {
      const result = await db
        .select({
          spentToday: sum(expenses.amount),
        })
        .from(expenses)
        .where(
          and(gte(expenses.expenseDate, start), lte(expenses.expenseDate, end))
        )
        .get();

      return result ? Number(result.spentToday) || 0 : 0;
    } catch (error) {
      console.error("Error calculating spentToday from expenses table:", error);
      return 0;
    }
  };

  return calculateSpentToday;
};

export default useCalculateSpentToday;
