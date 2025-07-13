import { useDbStore } from "@/store/dbStore";
import { expenses, todayExpenses, userBudgets } from "@/database/schema";
import { useState, useCallback } from "react";
import { format } from "date-fns"; 
import { eq } from "drizzle-orm";

const useAddExpense = () => {
  const { db, dbLoaded } = useDbStore();
  const [isAdding, setIsAdding] = useState(false); 
  const [addError, setAddError] = useState(null); 
  const [addSuccess, setAddSuccess] = useState(false); 

  const addExpense = useCallback(async (data) => {
    if (!dbLoaded || !db) {
      setAddError(new Error("Database not loaded."));
      return;
    }

    setIsAdding(true);
    setAddError(null);
    setAddSuccess(false);

    try {
      const activeUserBudget = await db
        .select()
        .from(userBudgets)
        .where(eq(userBudgets.isActive, true)) 
        .get(); 

      if (!activeUserBudget) {
        setAddError(new Error("No active budget found. Please activate a budget."));
        setIsAdding(false);
        return;
      }

      const todayDate = format(new Date(), 'yyyy-MM-dd'); 

      // Expenses Table ထဲသို့ ထည့်သွင်းခြင်း
      await db.insert(expenses).values({
        userBudgetId: activeUserBudget.id,
        title: data.title,
        categoryId: data.categoryId,
        amount: data.amount,
        expenseDate: todayDate, // လက်ရှိနေ့စွဲကို ထည့်သွင်း
      }).run();

      // TodayExpenses Table ထဲသို့ ထည့်သွင်းခြင်း
      await db.insert(todayExpenses).values({
        userBudgetId: activeUserBudget.id,
        title: data.title,
        categoryId: data.categoryId,
        amount: data.amount,
        expenseDate: todayDate, // လက်ရှိနေ့စွဲကို ထည့်သွင်း
      }).run();

      setAddSuccess(true);
      console.log("Expense added successfully to both tables!");
    } catch (error) {
      console.error("Error adding expense:", error);
      setAddError(error instanceof Error ? error : new Error(String(error)));
      setAddSuccess(false);
    } finally {
      setIsAdding(false);
    }
  }, [db, dbLoaded]); // db instance ဒါမှမဟုတ် dbLoaded ပြောင်းလဲရင် useCallback ကို ပြန်ဖန်တီး

  // Add လုပ်ပြီးရင် Success/Error status တွေကို reset လုပ်ဖို့
  const resetStatus = useCallback(() => {
    setAddSuccess(false);
    setAddError(null);
  }, []);

  return { addExpense, isAdding, addError, addSuccess, resetStatus };
};

export default useAddExpense;