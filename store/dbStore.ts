import { drizzle } from "drizzle-orm/expo-sqlite";
import { migrate } from "drizzle-orm/expo-sqlite/migrator";
import * as SQLite from "expo-sqlite";
import { create } from "zustand";

import * as schema from "@/database/schema";
import migrations from "@/drizzle/migrations";
import { sql } from "drizzle-orm";

export const DATABASE_NAME = "moh_db.db";

interface DbState {
  db: ReturnType<typeof drizzle> | null;
  dbLoaded: boolean;
  dbError: Error | null;
  initializeDb: () => Promise<void>;
  resetDbState: () => void;
}

export const useDbStore = create<DbState>((set, get) => ({
  db: null,
  dbLoaded: false,
  dbError: null,
  initializeDb: async () => {
    const { dbLoaded, dbError } = get();
    if (dbLoaded || dbError) {
      console.log(
        "Database already loaded or failed previously, not re-initializing."
      );
      return;
    }

    try {
      const expoDb = await SQLite.openDatabaseAsync(DATABASE_NAME);
      const drizzleDb = drizzle(expoDb, { schema });

      await migrate(drizzleDb, migrations);
      console.log("Database initialized and migrations applied successfully!");

      // Seed categories table
      await seedCategories(drizzleDb);

      set({ db: drizzleDb, dbLoaded: true, dbError: null });
    } catch (error: any) {
      console.error(
        "Failed to initialize database or apply migrations:",
        error
      );
      set({ db: null, dbLoaded: false, dbError: error });
    }
  },
  resetDbState: () => {
    console.log("Resetting database state...");
    set({ db: null, dbLoaded: false, dbError: null });
  },
}));

async function seedCategories(drizzleDb: ReturnType<typeof drizzle>) {
  try {
    const categoriesCountResult = await drizzleDb
      .select({ count: sql<number>`count(*)` })
      .from(schema.categories);
    const categoriesCount = categoriesCountResult[0].count;

    // If no categories exist, insert default ones
    if (categoriesCount === 0) {
      const defaultCategories = [
        // General Catch-all Category
        { name: "Other", icon: "category" },

        // Food & Dining
        { name: "Dining Out", icon: "restaurant" },
        { name: "Groceries", icon: "local-grocery-store" },
        { name: "Coffee/Cafes", icon: "coffee" }, // Changed from Starbucks to be more general
        { name: "Snacks", icon: "fastfood" },
        { name: "Alcohol", icon: "local-bar" },
        { name: "Takeaway/Delivery", icon: "delivery-dining" },

        // Transportation
        { name: "Ride-sharing", icon: "directions-car" }, // Changed from Uber to be more general
        { name: "Public Transport", icon: "directions-bus" },
        { name: "Fuel/Gas", icon: "local-gas-station" },
        { name: "Car Maintenance", icon: "car-repair" },
        { name: "Parking", icon: "local-parking" },
        { name: "Tolls", icon: "toll" },

        // Utilities & Bills
        { name: "Electricity Bill", icon: "flash-on" },
        { name: "Water Bill", icon: "water" },
        { name: "Internet Bill", icon: "wifi" },
        { name: "Phone Bill", icon: "phone" },
        { name: "Gas Bill", icon: "whatshot" }, // For cooking/heating gas
        { name: "Rent/Mortgage", icon: "home" },
        { name: "Property Tax", icon: "account-balance" },

        // Shopping & Personal Care
        { name: "Clothing", icon: "checkroom" },
        { name: "Books", icon: "book" },
        { name: "Electronics", icon: "devices" },
        { name: "Home Goods/Decor", icon: "lightbulb-outline" }, // Or 'home-mini'
        { name: "Personal Care", icon: "face" }, // Or 'spa'
        { name: "Gifts", icon: "card-giftcard" },
        { name: "Jewelry", icon: "watch" }, // Or 'diamond' if available in another set
        { name: "Subscriptions", icon: "subscriptions" }, // Generic for Netflix, Spotify etc.

        // Entertainment & Leisure
        { name: "Streaming Services", icon: "tv" }, // Generic for Netflix
        { name: "Music Subscriptions", icon: "music-note" }, // Generic for Spotify
        { name: "Movies/Cinema", icon: "theaters" },
        { name: "Concerts/Events", icon: "event" },
        { name: "Hobbies", icon: "extension" },
        { name: "Gaming", icon: "sports-esports" },
        { name: "Travel", icon: "flight" },

        // Health & Wellness
        { name: "Gym", icon: "fitness-center" },
        { name: "Medical", icon: "local-hospital" }, // General for Doctor/Medical Appointments
        { name: "Medication/Pharmacy", icon: "local-pharmacy" },
        { name: "Health Insurance", icon: "health-and-safety" },
        { name: "Fitness Classes", icon: "self-improvement" }, // Or 'sports-handball'
        { name: "Therapy/Counseling", icon: "psychology" },

        // Financial
        { name: "Insurance", icon: "shield" }, // General insurance
        { name: "Charity", icon: "favorite" },
        { name: "Loan Repayments", icon: "receipt" }, // Or 'paid'
        { name: "Savings", icon: "savings" },
        { name: "Investments", icon: "trending-up" },
        { name: "Bank Fees", icon: "credit-card" },
        { name: "Taxes", icon: "receipt" },

        // Education
        { name: "Tuition Fees", icon: "school" },
        { name: "Course Materials", icon: "menu-book" },
        { name: "Workshops/Seminars", icon: "laptop-mac" },

        // Children & Pets
        { name: "Childcare/Daycare", icon: "child-care" },
        { name: "School Supplies", icon: "auto-stories" }, // Or 'pencil'
        { name: "Toys", icon: "toys" },
        { name: "Pet Food", icon: "pets" },
        { name: "Vet Bills", icon: "healing" },
        { name: "Pet Grooming", icon: "content-cut" },

        // Miscellaneous/Other
        { name: "Home Maintenance", icon: "construction" },
        { name: "Laundry/Dry Cleaning", icon: "local-laundry-service" },
        { name: "Postage/Shipping", icon: "local-shipping" },
        { name: "Donations", icon: "volunteer-activism" },
        { name: "Legal Fees", icon: "gavel" },
        { name: "Work Expenses", icon: "work" },
        { name: "Unexpected Expenses", icon: "error-outline" },
        { name: "Miscellaneous", icon: "more-horiz" }, // General catch-all
      ];

      await drizzleDb.insert(schema.categories).values(defaultCategories);
      console.log("Default categories seeded successfully!");
    } else {
      console.log("Categories already exist, skipping seeding.");
    }
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
}
