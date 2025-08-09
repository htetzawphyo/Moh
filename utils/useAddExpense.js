import { budgetLimits, budgets, expenses } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import dayjs from "dayjs";
import { and, sql } from "drizzle-orm";
import * as Haptics from "expo-haptics";
import { useCallback, useState } from "react";
import { Alert } from "react-native";
import isBetween from "dayjs/plugin/isBetween";
dayjs.extend(isBetween);

const useAddExpense = () => {
  const { db, dbLoaded } = useDbStore();
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);

  function getCurrentMyanmarTime() {
    const offset = 6.5 * 60 * 60 * 1000;
    return new Date(Date.now() + offset).toISOString();
  }

  const addExpense = useCallback(
    async (data, onLimitExceeded) => {
      if (!dbLoaded || !db) {
        setAddError(new Error("Database not loaded."));
        return;
      }

      setIsAdding(true);
      setAddError(null);
      setAddSuccess(false);

      try {
        const currentTime = getCurrentMyanmarTime();

        // Step 1: Fetch latest active budget
        const budgetResult = await db
          .select()
          .from(budgets)
          .where(sql`${budgets.isActive} = 1`)
          .all();

        const activeBudget = budgetResult[0];
        if (!activeBudget) {
          console.log("hello no budget");
          
          Alert.alert(
            "No Budget",
            "Budget သတ်မှတ်ထားခြင်း မရှိသေးပါ။\nSettings > Budget ထဲတွင် Budget အရင်သတ်မှတ်ပေးပါ။"
          );
          setIsAdding(false);
          return;
        }

        const { totalBudget, startDate, endDate } = activeBudget;
        const currentDate = dayjs(currentTime);
        
        if (
          !currentDate.isBetween(
            dayjs(startDate),
            dayjs(endDate),
            "day",
            "[]"
          )
        ) {
          Alert.alert(
            "Out of Budget Period",
            "လက်ရှိနေ့စွဲသည် သတ်မှတ်ထားသော Budget အတွင်း မရှိပါ။"
          );
          setIsAdding(false);
          return;
        }

        // Step 2: Calculate total spent in current active budget duration
        const expenseResult = await db
          .select({
            totalSpent: sql`SUM(${expenses.amount})`.as("totalSpent"),
          })
          .from(expenses)
          .where(
            and(
              sql`${expenses.expenseDate} >= ${startDate}`,
              sql`${expenses.expenseDate} <= ${endDate}`
            )
          )
          .all();
        

        const totalSpent = Number(expenseResult?.[0]?.totalSpent ?? 0);
        const newTotal = totalSpent + parseFloat(data.amount);

        // Step 3: Check budget limits (if config exists)
        const limitResult = await db.select().from(budgetLimits).all();
        const limitConfig = limitResult[0];

        if (newTotal > totalBudget) {
          throw new Error("Total budget exceeded. Cannot add expense.");
        }
        console.log("limitConfig:", limitResult);
        

        if (limitConfig) {
          const {
            isBudgetLimitEnabled,
            totalBudgetLimitAmount,
            vibrateOnPhoneSystem,
          } = limitConfig;

          if (isBudgetLimitEnabled && totalBudgetLimitAmount != null) {
            const percentageSpent = (totalBudgetLimitAmount / 100) * totalBudget; 
            console.log("Percentage spent:", percentageSpent);
            console.log("New total:", newTotal);           
            if (newTotal > percentageSpent) {
              if (onLimitExceeded) {
                onLimitExceeded(); // Notify parent
              }
              if (vibrateOnPhoneSystem) {
                await Haptics.notificationAsync(
                  Haptics.NotificationFeedbackType.Warning
                );
              }
            }
          }
        }

        // Step 4: Add expense
        await db
          .insert(expenses)
          .values({
            title: data.title,
            categoryId: data.categoryId,
            amount: data.amount,
            expenseDate: currentTime,
          })
          .run();

        setAddSuccess(true);
      } catch (err) {
        const message =
          err instanceof Error
            ? err.message
            : typeof err === "string"
            ? err
            : "Unknown error occurred";

        setAddError(new Error(message));
        setAddSuccess(false);
      } finally {
        setIsAdding(false);
      }
    },
    [db, dbLoaded]
  );

  const resetStatus = useCallback(() => {
    setAddSuccess(false);
    setAddError(null);
  }, []);

  return { addExpense, isAdding, addError, addSuccess, resetStatus };
};

export default useAddExpense;
