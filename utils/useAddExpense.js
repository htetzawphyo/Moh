import { expenses } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { useCallback, useState } from "react";
import { sendLocalNotification } from "./notificationHelper";

const useAddExpense = () => {
  const { db, dbLoaded } = useDbStore();
  const [isAdding, setIsAdding] = useState(false);
  const [addError, setAddError] = useState(null);
  const [addSuccess, setAddSuccess] = useState(false);

  function getCurrentMyanmarTime() {
    const offset = 6.5 * 60 * 60 * 1000;
    return new Date(Date.now() + offset).toISOString();
  }

  let shouldSendAlert = true;
  let alertMessage = "Your total expenses have reached your budget limit of";
  
  const addExpense = useCallback(
    async (data) => {
      if (!dbLoaded || !db) {
        setAddError(new Error("Database not loaded."));
        return;
      }

      if(shouldSendAlert){
        await sendLocalNotification("Test Title", `Test Body "${data.title}"`, 1000);
      }

      setIsAdding(true);
      setAddError(null);
      setAddSuccess(false);

      try {
        const currentTime = getCurrentMyanmarTime();

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
      } catch (error) {
        console.error("Error adding expense:", error);
        setAddError(error instanceof Error ? error : new Error(String(error)));
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
