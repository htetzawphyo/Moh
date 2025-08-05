import { expenses } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { and, desc, gte, lte } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";

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

const useTodayExpenses = (refreshKey) => {
  const { db, dbLoaded } = useDbStore();
  const [todayExpenses, setTodayExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodayExpenses = useCallback(async () => {
    if (!dbLoaded || !db) {
      return;
    }

    const { start, end } = getCurrentMyanmarDateRange();
    console.log("myanmar date range:", start, end);

    try {
      setIsLoading(true);
      const results = await db
        .select()
        .from(expenses)
        .where(
          and(gte(expenses.expenseDate, start), lte(expenses.expenseDate, end))
        )
        .orderBy(desc(expenses.id))
        .all();
      console.log("today expenses:", results);

      setTodayExpenses(results);
    } catch (err) {
      console.error("Failed to fetch today expenses:", err);
      setError(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchTodayExpenses();
  }, [fetchTodayExpenses, refreshKey]);

  return {
    todayExpenses,
    isLoading,
    error,
    refetch: fetchTodayExpenses,
  };
};

export default useTodayExpenses;
