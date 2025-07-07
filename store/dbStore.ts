import { create } from 'zustand';
import * as SQLite from 'expo-sqlite';
import { drizzle } from 'drizzle-orm/expo-sqlite';
import { migrate } from 'drizzle-orm/expo-sqlite/migrator';

import * as schema from '@/database/schema';
import migrations from '@/drizzle/migrations';

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

      set({ db: drizzleDb, dbLoaded: true, dbError: null });
    } catch (error: any) {
      console.error('Failed to initialize database or apply migrations:', error);
      set({ db: null, dbLoaded: false, dbError: error });
    }
  },
}));