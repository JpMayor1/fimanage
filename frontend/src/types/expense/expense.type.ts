import type { ExpenseIconKey } from "@/assets/icons/expenseIcons";
import type { BalanceType } from "../balance/balance.type";

export type ExpenseCategoryType = {
  _id?: string;
  icon: string;
  name: string;
};

export type ExpenseType = {
  _id?: string;
  balanceId: string;
  icon: ExpenseIconKey;
  category: string;
  description: string;
  amount: number;
  dt: string;
  countable: boolean;
  createdAt: string;
};

export type ExpenseStoreType = {
  categories: ExpenseCategoryType[];
  balances: BalanceType[];
  expenses: ExpenseType[];
  limit: number;

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  getSelections: () => Promise<void>;

  // Expense Category
  getCategories: () => Promise<void>;
  createCategories: (categories: ExpenseCategoryType[]) => Promise<boolean>;
  updateCategory: (
    categoryId: string,
    updatedCategory: ExpenseCategoryType
  ) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;

  // Expense
  getExpenses: (append: boolean) => Promise<void>;
  addExpense: (data: Partial<ExpenseType>) => Promise<boolean>;
  updateExpense: (id: string, data: Partial<ExpenseType>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;

  // Limit
  updateLimit: (limit: number) => Promise<boolean>;
};
