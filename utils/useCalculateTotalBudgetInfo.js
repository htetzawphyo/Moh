import { budgets, expenses } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { gte, lte, sum, and, sql } from "drizzle-orm";
import { useCallback } from "react";

const useCalculateTotalBudgetInfo = () => {
  const { db } = useDbStore();

  const calculate = useCallback(async () => {
    if (!db) {
      console.warn(
        "Database not initialized, cannot calculate total remaining budget."
      );
      return null;
    }

    try {
      const budgetDetails = await db
        .select({
          totalBudget: budgets.totalBudget,
          startDate: budgets.startDate,
          endDate: budgets.endDate,
        })
        .from(budgets)
        .get();

      console.log('budget detail: ', budgetDetails);
      

      if (!budgetDetails) {
        console.warn(
          `Budget details not found.`
        );
        return null;
      }

      const totalBudget = Number(budgetDetails.totalBudget);

      const totalSpentResult = await db
        .select({
          totalSpent: sum(expenses.amount),
        })
        .from(expenses)
        .where(
          and( 
            gte(expenses.expenseDate, budgetDetails.startDate),
            lte(expenses.expenseDate, budgetDetails.endDate)
          )
        )
        .get();

      const totalSpent = totalSpentResult
        ? Number(totalSpentResult.totalSpent) || 0
        : 0;

      return {
        totalBudget,
        totalSpent,
        startDate: budgetDetails.startDate,
        endDate: budgetDetails.endDate,
      };
    } catch (error) {
      console.error("Error calculating total remaining budget:", error);
      return 0;
    }
  }, [db]);

  return calculate;
};

export default useCalculateTotalBudgetInfo;
