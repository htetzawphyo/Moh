// import { budgets, expenses } from "@/database/schema";
// import { useDbStore } from "@/store/dbStore";
// import { and, gte, lte, sum } from "drizzle-orm";
// import { useCallback } from "react";

// const useCalculateTotalBudgetInfo = () => {
//   const { db } = useDbStore();

//   const calculate = useCallback(async () => {
//     if (!db) {
//       console.warn(
//         "Database not initialized, cannot calculate total remaining budget."
//       );
//       return null;
//     }

//     try {
//       const budgetDetails = await db
//         .select({
//           totalBudget: budgets.totalBudget,
//           startDate: budgets.startDate,
//           endDate: budgets.endDate,
//         })
//         .from(budgets)
//         .get();

//       console.log("budget detail: ", budgetDetails);

//       if (!budgetDetails) {
//         console.warn(`Budget details not found.`);
//         return null;
//       }

//       const totalBudget = Number(budgetDetails.totalBudget);

//       console.log("Start:", budgets.startDate);
//       console.log("End:", budgets.endDate);

//       const totalSpentResult = await db
//         .select({
//           totalSpent: sum(expenses.amount),
//         })
//         .from(expenses)
//         .where(
//           and(
//             gte(expenses.expenseDate, budgetDetails.startDate),
//             lte(expenses.expenseDate, budgetDetails.endDate)
//           )
//         )
//         .get();
//       console.log("total spent result: ", totalSpentResult);

//       const totalSpent = totalSpentResult
//         ? Number(totalSpentResult.totalSpent) || 0
//         : 0;

//       return {
//         totalBudget,
//         totalSpent,
//         startDate: budgetDetails.startDate,
//         endDate: budgetDetails.endDate,
//       };
//     } catch (error) {
//       console.error("Error calculating total remaining budget:", error);
//       return 0;
//     }
//   }, [db]);

//   return calculate;
// };

// export default useCalculateTotalBudgetInfo;
import { budgets, expenses } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { and, gte, lte, sum } from "drizzle-orm";
import { useCallback } from "react";

const getMyanmarDateRange = (isoDateStr) => {
  const offset = 6.5 * 60 * 60 * 1000;
  const date = new Date(new Date(isoDateStr).getTime() + offset);

  const start = new Date(date);
  start.setUTCHours(0, 0, 0, 0);

  const end = new Date(date);
  end.setUTCHours(23, 59, 59, 999);

  return {
    start: start.toISOString(),
    end: end.toISOString(),
  };
};

const useCalculateTotalBudgetInfo = () => {
  const { db } = useDbStore();

  const calculate = useCallback(async () => {
    if (!db) {
      console.warn("Database not initialized, cannot calculate budget.");
      return null;
    }

    try {
      // Step 1: Get budget details (only one budget expected)
      const budgetDetails = await db
        .select({
          totalBudget: budgets.totalBudget,
          startDate: budgets.startDate,
          endDate: budgets.endDate,
        })
        .from(budgets)
        .limit(1)
        .get();

      if (!budgetDetails) {
        console.warn("No budget found.");
        return null;
      }

      const { startDate: rawStartDate, endDate: rawEndDate, totalBudget } = budgetDetails;
      const { start: startDate } = getMyanmarDateRange(rawStartDate);
      const { end: endDate } = getMyanmarDateRange(rawEndDate);

      // Step 2: Calculate total spent within budget range
      const totalSpentResult = await db
        .select({
          totalSpent: sum(expenses.amount),
        })
        .from(expenses)
        .where(
          and(
            gte(expenses.expenseDate, startDate),
            lte(expenses.expenseDate, endDate)
          )
        )
        .get();

      console.log("Total spent result:", totalSpentResult);

      const totalSpent = totalSpentResult?.totalSpent
        ? Number(totalSpentResult.totalSpent)
        : 0;

      return {
        totalBudget: Number(totalBudget),
        totalSpent,
        startDate,
        endDate,
      };
    } catch (error) {
      console.error("Error calculating budget info:", error);
      return null;
    }
  }, [db]);

  return calculate;
};

export default useCalculateTotalBudgetInfo;
