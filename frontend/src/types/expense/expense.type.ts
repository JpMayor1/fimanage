import type { ExpenseIconKey } from "@/assets/icons/expenseIcons";

export type ExpenseType = {
  _id?: string;
  icon: ExpenseIconKey;
  name: string;
  description: string;
  amount: number;
  dt: string;
  countable: boolean;
  createdAt: string;
};

export type ExpenseStoreType = {
  expenses: ExpenseType[];
  limit: number;

  hasMore: boolean;
  page: number;

  getLoading: boolean;
  createLoading: boolean;
  updateLoading: boolean;
  deleteLoading: boolean;

  shown: boolean;

  getExpenses: (append: boolean) => Promise<void>;
  addExpense: (data: Partial<ExpenseType>) => Promise<boolean>;
  updateExpense: (id: string, data: Partial<ExpenseType>) => Promise<boolean>;
  deleteExpense: (id: string) => Promise<boolean>;

  // Limit
  updateLimit: (limit: number) => Promise<boolean>;
  setShown: () => void;
};
