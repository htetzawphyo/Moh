import { todayExpenses } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { desc } from "drizzle-orm";
import { useCallback, useEffect, useState } from "react";

const useTodayExpenses = (refreshKey) => {
  const { db, dbLoaded } = useDbStore();
  const [expenses, setExpenses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTodayExpenses = useCallback(async () => {
    if (!dbLoaded || !db) {
      return;
    }

    try {
      setIsLoading(true);
      const results = await db
        .select()
        .from(todayExpenses)
        .orderBy(desc(todayExpenses.expenseDate));

      setExpenses(results);
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
    expenses,
    isLoading,
    error,
    refetch: fetchTodayExpenses,
  };
};

export default useTodayExpenses;
