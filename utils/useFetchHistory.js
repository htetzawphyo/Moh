import { categories, expenses } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { useFilterStore } from "@/store/filterStore";
import { desc, eq, and, lte, gte } from "drizzle-orm";
import { useEffect, useState } from "react";

const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
    timeZone: "UTC",
  }).format(date);
};

const getCurrentMyanmarDateRange = (dateStr) => {
  const offset = 6.5 * 60 * 60 * 1000;

  const baseDate = new Date(dateStr + 'T00:00:00Z');

  const myanmarStart = new Date(baseDate.getTime() + offset);
  const myanmarEnd = new Date(myanmarStart);
  myanmarEnd.setUTCHours(23, 59, 59, 999);

  myanmarStart.setUTCHours(0, 0, 0, 0);

  return {
    start: myanmarStart.toISOString(),
    end: myanmarEnd.toISOString(),
  };
};

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
        let filter = undefined; 

        if (filterValue) {
          if (filterType === "DATE") {
            const {start, end} = getCurrentMyanmarDateRange(filterValue);
            filter = and(gte(expenses.expenseDate, start), lte(expenses.expenseDate, end));
          } else {
            filter = eq(categories.name, filterValue);
          }
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
          .innerJoin(categories, eq(expenses.categoryId, categories.id))
          .where(filter)
          .orderBy(desc(expenses.id))
          .all();

        const formatted = result.map((item) => ({
          id: item.id,
          name: item.name,
          date: formatDate(item.date),
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
