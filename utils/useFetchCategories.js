import { categories } from "@/database/schema";
import { useDbStore } from "@/store/dbStore";
import { useEffect, useState } from "react";

const useFetchCategories = () => {
  const { db, dbLoaded } = useDbStore(); 
  const [categoryList, setCategoryList] = useState([]); 
  const [isLoadingCategories, setIsLoadingCategories] = useState(true); 
  const [errorCategories, setErrorCategories] = useState(null);

  useEffect(() => {
    const fetchCategories = async () => {
      if (!dbLoaded || !db) {
        setIsLoadingCategories(true); 
        return;
      }

      setIsLoadingCategories(true); 
      setErrorCategories(null); 

      try {
        const result = await db.select().from(categories).all();

        setCategoryList(result); 
      } catch (error) {
        console.error("Error fetching categories:", error);
        setErrorCategories(error); 
        setCategoryList([]);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories(); 
  }, [db, dbLoaded]); 

  return { categoryList, isLoadingCategories, errorCategories };
};

export default useFetchCategories;