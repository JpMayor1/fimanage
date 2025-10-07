import type { ExpenseIconKey } from "@/assets/icons/expenseIcons";

export type ExpenseCategoryType = {
  _id?: string;
  icon: string;
  name: string;
};

export type ExpenseType = {
  _id?: string;
  icon: ExpenseIconKey;
  description: string;
  category: string;
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
};
