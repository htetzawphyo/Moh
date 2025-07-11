import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const budgets = sqliteTable("budget", {
  id: integer("budget_id", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  totalBudget: real("total_budget").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(1),
});

export const userBudgets = sqliteTable("user_budget", {
  id: integer("user_budget_id", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  budgetId: integer("budget_id")
    .notNull()
    .references(() => budgets.id),
  totalRemainingBudget: real("total_remaining_budget").notNull(),
  dailyBudget: real("daily_budget").notNull(),
  spentToday: real("spent_today").default(0.0).notNull(),
  remainingBudgetToday: real("remaining_daily_budget").notNull(),
});

export const categories = sqliteTable("category", {
  id: integer("category_id", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  name: text("name").notNull().unique(),
  icon: text("icon"),
});

export const expenses = sqliteTable("expense", {
  id: integer("expense_id", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  userBudgetId: integer("user_budget_id")
    .notNull()
    .references(() => userBudgets.id),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  amount: real("amount").notNull(),
  expenseDate: text("expense_date").notNull(),
});
