import { todayExpenses } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { sum } from "drizzle-orm";

import { useEffect, useState } from "react";

const useCalculateSpentToday = () => {
  const { db } = useDbStore();
  const [spentToday, setSpentToday] = useState(0);

  useEffect(() => {
    const fetchSpentToday = async () => {
      try {
        const result = await db
          .select({
            spentToday: sum(todayExpenses.amount),
          })
          .from(todayExpenses)
          .get();

        setSpentToday(result ? Number(result.spentToday) || 0 : 0);
      } catch (error) {
        console.error("Error calculating spentToday:", error);
        setSpentToday(0);
      }
    };

    fetchSpentToday();
  }, [db]);

  return spentToday;
};

export default useCalculateSpentToday;
