import { categories, expenses, userBudgets } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { useFilterStore } from "@/store/filterStore";
import { eq, and, desc } from "drizzle-orm";
import { useEffect, useState } from "react";

export const useFetchHistory = (refreshKey) => {
  const { db } = useDbStore();
  const filterType = useFilterStore((state) => state.filterType);
  const filterValue = useFilterStore((state) => state.filterValue);
  const [data, setData] = useState([]);
  const [isLoading, setLoading] = useState(true);


  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
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

        // Build where condition dynamically
        const baseCondition = eq(expenses.userBudgetId, activeUserBudget.id);

        let filterCondition;
        if (filterType === "CATEGORY") {
          filterCondition = eq(categories.name, filterValue);
        } else if (filterType === "DATE") {
          filterCondition = eq(expenses.expenseDate, filterValue);
        }

        const whereClause = filterCondition
          ? and(baseCondition, filterCondition)
          : baseCondition;

        const result = await db
          .select({
            id: expenses.id,
            name: expenses.title,
            date: expenses.expenseDate,
            amount: expenses.amount,
            icon: categories.icon,
          })
          .from(expenses)
          .where(whereClause)
          .innerJoin(categories, eq(expenses.categoryId, categories.id))
          .orderBy(desc(expenses.expenseDate))
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
  }, [db, refreshKey, filterType, filterValue]);

  return { data, isLoading };
};
