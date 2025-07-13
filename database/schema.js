import { integer, real, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const budgets = sqliteTable("budget", {
  id: integer("budget_id", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  totalBudget: real("total_budget").notNull(),
  startDate: text("start_date").notNull(),
  endDate: text("end_date").notNull(),
  isActive: integer("is_active", { mode: "boolean" }).notNull().default(0),
});

export const userBudgets = sqliteTable("user_budget", {
  id: integer("user_budget_id", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  budgetId: integer("budget_id")
    .notNull()
    .references(() => budgets.id),
  isActive: integer("is_active", {mode: "boolean"}).notNull().default(0),
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
  title: text("title").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  amount: real("amount").notNull(),
  expenseDate: text("expense_date").notNull(),
});

export const todayExpenses = sqliteTable("today_expense", {
  id: integer("today_expense_id", { mode: "number" }).primaryKey({
    autoIncrement: true,
  }),
  userBudgetId: integer("user_budget_id")
  .notNull()
  .references(() => userBudgets.id),
  title: text("title").notNull(),
  categoryId: integer("category_id")
    .notNull()
    .references(() => categories.id),
  amount: real("amount").notNull(),
  expenseDate: text("expense_date").notNull(),
});
