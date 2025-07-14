import { useEffect, useState } from "react";
import { expenses, categories, userBudgets } from "@/database/schema";
import { eq } from "drizzle-orm";
import { useDbStore } from "@/store/dbStore";

export const useFetchHistory = (refreshKey) => {
  const { db } = useDbStore();
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);
  

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const activeUserBudget = await db
          .select()
          .from(userBudgets)
          .where(eq(userBudgets.isActive, true))
          .get();

        if (!activeUserBudget) {
          setData([]);
          return;
        }

        const result = await db
          .select({
            id: expenses.id,
            name: expenses.title,
            date: expenses.expenseDate,
            amount: expenses.amount,
            icon: categories.icon,
          })
          .from(expenses)
          .where(eq(expenses.userBudgetId, activeUserBudget.id))
          .innerJoin(categories, eq(expenses.categoryId, categories.id))
          .all();

        const formatted = result.map((item) => ({
          id: item.id,
          name: item.name,
          date: item.date,
          amount: -Math.abs(item.amount),
          icon: item.icon || "category",
        }));

        setData(formatted);
      } catch (err) {
        console.error("Error fetching history", err);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchHistory();
  }, [db, refreshKey]);

  return { data, isLoading };
};
