import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';
import * as SQLite from 'expo-sqlite';
import { create } from 'zustand';

import * as schema from '@/database/schema';
import migrations from '@/drizzle/migrations';
import { sql } from 'drizzle-orm';

export const DATABASE_NAME = 'moh_db.db';

interface DbState {
  db: ReturnType<typeof drizzle> | null;
  dbLoaded: boolean;
  dbError: Error | null;
  initializeDb: () => Promise<void>;
}

export const useDbStore = create<DbState>((set) => ({
  db: null,
  dbLoaded: false,
  dbError: null,
  initializeDb: async () => {
    try {
      const expoDb = await SQLite.openDatabaseAsync(DATABASE_NAME);
      const drizzleDb = drizzle(expoDb, { schema });

      await migrate(drizzleDb, migrations);
      console.log('Database initialized and migrations applied successfully!');

      // Seed categories table
      await seedCategories(drizzleDb);

      set({ db: drizzleDb, dbLoaded: true, dbError: null });
    } catch (error: any) {
      console.error('Failed to initialize database or apply migrations:', error);
      set({ db: null, dbLoaded: false, dbError: error });
    }
  },
}));

async function seedCategories(drizzleDb: ReturnType<typeof drizzle>) {
  try {
    const categoriesCountResult = await drizzleDb.select({ count: sql<number>`count(*)` }).from(schema.categories);
    const categoriesCount = categoriesCountResult[0].count;

    // If no categories exist, insert default ones
    if (categoriesCount === 0) {
      const defaultCategories = [
        { name: "Starbucks", icon: "coffee" },
        { name: "Amazon", icon: "shopping-cart" },
        { name: "Uber", icon: "directions-car" },
        { name: "Netflix", icon: "tv" },
        { name: "Groceries", icon: "local-grocery-store" },
        { name: "Gym", icon: "fitness-center" },
        { name: "Dining Out", icon: "restaurant" },
        { name: "Spotify", icon: "music-note" },
        { name: "Electricity Bill", icon: "flash-on" },
        { name: "Water Bill", icon: "water" },
        { name: "Internet Bill", icon: "wifi" },
        { name: "Phone Bill", icon: "phone" },
        { name: "Clothing", icon: "checkroom" },
        { name: "Books", icon: "book" },
        { name: "Travel", icon: "flight" },
        { name: "Insurance", icon: "shield" },
        { name: "Charity", icon: "favorite" },
        { name: "Pet Care", icon: "pets" },
        { name: "Subscriptions", icon: "subscriptions" },
        { name: "Miscellaneous", icon: "more-horiz" },
      ];

      await drizzleDb.insert(schema.categories).values(defaultCategories);
      console.log('Default categories seeded successfully!');
    } else {
      console.log('Categories already exist, skipping seeding.');
    }
  } catch (error) {
    console.error('Error seeding categories:', error);
  }
}