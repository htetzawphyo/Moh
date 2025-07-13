import { budgets, expenses, userBudgets } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { eq, sum } from "drizzle-orm"; // eq နဲ့ sum ကို import လုပ်ပါ။
import { useCallback } from "react";

// Custom Hook အဖြစ် ရေးသားထားခြင်း
const useCalculateTotalRemainingBudget = () => {
  const { db } = useDbStore(); // useDbStore ကနေ db instance ကို ယူမယ်

  // Total Remaining Budget ကို တွက်ချက်မယ့် function
  const calculate = useCallback(async () => {
    if (!db) {
      console.warn(
        "Database not initialized, cannot calculate total remaining budget."
      );
      return 0; // db မရှိရင် 0 ပြန်ပေးမယ်
    }

    try {
      // ၁။ User ရဲ့ လက်ရှိ Active ဖြစ်နေတဲ့ Budget ကို ရှာမယ်
      const activeUserBudget = await db
        .select()
        .from(userBudgets)
        .where(eq(userBudgets.isActive, 1)) // isActive က true (1) ဖြစ်တာကို ရှာမယ်
        .get();

      if (!activeUserBudget) {
        console.log("No active user budget found.");
        return 0; // Active Budget မရှိရင် 0 ပြန်ပေးမယ်
      }

      // ၂။ Active Budget ID ကို သုံးပြီး budgets table ကနေ totalBudget ကို ယူမယ်
      const budgetDetails = await db
        .select({
          totalBudget: budgets.totalBudget,
          startDate: budgets.startDate,
          endDate: budgets.endDate,
        })
        .from(budgets)
        .where(eq(budgets.id, activeUserBudget.budgetId))
        .get();

      if (!budgetDetails) {
        console.warn(
          `Budget details not found for budget ID: ${activeUserBudget.budgetId}`
        );
        return 0;
      }

      const totalBudget = Number(budgetDetails.totalBudget);

      // ၃။ အဲ့ဒီ Active Budget နဲ့ သက်ဆိုင်တဲ့ Expenses တွေရဲ့ စုစုပေါင်း (sum) ကို ယူမယ်
      const totalSpentResult = await db
        .select({
          totalSpent: sum(expenses.amount), // expenses table ရဲ့ amount တွေကို ပေါင်းမယ်
        })
        .from(expenses)
        .where(eq(expenses.userBudgetId, activeUserBudget.id)) // userBudgetId နဲ့ ချိတ်ဆက်ပြီး စစ်မယ်
        .get();

      // sum က null ဖြစ်နိုင်တာမို့ Default value 0 ထားပြီး Number ပြောင်းပေးမယ်
      const totalSpent = totalSpentResult
        ? Number(totalSpentResult.totalSpent) || 0
        : 0;

      // ၄။ totalBudget ထဲကနေ totalSpent ကို နှုတ်ပြီး remaining budget ကို တွက်မယ်
      const totalRemainingBudget = totalBudget - totalSpent;

      console.log(
        `Total Budget: ${totalBudget}, Total Spent: ${totalSpent}, Total Remaining: ${totalRemainingBudget}`
      );
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
