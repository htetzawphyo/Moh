import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const budgets = sqliteTable("budget", {
  id: integer("budget_id", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  totalBudget: real("total_budget").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(false),
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
  title: text("title").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  amount: real("amount").notNull(),
  expenseDate: text("expense_date").notNull(),
});

export const budgetLimits = sqliteTable("budget_limits", {
  id: integer("id", { mode: "number" }).primaryKey({ autoIncrement: true }),
  isBudgetLimitEnabled: integer("is_budget_limit_enabled", { mode: "boolean" }).default(false),
  totalBudgetLimitAmount: real("total_budget_limit_amount"),
  vibrateOnPhoneSystem: integer("vibrate_on_phone_system", { mode: "boolean" }).default(false),
});