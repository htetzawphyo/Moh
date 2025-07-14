import { budgets, expenses, userBudgets } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { eq, sum, and } from "drizzle-orm";
import { useCallback } from "react";

const useCalculateTotalRemainingBudget = () => {
  const { db } = useDbStore();

  const calculate = useCallback(async () => {
    if (!db) {
      console.warn(
        "Database not initialized, cannot calculate total remaining budget."
      );
      return 0;
    }

    try {
      const activeUserBudget = await db
        .select()
        .from(userBudgets)
        .where(eq(userBudgets.isActive, 1))
        .get();

      if (!activeUserBudget) {
        console.log("No active user budget found.");
        return 0;
      }

      const budgetDetails = await db
        .select({
          totalBudget: budgets.totalBudget,
          startDate: budgets.startDate,
          endDate: budgets.endDate,
        })
        .from(budgets)
        .where(
          and(
            eq(budgets.id, activeUserBudget.budgetId),
            eq(budgets.isActive, true)
          )
        )
        .get();

      console.log('budget detail: ', budgetDetails);
      

      if (!budgetDetails) {
        console.warn(
          `Budget details not found for budget ID: ${activeUserBudget.budgetId}`
        );
        return 0;
      }

      const totalBudget = Number(budgetDetails.totalBudget);

      const totalSpentResult = await db
        .select({
          totalSpent: sum(expenses.amount),
        })
        .from(expenses)
        .where(eq(expenses.userBudgetId, activeUserBudget.id))
        .get();

      const totalSpent = totalSpentResult
        ? Number(totalSpentResult.totalSpent) || 0
        : 0;

      const totalRemainingBudget = totalBudget - totalSpent;

      // console.log(
      //   `Total Budget: ${totalBudget}, Total Spent: ${totalSpent}, Total Remaining: ${totalRemainingBudget}`
      // );
      return {
        totalBudget,
        totalRemainingBudget,
        startDate: budgetDetails.startDate,
        endDate: budgetDetails.endDate,
      };
    } catch (error) {
      console.error("Error calculating total remaining budget:", error);
      return 0;
    }
  }, []);

  return calculate;
};

export default useCalculateTotalRemainingBudget;
