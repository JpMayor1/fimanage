import type { ExpenseIconKey } from "@/assets/icons/expenseIcons";

export type ExpenseCategoryType = {
  _id?: string;
  icon: string;
  name: string;
};

export type ExpenseType = {
  _id?: string;
  icon: ExpenseIconKey;
  category: string;
  description: string;
  amount: number;
  dt: string;
};

export type ExpenseStoreType = {
  categories: ExpenseCategoryType[];
  expenses: ExpenseType[];

  getLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  // Expense Category
  getCategories: () => Promise<void>;
  createCategories: (categories: ExpenseCategoryType[]) => Promise<boolean>;
  updateCategory: (
    categoryId: string,
    updatedCategory: ExpenseCategoryType
  ) => Promise<boolean>;
  deleteCategory: (categoryId: string) => Promise<boolean>;

  // Expense
  getExpenses: () => Promise<void>;
  addExpense: (data: Partial<ExpenseType>) => Promise<boolean>;
  updateExpense: (id: string, data: Partial<ExpenseType>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;
};
