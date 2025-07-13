import { categories } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { useEffect, useState } from "react";

// Custom Hook အဖြစ် ရေးသားထားခြင်း
const useFetchCategories = () => {
  const { db, dbLoaded } = useDbStore(); // db instance နဲ့ dbLoaded status ကို ယူမယ်
  const [categoryList, setCategoryList] = useState([]); // categories တွေကို သိမ်းဖို့ State
  const [isLoadingCategories, setIsLoadingCategories] = useState(true); // Loading Status
  const [errorCategories, setErrorCategories] = useState(null); // Error State

  useEffect(() => {
    const fetchCategories = async () => {
      // Database မ loaded ရသေးရင် စောင့်ဆိုင်းပါ (သို့မဟုတ် ပြန်ထွက်ပါ)
      if (!dbLoaded || !db) {
        setIsLoadingCategories(true); // Db မရသေးရင် loading ဆက်ပြပါ
        return;
      }

      setIsLoadingCategories(true); // Data fetch မလုပ်ခင် loading စပါ
      setErrorCategories(null); // အရင် error တွေ ရှင်းပါ

      try {
        // categories table က data အားလုံးကို select လုပ်ခြင်း
        const result = await db.select().from(categories).all();

        setCategoryList(result); // ရလာတဲ့ data တွေကို State မှာ ထည့်ပါ
        console.log("Fetched categories: ..................");
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorCategories(error); // Error ကို State မှာ သိမ်းပါ
        setCategoryList([]); // Error ဖြစ်ရင် Array ကို ပြန်ရှင်းပါ
      } finally {
        setIsLoadingCategories(false); // Data fetch ပြီးရင် loading ရပ်ပါ
      }
    };

    fetchCategories(); // Function ကို ခေါ်ပြီး execute လုပ်ပါ
  }, [db, dbLoaded]); // db instance ဒါမှမဟုတ် dbLoaded ပြောင်းလဲရင် ပြန် run ဖို့

  // categories list, loading status နဲ့ error ကို return ပြန်ပေးမယ်
  return { categoryList, isLoadingCategories, errorCategories };
};

export default useFetchCategories;